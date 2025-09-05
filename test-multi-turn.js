#!/usr/bin/env node
/**
 * Command-line script for running multi-turn conversation tests
 * Usage: node test-multi-turn.js [options]
 */

import { MultiTurnTestRunner, MULTI_TURN_TEST_SCENARIOS } from './src/lib/server/multiTurnTestSuite.js';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
	testType: 'single',
	scenarioId: null,
	maxTurns: null,
	verbose: false,
	export: false
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
	const arg = args[i];
	switch (arg) {
		case '--type':
		case '-t':
			options.testType = args[++i];
			break;
		case '--scenario':
		case '-s':
			options.scenarioId = args[++i];
			break;
		case '--max-turns':
		case '-m':
			options.maxTurns = parseInt(args[++i]);
			break;
		case '--verbose':
		case '-v':
			options.verbose = true;
			break;
		case '--export':
		case '-e':
			options.export = true;
			break;
		case '--help':
		case '-h':
			printUsage();
			process.exit(0);
		case '--list':
		case '-l':
			listScenarios();
			process.exit(0);
		default:
			console.error(`Unknown option: ${arg}`);
			printUsage();
			process.exit(1);
	}
}

function printUsage() {
	console.log(`
🔄 Multi-Turn Conversation Test Runner

USAGE:
  node test-multi-turn.js [options]

OPTIONS:
  -t, --type <type>       Test type: single, all
  -s, --scenario <id>     Scenario ID for single test
  -m, --max-turns <num>   Override maximum turns for test (1-15)
  -v, --verbose           Show detailed conversation flow
  -e, --export            Export detailed results to JSON
  -l, --list              List all available scenarios
  -h, --help              Show this help message

EXAMPLES:
  # Run a single scenario
  node test-multi-turn.js --type single --scenario angry_partner_journey

  # Run all scenarios
  node test-multi-turn.js --type all --verbose

  # Run single scenario with custom max turns
  node test-multi-turn.js -t single -s resistant_workplace_breakthrough -m 6

  # List available scenarios
  node test-multi-turn.js --list

AVAILABLE TEST TYPES:
  - single: Run one specific conversation scenario
  - all: Run all available scenarios for comprehensive testing
	`);
}

function listScenarios() {
	console.log(`
📋 AVAILABLE MULTI-TURN SCENARIOS:

`);
	
	MULTI_TURN_TEST_SCENARIOS.forEach((scenario, i) => {
		console.log(`${i + 1}. ${scenario.id}`);
		console.log(`   Name: ${scenario.name}`);
		console.log(`   Description: ${scenario.description}`);
		console.log(`   Target Path: ${scenario.targetPath}`);
		console.log(`   Max Turns: ${scenario.maxTurns}`);
		console.log(`   Category: ${scenario.category}`);
		console.log('');
	});
}

async function runSingleTest(scenarioId, maxTurns = null) {
	const scenario = MULTI_TURN_TEST_SCENARIOS.find(s => s.id === scenarioId);
	if (!scenario) {
		console.error(`❌ Scenario '${scenarioId}' not found`);
		return;
	}
	
	if (maxTurns) {
		scenario.maxTurns = Math.min(maxTurns, 15);
		console.log(`🔧 Overriding max turns to: ${scenario.maxTurns}`);
	}
	
	console.log(`🔄 Running: ${scenario.name}`);
	console.log(`📖 Description: ${scenario.description}`);
	console.log(`🎯 Target Path: ${scenario.targetPath}`);
	console.log(`💬 Max Turns: ${scenario.maxTurns}`);
	console.log(`👤 Test Persona: ${scenario.personaId}`);
	console.log('');
	
	const runner = new MultiTurnTestRunner();
	
	try {
		const result = await runner.runMultiTurnTest(scenario);
		
		console.log(`📊 RESULTS:`);
		console.log(`Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
		console.log(`Overall Score: ${result.overallScore.toFixed(1)}/100`);
		console.log(`Turns Completed: ${result.totalTurns}/${scenario.maxTurns}`);
		console.log('');
		
		console.log(`🎯 CONVERSATION ANALYSIS:`);
		console.log(`User Growth Achieved: ${result.conversationAnalysis.userGrowthAchieved?.join(', ') || 'None'}`);
		console.log(`Path Progression Quality: ${result.conversationAnalysis.pathProgressionQuality}/100`);
		console.log(`Consistency Score: ${result.conversationAnalysis.consistencyScore}/100`);
		console.log(`Avoidance Criteria Success: ${result.conversationAnalysis.avoidanceCriteriaSuccess ? '✅' : '❌'}`);
		console.log('');
		
		if (options.verbose || result.turnResults.some(t => t.criticalFailures.length > 0)) {
			console.log(`🔍 TURN-BY-TURN BREAKDOWN:`);
			result.turnResults.forEach(turn => {
				console.log(`\nTurn ${turn.turnNumber} (Score: ${turn.turnScore}/100):`);
				console.log(`  User: "${turn.userResponse}"`);
				console.log(`  AI: "${turn.aiResponse}"`);
				
				if (turn.progressAchieved.length > 0) {
					console.log(`  ✅ Progress: ${turn.progressAchieved.join(', ')}`);
				}
				
				if (turn.criticalFailures.length > 0) {
					console.log(`  ❌ Critical Issues: ${turn.criticalFailures.join(', ')}`);
				}
			});
		}
		
		if (result.comparabilityMetrics.repeatedPatterns.length > 0) {
			console.log(`\n⚠️ REPEATED PATTERNS DETECTED:`);
			result.comparabilityMetrics.repeatedPatterns.forEach(pattern => {
				console.log(`- ${pattern}`);
			});
		}
		
	} catch (error) {
		console.error(`❌ Test execution failed:`, error);
	}
}

async function runAllTests() {
	console.log(`🔄 Running all ${MULTI_TURN_TEST_SCENARIOS.length} multi-turn scenarios...\n`);
	
	const runner = new MultiTurnTestRunner();
	const results = [];
	let totalScore = 0;
	let passedTests = 0;
	
	for (let i = 0; i < MULTI_TURN_TEST_SCENARIOS.length; i++) {
		const scenario = MULTI_TURN_TEST_SCENARIOS[i];
		console.log(`[${i + 1}/${MULTI_TURN_TEST_SCENARIOS.length}] ${scenario.name}`);
		
		try {
			const result = await runner.runMultiTurnTest(scenario);
			results.push({ scenario, result });
			
			totalScore += result.overallScore;
			if (result.passed) passedTests++;
			
			console.log(`  ${result.passed ? '✅' : '❌'} Score: ${result.overallScore.toFixed(1)}/100 (${result.totalTurns} turns)`);
			
			if (result.turnResults.some(t => t.criticalFailures.length > 0)) {
				const issues = result.turnResults.flatMap(t => t.criticalFailures).slice(0, 2);
				console.log(`  ⚠️ Issues: ${issues.join(', ')}`);
			}
			
		} catch (error) {
			console.log(`  ❌ FAILED: ${error.message}`);
			results.push({ scenario, result: null, error });
		}
		
		console.log('');
		
		// Small delay between tests to avoid overwhelming the system
		await new Promise(resolve => setTimeout(resolve, 1500));
	}
	
	// Generate summary
	const avgScore = totalScore / MULTI_TURN_TEST_SCENARIOS.length;
	const passRate = (passedTests / MULTI_TURN_TEST_SCENARIOS.length) * 100;
	
	console.log(`📊 OVERALL RESULTS:`);
	console.log(`Tests Run: ${MULTI_TURN_TEST_SCENARIOS.length}`);
	console.log(`Passed: ${passedTests} (${passRate.toFixed(1)}%)`);
	console.log(`Average Score: ${avgScore.toFixed(1)}/100`);
	console.log(`Overall Assessment: ${
		passRate >= 80 ? '🎉 Excellent' : 
		passRate >= 70 ? '✅ Good' : 
		passRate >= 60 ? '⚠️ Needs Improvement' : 
		'❌ Poor'
	}`);
	console.log('');
	
	// Identify patterns
	const allFailures = results
		.filter(r => r.result)
		.flatMap(r => r.result.turnResults.flatMap(t => t.criticalFailures))
		.filter(f => f);
		
	if (allFailures.length > 0) {
		const failureCounts = allFailures.reduce((acc, failure) => {
			acc[failure] = (acc[failure] || 0) + 1;
			return acc;
		}, {});
		
		const topFailures = Object.entries(failureCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);
		
		console.log(`🔍 MOST COMMON ISSUES:`);
		topFailures.forEach(([failure, count]) => {
			console.log(`- ${failure} (${count} times)`);
		});
		console.log('');
	}
	
	return results;
}

async function main() {
	console.log('🔄 Multi-Turn Conversation Test Runner\n');
	
	try {
		if (options.testType === 'single') {
			if (!options.scenarioId) {
				console.error('❌ Scenario ID required for single test. Use --scenario flag.');
				console.log('\n💡 Use --list to see available scenarios');
				process.exit(1);
			}
			await runSingleTest(options.scenarioId, options.maxTurns);
			
		} else if (options.testType === 'all') {
			const results = await runAllTests();
			
			if (options.export) {
				const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
				const filename = `multi-turn-results-${timestamp}.json`;
				const fs = await import('fs');
				
				const exportData = {
					timestamp: new Date().toISOString(),
					testType: 'all',
					scenarios: results.length,
					results: results.map(r => ({
						scenarioId: r.scenario.id,
						scenarioName: r.scenario.name,
						result: r.result,
						error: r.error?.message
					}))
				};
				
				fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
				console.log(`💾 Detailed results exported to: ${filename}`);
			}
			
		} else {
			console.error('❌ Invalid test type. Use: single or all');
			process.exit(1);
		}
		
	} catch (error) {
		console.error('❌ Test execution failed:', error);
		process.exit(1);
	}
}

// Handle graceful shutdown
process.on('SIGINT', () => {
	console.log('\n🛑 Test execution cancelled');
	process.exit(130);
});

if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}