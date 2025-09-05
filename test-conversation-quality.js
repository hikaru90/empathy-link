#!/usr/bin/env node
/**
 * Command-line script for running conversation quality tests
 * Usage: node test-conversation-quality.js [options]
 */

import { ConversationTestRunner } from './src/lib/server/conversationTestRunner.js';
import { pb } from './src/scripts/pocketbase.js';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
	testType: 'basic',
	category: null,
	scenarioId: null,
	export: false,
	verbose: false
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
	const arg = args[i];
	switch (arg) {
		case '--type':
		case '-t':
			options.testType = args[++i];
			break;
		case '--category':
		case '-c':
			options.category = args[++i];
			break;
		case '--scenario':
		case '-s':
			options.scenarioId = args[++i];
			break;
		case '--export':
		case '-e':
			options.export = true;
			break;
		case '--verbose':
		case '-v':
			options.verbose = true;
			break;
		case '--help':
		case '-h':
			printUsage();
			process.exit(0);
		default:
			console.error(`Unknown option: ${arg}`);
			printUsage();
			process.exit(1);
	}
}

function printUsage() {
	console.log(`
🧪 Conversation Quality Test Runner

USAGE:
  node test-conversation-quality.js [options]

OPTIONS:
  -t, --type <type>       Test type: basic, advanced, all, category, single
  -c, --category <cat>    Category for category tests: user_growth, nvc_compliance, etc.
  -s, --scenario <id>     Scenario ID for single test
  -e, --export            Export results to JSON file
  -v, --verbose           Verbose output with detailed results
  -h, --help              Show this help message

ENVIRONMENT VARIABLES:
  ADMIN_EMAIL             Admin email for database authentication (default: admin@test.com)
  ADMIN_PASSWORD          Admin password for database authentication (default: test123456)
  TEST_BASE_URL           Base URL for API tests (default: http://localhost:5173)

AUTHENTICATION:
  The test runner tries to authenticate with PocketBase to use database-driven prompts.
  If authentication fails, it falls back to hardcoded prompts.
  
  Set up admin credentials:
  export ADMIN_EMAIL="your-admin@email.com"
  export ADMIN_PASSWORD="your-admin-password"

EXAMPLES:
  node test-conversation-quality.js --type basic
  node test-conversation-quality.js --type category --category user_growth
  node test-conversation-quality.js --type single --scenario ug_01_initial_frustration
  node test-conversation-quality.js --type all --export --verbose

TEST CATEGORIES:
  - user_growth: Tests for facilitating user self-awareness and growth
  - nvc_compliance: Tests for nonviolent communication principles
  - path_switching: Tests for conversation path transitions
  - circular_detection: Tests for avoiding repetitive conversations
  - balance_check: Tests for maintaining conversation balance
	`);
}

// Handle graceful cancellation
let isRunning = false;
process.on('SIGINT', () => {
	if (isRunning) {
		console.log('\n🛑 Test execution cancelled by user (Ctrl+C)');
		process.exit(130);
	} else {
		process.exit(0);
	}
});

process.on('SIGTERM', () => {
	if (isRunning) {
		console.log('\n🛑 Test execution terminated');
		process.exit(143);
	} else {
		process.exit(0);
	}
});

async function main() {
	console.log('🧪 Starting Conversation Quality Tests...\n');
	console.log('💡 Press Ctrl+C to cancel test execution at any time\n');
	
	if (options.verbose) {
		console.log('Test Configuration:');
		console.log(`- Type: ${options.testType}`);
		if (options.category) console.log(`- Category: ${options.category}`);
		if (options.scenarioId) console.log(`- Scenario: ${options.scenarioId}`);
		console.log(`- Export: ${options.export}`);
		console.log('');
	}
	
	const testRunner = new ConversationTestRunner();
	
	// Try to authenticate with admin credentials for CLI testing
	try {
		const adminEmail = process.env.ADMIN_EMAIL || 'admin@test.com';
		const adminPassword = process.env.ADMIN_PASSWORD || 'test123456';
		
		console.log('🔑 Attempting to authenticate for database access...');
		const authData = await pb.collection('users').authWithPassword(adminEmail, adminPassword);
		
		if (authData) {
			testRunner.setAuthenticatedPB(pb, authData.record);
			console.log('✅ Authenticated successfully');
		} else {
			console.log('⚠️ Authentication failed, falling back to hardcoded prompts');
		}
	} catch (error) {
		console.log('⚠️ Authentication failed, using hardcoded prompts:', error.message);
	}
	
	isRunning = true;
	
	try {
		let report;
		
		switch (options.testType) {
			case 'basic':
				report = await testRunner.runBasicTests();
				break;
			case 'advanced':
				report = await testRunner.runAdvancedTests();
				break;
			case 'all':
				report = await testRunner.runAllTests();
				break;
			case 'category':
				if (!options.category) {
					console.error('❌ Category is required for category tests. Use --category flag.');
					process.exit(1);
				}
				report = await testRunner.runCategoryTests(options.category);
				break;
			case 'single':
				if (!options.scenarioId) {
					console.error('❌ Scenario ID is required for single tests. Use --scenario flag.');
					process.exit(1);
				}
				const singleResult = await testRunner.runSingleTest(options.scenarioId);
				if (!singleResult) {
					console.error('❌ Test scenario not found:', options.scenarioId);
					process.exit(1);
				}
				
				console.log(`\n📊 SINGLE TEST RESULT: ${singleResult.scenarioId}`);
				console.log(`Score: ${singleResult.score}/100 ${singleResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
				console.log(`\nMetrics:`);
				Object.entries(singleResult.metrics).forEach(([key, value]) => {
					console.log(`- ${key}: ${value}/100`);
				});
				
				if (singleResult.evaluation.strengths.length > 0) {
					console.log(`\n✅ Strengths:`);
					singleResult.evaluation.strengths.forEach(s => console.log(`- ${s}`));
				}
				
				if (singleResult.evaluation.weaknesses.length > 0) {
					console.log(`\n⚠️ Issues:`);
					singleResult.evaluation.weaknesses.forEach(w => console.log(`- ${w}`));
				}
				
				if (singleResult.evaluation.recommendations.length > 0) {
					console.log(`\n🔧 Recommendations:`);
					singleResult.evaluation.recommendations.forEach(r => console.log(`- ${r}`));
				}
				
				if (options.verbose) {
					console.log(`\n🤖 AI Response:`);
					console.log(singleResult.aiResponse);
				}
				
				process.exit(0);
			default:
				console.error('❌ Invalid test type. Use: basic, advanced, all, category, or single');
				process.exit(1);
		}
		
		// Generate and display summary
		const summary = testRunner.generateTestSummary(report);
		console.log(summary);
		
		// Export results if requested
		if (options.export) {
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const filename = `conversation-quality-tests-${timestamp}.json`;
			const fs = await import('fs');
			
			const exportData = testRunner.exportResults(report, filename);
			fs.writeFileSync(filename, exportData);
			console.log(`\n💾 Results exported to: ${filename}`);
		}
		
		// Verbose output
		if (options.verbose && report.detailedResults) {
			console.log('\n📋 DETAILED RESULTS:');
			report.detailedResults.forEach((result, i) => {
				console.log(`\n${i + 1}. ${result.scenarioId} - ${result.passed ? '✅ PASSED' : '❌ FAILED'} (${result.score}/100)`);
				console.log(`   Metrics: UG:${result.metrics.userGrowthScore} NVC:${result.metrics.nvcComplianceScore} CP:${result.metrics.circularPreventionScore} PS:${result.metrics.pathSwitchingScore} CB:${result.metrics.conversationBalanceScore}`);
				if (result.evaluation.weaknesses.length > 0) {
					console.log(`   Issues: ${result.evaluation.weaknesses.join(', ')}`);
				}
			});
		}
		
		// Exit with appropriate code
		const passRate = report.summary.passRate;
		if (passRate >= 80) {
			console.log('\\n🎉 All tests passed with excellent results!');
			process.exit(0);
		} else if (passRate >= 70) {
			console.log('\\n✅ Tests completed with good results.');
			process.exit(0);
		} else {
			console.log('\\n⚠️ Some tests failed. Review the results and recommendations.');
			process.exit(1);
		}
		
	} catch (error) {
		console.error('❌ Test execution failed:', error);
		process.exit(1);
	} finally {
		isRunning = false;
	}
}

// List available tests/categories
if (args.includes('--list') || args.includes('-l')) {
	const testRunner = new ConversationTestRunner();
	
	console.log('📋 AVAILABLE TESTS:\\n');
	
	console.log('TEST CATEGORIES:');
	testRunner.getTestCategories().forEach(cat => {
		console.log(`- ${cat}`);
	});
	
	console.log('\\nTEST SCENARIOS:');
	testRunner.getAvailableTests().forEach(test => {
		console.log(`- ${test.id}: ${test.name} (${test.category})`);
	});
	
	process.exit(0);
}

// Run main function
if (require.main === module) {
	main().catch(error => {
		console.error('❌ Unexpected error:', error);
		process.exit(1);
	});
}