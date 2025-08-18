import { chromium } from 'playwright';

async function analyzeEmpathyApp() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('\n🔍 EMPATHY APP ANALYSIS\n');
  console.log('========================\n');

  try {
    // Navigate to the app
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(2000);

    console.log('✅ App loaded successfully');
    
    // Analyze landing page
    console.log('\n📄 LANDING PAGE ANALYSIS:');
    const title = await page.title();
    console.log(`- Page title: "${title}"`);
    
    // Check if it's responsive
    await page.setViewportSize({ width: 375, height: 812 }); // Mobile
    await page.waitForTimeout(1000);
    console.log('- Mobile viewport test: ✅');
    
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.waitForTimeout(1000);
    
    // Look for main navigation elements
    const navElements = await page.locator('nav, [role="navigation"], .menu, .navigation').count();
    console.log(`- Navigation elements found: ${navElements}`);
    
    // Check for CTA buttons
    const buttons = await page.locator('button, .button, [role="button"]').count();
    console.log(`- Interactive buttons found: ${buttons}`);
    
    // Look for auth-related elements
    const loginElements = await page.locator('text=/login|sign in|anmelden/i').count();
    const registerElements = await page.locator('text=/register|sign up|registrieren/i').count();
    console.log(`- Login elements: ${loginElements}, Register elements: ${registerElements}`);

    // Try to find main sections/modules
    console.log('\n🧩 MODULES & FEATURES:');
    const modules = [
      { name: 'Bullshift/Chat', selectors: ['text=/bullshift/i', 'text=/chat/i'] },
      { name: 'Self-empathy', selectors: ['text=/self.*empathy/i', 'text=/empathie/i'] },
      { name: 'Learning', selectors: ['text=/learn/i', 'text=/lernen/i'] },
      { name: 'Fights/Conflicts', selectors: ['text=/fight/i', 'text=/konflikt/i'] }
    ];

    for (const module of modules) {
      let found = false;
      for (const selector of module.selectors) {
        const count = await page.locator(selector).count();
        if (count > 0) {
          found = true;
          break;
        }
      }
      console.log(`- ${module.name}: ${found ? '✅ Found' : '❌ Not visible'}`);
    }

    // Try to access the main app (might require auth)
    console.log('\n🔐 AUTHENTICATION FLOW:');
    
    // Look for bullshift or main app links
    const appLinks = await page.locator('a[href*="/bullshift"], a[href*="/app"]').count();
    if (appLinks > 0) {
      console.log('- Found app links, attempting to access...');
      
      // Try clicking on bullshift link
      const bullshiftLink = page.locator('a[href*="/bullshift"]').first();
      if (await bullshiftLink.count() > 0) {
        await bullshiftLink.click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        console.log(`- Redirected to: ${currentUrl}`);
        
        if (currentUrl.includes('/auth') || currentUrl.includes('/login')) {
          console.log('- ✅ Proper auth protection detected');
          
          // Analyze login page
          console.log('\n📝 LOGIN PAGE ANALYSIS:');
          const emailInput = await page.locator('input[type="email"], input[name="email"]').count();
          const passwordInput = await page.locator('input[type="password"]').count();
          const submitButton = await page.locator('button[type="submit"], input[type="submit"]').count();
          
          console.log(`- Email input: ${emailInput > 0 ? '✅' : '❌'}`);
          console.log(`- Password input: ${passwordInput > 0 ? '✅' : '❌'}`);
          console.log(`- Submit button: ${submitButton > 0 ? '✅' : '❌'}`);
          
          // Check for register link
          const registerLink = await page.locator('a[href*="/register"], text=/register/i').count();
          console.log(`- Register link available: ${registerLink > 0 ? '✅' : '❌'}`);
        }
      }
    }

    // Performance analysis
    console.log('\n⚡ PERFORMANCE ANALYSIS:');
    const performanceEntries = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: Math.round(entries.loadEventEnd - entries.fetchStart),
        domReady: Math.round(entries.domContentLoadedEventEnd - entries.fetchStart),
        firstPaint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
      };
    });
    
    console.log(`- Page load time: ${performanceEntries.loadTime}ms`);
    console.log(`- DOM ready: ${performanceEntries.domReady}ms`);
    console.log(`- First paint: ${performanceEntries.firstPaint}ms`);

    // Accessibility quick check
    console.log('\n♿ ACCESSIBILITY QUICK CHECK:');
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    const altTexts = await page.locator('img[alt]').count();
    const totalImages = await page.locator('img').count();
    const ariaLabels = await page.locator('[aria-label]').count();
    
    console.log(`- Heading structure: ${headings} headings found`);
    console.log(`- Images with alt text: ${altTexts}/${totalImages}`);
    console.log(`- Elements with aria-labels: ${ariaLabels}`);

    // Mobile responsiveness check
    console.log('\n📱 MOBILE RESPONSIVENESS:');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    console.log(`- Horizontal scroll on mobile: ${hasHorizontalScroll ? '❌ Present' : '✅ None'}`);
    
    // Check for mobile menu
    const mobileMenus = await page.locator('.mobile-menu, .hamburger, [aria-label*="menu"]').count();
    console.log(`- Mobile menu elements: ${mobileMenus}`);

    console.log('\n🎨 DESIGN & UX OBSERVATIONS:');
    
    // Check for loading states
    const loadingElements = await page.locator('.loading, .spinner, .skeleton').count();
    console.log(`- Loading state elements: ${loadingElements}`);
    
    // Check for error states
    const errorElements = await page.locator('.error, .alert, .warning').count();
    console.log(`- Error state elements: ${errorElements}`);

  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
  } finally {
    console.log('\n📋 ANALYSIS COMPLETE');
    console.log('========================\n');
    
    // Keep browser open for manual inspection
    console.log('Browser will remain open for manual inspection...');
    console.log('Press Ctrl+C to close when done.\n');
    
    // Don't close the browser automatically
    // await browser.close();
  }
}

analyzeEmpathyApp().catch(console.error);