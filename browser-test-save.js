/**
 * Browser Console Test for test_runs API
 * Run this in the browser console while logged into the app
 */

// Test data sample
const testData = {
  test_type: "multi_turn",
  test_scenarios: ["mt_ug_01_defensive_to_vulnerable"],
  prompt_versions_tested: [],
  debug_mode: true,
  notes: "Browser console test - multi-turn conversation",
  total_tests: 1,
  passed: 0,
  pass_rate: 0,
  average_score: 65.5,
  total_conversations: 1,
  unique_paths_used: [],
  path_switching_quality: 0,
  detailed_results: [
    {
      scenarioId: "mt_ug_01_defensive_to_vulnerable",
      scenarioName: "Alex - Frustrated Partner",
      passed: false,
      overallScore: 65.5,
      totalTurns: 3,
      turnResults: [
        {
          turnNumber: 1,
          aiResponse: "Ich höre, dass du frustriert bist.",
          userResponse: "Ja, das bin ich wirklich.",
          turnScore: 70,
          progressAchieved: ["feeling_heard"],
          criticalFailures: [],
          aiAnalysis: {
            empathyLevel: 8,
            judgmentLevel: 2,
            questionType: "open",
            reflectsFeeling: true,
            progressesConversation: true,
            triggersResistance: false
          }
        }
      ],
      conversationAnalysis: {
        userGrowthAchieved: ["feeling_heard"],
        pathProgressionQuality: 65,
        consistencyScore: 78,
        avoidanceCriteriaSuccess: false
      },
      comparabilityMetrics: {
        conversationCoherence: 82,
        responseRelevance: 85,
        emotionalIntelligence: 72,
        adaptabilityScore: 68
      }
    }
  ],
  duration_ms: 5000,
  export_url: ""
};

// Test function
async function testSaveFunction() {
  console.log('🧪 Testing test_runs API with sample data...');
  console.log('📊 Test data:', testData);
  
  try {
    const response = await fetch('/api/test-runs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! Test run saved:', result);
      return result;
    } else {
      const error = await response.json();
      console.error('❌ ERROR:', error);
      return { error };
    }
  } catch (error) {
    console.error('❌ NETWORK ERROR:', error);
    return { error: error.message };
  }
}

// Auto-run the test
console.log('🚀 Running test_runs API test...');
testSaveFunction().then(result => {
  if (result.error) {
    console.log('❌ Test failed. Check the error above for details.');
  } else {
    console.log('🎉 Test passed! The save function is working correctly.');
  }
});