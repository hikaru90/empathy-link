/**
 * Path-Based Performance Attribution System
 * Runs complete conversation flows and attributes performance to individual prompts/paths
 */

import { saveTrace } from './tools.js';

export interface PathSegment {
	pathId: string;
	startIndex: number; // Message index where this path started
	endIndex: number;   // Message index where this path ended
	duration: number;   // Time spent in this path (ms)
	userMessages: any[]; // User messages during this path
	aiMessages: any[];   // AI messages during this path
	pathStartMarker?: any;
	pathEndMarker?: any;
}

export interface PathPerformanceScore {
	pathId: string;
	segment: PathSegment;
	
	// Individual path performance metrics
	userGrowthScore: number;      // How well this path facilitated user growth
	nvcComplianceScore: number;   // How well this path followed NVC principles  
	conversationBalanceScore: number; // Questions vs sharing balance in this path
	effectivenessScore: number;   // How effective was this path for its purpose
	transitionQualityScore: number; // How well it prepared for or handled transitions
	
	// Detailed feedback for this specific path
	strengths: string[];
	weaknesses: string[];
	recommendations: string[];
	
	overallScore: number; // 0-100 aggregate score for this path
}

export interface ConversationFlowScore {
	conversationId: string;
	testScenarioId: string;
	
	// Overall conversation metrics
	totalScore: number;
	pathSwitchingScore: number;    // Quality of path transitions
	circularPreventionScore: number; // Prevention of circular conversations
	coherenceScore: number;        // Overall conversation coherence
	
	// Path-specific performance
	pathPerformances: PathPerformanceScore[];
	
	// Conversation flow analysis  
	pathFlow: string[];           // Sequence of paths taken
	appropriateTransitions: boolean;
	transitionTiming: 'too_early' | 'appropriate' | 'too_late';
	goalAchievement: number;      // How well the conversation achieved its goal (0-100)
	
	summary: {
		bestPerformingPath: string;
		worstPerformingPath: string;
		totalDuration: number;
		pathSwitches: number;
		userSatisfaction: number;
	};
}

export class PathBasedEvaluator {
	
	/**
	 * Segment conversation into path-based chunks using path markers
	 */
	segmentConversationByPaths(conversationHistory: any[]): PathSegment[] {
		const segments: PathSegment[] = [];
		let currentPath: string | null = null;
		let currentSegmentStart = 0;
		
		for (let i = 0; i < conversationHistory.length; i++) {
			const message = conversationHistory[i];
			
			if (message.pathMarker) {
				const marker = message.pathMarker;
				
				if (marker.type === 'path_start') {
					// End previous segment if exists
					if (currentPath) {
						segments.push(this.createSegment(
							currentPath, 
							currentSegmentStart, 
							i - 1, 
							conversationHistory
						));
					}
					
					// Start new segment
					currentPath = marker.path;
					currentSegmentStart = i;
					
				} else if (marker.type === 'path_end' && currentPath === marker.path) {
					// End current segment
					segments.push(this.createSegment(
						currentPath,
						currentSegmentStart,
						i,
						conversationHistory
					));
					currentPath = null;
					
				} else if (marker.type === 'path_switch') {
					// End previous segment and start new one
					if (currentPath && marker.previousPath === currentPath) {
						segments.push(this.createSegment(
							currentPath,
							currentSegmentStart,
							i - 1,
							conversationHistory
						));
					}
					
					currentPath = marker.path;
					currentSegmentStart = i;
				}
			}
		}
		
		// Handle final segment if conversation ends without explicit path_end
		if (currentPath) {
			segments.push(this.createSegment(
				currentPath,
				currentSegmentStart,
				conversationHistory.length - 1,
				conversationHistory
			));
		}
		
		return segments;
	}
	
	/**
	 * Create a path segment from conversation slice
	 */
	private createSegment(
		pathId: string, 
		startIndex: number, 
		endIndex: number, 
		conversationHistory: any[]
	): PathSegment {
		const segmentMessages = conversationHistory.slice(startIndex, endIndex + 1);
		const userMessages = segmentMessages.filter(m => m.role === 'user');
		const aiMessages = segmentMessages.filter(m => m.role === 'model');
		
		const startTime = conversationHistory[startIndex]?.timestamp || 0;
		const endTime = conversationHistory[endIndex]?.timestamp || 0;
		
		return {
			pathId,
			startIndex,
			endIndex,
			duration: endTime - startTime,
			userMessages,
			aiMessages,
			pathStartMarker: conversationHistory[startIndex]?.pathMarker,
			pathEndMarker: conversationHistory[endIndex]?.pathMarker
		};
	}
	
	/**
	 * Evaluate performance of each path segment individually
	 */
	async evaluatePathSegment(
		segment: PathSegment, 
		conversationContext: any,
		testScenario: any,
		userId?: string,
		chatId?: string,
		pbInstance?: any
	): Promise<PathPerformanceScore> {
		
		// Create focused evaluation prompt for this specific path
		const evaluationPrompt = `
Du bist ein Experte für Gesprächsanalyse und Gewaltfreie Kommunikation. 
Bewerte die Leistung des "${segment.pathId}" Pfads in diesem Gesprächssegment.

**WICHTIG: SYSTEM-NACHRICHTEN UND PATH-MARKER IGNORIEREN**
- Nachrichten mit Inhalt wie "[No content]", "[System: ...]" oder leerem Text sind System-Nachrichten und sollten ignoriert werden
- Path-Marker (path_start, path_end, path_switch) sind technische Indikatoren und sollten die Bewertung nicht beeinflussen
- Bewerte nur den tatsächlichen Gesprächsinhalt, den Benutzer sehen würden
- System-Nachrichten und technische Marker sind normal und erwartet in Gesprächsabläufen

**Kontext:**
- Testszenarien: ${testScenario.name}
- Pfad: ${segment.pathId}
- Dauer: ${Math.round(segment.duration / 1000)}s
- User Nachrichten: ${segment.userMessages.length}
- AI Nachrichten: ${segment.aiMessages.length}

**Gesprächssegment:**
${this.formatSegmentForEvaluation(segment)}

Bewerte diese spezifischen Aspekte für den "${segment.pathId}" Pfad:

1. **User Growth (0-100)**: Wie gut hat dieser Pfad das Wachstum/Selbstverständnis des Nutzers gefördert?
2. **NVC Compliance (0-100)**: Wie gut hat dieser Pfad GFK-Prinzipien befolgt?
3. **Conversation Balance (0-100)**: War das Verhältnis von Fragen zu geteiltem Wissen angemessen für diesen Pfad?
4. **Path Effectiveness (0-100)**: Wie effektiv war dieser Pfad für seinen spezifischen Zweck?
5. **Transition Quality (0-100)**: Wie gut hat dieser Pfad auf Übergänge vorbereitet oder sie gehandhabt?

**ERINNERE DICH: Fokussiere dich nur auf den tatsächlichen Gesprächsinhalt. System-Nachrichten und technische Marker sollten deine Bewertung nicht beeinflussen.**

Antworte in diesem Format:
\`\`\`json
{
  "userGrowthScore": 85,
  "nvcComplianceScore": 90,
  "conversationBalanceScore": 75,
  "effectivenessScore": 80,
  "transitionQualityScore": 85,
  "strengths": ["Specific strengths of this path segment"],
  "weaknesses": ["Specific weaknesses of this path segment"], 
  "recommendations": ["Specific recommendations for improving this path"],
  "overallScore": 83
}
\`\`\`
`;

		try {
			// Use existing AI evaluation system
			const { ai } = await import('$lib/server/gemini');
			const model = ai.chats.create({
				model: 'gemini-2.5-flash',
				config: {
					temperature: 0.1,
					systemInstruction: 'You are an expert evaluator for conversation quality and Nonviolent Communication compliance. CRITICAL: Ignore system messages like "[No content]", "[System: ...]", or empty text. Only evaluate actual conversation content that users would see.'
				}
			});
			
			const response = await model.sendMessage({ message: evaluationPrompt });
			const content = response.text;
			
			// Save trace for token usage tracking
			if (userId && chatId) {
				await saveTrace(
					'evaluatePathSegment',
					evaluationPrompt,
					'path-testing',
					chatId,
					userId,
					content,
					response,
					'You are an expert evaluator for conversation quality and Nonviolent Communication compliance.',
					pbInstance
				);
			}
			
			// Parse JSON response
			const jsonMatch = content.match(/```json\s*(.*?)\s*```/s);
			if (!jsonMatch) {
				throw new Error('Invalid response format');
			}
			
			const evaluation = JSON.parse(jsonMatch[1]);
			
			return {
				pathId: segment.pathId,
				segment,
				userGrowthScore: evaluation.userGrowthScore || 0,
				nvcComplianceScore: evaluation.nvcComplianceScore || 0,
				conversationBalanceScore: evaluation.conversationBalanceScore || 0,
				effectivenessScore: evaluation.effectivenessScore || 0,
				transitionQualityScore: evaluation.transitionQualityScore || 0,
				strengths: evaluation.strengths || [],
				weaknesses: evaluation.weaknesses || [],
				recommendations: evaluation.recommendations || [],
				overallScore: evaluation.overallScore || 0
			};
			
		} catch (error) {
			console.error(`Error evaluating path segment ${segment.pathId}:`, error);
			// Return default scores on error
			return {
				pathId: segment.pathId,
				segment,
				userGrowthScore: 0,
				nvcComplianceScore: 0, 
				conversationBalanceScore: 0,
				effectivenessScore: 0,
				transitionQualityScore: 0,
				strengths: [],
				weaknesses: ['Evaluation failed'],
				recommendations: ['Re-run evaluation'],
				overallScore: 0
			};
		}
	}
	
	/**
	 * Format segment for AI evaluation
	 */
	private formatSegmentForEvaluation(segment: PathSegment): string {
		const allMessages = [...segment.userMessages, ...segment.aiMessages]
			.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
		
		return allMessages.map(msg => {
			const role = msg.role === 'user' ? 'USER' : 'AI';
			const content = msg.parts?.[0]?.text || msg.content || '';
			return `${role}: ${content}`;
		}).join('\n\n');
	}
	
	/**
	 * Evaluate overall conversation flow and path switching quality
	 */
	async evaluateConversationFlow(
		conversationHistory: any[],
		pathSegments: PathSegment[],
		testScenario: any,
		userId?: string,
		chatId?: string,
		pbInstance?: any
	): Promise<{ pathSwitchingScore: number, circularPreventionScore: number, coherenceScore: number }> {
		
		const pathFlow = pathSegments.map(s => s.pathId);
		const pathSwitches = pathSegments.length - 1;
		
		const flowEvaluationPrompt = `
Du bist ein Experte für Gesprächsanalyse. Bewerte die Qualität des Gesprächsflusses und der Pfadwechsel.

**WICHTIG: SYSTEM-NACHRICHTEN UND PATH-MARKER IGNORIEREN**
- Nachrichten mit Inhalt wie "[No content]", "[System: ...]" oder leerem Text sind System-Nachrichten und sollten ignoriert werden
- Path-Marker (path_start, path_end, path_switch) sind technische Indikatoren und sollten die Bewertung nicht beeinflussen
- Bewerte nur den tatsächlichen Gesprächsinhalt, den Benutzer sehen würden

**Testszenario:** ${testScenario.name}
**Pfadverlauf:** ${pathFlow.join(' → ')}
**Anzahl Pfadwechsel:** ${pathSwitches}
**Gesamtdauer:** ${Math.round((conversationHistory[conversationHistory.length-1]?.timestamp - conversationHistory[0]?.timestamp) / 1000)}s

**Vollständiges Gespräch (nur tatsächlicher Inhalt):**
${conversationHistory
	.filter(msg => {
		const content = msg.parts?.[0]?.text || msg.content || '';
		return content && !content.startsWith('[System:') && !content.startsWith('[No content]') && content.trim() !== '';
	})
	.map((msg, i) => {
		const role = msg.role === 'user' ? 'USER' : 'AI';
		const content = msg.parts?.[0]?.text || msg.content || '';
		return `${i+1}. ${role}: ${content}`;
	}).join('\n\n')}

Bewerte:
1. **Path Switching Quality (0-100)**: Waren die Pfadwechsel zum richtigen Zeitpunkt und angemessen?
2. **Circular Prevention (0-100)**: Wurde Wiederholung und Kreisläufe vermieden?
3. **Conversation Coherence (0-100)**: War das Gespräch insgesamt kohärent und zielgerichtet?

**ERINNERE DICH: Fokussiere dich nur auf den tatsächlichen Gesprächsinhalt. System-Nachrichten und technische Marker sollten deine Bewertung nicht beeinflussen.**

Antwortformat:
\`\`\`json
{
  "pathSwitchingScore": 85,
  "circularPreventionScore": 90,
  "coherenceScore": 80
}
\`\`\`
`;

		try {
			const { ai } = await import('$lib/server/gemini');
			const model = ai.chats.create({
				model: 'gemini-2.5-flash',
				config: {
					temperature: 0.1,
					systemInstruction: 'You are an expert at analyzing conversation flows and path switching quality.'
				}
			});
			
			const response = await model.sendMessage({ message: flowEvaluationPrompt });
			const content = response.text;
			
			// Save trace for token usage tracking
			if (userId && chatId) {
				await saveTrace(
					'evaluateConversationFlow',
					flowEvaluationPrompt,
					'path-testing',
					chatId,
					userId,
					content,
					response,
					'You are an expert at analyzing conversation flows and path switching quality.',
					pbInstance
				);
			}
			
			const jsonMatch = content.match(/```json\s*(.*?)\s*```/s);
			if (!jsonMatch) {
				throw new Error('Invalid flow evaluation response format');
			}
			
			const evaluation = JSON.parse(jsonMatch[1]);
			
			return {
				pathSwitchingScore: evaluation.pathSwitchingScore || 0,
				circularPreventionScore: evaluation.circularPreventionScore || 0,
				coherenceScore: evaluation.coherenceScore || 0
			};
			
		} catch (error) {
			console.error('Error evaluating conversation flow:', error);
			return {
				pathSwitchingScore: 0,
				circularPreventionScore: 0,
				coherenceScore: 0
			};
		}
	}
	
	/**
	 * Run complete path-based evaluation of a conversation
	 */
	async evaluateConversation(
		conversationHistory: any[],
		testScenario: any,
		conversationId?: string,
		userId?: string,
		chatId?: string,
		pbInstance?: any
	): Promise<ConversationFlowScore> {
		
		// Segment conversation by paths
		const pathSegments = this.segmentConversationByPaths(conversationHistory);
		console.log(`🔍 Path segments found: ${pathSegments.length}`, pathSegments.map(s => s.pathId));
		
		// Evaluate each path segment individually
		const pathPerformances: PathPerformanceScore[] = [];
		for (const segment of pathSegments) {
			console.log(`🔍 Evaluating path segment: ${segment.pathId} (${segment.userMessages.length} user messages, ${segment.aiMessages.length} AI messages)`);
			const pathScore = await this.evaluatePathSegment(segment, {}, testScenario, userId, chatId, pbInstance);
			pathPerformances.push(pathScore);
			console.log(`🔍 Path ${segment.pathId} score: ${pathScore.overallScore}/100`);
		}
		
		// Evaluate overall conversation flow
		const flowScores = await this.evaluateConversationFlow(
			conversationHistory, 
			pathSegments, 
			testScenario,
			userId,
			chatId,
			pbInstance
		);
		
		// Calculate aggregate scores
		const totalScore = pathPerformances.length > 0 
			? Math.round(pathPerformances.reduce((sum, p) => sum + p.overallScore, 0) / pathPerformances.length)
			: 0;
			
		const bestPath = pathPerformances.length > 0 
			? pathPerformances.reduce((best, current) => 
				current.overallScore > best.overallScore ? current : best
			).pathId
			: '';
			
		const worstPath = pathPerformances.length > 0
			? pathPerformances.reduce((worst, current) => 
				current.overallScore < worst.overallScore ? current : worst  
			).pathId
			: '';
		
		return {
			conversationId: conversationId || `test_${Date.now()}`,
			testScenarioId: testScenario.id,
			totalScore,
			pathSwitchingScore: flowScores.pathSwitchingScore,
			circularPreventionScore: flowScores.circularPreventionScore,
			coherenceScore: flowScores.coherenceScore,
			pathPerformances,
			pathFlow: pathSegments.map(s => s.pathId),
			appropriateTransitions: flowScores.pathSwitchingScore >= 70,
			transitionTiming: flowScores.pathSwitchingScore >= 80 ? 'appropriate' : 
			                 flowScores.pathSwitchingScore >= 50 ? 'too_late' : 'too_early',
			goalAchievement: totalScore,
			summary: {
				bestPerformingPath: bestPath,
				worstPerformingPath: worstPath,
				totalDuration: pathSegments.reduce((sum, s) => sum + s.duration, 0),
				pathSwitches: pathSegments.length - 1,
				userSatisfaction: totalScore
			}
		};
	}
}