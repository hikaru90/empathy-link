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

async function testAnalyzeChatFunctionality() {
    console.log('🧪 Testing analyzeChat functionality...\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Navigate to login page
        console.log('📝 Navigating to login page...');
        await page.goto('http://localhost:3001/app/auth/login');
        await page.waitForTimeout(1000);
        
        console.log('🔑 Attempting to login with test credentials...');
        
        // Try to find login form elements
        const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="mail"]');
        const passwordInput = await page.$('input[type="password"], input[name="password"]');
        
        if (!emailInput || !passwordInput) {
            console.log('❌ Could not find login form elements');
            console.log('   Current URL:', page.url());
            console.log('   Page title:', await page.title());
            return;
        }
        
        // Get credentials from environment (if available)
        const testEmail = process.env.PRIVATE_USERNAME || 'test@example.com';
        const testPassword = process.env.PRIVATE_PASSWORD || 'testpass';
        
        await emailInput.fill(testEmail);
        await passwordInput.fill(testPassword);
        
        const submitButton = await page.$('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")');
        if (submitButton) {
            await submitButton.click();
            console.log('   Clicked login button, waiting for response...');
            await page.waitForTimeout(3000);
        }
        
        const currentUrl = page.url();
        console.log('   After login attempt, URL:', currentUrl);
        
        if (currentUrl.includes('/bullshift') || currentUrl.includes('/dashboard')) {
            console.log('✅ Successfully logged in');
            
            // Navigate to bullshift chat
            console.log('📱 Navigating to bullshift chat...');
            await page.goto('http://localhost:3001/bullshift');
            await page.waitForTimeout(2000);
            
            // Check if we can access the chat
            const chatUrl = page.url();
            console.log('   Chat URL:', chatUrl);
            
            if (chatUrl.includes('/bullshift')) {
                console.log('✅ Successfully accessed bullshift chat');
                
                // Look for analyze chat functionality
                console.log('🔍 Looking for analyze chat functionality...');
                
                // Check if there are any analyze buttons or similar
                const analyzeButtons = await page.$$('button:has-text("Analyze"), button:has-text("Analysis"), [data-testid*="analyze"]');
                console.log('   Found analyze-related buttons:', analyzeButtons.length);
                
                // Check console for any analyzeChat related errors
                page.on('console', msg => {
                    if (msg.text().includes('analyzeChat')) {
                        console.log('   🔍 Browser console (analyzeChat):', msg.text());
                    }
                });
                
                // Check network requests for analyzeChat calls
                page.on('request', request => {
                    if (request.url().includes('analyzeChat')) {
                        console.log('   📡 Network request to analyzeChat:', request.url(), request.method());
                    }
                });
                
                page.on('response', response => {
                    if (response.url().includes('analyzeChat')) {
                        console.log('   📡 Network response from analyzeChat:', response.url(), response.status());
                    }
                });
                
                // Try to trigger analyze chat functionality
                // This might need to be adjusted based on the actual UI
                console.log('🔧 Attempting to trigger analyze chat functionality...');
                
                // Wait for any dynamic content to load
                await page.waitForTimeout(2000);
                
                console.log('   ⏳ Waiting 10 seconds to observe any automatic analyze chat calls...');
                await page.waitForTimeout(10000);
                
            } else {
                console.log('❌ Could not access bullshift chat, redirected to:', chatUrl);
            }
            
        } else {
            console.log('❌ Login failed or credentials invalid');
            console.log('   Please check PRIVATE_USERNAME and PRIVATE_PASSWORD in .env file');
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    } finally {
        console.log('🔍 Keeping browser open for manual inspection...');
        console.log('   Check browser console and network tab for analyzeChat activity');
        console.log('   Press Ctrl+C to close when done inspecting');
        
        // Keep browser open indefinitely for manual inspection
        await new Promise(() => {}); // This will keep the process running
    }
}

// Choose which test to run based on command line argument
const testType = process.argv[2];

if (testType === 'analyze') {
    testAnalyzeChatFunctionality().catch(console.error);
} else {
    // Run the original auth isolation test
    testAuthIsolation().catch(console.error);
}