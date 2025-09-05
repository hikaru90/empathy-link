/**
 * Test script for the test_runs save functionality
 * Run this with: node test-save-function.js
 */

const testSamples = {
  // Sample 1: Multi-turn test result
  multiTurn: {
    test_type: "multi_turn",
    test_scenarios: ["mt_ug_01_defensive_to_vulnerable"],
    prompt_versions_tested: [],
    debug_mode: true,
    notes: "Multi-turn conversation test - Frustrated Partner scenario",
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
        totalTurns: 6,
        turnResults: [
          {
            turnNumber: 1,
            aiResponse: "Ich höre, dass du frustriert bist. Das klingt wirklich schwierig.",
            userResponse: "Ja, ich bin total genervt von der ganzen Situation.",
            turnScore: 75,
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
          },
          {
            turnNumber: 2,
            aiResponse: "Was genau belastet dich am meisten in der Beziehung?",
            userResponse: "Er hilft nie im Haushalt und kommt immer spät nach Hause.",
            turnScore: 60,
            progressAchieved: [],
            criticalFailures: ["Focuses on external behavior instead of feelings"],
            aiAnalysis: {
              empathyLevel: 6,
              judgmentLevel: 3,
              questionType: "open",
              reflectsFeeling: false,
              progressesConversation: true,
              triggersResistance: false
            }
          }
        ],
        conversationAnalysis: {
          userGrowthAchieved: ["feeling_heard"],
          pathProgressionQuality: 65,
          consistencyScore: 78,
          avoidanceCriteriaSuccess: false,
          conversationCoherence: 82,
          emotionalProgression: ["frustrated", "hurt"],
          breakthroughMoments: []
        },
        comparabilityMetrics: {
          conversationCoherence: 82,
          responseRelevance: 85,
          emotionalIntelligence: 72,
          adaptabilityScore: 68
        }
      }
    ],
    duration_ms: 45000,
    export_url: ""
  },

  // Sample 2: Quality test result (for comparison)
  quality: {
    test_type: "quality",
    test_scenarios: ["ug_01_initial_frustration"],
    prompt_versions_tested: ["v1.2.3"],
    debug_mode: false,
    notes: "Single response quality evaluation",
    total_tests: 1,
    passed: 1,
    pass_rate: 100,
    average_score: 87.2,
    total_conversations: 1,
    unique_paths_used: ["empathy_reflection"],
    path_switching_quality: 90,
    detailed_results: [
      {
        testScenario: "ug_01_initial_frustration",
        testInput: "Ich bin so frustriert mit meinem Partner!",
        aiResponse: "Ich kann hören, wie frustriert du bist. Das muss wirklich schwer für dich sein.",
        score: 87.2,
        passed: true,
        evaluation: {
          empathy: 90,
          accuracy: 85,
          helpfulness: 88,
          appropriateness: 85
        },
        reasoning: "Excellent empathetic response with validation",
        suggestions: ["Could explore specific feelings more deeply"]
      }
    ],
    duration_ms: 3000,
    export_url: ""
  },

  // Sample 3: Path performance test result
  pathPerformance: {
    test_type: "path_performance", 
    test_scenarios: ["ug_01_initial_frustration", "ug_02_workplace_stress"],
    prompt_versions_tested: ["v1.2.3"],
    debug_mode: true,
    notes: "Path navigation quality assessment",
    total_tests: 2,
    passed: 1,
    pass_rate: 50,
    average_score: 73.5,
    total_conversations: 4,
    unique_paths_used: ["empathy_reflection", "needs_exploration", "solution_focus"],
    path_switching_quality: 68,
    detailed_results: [
      {
        testScenario: "ug_01_initial_frustration",
        pathId: "empathy_reflection",
        pathSwitchingQuality: 75,
        conversationCount: 2,
        averageScore: 78,
        pathProgression: {
          stagesCompleted: ["initial_empathy", "feeling_reflection"],
          stageScores: {
            "initial_empathy": 82,
            "feeling_reflection": 74
          },
          transitionQuality: 75
        }
      },
      {
        testScenario: "ug_02_workplace_stress",
        pathId: "needs_exploration",
        pathSwitchingQuality: 62,
        conversationCount: 2,
        averageScore: 69,
        pathProgression: {
          stagesCompleted: ["initial_empathy", "needs_identification"],
          stageScores: {
            "initial_empathy": 71,
            "needs_identification": 67
          },
          transitionQuality: 62
        }
      }
    ],
    duration_ms: 12000,
    export_url: ""
  }
};

/**
 * Test the API endpoint with sample data
 */
async function testSaveFunction(sampleName = 'multiTurn') {
  const sample = testSamples[sampleName];
  if (!sample) {
    console.error(`❌ Unknown sample: ${sampleName}`);
    console.log('Available samples:', Object.keys(testSamples));
    return;
  }

  console.log(`🧪 Testing save function with sample: ${sampleName}`);
  console.log('📊 Sample data:', JSON.stringify(sample, null, 2));

  try {
    const response = await fetch('http://localhost:3003/api/test-runs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add authentication headers if testing manually
      },
      body: JSON.stringify(sample)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success:', result);
    } else {
      const error = await response.json();
      console.error('❌ Error:', error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Usage examples:
console.log('📋 Available test samples:');
console.log('- multiTurn: Multi-turn conversation test result');
console.log('- quality: Single response quality test result');  
console.log('- pathPerformance: Path navigation test result');
console.log('');
console.log('🚀 To test manually, copy the sample data and send POST request to /api/test-runs');
console.log('');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testSamples, testSaveFunction };
}

// Test multi-turn sample by default if run directly
if (typeof window === 'undefined' && require.main === module) {
  console.log('🧪 Run with: node test-save-function.js [sampleName]');
  console.log('Example: node test-save-function.js multiTurn');
  
  const sampleName = process.argv[2] || 'multiTurn';
  // Note: This would need authentication to work
  // testSaveFunction(sampleName);
}