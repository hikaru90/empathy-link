import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let dataToSave: any = null; // Declare in outer scope for error handling
	
	try {
		const testRunData = await request.json();
		
		console.log('📥 Received test run data:', testRunData);
		console.log('🔍 Required fields check:', {
			test_type: testRunData.test_type,
			total_tests: testRunData.total_tests,
			hasTestType: !!testRunData.test_type,
			hasTotalTests: !!testRunData.total_tests
		});

		// Validate required fields
		if (!testRunData.test_type || testRunData.total_tests === undefined || testRunData.total_tests === null) {
			console.log('❌ Validation failed - missing required fields');
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Map test types to valid PocketBase values (based on existing schema)
		let validTestType = testRunData.test_type;
		if (testRunData.test_type === 'multi_turn') {
			validTestType = 'quality'; // Use 'quality' as valid type for multi-turn tests
		}

		// Extract unique paths from detailed results if available
		let uniquePathsUsed = testRunData.unique_paths_used || [];
		if (testRunData.detailed_results && testRunData.detailed_results.length > 0) {
			// Extract paths from pathResults in detailed results
			const pathsFromResults = testRunData.detailed_results.flatMap(result => 
				result.pathResults ? result.pathResults.map(pr => pr.pathId) : []
			);
			if (pathsFromResults.length > 0) {
				uniquePathsUsed = [...new Set(pathsFromResults)]; // Remove duplicates
			}
		}

		// Ensure all fields match the exact PocketBase schema
		dataToSave = {
			test_type: String(validTestType),
			test_scenarios: testRunData.test_scenarios || [],
			prompt_versions_tested: testRunData.prompt_versions_tested || [], // New required field
			debug_mode: Boolean(testRunData.debug_mode),
			notes: testRunData.notes || `Multi-turn conversation test: ${testRunData.test_type}`,
			total_tests: Number(testRunData.total_tests),
			passed: Number(testRunData.passed || 0),
			pass_rate: Number(testRunData.pass_rate || 0),
			average_score: Number(testRunData.average_score || 0),
			total_conversations: Number(testRunData.total_conversations || testRunData.total_tests || 0),
			unique_paths_used: uniquePathsUsed,
			path_switching_quality: Number(testRunData.path_switching_quality || 0),
			detailed_results: testRunData.detailed_results || [],
			user: user.id,
			duration_ms: Number(testRunData.duration_ms || 0),
			export_url: testRunData.export_url || ''
		};
		
		console.log('💾 Data to save (with proper types):', {
			...dataToSave,
			detailed_results: `[${dataToSave.detailed_results.length} items]` // Don't log full details
		});

		// Save to test_runs collection
		const record = await pb.collection('test_runs').create(dataToSave);

		return json({
			id: record.id,
			message: 'Test run saved successfully'
		});

	} catch (error: any) {
		console.error('Error saving test run:', error);
		console.error('Error response data:', error.response?.data);
		console.error('Error details:', {
			status: error.status,
			message: error.message,
			response: error.response,
			originalError: error.originalError
		});
		
		// Return detailed error information for debugging
		return json({ 
			error: 'Failed to save test run',
			details: error.message,
			pocketbaseError: error.response?.data,
			sentData: dataToSave
		}, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ locals, url }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const latestOnly = url.searchParams.get('latest') === 'true';
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const testType = url.searchParams.get('test_type');
		
		if (latestOnly) {
			// Get only the latest test run
			const records = await pb.collection('test_runs').getList(1, 1, {
				filter: `user = "${user.id}"`,
				sort: '-created'
			});

			const latestTestRun = records.items.length > 0 ? records.items[0] : null;

			return json({
				latestTestRun,
				hasTestRuns: records.items.length > 0
			});
		} else {
			// Build filter based on parameters
			let filter = `user = "${user.id}"`;
			if (testType) {
				filter += ` && test_type = "${testType}"`;
			}

			// Get test runs for the current user (default behavior)
			const records = await pb.collection('test_runs').getList(1, Math.min(limit, 100), {
				filter,
				sort: '-created'
			});

			return json({
				testRuns: records.items
			});
		}

	} catch (error: any) {
		console.error('Error fetching test runs:', error);
		return json({ 
			error: 'Failed to fetch test runs',
			details: error.message 
		}, { status: 500 });
	}
};
