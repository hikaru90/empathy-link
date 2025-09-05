import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testTestRuns() {
  try {
    // Authenticate (replace with your credentials)
    const authData = await pb.collection('users').authWithPassword('your-email@example.com', 'your-password');
    
    console.log('✅ Authenticated successfully');
    
    // Test 1: Run a single quality test
    console.log('\n🧪 Running single quality test...');
    const qualityResponse = await fetch('http://localhost:5173/api/ai/test-conversation-quality', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testType: 'single',
        scenarioId: 'ug_01_initial_frustration'
      })
    });
    
    const qualityResult = await qualityResponse.json();
    console.log('Quality test result:', qualityResult);
    
    // Test 2: Run path performance test
    console.log('\n🧪 Running path performance test...');
    const pathResponse = await fetch('http://localhost:5173/api/ai/test-path-performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testScenarioIds: ['ug_01_initial_frustration'],
        saveResults: false,
        debugMode: true
      })
    });
    
    const pathResult = await pathResponse.json();
    console.log('Path test result:', pathResult);
    
    // Test 3: Save to test_runs collection
    console.log('\n💾 Saving to test_runs collection...');
    
    const testRunData = {
      test_type: 'quality',
      test_scenarios: ['ug_01_initial_frustration'],
      debug_mode: true,
      total_tests: 1,
      passed: qualityResult.result?.passed ? 1 : 0,
      pass_rate: qualityResult.result?.passed ? 100 : 0,
      average_score: qualityResult.result?.score || 0,
      total_conversations: 1,
      unique_paths_used: ['idle'],
      path_switching_quality: 80,
      detailed_results: [qualityResult.result],
      duration_ms: 5000,
      user: authData.record.id
    };
    
    const savedTestRun = await pb.collection('test_runs').create(testRunData);
    console.log('✅ Test run saved:', savedTestRun.id);
    
    // Test 4: Retrieve test runs
    console.log('\n📊 Retrieving test runs...');
    const testRuns = await pb.collection('test_runs').getList(1, 10, {
      sort: '-created'
    });
    
    console.log('Found test runs:', testRuns.items.length);
    testRuns.items.forEach(run => {
      console.log(`- ${run.test_type}: ${run.average_score}/100 (${run.created})`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testTestRuns();
