/**
 * AI-Driven Test User Simulator
 * Provides consistent, realistic user responses for conversation testing
 */

import { ai } from './gemini.js';

export interface TestUserPersona {
	id: string;
	name: string;
	background: string;
	emotionalState: string;
	communicationStyle: 'defensive' | 'open' | 'confused' | 'resistant' | 'cooperative';
	coreIssue: string;
	goals: string[];
	triggers: string[];
	progressionPath: string[]; // Expected emotional journey
	vulnerabilityLevel: number; // 1-10, how easily they open up
}

export interface ConversationContext {
	currentTurn: number;
	userPersona: TestUserPersona;
	conversationHistory: Array<{
		role: 'user' | 'ai';
		content: string;
		timestamp: number;
		analysis?: ResponseAnalysis;
	}>;
	currentEmotionalState: string;
	progressMade: string[];
	resistanceTriggered: boolean;
}

export interface ResponseAnalysis {
	empathyLevel: number; // 1-10
	judgmentLevel: number; // 1-10 (lower is better)
	questionType: 'open' | 'closed' | 'leading' | 'none';
	reflectsFeeling: boolean;
	progressesConversation: boolean;
	triggersResistance: boolean;
}

// Pre-defined test personas for consistent testing
export const TEST_PERSONAS: Record<string, TestUserPersona> = {
	frustrated_partner: {
		id: 'frustrated_partner',
		name: 'Alex - Frustrated Partner',
		background: 'In a 3-year relationship, feeling unheard and unappreciated. Partner works long hours, doesn\'t help with household tasks.',
		emotionalState: 'Frustrated, hurt, some resentment building',
		communicationStyle: 'defensive',
		coreIssue: 'Feeling unvalued and carrying unfair burden in relationship',
		goals: ['Be understood', 'Get validation', 'Find way to communicate needs'],
		triggers: ['Being blamed', 'Quick relationship advice', 'Minimizing their feelings'],
		progressionPath: ['anger/frustration', 'hurt/sadness', 'need for respect', 'clarity about boundaries'],
		vulnerabilityLevel: 4
	},
	
	workplace_conflict: {
		id: 'workplace_conflict',
		name: 'Jordan - Workplace Stress',
		background: 'Marketing manager dealing with difficult boss who micromanages and takes credit for their work.',
		emotionalState: 'Angry, stressed, feeling powerless',
		communicationStyle: 'resistant',
		coreIssue: 'Professional boundaries violated, lack of recognition',
		goals: ['Reduce stress', 'Find ways to deal with boss', 'Regain confidence'],
		triggers: ['Suggesting to quit', 'Minimizing workplace issues', 'Corporate speak'],
		progressionPath: ['anger', 'powerlessness', 'need for autonomy', 'self-advocacy strategies'],
		vulnerabilityLevel: 6
	},
	
	family_tension: {
		id: 'family_tension',
		name: 'Sam - Family Dynamics',
		background: 'Adult child dealing with overbearing parents who don\'t respect boundaries. Recently moved back home.',
		emotionalState: 'Conflicted, guilty, frustrated',
		communicationStyle: 'confused',
		coreIssue: 'Balancing independence with family loyalty',
		goals: ['Set healthy boundaries', 'Reduce guilt', 'Improve family relationships'],
		triggers: ['Criticizing family', 'Oversimplifying family dynamics', 'Being told to move out'],
		progressionPath: ['confusion', 'guilt', 'need for autonomy', 'compassion for family', 'boundary clarity'],
		vulnerabilityLevel: 7
	},

	self_critical: {
		id: 'self_critical',
		name: 'Riley - Self-Doubt',
		background: 'Perfectionist struggling with imposter syndrome at new job. Highly self-critical.',
		emotionalState: 'Anxious, self-doubting, overwhelmed',
		communicationStyle: 'open',
		coreIssue: 'Harsh inner critic preventing self-acceptance',
		goals: ['Reduce self-criticism', 'Build confidence', 'Feel more at peace'],
		triggers: ['Toxic positivity', 'Being told to "just think positive"', 'Dismissing their concerns'],
		progressionPath: ['anxiety', 'self-criticism', 'fear of failure', 'need for self-compassion', 'acceptance'],
		vulnerabilityLevel: 8
	}
};

export class TestUserSimulator {
	
	/**
	 * Generate realistic user response based on AI response and conversation context
	 */
	async generateUserResponse(
		aiResponse: string,
		context: ConversationContext
	): Promise<{
		userResponse: string;
		updatedContext: ConversationContext;
		responseReasoning: string;
	}> {
		
		// First, analyze the AI response
		const aiAnalysis = await this.analyzeAIResponse(aiResponse, context);
		
		// Generate appropriate user response
		const responsePrompt = this.buildUserResponsePrompt(aiResponse, context, aiAnalysis);
		
		try {
			const model = ai.chats.create({
				model: 'gemini-2.5-flash',
				config: {
					temperature: 0.7,
					systemInstruction: this.getUserSimulatorSystemPrompt(context.userPersona)
				}
			});

			const result = await model.sendMessage({ message: responsePrompt });
			const responseData = this.parseUserResponse(result.text);
			
			// Update conversation context
			const updatedContext = this.updateConversationContext(
				context, 
				aiResponse, 
				responseData.userResponse, 
				aiAnalysis
			);
			
			return {
				userResponse: responseData.userResponse,
				updatedContext,
				responseReasoning: responseData.reasoning
			};
			
		} catch (error) {
			console.error('Error generating user response:', error);
			// Fallback to basic response
			return {
				userResponse: "Hmm, ich weiß nicht so recht.",
				updatedContext: context,
				responseReasoning: "Fallback response due to generation error"
			};
		}
	}

	/**
	 * Analyze AI response quality and potential impact on user
	 */
	private async analyzeAIResponse(
		aiResponse: string, 
		context: ConversationContext
	): Promise<ResponseAnalysis> {
		
		const analysisPrompt = `Analyze this AI counselor response for quality and potential user impact.

AI Response: "${aiResponse}"

User Context: ${context.userPersona.name} - ${context.userPersona.emotionalState}
Communication Style: ${context.userPersona.communicationStyle}
Triggers: ${context.userPersona.triggers.join(', ')}
Current Turn: ${context.currentTurn}

Analyze for:
1. Empathy level (1-10, how much understanding/warmth is shown)
2. Judgment level (1-10, how much blame/criticism is present, lower is better)
3. Question type (open/closed/leading/none)
4. Does it reflect the user's feeling?
5. Does it progress the conversation forward?
6. Does it trigger likely resistance based on user triggers?

Respond with JSON:
{
  "empathyLevel": 0-10,
  "judgmentLevel": 0-10,
  "questionType": "open|closed|leading|none",
  "reflectsFeeling": boolean,
  "progressesConversation": boolean,
  "triggersResistance": boolean,
  "reasoning": "brief explanation"
}`;

		try {
			const model = ai.chats.create({
				model: 'gemini-2.5-flash',
				config: {
					temperature: 0.1,
					systemInstruction: 'You are an expert in conversation analysis and nonviolent communication.'
				}
			});

			const result = await model.sendMessage({ message: analysisPrompt });
			return this.parseAnalysisResponse(result.text);
			
		} catch (error) {
			console.error('Error analyzing AI response:', error);
			// Return neutral analysis
			return {
				empathyLevel: 5,
				judgmentLevel: 5,
				questionType: 'none',
				reflectsFeeling: false,
				progressesConversation: false,
				triggersResistance: false
			};
		}
	}

	/**
	 * Build prompt for generating user response
	 */
	private buildUserResponsePrompt(
		aiResponse: string,
		context: ConversationContext,
		aiAnalysis: ResponseAnalysis
	): string {
		
		const persona = context.userPersona;
		const recentHistory = context.conversationHistory.slice(-3)
			.map(h => `${h.role}: ${h.content}`)
			.join('\n');

		return `Generate a realistic user response for this counseling conversation.

CONVERSATION CONTEXT:
${recentHistory}

AI Counselor just said: "${aiResponse}"

YOUR ROLE: ${persona.name}
Background: ${persona.background}
Current emotional state: ${context.currentEmotionalState}
Communication style: ${persona.communicationStyle}
Core issue: ${persona.coreIssue}
Progress made so far: ${context.progressMade.join(', ') || 'None yet'}

RESPONSE ANALYSIS:
- AI empathy level: ${aiAnalysis.empathyLevel}/10
- AI triggered resistance: ${aiAnalysis.triggersResistance}
- AI reflects feeling: ${aiAnalysis.reflectsFeeling}

RESPONSE GUIDELINES:
- Stay true to your emotional state and communication style
- React authentically to the AI's approach
- If triggered, show resistance/defensiveness 
- If feeling heard, gradually open up more
- Keep responses realistic (50-150 words)
- Don't make unrealistic breakthroughs too quickly
- Show emotional progression consistent with your journey

Respond in German as this person would naturally respond.

Required JSON format:
{
  "userResponse": "The actual response in German",
  "reasoning": "Why this person would respond this way",
  "emotionalShift": "Any change in emotional state",
  "progressIndicators": ["Any signs of progress made"]
}`;
	}

	/**
	 * Get system prompt for user simulator
	 */
	private getUserSimulatorSystemPrompt(persona: TestUserPersona): string {
		return `Du bist ${persona.name}, eine Person in einer Beratungssituation.

DEINE PERSÖNLICHKEIT:
- Hintergrund: ${persona.background}
- Emotionaler Zustand: ${persona.emotionalState}  
- Kommunikationsstil: ${persona.communicationStyle}
- Kernproblem: ${persona.coreIssue}
- Ziele: ${persona.goals.join(', ')}
- Trigger: ${persona.triggers.join(', ')}

VERHALTENSREGELN:
- Antworte authentisch und menschlich
- Zeige echte emotionale Reaktionen
- Sei ${persona.communicationStyle} wie beschrieben
- Öffne dich nur langsam (Verletzlichkeitslevel: ${persona.vulnerabilityLevel}/10)
- Reagiere negativ auf deine Trigger
- Zeige Fortschritt entsprechend deinem Weg: ${persona.progressionPath.join(' → ')}

Du bist NICHT kooperativ oder therapeutisch - du bist eine echte Person mit echten Problemen und Widerständen.`;
	}

	/**
	 * Parse AI analysis response
	 */
	private parseAnalysisResponse(responseText: string): ResponseAnalysis {
		try {
			let cleanText = responseText.trim();
			if (cleanText.startsWith('```json')) {
				cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
			}
			return JSON.parse(cleanText);
		} catch (error) {
			console.error('Error parsing analysis response:', error);
			return {
				empathyLevel: 5,
				judgmentLevel: 5,
				questionType: 'none',
				reflectsFeeling: false,
				progressesConversation: false,
				triggersResistance: false
			};
		}
	}

	/**
	 * Parse user response
	 */
	private parseUserResponse(responseText: string): {userResponse: string, reasoning: string} {
		try {
			let cleanText = responseText.trim();
			if (cleanText.startsWith('```json')) {
				cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
			}
			const parsed = JSON.parse(cleanText);
			return {
				userResponse: parsed.userResponse || 'Hmm.',
				reasoning: parsed.reasoning || 'Generated response'
			};
		} catch (error) {
			// If JSON parsing fails, treat the whole response as user response
			return {
				userResponse: responseText.trim(),
				reasoning: 'Direct response'
			};
		}
	}

	/**
	 * Update conversation context after each exchange
	 */
	private updateConversationContext(
		context: ConversationContext,
		aiResponse: string,
		userResponse: string,
		aiAnalysis: ResponseAnalysis
	): ConversationContext {
		
		const updatedHistory = [
			...context.conversationHistory,
			{
				role: 'ai' as const,
				content: aiResponse,
				timestamp: Date.now(),
				analysis: aiAnalysis
			},
			{
				role: 'user' as const,
				content: userResponse,
				timestamp: Date.now()
			}
		];

		// Update emotional state based on AI response quality
		let newEmotionalState = context.currentEmotionalState;
		const progressMade = [...context.progressMade];
		
		if (aiAnalysis.empathyLevel >= 7 && aiAnalysis.reflectsFeeling) {
			// Good empathy - user feels more heard
			if (!progressMade.includes('feeling_heard')) {
				progressMade.push('feeling_heard');
			}
		}
		
		if (aiAnalysis.triggersResistance) {
			newEmotionalState = 'defensive';
		} else if (aiAnalysis.empathyLevel >= 8) {
			// High empathy gradually softens emotional state
			const softening = {
				'angry': 'frustrated',
				'frustrated': 'hurt',
				'defensive': 'cautious',
				'hurt': 'sad',
				'sad': 'reflective'
			};
			newEmotionalState = softening[newEmotionalState] || newEmotionalState;
		}

		return {
			...context,
			currentTurn: context.currentTurn + 1,
			conversationHistory: updatedHistory,
			currentEmotionalState: newEmotionalState,
			progressMade,
			resistanceTriggered: context.resistanceTriggered || aiAnalysis.triggersResistance
		};
	}

	/**
	 * Initialize conversation context for testing
	 */
	initializeContext(personaId: string, initialMessage: string): ConversationContext {
		const persona = TEST_PERSONAS[personaId];
		if (!persona) {
			throw new Error(`Unknown persona: ${personaId}`);
		}

		return {
			currentTurn: 1,
			userPersona: persona,
			conversationHistory: [{
				role: 'user',
				content: initialMessage,
				timestamp: Date.now()
			}],
			currentEmotionalState: persona.emotionalState,
			progressMade: [],
			resistanceTriggered: false
		};
	}
}