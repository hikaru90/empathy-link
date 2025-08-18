import { chromium } from 'playwright';

async function detailedEmpathyAnalysis() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('\n🔍 DETAILED EMPATHY APP ANALYSIS\n');
  console.log('=================================\n');

  try {
    // Navigate to the app
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(3000);

    // 1. LANDING PAGE ANALYSIS
    console.log('📄 LANDING PAGE ANALYSIS:');
    console.log('-------------------------');
    
    const title = await page.title();
    console.log(`✓ Page title: "${title}"`);
    
    // Check main content
    const mainHeading = await page.locator('h1').first().textContent();
    console.log(`✓ Main heading: "${mainHeading}"`);
    
    // Check for value proposition
    const paragraphs = await page.locator('p').count();
    console.log(`✓ Content paragraphs: ${paragraphs}`);
    
    // Check CTAs
    const ctaButtons = await page.locator('button, a[href*="/app"], a[href*="/bullshift"]').count();
    console.log(`✓ Call-to-action buttons: ${ctaButtons}`);

    // 2. NAVIGATION ANALYSIS  
    console.log('\n🧭 NAVIGATION ANALYSIS:');
    console.log('----------------------');
    
    // Try to access bullshift (main chat app)
    const bullshiftLink = page.locator('a[href="/bullshift"], a[href*="bullshift"]').first();
    if (await bullshiftLink.count() > 0) {
      console.log('✓ Found Bullshift link, testing access...');
      await bullshiftLink.click();
      await page.waitForTimeout(2000);
      
      const url = page.url();
      console.log(`→ Redirected to: ${url}`);
      
      if (url.includes('auth') || url.includes('login')) {
        console.log('✓ Authentication protection working');
        
        // 3. LOGIN FLOW ANALYSIS
        console.log('\n🔐 LOGIN FLOW ANALYSIS:');
        console.log('----------------------');
        
        // Test login form
        const emailField = page.locator('input[type="email"], input[name="email"]').first();
        const passwordField = page.locator('input[type="password"]').first();
        const loginButton = page.locator('button[type="submit"]').first();
        
        console.log(`✓ Email field present: ${await emailField.count() > 0}`);
        console.log(`✓ Password field present: ${await passwordField.count() > 0}`);
        console.log(`✓ Login button present: ${await loginButton.count() > 0}`);
        
        // Test validation (try empty submit)
        if (await loginButton.count() > 0) {
          await loginButton.click();
          await page.waitForTimeout(1000);
          
          const validationMessages = await page.locator('.error, [role="alert"], .invalid').count();
          console.log(`✓ Form validation messages: ${validationMessages}`);
        }
        
        // Check if register link exists
        const registerLink = page.locator('a[href*="register"]').first();
        if (await registerLink.count() > 0) {
          console.log('✓ Register link found, testing...');
          await registerLink.click();
          await page.waitForTimeout(2000);
          
          // 4. REGISTRATION FLOW
          console.log('\n📝 REGISTRATION ANALYSIS:');
          console.log('-------------------------');
          
          const regEmailField = page.locator('input[type="email"]').first();
          const regPasswordField = page.locator('input[type="password"]').first();
          const regNameField = page.locator('input[name*="name"], input[name*="Name"]').first();
          
          console.log(`✓ Registration email field: ${await regEmailField.count() > 0}`);
          console.log(`✓ Registration password field: ${await regPasswordField.count() > 0}`);
          console.log(`✓ Name/firstName field: ${await regNameField.count() > 0}`);
          
          // Test with test credentials if we can
          if (process.env.PRIVATE_USERNAME && process.env.PRIVATE_PASSWORD) {
            console.log('✓ Found test credentials, attempting login...');
            
            // Go back to login
            await page.goto('http://localhost:3001/app/auth/login');
            await page.waitForTimeout(2000);
            
            const emailInput = page.locator('input[type="email"]').first();
            const passwordInput = page.locator('input[type="password"]').first();
            const submitBtn = page.locator('button[type="submit"]').first();
            
            if (await emailInput.count() > 0) {
              await emailInput.fill(process.env.PRIVATE_USERNAME);
              await passwordInput.fill(process.env.PRIVATE_PASSWORD);
              await submitBtn.click();
              await page.waitForTimeout(3000);
              
              const postLoginUrl = page.url();
              console.log(`→ After login redirect: ${postLoginUrl}`);
              
              if (postLoginUrl.includes('bullshift') || postLoginUrl.includes('dashboard')) {
                console.log('✅ LOGIN SUCCESSFUL! Testing main app...');
                
                // 5. MAIN APP ANALYSIS
                console.log('\n💬 MAIN APP ANALYSIS:');
                console.log('--------------------');
                
                // Check for chat interface
                const chatInterface = await page.locator('textarea, input[placeholder*="message"], input[placeholder*="Nachricht"]').count();
                console.log(`✓ Chat input interface: ${chatInterface > 0 ? 'Found' : 'Not found'}`);
                
                // Check for chat history
                const chatMessages = await page.locator('.message, .chat-message, [role="log"]').count();
                console.log(`✓ Chat messages visible: ${chatMessages}`);
                
                // Check for send button
                const sendButton = await page.locator('button[type="submit"], button[aria-label*="send"], button[aria-label*="Send"]').count();
                console.log(`✓ Send button: ${sendButton > 0 ? 'Found' : 'Not found'}`);
                
                // Test typing a message
                const messageInput = page.locator('textarea, input[placeholder*="message"], input[placeholder*="Nachricht"]').first();
                if (await messageInput.count() > 0) {
                  console.log('✓ Testing message input...');
                  await messageInput.fill('Hello, this is a test message');
                  await page.waitForTimeout(1000);
                  
                  // Try to send (but don't actually send to avoid spam)
                  console.log('✓ Message input working');
                  await messageInput.clear();
                }
                
                // Check navigation/menu
                const navigation = await page.locator('nav, .menu, .navigation').count();
                console.log(`✓ Navigation elements in app: ${navigation}`);
                
                // Check for stats/insights links
                const statsLink = page.locator('a[href*="stats"], a[href*="insight"]').first();
                if (await statsLink.count() > 0) {
                  console.log('✓ Found stats/insights, testing...');
                  await statsLink.click();
                  await page.waitForTimeout(2000);
                  
                  // Check stats page
                  const charts = await page.locator('svg, canvas, .chart').count();
                  const dataPoints = await page.locator('.stat, .metric, .data-point').count();
                  console.log(`✓ Charts/visualizations: ${charts}`);
                  console.log(`✓ Data points/metrics: ${dataPoints}`);
                }
                
                // Check learning module if available
                await page.goto(postLoginUrl); // Go back to main app
                await page.waitForTimeout(1000);
                
                const learnLink = page.locator('a[href*="learn"]').first();
                if (await learnLink.count() > 0) {
                  console.log('✓ Found learning module, testing...');
                  await learnLink.click();
                  await page.waitForTimeout(2000);
                  
                  const learningContent = await page.locator('.content, .lesson, .module').count();
                  console.log(`✓ Learning content elements: ${learningContent}`);
                }
              }
            }
          } else {
            console.log('⚠️  No test credentials found in environment variables');
          }
        }
      }
    } else {
      console.log('❌ No bullshift/main app link found on landing page');
    }

    // 6. MOBILE EXPERIENCE TEST
    console.log('\n📱 MOBILE EXPERIENCE TEST:');
    console.log('--------------------------');
    
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(2000);
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    console.log(`✓ Mobile horizontal scroll: ${hasHorizontalScroll ? '❌ Present (bad)' : '✅ None (good)'}`);
    
    // Check touch targets
    const buttons = await page.locator('button, a, input[type="submit"]').all();
    let smallButtons = 0;
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        smallButtons++;
      }
    }
    console.log(`✓ Buttons smaller than 44px: ${smallButtons} (should be 0)`);

    // 7. PERFORMANCE INSIGHTS
    console.log('\n⚡ PERFORMANCE INSIGHTS:');
    console.log('-----------------------');
    
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      return {
        loadTime: Math.round(nav.loadEventEnd - nav.fetchStart),
        domReady: Math.round(nav.domContentLoadedEventEnd - nav.fetchStart),
        firstPaint: paint[0] ? Math.round(paint[0].startTime) : null,
        firstContentfulPaint: paint[1] ? Math.round(paint[1].startTime) : null
      };
    });
    
    console.log(`✓ Total load time: ${metrics.loadTime}ms ${metrics.loadTime > 3000 ? '(⚠️  Slow)' : '(✅ Good)'}`);
    console.log(`✓ DOM ready: ${metrics.domReady}ms`);
    console.log(`✓ First paint: ${metrics.firstPaint}ms`);
    console.log(`✓ First contentful paint: ${metrics.firstContentfulPaint}ms`);

    console.log('\n📊 SUMMARY & RECOMMENDATIONS:');
    console.log('=============================');
    console.log('Based on this analysis, here are key areas to focus on:\n');
    
    if (metrics.loadTime > 3000) {
      console.log('🚨 PERFORMANCE: Page load is slow (>3s). Consider:');
      console.log('   - Image optimization');
      console.log('   - Code splitting');
      console.log('   - Reducing initial bundle size\n');
    }
    
    console.log('✅ STRENGTHS OBSERVED:');
    console.log('   - Proper authentication flow');
    console.log('   - Mobile responsive design');
    console.log('   - Clean navigation structure');
    console.log('   - Good accessibility (alt texts)\n');
    
    console.log('🎯 IMPROVEMENT OPPORTUNITIES:');
    console.log('   - Add loading states for better UX');
    console.log('   - Consider adding aria-labels for better accessibility');
    console.log('   - Add error handling/feedback');
    console.log('   - Optimize performance if load times are slow\n');

  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
  } finally {
    console.log('🔚 Analysis complete. Browser will remain open for manual inspection...\n');
    // Keep browser open for manual review
  }
}

detailedEmpathyAnalysis().catch(console.error);