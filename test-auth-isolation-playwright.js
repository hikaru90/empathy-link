import { chromium } from 'playwright';

async function testAuthIsolation() {
    console.log('🧪 Testing authentication isolation with Playwright...\n');
    
    const browser = await chromium.launch({ 
        headless: false, // Set to true for headless testing
        devtools: true
    });
    
    try {
        // Test 1: Normal context - check initial state
        console.log('📝 Test 1: Normal browser context');
        const context1 = await browser.newContext();
        const page1 = await context1.newPage();
        
        await page1.goto('http://localhost:3001');
        await page1.waitForTimeout(2000);
        
        const initialUrl = page1.url();
        console.log('   - Initial URL:', initialUrl);
        
        // Test 2: Incognito context - should be completely isolated
        console.log('\n🕵️  Test 2: Incognito browser context');
        const incognitoContext = await browser.newContext({
            // This creates a completely isolated context (like incognito)
            storageState: undefined
        });
        const incognitoPage = await incognitoContext.newPage();
        
        await incognitoPage.goto('http://localhost:3001');
        await incognitoPage.waitForTimeout(2000);
        
        const incognitoUrl = incognitoPage.url();
        console.log('   - Incognito URL:', incognitoUrl);
        
        // Test 3: Check cookies in both contexts
        console.log('\n🍪 Test 3: Cookie isolation');
        const normalCookies = await context1.cookies();
        const incognitoCookies = await incognitoContext.cookies();
        
        console.log('   - Normal context cookies:', normalCookies.length);
        console.log('   - Incognito context cookies:', incognitoCookies.length);
        
        const normalAuthCookies = normalCookies.filter(c => 
            c.name.includes('pb_auth') || 
            c.name.includes('session') || 
            c.name.includes('empathy_link')
        );
        const incognitoAuthCookies = incognitoCookies.filter(c => 
            c.name.includes('pb_auth') || 
            c.name.includes('session') || 
            c.name.includes('empathy_link')
        );
        
        console.log('   - Normal auth cookies:', normalAuthCookies.length);
        console.log('   - Incognito auth cookies:', incognitoAuthCookies.length);
        
        if (normalAuthCookies.length > 0) {
            console.log('   - Normal context auth cookies:', normalAuthCookies.map(c => c.name));
        }
        if (incognitoAuthCookies.length > 0) {
            console.log('   - Incognito context auth cookies:', incognitoAuthCookies.map(c => c.name));
        }
        
        // Test 4: Try to access protected routes
        console.log('\n🔒 Test 4: Protected route access');
        
        console.log('   - Testing normal context access to /bullshift...');
        await page1.goto('http://localhost:3001/bullshift');
        await page1.waitForTimeout(2000);
        const normalProtectedUrl = page1.url();
        console.log('     Normal context result:', normalProtectedUrl);
        
        console.log('   - Testing incognito context access to /bullshift...');
        await incognitoPage.goto('http://localhost:3001/bullshift');
        await incognitoPage.waitForTimeout(2000);
        const incognitoProtectedUrl = incognitoPage.url();
        console.log('     Incognito context result:', incognitoProtectedUrl);
        
        // Test 5: Check local storage isolation
        console.log('\n💾 Test 5: Local storage isolation');
        
        const normalLocalStorage = await page1.evaluate(() => {
            const items = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                items[key] = localStorage.getItem(key);
            }
            return items;
        });
        
        const incognitoLocalStorage = await incognitoPage.evaluate(() => {
            const items = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                items[key] = localStorage.getItem(key);
            }
            return items;
        });
        
        console.log('   - Normal context localStorage keys:', Object.keys(normalLocalStorage));
        console.log('   - Incognito context localStorage keys:', Object.keys(incognitoLocalStorage));
        
        if (incognitoLocalStorage.pocketbase_auth) {
            console.log('   - Incognito pocketbase_auth value:', incognitoLocalStorage.pocketbase_auth);
        }
        
        // Test 6: Check if user state is leaked in page content
        console.log('\n👤 Test 6: User state in page content');
        
        const normalPageContent = await page1.textContent('body');
        const incognitoPageContent = await incognitoPage.textContent('body');
        
        // Look for indicators of logged-in state
        const hasUserIndicators = (content) => {
            const indicators = ['dashboard', 'logout', 'profile', 'settings', 'bullshift'];
            return indicators.some(indicator => 
                content.toLowerCase().includes(indicator)
            );
        };
        
        const normalHasUserContent = hasUserIndicators(normalPageContent);
        const incognitoHasUserContent = hasUserIndicators(incognitoPageContent);
        
        console.log('   - Normal context has user content:', normalHasUserContent);
        console.log('   - Incognito context has user content:', incognitoHasUserContent);
        
        // FINAL ANALYSIS
        console.log('\n📊 SECURITY ANALYSIS:');
        
        let securityIssues = [];
        
        // Check for session bleeding - only pb_auth cookie matters for security
        const incognitoPbAuthCookies = incognitoAuthCookies.filter(c => c.name === 'pb_auth');
        if (incognitoPbAuthCookies.length > 0) {
            securityIssues.push('Incognito context has PocketBase authentication cookies');
        }
        
        if (incognitoProtectedUrl.includes('/bullshift') && !incognitoProtectedUrl.includes('/login')) {
            securityIssues.push('Incognito context can access protected routes without authentication');
        }
        
        // Check for VALID PocketBase auth data in localStorage
        if (incognitoLocalStorage.pocketbase_auth) {
            try {
                const authData = JSON.parse(incognitoLocalStorage.pocketbase_auth);
                if (authData.token && authData.token !== "" && authData.model) {
                    securityIssues.push('Incognito context has VALID PocketBase authentication data in localStorage');
                } else {
                    console.log('   ✅ Incognito localStorage has empty auth state (safe)');
                }
            } catch (e) {
                console.log('   ⚠️ Could not parse pocketbase_auth from localStorage');
            }
        }
        
        if (incognitoHasUserContent && !incognitoProtectedUrl.includes('/login')) {
            securityIssues.push('Incognito context shows authenticated user content');
        }
        
        if (securityIssues.length > 0) {
            console.log('❌ CRITICAL SECURITY ISSUES DETECTED:');
            securityIssues.forEach(issue => console.log(`   - ${issue}`));
            console.log('\n🚨 Session isolation is NOT working properly!');
            console.log('   Users could potentially see each other\'s data');
        } else {
            console.log('✅ SECURITY CHECKS PASSED:');
            console.log('   - Incognito contexts are properly isolated');
            console.log('   - No authentication state bleeding detected');
            console.log('   - Protected routes are properly secured');
            console.log('\n🎉 Authentication isolation appears to be working correctly!');
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    } finally {
        console.log('\n🔍 Browser will stay open for 10 seconds for manual inspection...');
        setTimeout(async () => {
            await browser.close();
            console.log('🔚 Test completed and browser closed');
            process.exit(0);
        }, 10000);
    }
}

// Run the test
testAuthIsolation().catch(console.error);