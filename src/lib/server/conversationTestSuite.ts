/**
 * Conversation Quality Test Suite
 * Comprehensive testing framework for AI conversation paths and prompt quality
 */

export interface TestScenario {
	id: string;
	name: string;
	category: 'user_growth' | 'nvc_compliance' | 'path_switching' | 'circular_detection' | 'balance_check';
	description: string;
	inputMessage: string;
	expectedPath?: string;
	contextSetup?: ConversationContext;
	evaluationCriteria: EvaluationCriteria;
}

export interface ConversationContext {
	currentPath: string;
	messageHistory: Array<{ role: 'user' | 'model'; content: string; timestamp: number }>;
	userProfile?: {
		firstName?: string;
		aiAnswerLength?: 'short' | 'medium' | 'long';
		toneOfVoice?: 'analytical' | 'heartfelt';
		nvcKnowledge?: 'beginner' | 'advanced';
	};
	sessionDuration?: number; // minutes
	previousPaths?: string[];
}

export interface EvaluationCriteria {
	// User Growth Metrics
	userGrowth: {
		selfAwareness: boolean; // Does response promote self-reflection?
		emotionalInsight: boolean; // Does it help identify emotions?
		needsClarity: boolean; // Does it clarify underlying needs?
		perspective: boolean; // Does it broaden perspective?
	};
	
	// NVC Compliance
	nvcCompliance: {
		observationWithoutEvaluation: boolean; // Separates facts from judgments
		feelingsIdentification: boolean; // Helps identify genuine feelings
		needsRecognition: boolean; // Connects to universal human needs
		requestsNotDemands: boolean; // Frames actions as requests
		empathyPresent: boolean; // Shows understanding without fixing
	};
	
	// Circular Reference Detection
	circularPrevention: {
		avoidsRepeatQuestions: boolean; // Doesn't ask same questions
		buildsOnPrevious: boolean; // References previous insights
		progressesConversation: boolean; // Moves conversation forward
	};
	
	// Path Switching Quality
	pathSwitching: {
		recognizesCompletionSignals: boolean; // Detects when path is complete
		suggestsAppropriateNext: boolean; // Recommends logical next path
		smoothTransition: boolean; // Handles transitions naturally
	};
	
	// Question/Knowledge Balance
	conversationBalance: {
		questionToStatementRatio: number; // Should be balanced, not all questions
		sharesRelevantInsights: boolean; // Offers valuable knowledge
		avoidsLecturing: boolean; // Doesn't become preachy
		maintainsDialogue: boolean; // Keeps conversation interactive
	};
}

export const TEST_SCENARIOS: TestScenario[] = [
	// USER GROWTH SCENARIOS
	{
		id: 'ug_01_initial_frustration',
		name: 'Initial Frustration Expression',
		category: 'user_growth',
		description: 'User expresses frustration without self-awareness',
		inputMessage: 'Mein Partner nervt mich total. Er macht immer alles falsch.',
		expectedPath: 'self_empathy',
		contextSetup: {
			currentPath: 'idle',
			messageHistory: [],
			userProfile: { nvcKnowledge: 'beginner' }
		},
		evaluationCriteria: {
			userGrowth: {
				selfAwareness: true, // Should guide to look inward
				emotionalInsight: true, // Should help identify feelings beyond "annoyed"
				needsClarity: false, // Too early for needs
				perspective: false // Too early for other's perspective
			},
			nvcCompliance: {
				observationWithoutEvaluation: true, // Should separate judgments from facts
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
				questionToStatementRatio: 0.5, // 50% questions, 50% empathic statements
				sharesRelevantInsights: false, // Focus on understanding first
				avoidsLecturing: true,
				maintainsDialogue: true
			}
		}
	},
	
	{
		id: 'ug_02_feeling_breakthrough',
		name: 'Feeling Breakthrough Moment',
		category: 'user_growth',
		description: 'User has insight about their feelings',
		inputMessage: 'Oh wow, ich merke gerade, dass ich eigentlich traurig bin, nicht wütend.',
		contextSetup: {
			currentPath: 'self_empathy',
			messageHistory: [
				{ role: 'user', content: 'Mein Partner nervt mich total.', timestamp: Date.now() - 60000 },
				{ role: 'model', content: 'Das hört sich frustrierend an. Magst du mir mehr darüber erzählen, was genau passiert ist?', timestamp: Date.now() - 45000 }
			]
		},
		evaluationCriteria: {
			userGrowth: {
				selfAwareness: true,
				emotionalInsight: true,
				needsClarity: true, // Now ready to explore needs
				perspective: false
			},
			nvcCompliance: {
				observationWithoutEvaluation: true,
				feelingsIdentification: true,
				needsRecognition: true, // Should connect feelings to needs
				requestsNotDemands: false,
				empathyPresent: true
			},
			circularPrevention: {
				avoidsRepeatQuestions: true,
				buildsOnPrevious: true,
				progressesConversation: true
			},
			pathSwitching: {
				recognizesCompletionSignals: false, // Not complete yet
				suggestsAppropriateNext: false,
				smoothTransition: true
			},
			conversationBalance: {
				questionToStatementRatio: 0.3, // More acknowledgment, fewer questions
				sharesRelevantInsights: true, // Can share about feelings/needs connection
				avoidsLecturing: true,
				maintainsDialogue: true
			}
		}
	},

	// NVC COMPLIANCE SCENARIOS
	{
		id: 'nvc_01_judgment_separation',
		name: 'Judgment vs Observation Test',
		category: 'nvc_compliance',
		description: 'Tests if AI helps separate judgments from observations',
		inputMessage: 'Mein Chef ist ein Arschloch. Er respektiert mich überhaupt nicht.',
		contextSetup: {
			currentPath: 'self_empathy',
			messageHistory: []
		},
		evaluationCriteria: {
			userGrowth: {
				selfAwareness: true,
				emotionalInsight: true,
				needsClarity: false,
				perspective: false
			},
			nvcCompliance: {
				observationWithoutEvaluation: true, // CRITICAL: Must help separate judgments
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
				sharesRelevantInsights: true, // Should explain observation vs judgment
				avoidsLecturing: true,
				maintainsDialogue: true
			}
		}
	},

	// PATH SWITCHING SCENARIOS  
	{
		id: 'ps_01_self_to_other_empathy',
		name: 'Transition from Self to Other Empathy',
		category: 'path_switching',
		description: 'User shows self-understanding and wants to understand the other person',
		inputMessage: 'Ich verstehe jetzt, dass ich verletzt bin, weil mir Wertschätzung wichtig ist. Aber was geht wohl in meinem Partner vor?',
		contextSetup: {
			currentPath: 'self_empathy',
			messageHistory: [
				{ role: 'user', content: 'Mein Partner nervt mich total.', timestamp: Date.now() - 300000 },
				{ role: 'model', content: 'Das hört sich frustrierend an...', timestamp: Date.now() - 280000 },
				{ role: 'user', content: 'Ja, ich fühle mich nicht wertgeschätzt.', timestamp: Date.now() - 120000 }
			]
		},
		evaluationCriteria: {
			userGrowth: {
				selfAwareness: true,
				emotionalInsight: true,
				needsClarity: true,
				perspective: true // Now ready for other's perspective
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
				recognizesCompletionSignals: true, // CRITICAL: Should recognize self-empathy completion
				suggestsAppropriateNext: true, // Should suggest other_empathy
				smoothTransition: true
			},
			conversationBalance: {
				questionToStatementRatio: 0.4,
				sharesRelevantInsights: true,
				avoidsLecturing: true,
				maintainsDialogue: true
			}
		}
	},

	// CIRCULAR REFERENCE DETECTION
	{
		id: 'cr_01_repeat_question',
		name: 'Repeated Question Detection',
		category: 'circular_detection',
		description: 'Tests if AI avoids asking the same question repeatedly',
		inputMessage: 'Ich weiß nicht.',
		contextSetup: {
			currentPath: 'self_empathy',
			messageHistory: [
				{ role: 'model', content: 'Was fühlst du in dieser Situation?', timestamp: Date.now() - 180000 },
				{ role: 'user', content: 'Ich weiß nicht.', timestamp: Date.now() - 160000 },
				{ role: 'model', content: 'Nimm dir Zeit. Was nimmst du in deinem Körper wahr?', timestamp: Date.now() - 140000 },
				{ role: 'user', content: 'Ich weiß nicht.', timestamp: Date.now() - 120000 }
			]
		},
		evaluationCriteria: {
			userGrowth: {
				selfAwareness: true,
				emotionalInsight: true,
				needsClarity: false,
				perspective: false
			},
			nvcCompliance: {
				observationWithoutEvaluation: true,
				feelingsIdentification: true,
				needsRecognition: false,
				requestsNotDemands: false,
				empathyPresent: true
			},
			circularPrevention: {
				avoidsRepeatQuestions: true, // CRITICAL: Should not ask about feelings again
				buildsOnPrevious: true,
				progressesConversation: true // Should try different approach
			},
			pathSwitching: {
				recognizesCompletionSignals: false,
				suggestsAppropriateNext: false,
				smoothTransition: true
			},
			conversationBalance: {
				questionToStatementRatio: 0.3, // Fewer questions, more statements
				sharesRelevantInsights: true,
				avoidsLecturing: true,
				maintainsDialogue: true
			}
		}
	},

	// BALANCE SCENARIOS
	{
		id: 'cb_01_question_bombardment',
		name: 'Question Balance Test',
		category: 'balance_check',
		description: 'Tests if AI maintains good question/statement balance',
		inputMessage: 'Ja, das stimmt.',
		contextSetup: {
			currentPath: 'self_empathy',
			messageHistory: [
				{ role: 'model', content: 'Was fühlst du?', timestamp: Date.now() - 180000 },
				{ role: 'user', content: 'Traurig.', timestamp: Date.now() - 160000 },
				{ role: 'model', content: 'Warum traurig?', timestamp: Date.now() - 140000 },
				{ role: 'user', content: 'Wegen meinem Partner.', timestamp: Date.now() - 120000 },
				{ role: 'model', content: 'Was hat er gemacht?', timestamp: Date.now() - 100000 },
				{ role: 'user', content: 'Er hat mich ignoriert.', timestamp: Date.now() - 80000 }
			]
		},
		evaluationCriteria: {
			userGrowth: {
				selfAwareness: true,
				emotionalInsight: true,
				needsClarity: true,
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
				recognizesCompletionSignals: false,
				suggestsAppropriateNext: false,
				smoothTransition: true
			},
			conversationBalance: {
				questionToStatementRatio: 0.2, // CRITICAL: Should be mostly empathic statements, not questions
				sharesRelevantInsights: true,
				avoidsLecturing: true,
				maintainsDialogue: true
			}
		}
	}
];

// Add more complex scenarios
export const ADVANCED_TEST_SCENARIOS: TestScenario[] = [
	{
		id: 'adv_01_path_switching_resistance',
		name: 'User Resists Path Switching',
		category: 'path_switching',
		description: 'User wants to stay in current path despite completion signals',
		inputMessage: 'Ich will noch mehr über meine Gefühle sprechen, bevor wir zu etwas anderem wechseln.',
		contextSetup: {
			currentPath: 'self_empathy',
			messageHistory: [
				{ role: 'user', content: 'Ich verstehe jetzt meine Bedürfnisse viel besser.', timestamp: Date.now() - 120000 },
				{ role: 'model', content: 'Das ist wunderbar. Möchtest du vielleicht auch verstehen, was in der anderen Person vorgeht?', timestamp: Date.now() - 60000 }
			]
		},
		evaluationCriteria: {
			userGrowth: {
				selfAwareness: true,
				emotionalInsight: true,
				needsClarity: true,
				perspective: false
			},
			nvcCompliance: {
				observationWithoutEvaluation: true,
				feelingsIdentification: true,
				needsRecognition: true,
				requestsNotDemands: true, // Should respect user's request
				empathyPresent: true
			},
			circularPrevention: {
				avoidsRepeatQuestions: true,
				buildsOnPrevious: true,
				progressesConversation: true
			},
			pathSwitching: {
				recognizesCompletionSignals: true,
				suggestsAppropriateNext: false, // Should respect user choice
				smoothTransition: true // Should stay in current path gracefully
			},
			conversationBalance: {
				questionToStatementRatio: 0.4,
				sharesRelevantInsights: true,
				avoidsLecturing: true,
				maintainsDialogue: true
			}
		}
	}
];

export interface TestResult {
	scenarioId: string;
	passed: boolean;
	score: number; // 0-100
	metrics: {
		userGrowthScore: number;
		nvcComplianceScore: number;
		circularPreventionScore: number;
		pathSwitchingScore: number;
		conversationBalanceScore: number;
	};
	aiResponse: string;
	evaluation: {
		strengths: string[];
		weaknesses: string[];
		recommendations: string[];
	};
}