/**
 * AI-Powered Conversation Quality Evaluator
 * Uses Gemini to evaluate conversation quality against defined metrics
 */

import { ai } from './gemini.js';
import type { TestScenario, TestResult, EvaluationCriteria } from './conversationTestSuite.js';

export class ConversationEvaluator {
	
	/**
	 * Evaluate a single AI response against test criteria
	 */
	async evaluateResponse(
		scenario: TestScenario, 
		aiResponse: string,
		actualPath?: string
	): Promise<TestResult> {
		
		const evaluationPrompt = this.buildEvaluationPrompt(scenario, aiResponse, actualPath);
		
		console.log(`🔍 EVALUATION PROMPT for ${scenario.id}:`, evaluationPrompt);
		
		try {
			const model = ai.chats.create({
				model: 'gemini-2.5-flash',
				config: {
					temperature: 0.1,
					systemInstruction: this.getEvaluatorSystemPrompt()
				}
			});

			const result = await model.sendMessage({ message: evaluationPrompt });
			console.log(`🔍 EVALUATION RESPONSE for ${scenario.id}:`, result.text);
			const evaluation = this.parseEvaluationResponse(result.text);
			console.log(`🔍 PARSED EVALUATION for ${scenario.id}:`, evaluation);
			
			return {
				scenarioId: scenario.id,
				passed: evaluation.overallScore >= 70,
				score: evaluation.overallScore,
				metrics: evaluation.metrics,
				aiResponse,
				evaluation: evaluation.qualitativeAnalysis
			};
			
		} catch (error) {
			console.error('Evaluation failed:', error);
			return this.getFallbackResult(scenario, aiResponse);
		}
	}

	/**
	 * Batch evaluate multiple scenarios
	 */
	async evaluateScenarios(results: Array<{scenario: TestScenario, response: string, path?: string}>): Promise<TestResult[]> {
		const evaluations = await Promise.all(
			results.map(({scenario, response, path}) => 
				this.evaluateResponse(scenario, response, path)
			)
		);
		
		return evaluations;
	}

	/**
	 * Generate comprehensive metrics report
	 */
	generateMetricsReport(results: TestResult[]): ConversationMetricsReport {
		const totalScenarios = results.length;
		const passedScenarios = results.filter(r => r.passed).length;
		
		// Calculate average scores by category
		const categoryScores = this.calculateCategoryScores(results);
		
		// Identify patterns and issues
		const patterns = this.identifyPatterns(results);
		
		// Generate recommendations
		const recommendations = this.generateRecommendations(results, patterns);
		
		return {
			summary: {
				totalTests: totalScenarios,
				passed: passedScenarios,
				passRate: (passedScenarios / totalScenarios) * 100,
				averageScore: results.reduce((sum, r) => sum + r.score, 0) / totalScenarios
			},
			categoryBreakdown: categoryScores,
			criticalIssues: patterns.criticalIssues,
			strengths: patterns.strengths,
			recommendations,
			detailedResults: results
		};
	}

	private buildEvaluationPrompt(scenario: TestScenario, aiResponse: string, actualPath?: string): string {
		return `
Evaluate this AI conversation response against specific quality criteria.

**IMPORTANT: IGNORE SYSTEM MESSAGES AND PATH MARKERS**
- Messages with content like "[No content]", "[System: ...]", or empty text are system messages and should be ignored
- Path markers (path_start, path_end, path_switch) are technical indicators and should not affect scoring
- Only evaluate actual conversation content that users would see

**SCENARIO CONTEXT:**
- Test ID: ${scenario.id}
- Category: ${scenario.category}
- Description: ${scenario.description}
- User Input: "${scenario.inputMessage}"
- Expected Path: ${scenario.expectedPath || 'N/A'}
- Actual Path: ${actualPath || 'N/A'}

**AI RESPONSE TO EVALUATE:**
"${aiResponse}"

**CONVERSATION CONTEXT:**
${this.formatConversationContext(scenario.contextSetup)}

**EVALUATION CRITERIA:**
${this.formatEvaluationCriteria(scenario.evaluationCriteria)}

**REQUIRED OUTPUT FORMAT:**
Provide your evaluation as a JSON object with this exact structure:

{
  "overallScore": <number 0-100>,
  "metrics": {
    "userGrowthScore": <number 0-100>,
    "nvcComplianceScore": <number 0-100>, 
    "circularPreventionScore": <number 0-100>,
    "pathSwitchingScore": <number 0-100>,
    "conversationBalanceScore": <number 0-100>
  },
  "qualitativeAnalysis": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "recommendations": ["recommendation1", "recommendation2"]
  },
  "reasoning": "Brief explanation of scoring rationale"
}

**SCORING GUIDELINES:**
- 90-100: Excellent - Meets all criteria exceptionally
- 80-89: Good - Meets most criteria well
- 70-79: Adequate - Meets basic requirements
- 60-69: Needs Improvement - Some criteria unmet
- Below 60: Poor - Major issues present

**REMEMBER: Only evaluate actual conversation content. Ignore system messages and technical markers.**

Evaluate objectively against the specific criteria provided.`;
	}

	private getEvaluatorSystemPrompt(): string {
		return `You are an expert evaluator of AI conversation systems, specializing in empathic communication and nonviolent communication (NVC) principles.

**CRITICAL INSTRUCTION: IGNORE SYSTEM MESSAGES AND TECHNICAL MARKERS**
- Messages with content like "[No content]", "[System: ...]", or empty text are system messages and should be ignored
- Path markers (path_start, path_end, path_switch) are technical indicators and should not affect scoring
- Only evaluate actual conversation content that users would see and interact with
- System messages and technical markers are normal and expected in conversation flows

Your role is to objectively assess AI responses against specific quality criteria:

**USER GROWTH METRICS:**
- Self-awareness: Does the response promote self-reflection and inner awareness?
- Emotional insight: Does it help identify and understand emotions?
- Needs clarity: Does it connect emotions to underlying human needs?
- Perspective: Does it broaden understanding of situations?

**NVC COMPLIANCE:**
- Observation without evaluation: Separates facts from judgments
- Feelings identification: Helps recognize authentic feelings (not thoughts disguised as feelings)
- Needs recognition: Connects to universal human needs
- Requests not demands: Frames actions as requests rather than demands
- Empathy present: Shows understanding without trying to fix or advise

**CIRCULAR PREVENTION:**
- Avoids repeat questions: Doesn't ask the same question multiple times
- Builds on previous: References and builds upon earlier conversation
- Progresses conversation: Moves the dialogue forward meaningfully

**PATH SWITCHING QUALITY:**
- Recognizes completion signals: Detects when a conversation stage is naturally complete
- Suggests appropriate next: Recommends logical next conversation paths
- Smooth transition: Handles path changes naturally and gracefully

**CONVERSATION BALANCE:**
- Question/statement ratio: Maintains healthy balance (not too many questions)
- Shares relevant insights: Offers valuable knowledge when appropriate
- Avoids lecturing: Doesn't become preachy or didactic
- Maintains dialogue: Keeps conversation interactive and engaging

**REMEMBER: Focus only on actual conversation content. System messages and technical markers should not impact your evaluation.**

Be precise, objective, and constructive in your evaluations.`;
	}

	private formatConversationContext(context: any): string {
		if (!context) return 'No context provided';
		
		let formatted = `Current Path: ${context.currentPath}\n`;
		
		if (context.messageHistory && context.messageHistory.length > 0) {
			formatted += `Previous Messages:\n`;
			context.messageHistory.forEach((msg: any, i: number) => {
				formatted += `${i + 1}. ${msg.role}: "${msg.content}"\n`;
			});
		}
		
		if (context.userProfile) {
			formatted += `User Profile: ${JSON.stringify(context.userProfile)}\n`;
		}
		
		return formatted;
	}

	private formatEvaluationCriteria(criteria: EvaluationCriteria): string {
		return `
**Expected User Growth:**
- Self-awareness: ${criteria.userGrowth.selfAwareness}
- Emotional insight: ${criteria.userGrowth.emotionalInsight}
- Needs clarity: ${criteria.userGrowth.needsClarity}
- Perspective: ${criteria.userGrowth.perspective}

**Expected NVC Compliance:**
- Observation without evaluation: ${criteria.nvcCompliance.observationWithoutEvaluation}
- Feelings identification: ${criteria.nvcCompliance.feelingsIdentification}
- Needs recognition: ${criteria.nvcCompliance.needsRecognition}
- Requests not demands: ${criteria.nvcCompliance.requestsNotDemands}
- Empathy present: ${criteria.nvcCompliance.empathyPresent}

**Expected Circular Prevention:**
- Avoids repeat questions: ${criteria.circularPrevention.avoidsRepeatQuestions}
- Builds on previous: ${criteria.circularPrevention.buildsOnPrevious}
- Progresses conversation: ${criteria.circularPrevention.progressesConversation}

**Expected Path Switching:**
- Recognizes completion signals: ${criteria.pathSwitching.recognizesCompletionSignals}
- Suggests appropriate next: ${criteria.pathSwitching.suggestsAppropriateNext}
- Smooth transition: ${criteria.pathSwitching.smoothTransition}

**Expected Balance:**
- Question/statement ratio: ${criteria.conversationBalance.questionToStatementRatio}
- Shares relevant insights: ${criteria.conversationBalance.sharesRelevantInsights}
- Avoids lecturing: ${criteria.conversationBalance.avoidsLecturing}
- Maintains dialogue: ${criteria.conversationBalance.maintainsDialogue}`;
	}

	private parseEvaluationResponse(responseText: string): any {
		try {
			// Clean response text
			let cleanText = responseText.trim();
			if (cleanText.startsWith('```json')) {
				cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
			} else if (cleanText.startsWith('```')) {
				cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
			}
			
			return JSON.parse(cleanText);
		} catch (error) {
			console.error('Failed to parse evaluation response:', error);
			return this.getDefaultEvaluation();
		}
	}

	private getFallbackResult(scenario: TestScenario, aiResponse: string): TestResult {
		return {
			scenarioId: scenario.id,
			passed: false,
			score: 0,
			metrics: {
				userGrowthScore: 0,
				nvcComplianceScore: 0,
				circularPreventionScore: 0,
				pathSwitchingScore: 0,
				conversationBalanceScore: 0
			},
			aiResponse,
			evaluation: {
				strengths: [],
				weaknesses: ['Evaluation failed due to technical error'],
				recommendations: ['Review technical issues with evaluation system']
			}
		};
	}

	private getDefaultEvaluation(): any {
		return {
			overallScore: 50,
			metrics: {
				userGrowthScore: 50,
				nvcComplianceScore: 50,
				circularPreventionScore: 50,
				pathSwitchingScore: 50,
				conversationBalanceScore: 50
			},
			qualitativeAnalysis: {
				strengths: ['Unable to determine'],
				weaknesses: ['Evaluation parsing failed'],
				recommendations: ['Check evaluation system']
			},
			reasoning: 'Default evaluation due to parsing error'
		};
	}

	private calculateCategoryScores(results: TestResult[]): CategoryScores {
		const categories = ['user_growth', 'nvc_compliance', 'path_switching', 'circular_detection', 'balance_check'];
		const scores: any = {};
		
		categories.forEach(category => {
			const categoryResults = results.filter(r => r.scenarioId.includes(category.substring(0, 2)));
			if (categoryResults.length > 0) {
				scores[category] = {
					averageScore: categoryResults.reduce((sum, r) => sum + r.score, 0) / categoryResults.length,
					passRate: (categoryResults.filter(r => r.passed).length / categoryResults.length) * 100,
					testCount: categoryResults.length
				};
			}
		});
		
		return scores;
	}

	private identifyPatterns(results: TestResult[]): PatternAnalysis {
		const criticalIssues: string[] = [];
		const strengths: string[] = [];
		
		// Analyze common weaknesses
		const commonWeaknesses = new Map<string, number>();
		const commonStrengths = new Map<string, number>();
		
		results.forEach(result => {
			result.evaluation.weaknesses.forEach(weakness => {
				commonWeaknesses.set(weakness, (commonWeaknesses.get(weakness) || 0) + 1);
			});
			result.evaluation.strengths.forEach(strength => {
				commonStrengths.set(strength, (commonStrengths.get(strength) || 0) + 1);
			});
		});
		
		// Identify most common issues (appearing in >30% of tests)
		const threshold = Math.ceil(results.length * 0.3);
		for (const [weakness, count] of commonWeaknesses.entries()) {
			if (count >= threshold) {
				criticalIssues.push(`${weakness} (${count}/${results.length} tests)`);
			}
		}
		
		// Identify consistent strengths
		for (const [strength, count] of commonStrengths.entries()) {
			if (count >= threshold) {
				strengths.push(`${strength} (${count}/${results.length} tests)`);
			}
		}
		
		return { criticalIssues, strengths };
	}

	private generateRecommendations(results: TestResult[], patterns: PatternAnalysis): string[] {
		const recommendations: string[] = [];
		
		// Low scoring categories
		const avgScores = {
			userGrowth: results.reduce((sum, r) => sum + r.metrics.userGrowthScore, 0) / results.length,
			nvcCompliance: results.reduce((sum, r) => sum + r.metrics.nvcComplianceScore, 0) / results.length,
			circularPrevention: results.reduce((sum, r) => sum + r.metrics.circularPreventionScore, 0) / results.length,
			pathSwitching: results.reduce((sum, r) => sum + r.metrics.pathSwitchingScore, 0) / results.length,
			conversationBalance: results.reduce((sum, r) => sum + r.metrics.conversationBalanceScore, 0) / results.length
		};
		
		// Generate specific recommendations based on scores
		if (avgScores.userGrowth < 70) {
			recommendations.push('Improve user growth facilitation - focus more on self-awareness and emotional insight prompts');
		}
		if (avgScores.nvcCompliance < 70) {
			recommendations.push('Enhance NVC compliance - better separation of observations from evaluations, clearer feelings/needs identification');
		}
		if (avgScores.circularPrevention < 70) {
			recommendations.push('Reduce circular conversations - implement better conversation history tracking and varied questioning approaches');
		}
		if (avgScores.pathSwitching < 70) {
			recommendations.push('Improve path switching logic - better recognition of completion signals and smoother transitions');
		}
		if (avgScores.conversationBalance < 70) {
			recommendations.push('Balance conversation flow - reduce excessive questioning, increase empathic statements and relevant insights');
		}
		
		// Add pattern-based recommendations
		if (patterns.criticalIssues.length > 0) {
			recommendations.push(`Address recurring issues: ${patterns.criticalIssues.join(', ')}`);
		}
		
		return recommendations;
	}
}

export interface ConversationMetricsReport {
	summary: {
		totalTests: number;
		passed: number;
		passRate: number;
		averageScore: number;
	};
	categoryBreakdown: CategoryScores;
	criticalIssues: string[];
	strengths: string[];
	recommendations: string[];
	detailedResults: TestResult[];
}

export interface CategoryScores {
	[category: string]: {
		averageScore: number;
		passRate: number;
		testCount: number;
	};
}

export interface PatternAnalysis {
	criticalIssues: string[];
	strengths: string[];
}