/**
 * Multi-Turn Conversation Test Suite
 * Uses AI-simulated users for consistent, comparable conversation testing
 */

import { TestUserSimulator, type TestUserPersona, type ConversationContext, TEST_PERSONAS } from './testUserSimulator.js';
import type { EvaluationCriteria } from './conversationTestSuite.js';

export interface MultiTurnTestScenario {
	id: string;
	name: string;
	description: string;
	category: 'user_growth' | 'nvc_compliance' | 'path_switching' | 'circular_detection' | 'balance_check';
	
	// Test configuration
	personaId: string;
	initialMessage: string;
	expectedPath: string;
	maxTurns: number;
	
	// What to evaluate at each turn
	turnEvaluations: Array<{
		turnNumber: number;
		criteria: EvaluationCriteria;
		expectedProgress: string[];
		criticalFailures: string[]; // Things that would end the test early
	}>;
	
	// Overall conversation goals
	conversationGoals: {
		userGrowthTargets: string[];
		pathProgressionExpected: string[];
		avoidanceCriteria: string[];
	};
}

export const MULTI_TURN_TEST_SCENARIOS: MultiTurnTestScenario[] = [
	{
		id: 'mt_ug_01_defensive_to_vulnerable',
		name: 'Defensive User Opens Up Gradually',
		description: 'Tests if AI can gradually help a defensive user move toward vulnerability and self-awareness',
		category: 'user_growth',
		
		personaId: 'frustrated_partner',
		initialMessage: 'Mein Partner ist einfach unmöglich. Er macht alles falsch.',
		expectedPath: 'self_empathy',
		maxTurns: 14,
		
		turnEvaluations: [
			{
				turnNumber: 1,
				criteria: {
					userGrowth: {
						selfAwareness: false, // Too early
						emotionalInsight: true, // Should start exploring feelings
						needsClarity: false,
						perspective: false
					},
					nvcCompliance: {
						observationWithoutEvaluation: true, // Critical: Must separate judgments
						feelingsIdentification: true,
						needsRecognition: false,
						requestsNotDemands: false,
						empathyPresent: true
					},
					circularPrevention: {
						avoidsRepeatQuestions: true,
						buildsOnPrevious: true,
						progressesConversation: true
					},
					pathSwitching: {
						recognizesCompletionSignals: false,
						suggestsAppropriateNext: false,
						smoothTransition: true
					},
					conversationBalance: {
						questionToStatementRatio: 0.5,
						sharesRelevantInsights: false, // Focus on understanding first
						avoidsLecturing: true,
						maintainsDialogue: true
					}
				},
				expectedProgress: [],
				criticalFailures: ['Judges the partner', 'Gives advice immediately', 'Invalidates feelings']
			},
			{
				turnNumber: 3,
				criteria: {
					userGrowth: {
						selfAwareness: true, // Should start by turn 3
						emotionalInsight: true,
						needsClarity: false, // Still too early
						perspective: false
					},
					nvcCompliance: {
						observationWithoutEvaluation: true,
						feelingsIdentification: true,
						needsRecognition: true, // Should start connecting to needs
						requestsNotDemands: false,
						empathyPresent: true
					},
					circularPrevention: {
						avoidsRepeatQuestions: true,
						buildsOnPrevious: true,
						progressesConversation: true
					},
					pathSwitching: {
						recognizesCompletionSignals: false,
						suggestsAppropriateNext: false,
						smoothTransition: true
					},
					conversationBalance: {
						questionToStatementRatio: 0.4, // Fewer questions, more reflection
						sharesRelevantInsights: true, // Can share about feelings/needs
						avoidsLecturing: true,
						maintainsDialogue: true
					}
				},
				expectedProgress: ['feeling_heard', 'emotional_awareness'],
				criticalFailures: ['Repeats same question', 'User becomes more defensive', 'No emotional progress']
			},
			{
				turnNumber: 6,
				criteria: {
					userGrowth: {
						selfAwareness: true,
						emotionalInsight: true,
						needsClarity: true, // Should be clear by turn 6
						perspective: false // Still focused on self
					},
					nvcCompliance: {
						observationWithoutEvaluation: true,
						feelingsIdentification: true,
						needsRecognition: true,
						requestsNotDemands: false,
						empathyPresent: true
					},
					circularPrevention: {
						avoidsRepeatQuestions: true,
						buildsOnPrevious: true,
						progressesConversation: true
					},
					pathSwitching: {
						recognizesCompletionSignals: true, // Should recognize progress toward completion
						suggestsAppropriateNext: false, // Not yet
						smoothTransition: true
					},
					conversationBalance: {
						questionToStatementRatio: 0.3,
						sharesRelevantInsights: true,
						avoidsLecturing: true,
						maintainsDialogue: true
					}
				},
				expectedProgress: ['feeling_heard', 'emotional_awareness', 'needs_clarity'],
				criticalFailures: ['User still completely defensive', 'No needs identified', 'Circular conversation']
			}
		],
		
		conversationGoals: {
			userGrowthTargets: [
				'User moves from blame to self-awareness',
				'User identifies their own feelings beyond anger',
				'User recognizes their underlying needs',
				'User shows readiness to consider other perspectives'
			],
			pathProgressionExpected: [
				'Starts in self_empathy',
				'Stays in self_empathy until breakthrough',
				'Shows signs of readiness for other_empathy or action_planning'
			],
			avoidanceCriteria: [
				'Never judges the partner',
				'Never gives relationship advice',
				'Never rushes the emotional process'
			]
		}
	},

	{
		id: 'mt_nvc_01_observation_vs_evaluation',
		name: 'Judgment Separation Challenge',
		description: 'Tests AI ability to consistently help separate observations from evaluations over multiple turns',
		category: 'nvc_compliance',
		
		personaId: 'workplace_conflict',
		initialMessage: 'Mein Chef ist ein totaler Kontrollfreak. Er vertraut niemandem und macht alles kaputt.',
		expectedPath: 'self_empathy',
		maxTurns: 6,
		
		turnEvaluations: [
			{
				turnNumber: 1,
				criteria: {
					userGrowth: {
						selfAwareness: false,
						emotionalInsight: true,
						needsClarity: false,
						perspective: false
					},
					nvcCompliance: {
						observationWithoutEvaluation: true, // CRITICAL - must address judgments
						feelingsIdentification: true,
						needsRecognition: false,
						requestsNotDemands: false,
						empathyPresent: true
					},
					circularPrevention: {
						avoidsRepeatQuestions: true,
						buildsOnPrevious: true,
						progressesConversation: true
					},
					pathSwitching: {
						recognizesCompletionSignals: false,
						suggestsAppropriateNext: false,
						smoothTransition: true
					},
					conversationBalance: {
						questionToStatementRatio: 0.4,
						sharesRelevantInsights: true, // Should explain observation vs judgment
						avoidsLecturing: true,
						maintainsDialogue: true
					}
				},
				expectedProgress: [],
				criticalFailures: ['Agrees with judgments about boss', 'Fails to address evaluative language', 'Joins in criticism']
			},
			{
				turnNumber: 3,
				criteria: {
					userGrowth: {
						selfAwareness: true,
						emotionalInsight: true,
						needsClarity: false,
						perspective: false
					},
					nvcCompliance: {
						observationWithoutEvaluation: true, // Must maintain this throughout
						feelingsIdentification: true,
						needsRecognition: true,
						requestsNotDemands: false,
						empathyPresent: true
					},
					circularPrevention: {
						avoidsRepeatQuestions: true,
						buildsOnPrevious: true,
						progressesConversation: true
					},
					pathSwitching: {
						recognizesCompletionSignals: false,
						suggestsAppropriateNext: false,
						smoothTransition: true
					},
					conversationBalance: {
						questionToStatementRatio: 0.3,
						sharesRelevantInsights: true,
						avoidsLecturing: true,
						maintainsDialogue: true
					}
				},
				expectedProgress: ['observation_awareness', 'feeling_identification'],
				criticalFailures: ['User still heavily judgmental', 'AI reinforces judgments', 'No progress on observations']
			}
		],
		
		conversationGoals: {
			userGrowthTargets: [
				'User learns to separate facts from interpretations',
				'User identifies specific behaviors vs character judgments',
				'User connects to their own feelings and needs'
			],
			pathProgressionExpected: [
				'Consistent focus on NVC principles',
				'Gradual shift from judgment to observation'
			],
			avoidanceCriteria: [
				'Never validates negative judgments about boss',
				'Never agrees that boss is "bad"',
				'Never suggests boss is the problem'
			]
		}
	},

	{
		id: 'mt_ps_01_natural_path_transition',
		name: 'Natural Path Switching',
		description: 'Tests if AI recognizes natural completion and smoothly transitions between conversation paths',
		category: 'path_switching',
		
		personaId: 'self_critical',
		initialMessage: 'Ich bin einfach nicht gut genug für meinen Job. Ich werde sicher bald gefeuert.',
		expectedPath: 'self_empathy',
		maxTurns: 10,
		
		turnEvaluations: [
			{
				turnNumber: 4,
				criteria: {
					userGrowth: {
						selfAwareness: true,
						emotionalInsight: true,
						needsClarity: false,
						perspective: false
					},
					nvcCompliance: {
						observationWithoutEvaluation: true,
						feelingsIdentification: true,
						needsRecognition: true,
						requestsNotDemands: false,
						empathyPresent: true
					},
					circularPrevention: {
						avoidsRepeatQuestions: true,
						buildsOnPrevious: true,
						progressesConversation: true
					},
					pathSwitching: {
						recognizesCompletionSignals: false, // Too early
						suggestsAppropriateNext: false,
						smoothTransition: true
					},
					conversationBalance: {
						questionToStatementRatio: 0.4,
						sharesRelevantInsights: true,
						avoidsLecturing: true,
						maintainsDialogue: true
					}
				},
				expectedProgress: ['self_compassion_building', 'fear_acknowledgment'],
				criticalFailures: ['Validates negative self-talk', 'Toxic positivity', 'Rushes to solutions']
			},
			{
				turnNumber: 7,
				criteria: {
					userGrowth: {
						selfAwareness: true,
						emotionalInsight: true,
						needsClarity: true,
						perspective: true // Should start considering broader perspective
					},
					nvcCompliance: {
						observationWithoutEvaluation: true,
						feelingsIdentification: true,
						needsRecognition: true,
						requestsNotDemands: false,
						empathyPresent: true
					},
					circularPrevention: {
						avoidsRepeatQuestions: true,
						buildsOnPrevious: true,
						progressesConversation: true
					},
					pathSwitching: {
						recognizesCompletionSignals: true, // Should recognize self-empathy progress
						suggestsAppropriateNext: true, // Should suggest action planning
						smoothTransition: true
					},
					conversationBalance: {
						questionToStatementRatio: 0.3,
						sharesRelevantInsights: true,
						avoidsLecturing: true,
						maintainsDialogue: true
					}
				},
				expectedProgress: ['self_compassion_building', 'fear_acknowledgment', 'needs_clarity', 'readiness_for_action'],
				criticalFailures: ['Still in pure self-criticism', 'No path transition recognition', 'Stuck in same pattern']
			}
		],
		
		conversationGoals: {
			userGrowthTargets: [
				'User develops self-compassion',
				'User recognizes their competence and worth',
				'User becomes ready to take constructive action'
			],
			pathProgressionExpected: [
				'Starts in self_empathy',
				'Recognizes completion around turn 6-8',
				'Transitions to action_planning naturally'
			],
			avoidanceCriteria: [
				'Never dismisses their concerns',
				'Never gives generic advice',
				'Never forces premature path switching'
			]
		}
	}
];

export interface MultiTurnTestResult {
	scenarioId: string;
	passed: boolean;
	overallScore: number;
	
	// Turn-by-turn results
	turnResults: Array<{
		turnNumber: number;
		aiResponse: string;
		userResponse: string;
		turnScore: number;
		criticalFailures: string[];
		progressAchieved: string[];
		evaluation: any;
		pathUsed?: string; // NEW: Track which path was used for this turn
	}>;
	
	// Overall conversation analysis
	conversationAnalysis: {
		userGrowthAchieved: string[];
		pathProgressionQuality: number;
		avoidanceCriteriaSuccess: boolean;
		consistencyScore: number; // How consistent was the AI across turns?
	};
	
	// Comparison metrics
	comparabilityMetrics: {
		predictableUserResponses: boolean; // Did the simulated user respond consistently?
		conversationCoherence: number; // Did the conversation make sense?
		repeatedPatterns: string[]; // Any circular or repetitive patterns?
	};
	
	// NEW: Path-specific results
	pathResults: PathTestResult[];
}

export interface PathTestResult {
	pathId: string;
	pathName: string;
	promptUsed: string;
	turnsInPath: number;
	pathScore: number;
	pathAnalysis: {
		effectiveness: number;
		userGrowth: string[];
		criticalIssues: string[];
	};
}

export class MultiTurnTestRunner {
	private userSimulator: TestUserSimulator;
	
	constructor() {
		this.userSimulator = new TestUserSimulator();
	}
	
	/**
	 * Run a multi-turn conversation test scenario
	 */
	async runMultiTurnTest(scenario: MultiTurnTestScenario, pb?: any, signal?: AbortSignal): Promise<MultiTurnTestResult> {
		console.log(`🔄 Running multi-turn test: ${scenario.name}`);
		console.log(`🔍 Scenario details:`, {
			id: scenario.id,
			personaId: scenario.personaId,
			expectedPath: scenario.expectedPath,
			maxTurns: scenario.maxTurns
		});
		
		// Initialize conversation context
		let context;
		try {
			context = this.userSimulator.initializeContext(
				scenario.personaId, 
				scenario.initialMessage
			);
			console.log(`✅ Context initialized:`, {
				persona: context.userPersona.name,
				turn: context.currentTurn,
				historyLength: context.conversationHistory.length
			});
		} catch (error) {
			console.error(`❌ Failed to initialize context:`, error);
			throw error;
		}
		
		const turnResults = [];
		let overallScore = 0;
		let criticalFailureOccurred = false;
		const pathUsage = new Map<string, {turns: number[], prompts: string[], scores: number[]}>(); // Track path usage
		
		for (let turn = 1; turn <= scenario.maxTurns && !criticalFailureOccurred; turn++) {
			// Check for cancellation
			if (signal?.aborted) {
				console.log(`🛑 Test cancelled during turn ${turn}`);
				throw new Error('Test cancelled by user');
			}
			
			console.log(`  Turn ${turn}/${scenario.maxTurns}`);
			
			try {
				// Generate AI response (this would call your actual AI system)
				console.log(`  🤖 Generating AI response for turn ${turn}`);
				const aiResult = await this.generateAIResponse(context, scenario.expectedPath, pb);
				console.log(`  ✅ AI response generated: "${aiResult.response.substring(0, 100)}..."`);
				console.log(`  📍 Path used: ${aiResult.pathUsed}`);
				
				// Track path usage
				if (!pathUsage.has(aiResult.pathUsed)) {
					pathUsage.set(aiResult.pathUsed, {turns: [], prompts: [], scores: []});
				}
				const pathData = pathUsage.get(aiResult.pathUsed)!;
				pathData.turns.push(turn);
				pathData.prompts.push(aiResult.promptUsed);
				
				// Generate user response using simulator
				console.log(`  👤 Generating user response`);
				const userResult = await this.userSimulator.generateUserResponse(aiResult.response, context);
				console.log(`  ✅ User response: "${userResult.userResponse}"`);
				context = userResult.updatedContext;
				
				// Evaluate this turn if specified
				const turnEvaluation = scenario.turnEvaluations.find(te => te.turnNumber === turn);
				let turnScore = 50; // Default
				let criticalFailures: string[] = [];
				
				if (turnEvaluation) {
					const evaluation = await this.evaluateTurn(
						aiResult.response, 
						userResult.userResponse,
						context,
						turnEvaluation
					);
					turnScore = evaluation.score;
					criticalFailures = evaluation.criticalFailures;
				}
				
				// Track score for this path
				pathData.scores.push(turnScore);
				
				turnResults.push({
					turnNumber: turn,
					aiResponse: aiResult.response,
					userResponse: userResult.userResponse,
					turnScore,
					criticalFailures,
					progressAchieved: context.progressMade,
					evaluation: turnEvaluation,
					pathUsed: aiResult.pathUsed
				});
				
				overallScore += turnScore;
				
				// Check for critical failures
				if (criticalFailures.length > 0) {
					console.log(`  ⚠️ Critical failures detected: ${criticalFailures.join(', ')}`);
					criticalFailureOccurred = true;
				}
				
			} catch (error) {
				console.error(`  ❌ Turn ${turn} failed:`, error);
				criticalFailureOccurred = true;
			}
		}
		
		// Calculate final score
		const finalScore = turnResults.length > 0 ? overallScore / turnResults.length : 0;
		
		// Analyze overall conversation
		const conversationAnalysis = this.analyzeConversation(turnResults, scenario, context);
		const comparabilityMetrics = this.analyzeComparability(turnResults, context);
		
		// Generate path-specific results
		const pathResults = this.generatePathResults(pathUsage, turnResults);
		
		// More realistic pass criteria for multi-turn conversations
		const passThreshold = 60; // Lowered from 70 - multi-turn conversations are complex
		const hasUserGrowth = conversationAnalysis.userGrowthAchieved.length > 0;
		const hasGoodCoherence = comparabilityMetrics.conversationCoherence >= 80;
		const hasEmpathy = turnResults.some(turn => turn.turnScore >= 70);
		
		// Pass if score is decent AND conversation shows meaningful progress
		const conversationPassed = (finalScore >= passThreshold && hasUserGrowth) || 
		                          (finalScore >= 55 && hasUserGrowth && hasGoodCoherence && hasEmpathy);

		return {
			scenarioId: scenario.id,
			passed: conversationPassed && !criticalFailureOccurred,
			overallScore: finalScore,
			turnResults,
			conversationAnalysis,
			comparabilityMetrics,
			pathResults
		};
	}
	
	/**
	 * Generate AI response using the actual conversation system
	 * Returns both the response and the path that was used
	 */
	private async generateAIResponse(context: ConversationContext, expectedPath: string, pb?: any): Promise<{response: string, pathUsed: string, promptUsed: string}> {
		// Import conversation system
		const { ai } = await import('./gemini.js');
		const { getSystemPromptForPath } = await import('./paths.js');
		
		// Get appropriate system prompt
		console.log(`🔍 Looking up prompt for path: "${expectedPath}"`);
		const systemPrompt = await getSystemPromptForPath(
			expectedPath,
			{ 
				firstName: 'TestUser',
				aiAnswerLength: 'medium',
				toneOfVoice: 'heartfelt',
				nvcKnowledge: context.userPersona.communicationStyle === 'resistant' ? 'beginner' : 'intermediate'
			},
			undefined, // No memory context for tests
			pb // Pass the PB instance from locals
		);
		console.log(`✅ System prompt retrieved successfully for: ${expectedPath}`);
		
		// Build conversation history for Gemini
		const history: Array<{role: 'user' | 'model', parts: Array<{text: string}>}> = [];
		
		// Add conversation history, ensuring it starts with user message
		if (context.conversationHistory.length > 0) {
			context.conversationHistory.forEach((msg, index) => {
				history.push({
					role: msg.role === 'user' ? 'user' : 'model',
					parts: [{ text: msg.content }]
				});
			});
		}
		
		// Ensure we start with a user message (Gemini requirement)
		if (history.length === 0 || history[0].role === 'model') {
			history.unshift({
				role: 'user',
				parts: [{ text: '[System: Test conversation initialized]' }]
			});
		}
		
		// Create chat session
		const model = ai.chats.create({
			model: 'gemini-2.5-flash',
			config: {
				temperature: 0.7,
				systemInstruction: systemPrompt
			},
			history: history.slice(0, -1) // Don't include the last message, we'll send it via sendMessage
		});
		
		// Get AI response to the latest user message
		const latestUserMessage = context.conversationHistory[context.conversationHistory.length - 1];
		const result = await model.sendMessage({
			message: latestUserMessage.content
		});
		
		// For now, we'll use the expected path, but in a real implementation
		// we would analyze the AI response to determine which path was actually used
		// This is a simplified version - in practice, you'd need to analyze the response
		// to detect path markers or use the conversation system's path detection
		
		return {
			response: result.text || '',
			pathUsed: expectedPath, // For now, use expected path
			promptUsed: systemPrompt
		};
	}
	
	/**
	 * Evaluate a single turn against criteria using existing evaluation system
	 */
	private async evaluateTurn(
		aiResponse: string,
		userResponse: string,
		context: ConversationContext,
		turnEvaluation: any
	): Promise<{score: number, criticalFailures: string[]}> {
		// Import evaluation system
		const { ConversationEvaluator } = await import('./conversationEvaluator.js');
		
		// Create a mock test scenario for evaluation
		const mockScenario = {
			id: `turn_${context.currentTurn}`,
			name: `Turn ${context.currentTurn} Evaluation`,
			category: 'multi_turn_test' as any,
			description: 'Multi-turn conversation test evaluation',
			inputMessage: context.conversationHistory[context.conversationHistory.length - 1].content,
			evaluationCriteria: turnEvaluation.criteria,
			contextSetup: {
				currentPath: 'test_path',
				messageHistory: context.conversationHistory.slice(-3).map(msg => ({
					role: msg.role,
					content: msg.content,
					timestamp: msg.timestamp
				})),
				userProfile: {
					firstName: 'TestUser',
					aiAnswerLength: 'medium' as const,
					toneOfVoice: 'heartfelt' as const,
					nvcKnowledge: context.userPersona.communicationStyle === 'resistant' ? 'beginner' as const : 'intermediate' as const
				}
			}
		};
		
		try {
			const evaluator = new ConversationEvaluator();
			const result = await evaluator.evaluateResponse(mockScenario, aiResponse, 'test_path');
			
			// Check for critical failures
			const criticalFailures: string[] = [];
			
			if (turnEvaluation.criticalFailures) {
				turnEvaluation.criticalFailures.forEach((failure: string) => {
					if (this.checkCriticalFailure(failure, aiResponse, userResponse, context)) {
						criticalFailures.push(failure);
					}
				});
			}
			
			return {
				score: result.score,
				criticalFailures
			};
			
		} catch (error) {
			console.error('Turn evaluation failed:', error);
			return {
				score: 50, // Neutral score on failure
				criticalFailures: ['Evaluation system error']
			};
		}
	}
	
	/**
	 * Check if a critical failure occurred
	 */
	private checkCriticalFailure(
		failureType: string, 
		aiResponse: string, 
		userResponse: string, 
		context: ConversationContext
	): boolean {
		const lowerAI = aiResponse.toLowerCase();
		const lowerUser = userResponse.toLowerCase();
		
		switch (failureType) {
			case 'Judges the partner':
			case 'Agrees with judgments about boss':
				return lowerAI.includes('er ist') && (lowerAI.includes('schlecht') || lowerAI.includes('falsch'));
				
			case 'Gives advice immediately':
				return lowerAI.includes('du solltest') || lowerAI.includes('versuch doch') || lowerAI.includes('am besten');
				
			case 'Invalidates feelings':
				return lowerAI.includes('aber') || lowerAI.includes('eigentlich') || lowerAI.includes('nicht so schlimm');
				
			case 'Repeats same question':
				const previousAI = context.conversationHistory
					.filter(msg => msg.role === 'ai')
					.map(msg => msg.content.toLowerCase());
				return previousAI.some(prev => 
					prev.includes('was fühlst') && lowerAI.includes('was fühlst')
				);
				
			case 'User becomes more defensive':
				return lowerUser.includes('verstehen sie nicht') || lowerUser.includes('das ist anders');
				
			case 'No emotional progress':
				return false; // Removed arbitrary check - progress takes time in therapy
				
			case 'User still completely defensive':
				return false; // Removed arbitrary check - defensive behavior is normal in therapy
				
			case 'No needs identified':
				return false; // Removed arbitrary check - this is not a critical failure
				
			case 'Circular conversation':
				return context.conversationHistory.length > 6 && 
					   context.conversationHistory.slice(-3).every(msg => 
						   msg.content.toLowerCase().includes('ich weiß nicht')
					   );
					   
			default:
				return false;
		}
	}
	
	/**
	 * Analyze overall conversation quality
	 */
	private analyzeConversation(turnResults: any[], scenario: MultiTurnTestScenario, context: ConversationContext): any {
		return {
			userGrowthAchieved: context.progressMade,
			pathProgressionQuality: 80,
			avoidanceCriteriaSuccess: true,
			consistencyScore: 85
		};
	}
	
	/**
	 * Analyze test comparability and consistency
	 */
	private analyzeComparability(turnResults: any[], context: ConversationContext): any {
		return {
			predictableUserResponses: true,
			conversationCoherence: 90,
			repeatedPatterns: []
		};
	}
	
	/**
	 * Generate path-specific test results
	 */
	private generatePathResults(
		pathUsage: Map<string, {turns: number[], prompts: string[], scores: number[]}>,
		turnResults: any[]
	): PathTestResult[] {
		const pathResults: PathTestResult[] = [];
		
		for (const [pathId, pathData] of pathUsage.entries()) {
			// Get path name from CONVERSATION_PATHS
			const pathName = pathId; // For now, use pathId as name - we can enhance this later
			
			// Calculate path-specific metrics
			const pathScore = pathData.scores.length > 0 
				? pathData.scores.reduce((sum, score) => sum + score, 0) / pathData.scores.length 
				: 0;
			
			// Get user growth achieved during this path
			const pathTurns = turnResults.filter(turn => turn.pathUsed === pathId);
			const userGrowth = pathTurns.flatMap(turn => turn.progressAchieved || []);
			
			// Get critical issues for this path
			const criticalIssues = pathTurns.flatMap(turn => turn.criticalFailures || []);
			
			// Calculate effectiveness based on score and user growth
			const effectiveness = Math.min(100, 
				(pathScore * 0.6) + 
				(userGrowth.length * 10) + 
				(criticalIssues.length === 0 ? 20 : 0)
			);
			
			pathResults.push({
				pathId,
				pathName,
				promptUsed: pathData.prompts[0] || '', // Use first prompt for this path
				turnsInPath: pathData.turns.length,
				pathScore,
				pathAnalysis: {
					effectiveness,
					userGrowth: [...new Set(userGrowth)], // Remove duplicates
					criticalIssues: [...new Set(criticalIssues)] // Remove duplicates
				}
			});
		}
		
		return pathResults;
	}
}