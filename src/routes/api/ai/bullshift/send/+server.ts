import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	analyzeGfkCompliance,
	flagViolations,
	analyzePathSwitchingIntent,
	getCurrentPath,
	switchPath,
	convertHistoryToGemini,
	ai,
	type GfkAnalysis,
	type PathSwitchAnalysis,
	type Sensitivity
} from '$lib/server/gemini';
import { encryptChatHistory, decryptChatHistory } from '$lib/utils/chatEncryption.js';
import { CONVERSATION_PATHS, getSystemPromptForPath } from '$lib/server/paths';
import { analyzeChatFlow, saveChatFeedback } from '$lib/server/chatAnalysis';
import { pb } from '$scripts/pocketbase';
import {
	saveTrace,
	extractMemories,
} from '$lib/server/tools';
import { searchSimilarMemories } from '$lib/server/memory';
import type { GenerateContentResponse } from '@google/genai';
import { recommendationService, type RecommendationMatch } from '$lib/server/recommendations';

export interface State {
	currentStep: string;
	observation: string;
	feelings: string[];
	needs: string[];
	request: string;
}

const sanitizeText = (text: string) => {
	console.log('text', text);
	if (text.includes('```json')) {
		text = text.replace('```json', '').replace('```', '');
	}
	if (text.includes('```')) {
		text = text.replace('```', '');
	}
	// Replace multiple newlines with single newline
	let sanitized = text.replace(/\n{2,}/g, '\n');
	// Replace multiple tabs with single tab
	sanitized = sanitized.replace(/\t{2,}/g, '\t');
	// Trim whitespace from start and end

	return sanitized.trim();
};

// Helper function to extract feedback from conversation
const extractFeedbackFromConversation = (history: any[]): any | null => {
	console.log('🔍 Analyzing conversation for feedback responses...');
	
	// Get recent messages in feedback path with both processed and original text
	const recentHistory = history
		.slice(-20) // Look at last 20 messages
		.filter(msg => !msg.pathMarker && !msg.hidden && msg.parts?.[0]?.text);

	if (recentHistory.length < 4) {
		console.log('🔍 Not enough messages for feedback extraction');
		return null;
	}

	console.log('🔍 Feedback messages found:', recentHistory.length);

	const feedback: any = {};
	let foundAnswers = 0;

	// Look for patterns in user responses
	for (let i = 0; i < recentHistory.length - 1; i++) {
		const aiMsg = recentHistory[i];
		const userMsg = recentHistory[i + 1];
		
		if (aiMsg.role !== 'model' || userMsg.role !== 'user') continue;
		
		const aiText = aiMsg.parts[0].text.toLowerCase().trim();
		const userText = userMsg.parts[0].text.toLowerCase().trim();
		const originalUserText = userMsg.parts[0].text; // Keep original case for text responses
		
		// 1. Helpfulness rating (1-10)
		if (aiText.includes('hilfreich') && aiText.includes('skala') && !feedback.helpfulness) {
			const match = userText.match(/\b([1-9]|10)\b/);
			if (match) {
				feedback.helpfulness = parseInt(match[1]);
				foundAnswers++;
				console.log('🔍 Found helpfulness:', feedback.helpfulness);
			}
		}
		
		// 2. Understanding (ja/nein)
		else if (aiText.includes('verstanden') && aiText.includes('gefühlt') && feedback.understanding === undefined) {
			if (userText.includes('ja') || userText.includes('yes') || userText.includes('definitiv') || userText.includes('absolut')) {
				feedback.understanding = true;
				foundAnswers++;
				console.log('🔍 Found understanding: true');
			} else if (userText.includes('nein') || userText.includes('no') || userText.includes('nicht')) {
				feedback.understanding = false;
				foundAnswers++;
				console.log('🔍 Found understanding: false');
			}
		}
		
		// 3. New insights (ja/nein)
		else if (aiText.includes('erkenntnisse') && aiText.includes('gewinnen') && feedback.newInsights === undefined) {
			if (userText.includes('ja') || userText.includes('yes') || userText.includes('definitiv') || userText.includes('absolut')) {
				feedback.newInsights = true;
				foundAnswers++;
				console.log('🔍 Found newInsights: true');
			} else if (userText.includes('nein') || userText.includes('no') || userText.includes('nicht')) {
				feedback.newInsights = false;
				foundAnswers++;
				console.log('🔍 Found newInsights: false');
			}
		}
		
		// 4. Would recommend (ja/nein)
		else if (aiText.includes('weiterempfehlen') && feedback.wouldRecommend === undefined) {
			if (userText.includes('ja') || userText.includes('yes') || userText.includes('definitiv') || userText.includes('absolut')) {
				feedback.wouldRecommend = true;
				foundAnswers++;
				console.log('🔍 Found wouldRecommend: true');
			} else if (userText.includes('nein') || userText.includes('no') || userText.includes('nicht')) {
				feedback.wouldRecommend = false;
				foundAnswers++;
				console.log('🔍 Found wouldRecommend: false');
			}
		}
		
		// 5. Best aspects (text)
		else if (aiText.includes('besonders gut') && aiText.includes('gefallen') && !feedback.bestAspects) {
			if (userText.length > 10) { // Only if substantial response
				feedback.bestAspects = originalUserText; // Use original case
				foundAnswers++;
				console.log('🔍 Found bestAspects');
			}
		}
		
		// 6. Improvements (text)
		else if (aiText.includes('besser machen') && !feedback.improvements) {
			if (userText.length > 10) { // Only if substantial response
				feedback.improvements = originalUserText; // Use original case
				foundAnswers++;
				console.log('🔍 Found improvements');
			}
		}
		
		// 7. Additional comments (text)
		else if (aiText.includes('noch etwas') && aiText.includes('mitteilen') && !feedback.additionalComments) {
			if (userText.length > 10) { // Only if substantial response
				feedback.additionalComments = originalUserText; // Use original case
				foundAnswers++;
				console.log('🔍 Found additionalComments');
			}
		}
	}

	console.log('🔍 Feedback extraction results:', { foundAnswers, feedback });
	
	// Check if we have ALL 4 mandatory answers
	const hasAllMandatoryAnswers = 
		feedback.helpfulness !== undefined &&
		feedback.understanding !== undefined &&
		feedback.newInsights !== undefined &&
		feedback.wouldRecommend !== undefined;
	
	console.log('🔍 Has all mandatory answers:', hasAllMandatoryAnswers);
	
	// Only return feedback if we have ALL 4 mandatory answers
	return hasAllMandatoryAnswers ? feedback : null;
};

const initialState: State = {
	currentStep: 'observation',
	observation: '',
	feelings: [],
	needs: [],
	request: ''
};

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { chatId, message, systemInstruction, locale } = await request.json();

		console.log('Send request received:', { chatId, message, userId: user.id, locale });

		if (!chatId || !message) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Get chat from database (single source of truth)
		const chatInDb = await pb.collection('chats').getOne(chatId);
		if (!chatInDb) {
			console.log('Chat not found in database for chatId:', chatId);
			return json({ error: 'Chat session not found' }, { status: 404 });
		}
		
		// Decrypt chat history before processing
		if (chatInDb.history) {
			console.log('🔓 Decrypting history from database. Sample encrypted text:', chatInDb.history[0]?.parts[0]?.text?.substring(0, 50) + '...');
			chatInDb.history = decryptChatHistory(chatInDb.history);
			console.log('🔓 Decrypted sample text:', chatInDb.history[0]?.parts[0]?.text?.substring(0, 50) + '...');
		}
		let state = chatInDb?.state || initialState;


		// Default sensitivity thresholds (can be made configurable)
		const defaultSensitivity: Sensitivity = {
			Beobachtung_vs_Bewertung: 6,
			Gefühle_vs_Gedanken: 6,
			Bedürfnisse_vs_Strategien: 6,
			Bitte_vs_Forderung: 6
		};

		let nvcAnalysis: GfkAnalysis | null = null;
		let nvcViolations: Record<string, { score: number; explanation: string }> = {};


		// Analyze path switching intent BEFORE generating AI response
		const preliminaryMessages = chatInDb.history.slice(-6)
			.filter((h: any) => h.parts && h.parts.length > 0 && !h.pathMarker && !h.hidden)
			.map((h: any) => ({
				role: h.role === 'model' ? 'assistant' : h.role as string,
				content: h.parts[0]?.text || ''
			}))
			.filter((m: any) => (m.role === 'user' || m.role === 'assistant') && m.content.trim().length > 0);

		// Add current user message to context
		preliminaryMessages.push({ role: 'user', content: message });

		console.log('🔍 Pre-response path analysis - User message:', message);

		// Get current path state
		const currentPath = getCurrentPath(chatId);
		console.log('🔍 Pre-response path analysis - Current path:', currentPath);
		console.log('🔍 Active path:', currentPath?.activePath);

		let pathSwitchAnalysis: PathSwitchAnalysis | null = null;
		let pathSwitchedEarly = false;
		let earlyNewPathId = null;
		let feedbackSaved = false;
		let feedbackData = null;

		try {
			if (currentPath?.activePath) {
				// Special handling for feedback path - only allow explicit switches
				if (currentPath.activePath === 'feedback') {
					// In feedback path, only allow switching if user explicitly asks to end or switch
					const explicitSwitchKeywords = [
						'beenden', 'ende', 'stop', 'aufhören', 'abbrechen',
						'selbst-empathie', 'fremd-empathie', 'handlungsplanung', 'konfliktlösung',
						'anderes thema', 'wechseln zu', 'gehen zu'
					];
					
					const hasExplicitSwitch = explicitSwitchKeywords.some(keyword => 
						message.toLowerCase().includes(keyword)
					);
					
					if (!hasExplicitSwitch) {
						console.log('🔒 Feedback path: Preventing automatic path switching, staying in feedback');
						// Skip path analysis to prevent automatic switching
					} else {
						console.log('🔓 Feedback path: Explicit switch detected, allowing path analysis');
						pathSwitchAnalysis = await analyzePathSwitchingIntent(
							message,
							currentPath.activePath,
							preliminaryMessages,
							locale || 'de',
							chatId,
							user.id
						);
					}
				} else {
					// Normal path switching analysis for non-feedback paths
					pathSwitchAnalysis = await analyzePathSwitchingIntent(
						message,
						currentPath.activePath,
						preliminaryMessages,
						locale || 'de',
						chatId,
						user.id
					);
				}
				
				console.log('🔍 Pre-response path analysis result:', pathSwitchAnalysis);

				// Switch path BEFORE generating response if user wants to switch
				if (pathSwitchAnalysis?.shouldSwitch && 
					(pathSwitchAnalysis?.confidence || 0) >= 70 && 
					pathSwitchAnalysis?.suggestedPath && 
					pathSwitchAnalysis.suggestedPath !== currentPath.activePath) {
					
					const nextPath = pathSwitchAnalysis.suggestedPath;
					console.log('🔄 Switching path BEFORE AI response generation');
					console.log('🎯 Switching from:', currentPath.activePath, 'to:', nextPath);
					
					if (CONVERSATION_PATHS[nextPath]) {
						try {
							const switchResult = await switchPath(chatId, nextPath, user, locale || 'de');
							if (switchResult.success) {
								pathSwitchedEarly = true;
								earlyNewPathId = nextPath;
								console.log(`✅ Path switched early to ${nextPath} - AI will use new context`);
							}
						} catch (error) {
							console.error('❌ Error switching path early:', error);
						}
					}
				}
			}
		} catch (error) {
			console.error('❌ Error analyzing path switching intent early:', error);
		}

		// console.log('Performing GFK analysis on message:', message);
		// nvcAnalysis = await analyzeGfkCompliance(message, locale || 'de', chatId, user.id);
		// nvcViolations = flagViolations(nvcAnalysis, defaultSensitivity);
		// console.log('GFK Analysis:', nvcAnalysis);
		// console.log('GFK Violations:', nvcViolations);

		// Create Gemini chat on-demand with current system instruction and history
		const pathStateForAI = getCurrentPath(chatId);
		let currentSystemInstruction;
		let memoryContext = '';

		// Get user preferences from database for system prompt customization
		let userWithPreferences = user;
		try {
			const userData = await pb.collection('users').getOne(user.id);
			userWithPreferences = {
				...user,
				aiAnswerLength: userData.aiAnswerLength || 'short',
				toneOfVoice: userData.toneOfVoice || 'heartfelt',
				nvcKnowledge: userData.nvcKnowledge || 'beginner'
			};
			console.log('🎛️ User preferences loaded:', {
				aiAnswerLength: userWithPreferences.aiAnswerLength,
				toneOfVoice: userWithPreferences.toneOfVoice,
				nvcKnowledge: userWithPreferences.nvcKnowledge
			});
		} catch (error) {
			console.error('Error loading user preferences, using defaults:', error);
		}

		// Handle memory path specially
		if (pathStateForAI?.activePath === 'memory') {
			console.log('🧠 Memory path detected - searching for all user memories...');
			const relevantMemories = await searchSimilarMemories(message, user.id, 10);
			console.log(`📝 Found ${relevantMemories.length} memories for memory path`);
			
			if (relevantMemories.length > 0) {
				memoryContext = relevantMemories
					.map(m => `- ${m.key || 'Erinnerung'}: ${m.value}`)
					.join('\n');
				console.log('🧠 Memory context for memory path:', memoryContext);
			} else {
				memoryContext = '- Keine gespeicherten Erinnerungen gefunden';
				console.log('❌ No memories found for memory path');
			}
			
			currentSystemInstruction = await getSystemPromptForPath('memory', userWithPreferences, memoryContext);
		} else {
			// For non-memory paths, use standard approach with user preferences
			currentSystemInstruction = await getSystemPromptForPath(pathStateForAI?.activePath || 'idle', userWithPreferences);
		}
		
		// Convert DB history to Gemini format (excludes path markers, hidden messages)
		const geminiHistory = convertHistoryToGemini(chatInDb.history);
		
		console.log('=== GEMINI HISTORY DEBUG ===');
		console.log('DB history length:', chatInDb.history.length);
		console.log('Gemini history length:', geminiHistory.length);
		console.log('DB history (raw):', JSON.stringify(chatInDb.history, null, 2));
		console.log('Gemini history (filtered):', JSON.stringify(geminiHistory, null, 2));
		console.log('System instruction for path:', pathStateForAI?.activePath, currentSystemInstruction);
		console.log('=== END DEBUG ===');
		
		const geminiChat = ai.chats.create({
			model: 'gemini-2.0-flash',
			config: {
				systemInstruction: currentSystemInstruction
			},
			history: geminiHistory
		});

		// Send message normally (GFK analysis commented out)
		let response: GenerateContentResponse;
		
		// If we switched to idle path, generate a proactive orchestrator message instead of normal response
		if (pathSwitchedEarly && earlyNewPathId === 'idle') {
			console.log('🎭 Generating proactive idle orchestrator message');
			// Create a message that reflects on the conversation so far and suggests directions
			const orchestratorPrompt = `Der Nutzer hat gerade geschrieben: "${message}"

Basierend auf unserem bisherigen Gespräch, agiere jetzt als weiser Gesprächsbegleiter auf Meta-Ebene. Reflektiere den Gesprächsverlauf und mache hilfreiche Richtungsvorschläge für die weitere Unterhaltung.

Verfügbare Richtungen:
- Selbst-Empathie: Eigene Gefühle und Bedürfnisse verstehen
- Fremd-Empathie: Andere Menschen verstehen
- Handlungsplanung: Konkrete Schritte entwickeln
- Konfliktlösung: Zwischenmenschliche Probleme lösen

Reagiere empathisch auf ihre Nachricht und schlage dann basierend auf dem Kontext sinnvolle nächste Schritte vor.`;

			response = await geminiChat.sendMessage({ message: orchestratorPrompt });
		} else {
			// Normal message processing
			response = await geminiChat.sendMessage({ message });
		}
		
		// // If there are NVC violations, create a temporary chat with context for enhanced response
		// if (Object.keys(nvcViolations).length > 0) {
		//	console.log('NVC violations detected, creating temporary enhanced context');
		//	
		//	// Get current history without the new message
		//	const currentHistory = await chatInMemory.getHistory();
		//	
		//	// Create enhanced message with context for temporary processing
		//	const violationContext = locale === 'de' 
		//		? `[SYSTEM KONTEXT: Der Nutzer zeigt GFK-Verbesserungspotential: ${Object.entries(nvcViolations)
		//			.map(([key, violation]) => `${key.replace(/_/g, ' ')}: ${violation.explanation} (${violation.score}/10)`)
		//			.join('; ')}. Hilf empathisch bei der Verbesserung.]\n\n${message}`
		//		: `[SYSTEM CONTEXT: User shows NVC improvement potential: ${Object.entries(nvcViolations)
		//			.map(([key, violation]) => `${key.replace(/_/g, ' ')}: ${violation.explanation} (${violation.score}/10)`)
		//			.join('; ')}. Help empathetically with improvement.]\n\n${message}`;
		//	
		//	// Send enhanced message to get better response
		//	response = await chatInMemory.sendMessage({ message: violationContext });
		//	
		//	// Now manually fix the history to only show the original user message
		//	const newHistory = await chatInMemory.getHistory();
		//	if (newHistory.length >= 2) {
		//		// Replace the last user message (which has the context) with the original message
		//		newHistory[newHistory.length - 2] = {
		//			role: 'user',
		//			parts: [{ text: message }]
		//		};
		//	}
		//	
		//	// Update the chat with the cleaned history (this is a bit hacky but necessary)
		//	// Unfortunately, we can't directly modify Gemini chat history, so we'll clean it in DB
		// } else {
		//	// No violations, send message normally
		//	response = await chatInMemory.sendMessage({ message });
		// }
		if (!response.text) throw new Error('No text in response');

		// Generate recommendations after AI response
		let recommendations: RecommendationMatch[] = [];
		try {
			const currentPathForRec = getCurrentPath(chatId);
			if (recommendationService.shouldGenerateRecommendations(currentPathForRec, message, response.text)) {
				console.log('📚 Generating content recommendations...');
				const conversationContext = recommendationService.extractConversationContext(chatInDb.history);
				recommendations = await recommendationService.generateRecommendations(
					message,
					response.text,
					conversationContext,
					ai
				);
				
				if (recommendations.length > 0) {
					console.log('📚 Generated recommendations:', recommendations.length);
				}
			}
		} catch (error) {
			console.error('❌ Error generating recommendations:', error);
			// Continue without recommendations if there's an error
		}

		// Manually manage history - DB is single source of truth
		let historyToSave = [...chatInDb.history];
		
		// Add the user message first
		historyToSave.push({
			role: 'user',
			parts: [{ text: message }],
			timestamp: Date.now()
		});
		
		// If path was switched, add path markers AFTER user message but BEFORE AI response
		if (pathSwitchedEarly && earlyNewPathId) {
			console.log('🔄 Adding path markers between user message and AI response');
			const previousPath = currentPath?.activePath; // Use the original path from before the switch
			
			// Add path end marker for previous path
			if (previousPath) {
				historyToSave.push({
					role: 'model',
					parts: [{ text: '' }],
					timestamp: Date.now(),
					pathMarker: {
						type: 'path_end',
						path: previousPath,
						timestamp: Date.now()
					}
				});
			}
			
			// Add path switch marker
			historyToSave.push({
				role: 'model',
				parts: [{ text: '' }],
				timestamp: Date.now(),
				pathMarker: {
					type: 'path_switch',
					path: earlyNewPathId,
					previousPath: previousPath,
					timestamp: Date.now()
				}
			});
		}
		
		// Add the AI response last
		const aiMessage: any = {
			role: 'model',
			parts: [{ text: response.text }],
			timestamp: Date.now()
		};
		
		// Add recommendations to the AI message if any were generated
		if (recommendations.length > 0) {
			aiMessage.recommendations = recommendations;
		}
		
		historyToSave.push(aiMessage);
		
		// Store initial history without feedback confirmation
		let finalHistoryToSave = [...historyToSave];
		const encryptedHistory = encryptChatHistory(finalHistoryToSave);
		
		await pb.collection('chats').update(chatId, { history: encryptedHistory });

		// Trigger automatic feedback analysis if we switched to feedback path
		// OR for testing: if user message contains "test feedback"
		const isTestFeedback = message.toLowerCase().includes('test feedback');
		if ((pathSwitchedEarly && earlyNewPathId === 'feedback') || isTestFeedback) {
			console.log('🔍 Feedback-Pfad aktiviert - starte automatische Gesprächsanalyse');
			console.log('🔍 Chat history length for analysis:', historyToSave.length);
			try {
				// Führe automatische Analyse durch (ohne User-Feedback)
				console.log('🔍 Calling analyzeChatFlow...');
				const analysisResult = await analyzeChatFlow(chatId, historyToSave, locale || 'de');
				console.log('🔍 Analysis completed:', {
					flowRating: analysisResult.conversationFlow.flowRating,
					nvcCompliance: analysisResult.nvcCompliance.overallCompliance,
					orchestratorEffectiveness: analysisResult.orchestratorEffectiveness.overallEffectiveness
				});
				
				// Speichere Analyse-Ergebnisse (ohne User-Feedback)
				console.log('🔍 Calling saveChatFeedback...');
				const feedbackRecordId = await saveChatFeedback(
					chatId, 
					analysisResult, 
					null, // Kein User-Feedback zum jetzigen Zeitpunkt
					user.id
				);
				console.log('🔍 Feedback record created with ID:', feedbackRecordId);
				
				// Chat als feedback-bereit markieren (nur feedbackId setzen)
				console.log('🔍 Updating chat with feedbackId...');
				await pb.collection('chats').update(chatId, {
					feedbackId: feedbackRecordId
				});
				
				console.log('✅ Automatische Feedback-Analyse abgeschlossen:', feedbackRecordId);
				feedbackSaved = true;
				feedbackData = { feedbackId: feedbackRecordId };
			} catch (error) {
				console.error('❌ Fehler bei automatischer Feedback-Analyse:', error);
				if (error instanceof Error) {
					console.error('❌ Stack trace:', error.stack);
				}
				// Fehler wird nicht an User weitergegeben - Hauptfunktion bleibt intakt
			}
		}

		// Feedback will be processed when user clicks "Chat abschließen" button
		// No need to process feedback here during normal conversation

		saveTrace(
			'sendMessage',
			message,
			'bullshift',
			chatId,
			user.id,
			response.text,
			response,
			systemInstruction
		);

		// Path was already switched before response generation if needed

		// Get updated path state after potential switch (moved up for feedback check)
		const finalPathForReturn = getCurrentPath(chatId);

		return json({
			response: response.text,
			timestamp: Date.now(),
			gfkAnalysis: nvcAnalysis,
			gfkViolations: Object.keys(nvcViolations).length > 0 ? nvcViolations : null,
			pathSwitchAnalysis,
			pathSwitched: pathSwitchedEarly,
			newPath: earlyNewPathId,
			currentPath: finalPathForReturn?.activePath,
			pathState: finalPathForReturn,
			feedbackSaved,
			feedbackData,
			recommendations
		});
	} catch (error) {
		console.error('Error sending message:', error);
		return json({ error: 'Failed to send message' }, { status: 500 });
	}
};
