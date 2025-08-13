import puppeteer from 'puppeteer';

async function testAuthIsolation() {
    console.log('🧪 Testing authentication isolation...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false, // Set to true for headless testing
        devtools: true
    });
    
    try {
        // Test 1: Normal tab - login as user
        console.log('📝 Test 1: Login in normal tab');
        const page1 = await browser.newPage();
        await page1.goto('http://localhost:3001');
        
        console.log('   - Navigated to homepage');
        console.log('   - Current URL:', page1.url());
        
        // Check if already logged in or need to login
        await page1.waitForTimeout(2000);
        const currentUrl = page1.url();
        console.log('   - After load, URL:', currentUrl);
        
        if (currentUrl.includes('/app/auth/login') || currentUrl === 'http://localhost:3001/') {
            console.log('   - Not logged in, attempting to login...');
            // Navigate to login if not already there
            if (!currentUrl.includes('/app/auth/login')) {
                await page1.goto('http://localhost:3001/app/auth/login');
                await page1.waitForTimeout(1000);
            }
            
            // Look for login form elements
            const emailInput = await page1.$('input[type="email"], input[name="email"], input[placeholder*="email"]');
            const passwordInput = await page1.$('input[type="password"], input[name="password"]');
            
            if (emailInput && passwordInput) {
                console.log('   - Found login form, filling credentials...');
                await emailInput.type('test@example.com'); // Replace with valid test credentials
                await passwordInput.type('testpassword'); // Replace with valid test credentials
                
                const submitButton = await page1.$('button[type="submit"], button:contains("Login"), button:contains("Sign in")');
                if (submitButton) {
                    await submitButton.click();
                    console.log('   - Clicked login button');
                    await page1.waitForTimeout(3000);
                }
            } else {
                console.log('   - Could not find login form elements');
            }
        }
        
        const finalUrl1 = page1.url();
        console.log('   - Final URL after login attempt:', finalUrl1);
        
        // Test 2: Incognito tab - should NOT be logged in
        console.log('\n🕵️  Test 2: Open incognito context');
        const incognitoContext = await browser.createIncognitoBrowserContext();
        const page2 = await incognitoContext.newPage();
        
        await page2.goto('http://localhost:3001');
        await page2.waitForTimeout(2000);
        
        const incognitoUrl = page2.url();
        console.log('   - Incognito tab URL:', incognitoUrl);
        
        // Check if incognito tab is wrongly logged in
        if (incognitoUrl.includes('/bullshift') || incognitoUrl.includes('/app/dashboard')) {
            console.log('   - ❌ SECURITY ISSUE: Incognito tab is logged in!');
            console.log('   - This indicates session bleeding between requests');
        } else if (incognitoUrl.includes('/app/auth/login') || incognitoUrl === 'http://localhost:3001/') {
            console.log('   - ✅ CORRECT: Incognito tab is not logged in');
        } else {
            console.log('   - ⚠️  UNKNOWN STATE: Unexpected URL in incognito tab');
        }
        
        // Test 3: Regular new tab - check if it inherits auth
        console.log('\n📱 Test 3: Open new regular tab');
        const page3 = await browser.newPage();
        await page3.goto('http://localhost:3001');
        await page3.waitForTimeout(2000);
        
        const regularTabUrl = page3.url();
        console.log('   - Regular new tab URL:', regularTabUrl);
        
        if (finalUrl1.includes('/bullshift') && regularTabUrl.includes('/bullshift')) {
            console.log('   - ✅ CORRECT: Regular tab inherits authentication (cookies work)');
        } else if (finalUrl1.includes('/app/auth/login') && regularTabUrl.includes('/app/auth/login')) {
            console.log('   - ✅ CORRECT: Both tabs not logged in (no valid credentials)');
        } else {
            console.log('   - ⚠️  Mixed state between tabs');
        }
        
        // Test 4: Check cookies
        console.log('\n🍪 Test 4: Check cookies');
        const page1Cookies = await page1.cookies();
        const page2Cookies = await page2.cookies();
        const page3Cookies = await page3.cookies();
        
        console.log('   - Normal tab cookies:', page1Cookies.length);
        console.log('   - Incognito tab cookies:', page2Cookies.length);
        console.log('   - New regular tab cookies:', page3Cookies.length);
        
        const authCookies1 = page1Cookies.filter(c => c.name.includes('pb_auth') || c.name.includes('session'));
        const authCookies2 = page2Cookies.filter(c => c.name.includes('pb_auth') || c.name.includes('session'));
        const authCookies3 = page3Cookies.filter(c => c.name.includes('pb_auth') || c.name.includes('session'));
        
        console.log('   - Normal tab auth cookies:', authCookies1.length);
        console.log('   - Incognito tab auth cookies:', authCookies2.length);  
        console.log('   - New regular tab auth cookies:', authCookies3.length);
        
        if (authCookies2.length > 0) {
            console.log('   - ❌ SECURITY ISSUE: Incognito tab has auth cookies!');
        } else {
            console.log('   - ✅ CORRECT: Incognito tab has no auth cookies');
        }
        
        // Summary
        console.log('\n📊 SUMMARY:');
        if (incognitoUrl.includes('/bullshift') || authCookies2.length > 0) {
            console.log('❌ CRITICAL SECURITY ISSUE DETECTED:');
            console.log('   - Incognito tabs are getting authenticated state');
            console.log('   - This indicates session bleeding in hooks.server.ts');
            console.log('   - Users could see each other\'s data');
        } else {
            console.log('✅ AUTHENTICATION ISOLATION WORKING:');
            console.log('   - Incognito tabs properly isolated');
            console.log('   - Regular tabs share cookies as expected');
            console.log('   - Security issue appears to be fixed');
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    } finally {
        console.log('\n🔍 Keeping browser open for manual inspection...');
        console.log('Press Ctrl+C to close when done inspecting');
        
        // Keep browser open for manual inspection
        // Uncomment the next line to auto-close after 30 seconds
        // setTimeout(() => browser.close(), 30000);
    }
}

// Run the test
testAuthIsolation().catch(console.error);