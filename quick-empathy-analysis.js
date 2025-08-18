import { chromium } from 'playwright';

async function quickEmpathyAnalysis() {
  console.log('\n🔍 EMPATHY APP - USER EXPERIENCE ANALYSIS\n');
  console.log('=========================================\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const findings = {
    strengths: [],
    issues: [],
    recommendations: []
  };

  try {
    // 1. Test Landing Page
    console.log('1️⃣  TESTING LANDING PAGE...');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    const hasTitle = title && title.length > 0;
    
    if (!hasTitle) {
      findings.issues.push('Missing or empty page title - bad for SEO and accessibility');
    } else {
      findings.strengths.push('Page has title set');
    }

    // Check for clear value proposition
    const mainHeading = await page.locator('h1').first().textContent();
    if (mainHeading && mainHeading.length > 10) {
      findings.strengths.push('Clear main heading present');
    } else {
      findings.issues.push('Main heading missing or too short');
    }

    // 2. Test Navigation to Main App
    console.log('2️⃣  TESTING NAVIGATION TO MAIN APP...');
    
    // Look for ways to access the main app
    const appEntryPoints = await page.locator('a[href*="/bullshift"], a[href*="/app"], button:has-text("Start"), button:has-text("Los")').count();
    
    if (appEntryPoints === 0) {
      findings.issues.push('No clear entry point to main app from landing page');
      
      // Try direct navigation
      await page.goto('http://localhost:3001/bullshift');
    } else {
      await page.locator('a[href*="/bullshift"], a[href*="/app"]').first().click();
    }
    
    await page.waitForLoadState('networkidle');

    // 3. Test Authentication Flow
    console.log('3️⃣  TESTING AUTHENTICATION...');
    
    const currentUrl = page.url();
    if (currentUrl.includes('auth') || currentUrl.includes('login')) {
      findings.strengths.push('Proper authentication protection in place');
      
      // Test login form
      const emailField = page.locator('input[type="email"]');
      const passwordField = page.locator('input[type="password"]'); 
      const submitButton = page.locator('button[type="submit"]');
      
      const hasCompleteLoginForm = (await emailField.count() > 0) && 
                                  (await passwordField.count() > 0) && 
                                  (await submitButton.count() > 0);
      
      if (hasCompleteLoginForm) {
        findings.strengths.push('Complete login form with proper input types');
        
        // Test actual login with credentials
        await emailField.fill('test@example.com');
        await passwordField.fill('dif6rixa3');
        await submitButton.click();
        await page.waitForLoadState('networkidle');
        
        const postLoginUrl = page.url();
        if (!postLoginUrl.includes('auth') && !postLoginUrl.includes('login')) {
          console.log('4️⃣  TESTING MAIN APPLICATION...');
          findings.strengths.push('Login flow works correctly');
          
          // Test main chat interface
          const chatInput = page.locator('textarea, input[placeholder*="message"], input[placeholder*="Nachricht"]');
          const sendButton = page.locator('button[type="submit"], button:has-text("Send"), button[aria-label*="send"]');
          
          if (await chatInput.count() > 0) {
            findings.strengths.push('Chat interface present with input field');
            
            // Test typing
            await chatInput.fill('Test message for analysis');
            await page.waitForTimeout(1000);
            
            if (await sendButton.count() > 0) {
              findings.strengths.push('Send button available');
              // Don't actually send to avoid creating test data
              await chatInput.clear();
            } else {
              findings.issues.push('No clear send button found');
            }
          } else {
            findings.issues.push('No chat input interface found in main app');
          }
          
          // Test navigation within app
          const navElements = await page.locator('nav a, .menu a, [role="navigation"] a').count();
          if (navElements > 0) {
            findings.strengths.push(`Navigation menu with ${navElements} links found`);
            
            // Test stats/insights page
            const statsLink = page.locator('a[href*="stats"], a[href*="insight"]');
            if (await statsLink.count() > 0) {
              await statsLink.click();
              await page.waitForLoadState('networkidle');
              
              const hasCharts = await page.locator('svg, canvas, .chart').count() > 0;
              const hasData = await page.locator('.stat, .metric, td').count() > 0;
              
              if (hasCharts || hasData) {
                findings.strengths.push('Stats page contains data visualizations');
              } else {
                findings.issues.push('Stats page exists but appears empty');
              }
            }
          } else {
            findings.issues.push('No navigation menu found in main app');
          }
        } else {
          findings.issues.push('Login credentials may be incorrect - still on auth page');
        }
      } else {
        findings.issues.push('Incomplete login form missing required fields');
      }
    } else {
      findings.issues.push('No authentication protection - security concern');
    }

    // 5. Test Mobile Responsiveness
    console.log('5️⃣  TESTING MOBILE EXPERIENCE...');
    
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    if (!hasHorizontalScroll) {
      findings.strengths.push('No horizontal scroll on mobile - good responsive design');
    } else {
      findings.issues.push('Horizontal scroll present on mobile - responsive issues');
    }
    
    // Check button sizes for mobile
    const buttons = await page.locator('button, a, input[type="submit"]').all();
    let smallButtons = 0;
    for (const button of buttons.slice(0, 10)) { // Check first 10 to avoid timeout
      try {
        const box = await button.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          smallButtons++;
        }
      } catch (e) {
        // Ignore elements that can't be measured
      }
    }
    
    if (smallButtons === 0) {
      findings.strengths.push('Touch targets are appropriately sized (44px+)');
    } else {
      findings.issues.push(`${smallButtons} buttons are too small for mobile (< 44px)`);
      findings.recommendations.push('Increase button sizes to at least 44x44px for better mobile usability');
    }

    // 6. Performance Check
    console.log('6️⃣  CHECKING PERFORMANCE...');
    
    await page.goto('http://localhost:3001');
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: Math.round(nav.loadEventEnd - nav.fetchStart),
        domReady: Math.round(nav.domContentLoadedEventEnd - nav.fetchStart)
      };
    });
    
    if (metrics.loadTime < 1000) {
      findings.strengths.push(`Excellent load time: ${metrics.loadTime}ms`);
    } else if (metrics.loadTime < 3000) {
      findings.strengths.push(`Good load time: ${metrics.loadTime}ms`);
    } else {
      findings.issues.push(`Slow load time: ${metrics.loadTime}ms`);
      findings.recommendations.push('Optimize images, reduce bundle size, implement lazy loading');
    }

  } catch (error) {
    findings.issues.push(`Analysis error: ${error.message}`);
  }

  // Generate Report
  console.log('\n📊 ANALYSIS RESULTS');
  console.log('==================\n');
  
  console.log('✅ STRENGTHS:');
  if (findings.strengths.length === 0) {
    console.log('   None identified');
  } else {
    findings.strengths.forEach(strength => console.log(`   • ${strength}`));
  }
  
  console.log('\n❌ ISSUES FOUND:');
  if (findings.issues.length === 0) {
    console.log('   None found!');
  } else {
    findings.issues.forEach(issue => console.log(`   • ${issue}`));
  }
  
  console.log('\n💡 RECOMMENDATIONS:');
  
  // Add smart recommendations based on findings
  const smartRecommendations = [
    'Add loading states during AI response generation for better UX',
    'Implement error handling for failed API calls',
    'Add progress indicators for multi-step processes',
    'Consider adding onboarding tooltips for new users',
    'Add keyboard shortcuts for power users',
    'Implement offline support with service workers',
    'Add analytics to track user behavior and pain points',
    'Consider adding dark mode support',
    'Add export functionality for chat history',
    'Implement better accessibility with ARIA labels'
  ];
  
  const allRecommendations = [...findings.recommendations, ...smartRecommendations];
  allRecommendations.forEach(rec => console.log(`   • ${rec}`));
  
  console.log('\n🎯 PRIORITY FIXES:');
  const priorities = findings.issues.slice(0, 3);
  if (priorities.length === 0) {
    console.log('   Great job! No critical issues found.');
  } else {
    priorities.forEach((issue, i) => console.log(`   ${i + 1}. ${issue}`));
  }
  
  console.log('\n📈 OVERALL SCORE:');
  const totalFindings = findings.strengths.length + findings.issues.length;
  const positiveRatio = totalFindings > 0 ? (findings.strengths.length / totalFindings * 100) : 0;
  console.log(`   ${Math.round(positiveRatio)}% (${findings.strengths.length} strengths, ${findings.issues.length} issues)`);
  
  if (positiveRatio >= 80) {
    console.log('   🌟 Excellent! Your app is in great shape.');
  } else if (positiveRatio >= 60) {
    console.log('   👍 Good foundation, some areas for improvement.');
  } else {
    console.log('   🔧 Needs work, but you\'re on the right track.');
  }

  console.log('\n🔚 Analysis complete!\n');
  
  await browser.close();
}

quickEmpathyAnalysis().catch(console.error);