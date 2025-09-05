import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	const pb = locals.pb;
	
	if (!user || !pb) {
		return json({ error: 'Unauthorized - please log in first' }, { status: 401 });
	}

	console.log('🧪 Testing save function with authenticated user:', user.email);

	// Sample multi-turn test data
	const testData = {
		test_type: "multi_turn",
		test_scenarios: ["mt_ug_01_defensive_to_vulnerable"],
		prompt_versions_tested: [],
		debug_mode: true,
		notes: "API test - multi-turn conversation save function",
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
						aiResponse: "Ich höre, dass du frustriert bist. Das muss wirklich schwer für dich sein.",
						userResponse: "Ja, das bin ich wirklich. Ich weiß nicht mehr weiter.",
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
						},
						emotionalStateChange: "frustrated -> slightly relieved"
					},
					{
						turnNumber: 2,
						aiResponse: "Was belastet dich am meisten in dieser Situation?",
						userResponse: "Er kommt immer so spät nach Hause und hilft nie im Haushalt.",
						turnScore: 60,
						progressAchieved: [],
						criticalFailures: ["Focuses on behavior instead of feelings"],
						aiAnalysis: {
							empathyLevel: 6,
							judgmentLevel: 3,
							questionType: "open",
							reflectsFeeling: false,
							progressesConversation: true,
							triggersResistance: false
						}
					},
					{
						turnNumber: 3,
						aiResponse: "Wie fühlst du dich, wenn er spät kommt?",
						userResponse: "Ich fühle mich allein gelassen und nicht wichtig.",
						turnScore: 80,
						progressAchieved: ["emotional_awareness", "needs_identification"],
						criticalFailures: [],
						aiAnalysis: {
							empathyLevel: 9,
							judgmentLevel: 1,
							questionType: "open",
							reflectsFeeling: true,
							progressesConversation: true,
							triggersResistance: false
						},
						emotionalStateChange: "frustrated -> sad but understood"
					}
				],
				conversationAnalysis: {
					userGrowthAchieved: ["feeling_heard", "emotional_awareness", "needs_identification"],
					pathProgressionQuality: 72,
					consistencyScore: 78,
					avoidanceCriteriaSuccess: true,
					conversationCoherence: 85,
					emotionalProgression: ["frustrated", "slightly relieved", "sad but understood"],
					breakthroughMoments: [3]
				},
				comparabilityMetrics: {
					conversationCoherence: 85,
					responseRelevance: 88,
					emotionalIntelligence: 82,
					adaptabilityScore: 75
				}
			}
		],
		duration_ms: 47000,
		export_url: ""
	};

	try {
		console.log('🔄 Attempting to save test data...');
		
		// Map test types to valid PocketBase values
		let validTestType = testData.test_type;
		if (testData.test_type === 'multi_turn') {
			validTestType = 'quality'; // Use 'quality' as valid type for multi-turn tests
		}

		// Extract unique paths from detailed results if available
		let uniquePathsUsed = testData.unique_paths_used || [];
		if (testData.detailed_results && testData.detailed_results.length > 0) {
			// Extract paths from pathResults in detailed results
			const pathsFromResults = testData.detailed_results.flatMap(result => 
				result.pathResults ? result.pathResults.map(pr => pr.pathId) : []
			);
			if (pathsFromResults.length > 0) {
				uniquePathsUsed = [...new Set(pathsFromResults)]; // Remove duplicates
			}
		}

		// Prepare data for PocketBase
		const dataToSave = {
			test_type: String(validTestType),
			test_scenarios: testData.test_scenarios || [],
			prompt_versions_tested: testData.prompt_versions_tested || [],
			debug_mode: Boolean(testData.debug_mode),
			notes: testData.notes || 'API test save function',
			total_tests: Number(testData.total_tests),
			passed: Number(testData.passed || 0),
			pass_rate: Number(testData.pass_rate || 0),
			average_score: Number(testData.average_score || 0),
			total_conversations: Number(testData.total_conversations || testData.total_tests || 0),
			unique_paths_used: uniquePathsUsed,
			path_switching_quality: Number(testData.path_switching_quality || 0),
			detailed_results: testData.detailed_results || [],
			user: user.id,
			duration_ms: Number(testData.duration_ms || 0),
			export_url: testData.export_url || ''
		};

		console.log('💾 Saving to PocketBase...');
		console.log('👤 User ID:', user.id);
		console.log('📊 Data summary:', {
			test_type: dataToSave.test_type,
			total_tests: dataToSave.total_tests,
			average_score: dataToSave.average_score,
			detailed_results_count: dataToSave.detailed_results.length
		});

		// Save to test_runs collection
		const record = await pb.collection('test_runs').create(dataToSave);

		console.log('✅ SUCCESS! Record saved with ID:', record.id);

		return json({
			success: true,
			message: 'Test save function completed successfully!',
			recordId: record.id,
			testData: {
				test_type: dataToSave.test_type,
				scenario: testData.test_scenarios[0],
				score: testData.average_score,
				turns: testData.detailed_results[0]?.totalTurns,
				user: user.email
			},
			savedRecord: {
				id: record.id,
				test_type: record.test_type,
				total_tests: record.total_tests,
				average_score: record.average_score,
				created: record.created
			}
		});

	} catch (error: any) {
		console.error('❌ Save function test failed:', error);
		console.error('Error details:', {
			message: error.message,
			response: error.response?.data,
			status: error.status
		});

		return json({
			success: false,
			error: 'Save function test failed',
			details: error.message,
			pocketbaseError: error.response?.data,
			testData: {
				test_type: testData.test_type,
				scenario: testData.test_scenarios[0],
				user: user.email
			}
		}, { status: 500 });
	}
};