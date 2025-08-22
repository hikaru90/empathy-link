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
import { CONVERSATION_PATHS, getSystemPromptForPath } from '$lib/server/paths';
import { analyzeChatFlow, saveChatFeedback } from '$lib/server/chatAnalysis';
import { pb } from '$scripts/pocketbase';
import {
	saveTrace,
	queueMemoryExtraction,
} from '$lib/server/tools';
import type { GenerateContentResponse } from '@google/genai';

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
		let state = chatInDb?.state || initialState;

		await queueMemoryExtraction(user.id, 'pending');

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
			.filter(h => h.parts && h.parts.length > 0 && !h.pathMarker && !h.hidden)
			.map(h => ({
				role: h.role === 'model' ? 'assistant' : h.role as string,
				content: h.parts[0]?.text || ''
			}))
			.filter(m => (m.role === 'user' || m.role === 'assistant') && m.content.trim().length > 0);

		// Add current user message to context
		preliminaryMessages.push({ role: 'user', content: message });

		console.log('🔍 Pre-response path analysis - User message:', message);

		// Get current path state
		const currentPath = getCurrentPath(chatId);
		console.log('🔍 Pre-response path analysis - Current path:', currentPath);

		let pathSwitchAnalysis: PathSwitchAnalysis | null = null;
		let pathSwitchedEarly = false;
		let earlyNewPathId = null;

		try {
			if (currentPath?.activePath) {
				pathSwitchAnalysis = await analyzePathSwitchingIntent(
					message,
					currentPath.activePath,
					preliminaryMessages,
					locale || 'de',
					chatId,
					user.id
				);
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
		const currentSystemInstruction = getSystemPromptForPath(pathStateForAI?.activePath || 'idle', user);
		
		// Convert DB history to Gemini format (excludes path markers, hidden messages)
		const geminiHistory = convertHistoryToGemini(chatInDb.history);
		
		console.log('=== GEMINI HISTORY DEBUG ===');
		console.log('DB history length:', chatInDb.history.length);
		console.log('Gemini history length:', geminiHistory.length);
		console.log('DB history (raw):', JSON.stringify(chatInDb.history, null, 2));
		console.log('Gemini history (filtered):', JSON.stringify(geminiHistory, null, 2));
		console.log('System instruction for path:', pathStateForAI?.activePath, currentSystemInstruction.substring(0, 100) + '...');
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
		historyToSave.push({
			role: 'model',
			parts: [{ text: response.text }],
			timestamp: Date.now()
		});
		
		await pb.collection('chats').update(chatId, { history: historyToSave });

		// Trigger automatic feedback analysis if we switched to feedback path
		if (pathSwitchedEarly && earlyNewPathId === 'feedback') {
			console.log('🔍 Feedback-Pfad aktiviert - starte automatische Gesprächsanalyse');
			try {
				// Führe automatische Analyse durch (ohne User-Feedback)
				const analysisResult = await analyzeChatFlow(chatId, historyToSave, locale || 'de');
				
				// Speichere Analyse-Ergebnisse (ohne User-Feedback)
				const feedbackRecordId = await saveChatFeedback(
					chatId, 
					analysisResult, 
					null, // Kein User-Feedback zum jetzigen Zeitpunkt
					user.id
				);
				
				// Chat als feedback-bereit markieren (nur feedbackId setzen)
				await pb.collection('chats').update(chatId, {
					feedbackId: feedbackRecordId
				});
				
				console.log('✅ Automatische Feedback-Analyse abgeschlossen:', feedbackRecordId);
			} catch (error) {
				console.error('❌ Fehler bei automatischer Feedback-Analyse:', error);
				// Fehler wird nicht an User weitergegeben - Hauptfunktion bleibt intakt
			}
		}

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

		// Get updated path state after potential switch
		const finalPath = getCurrentPath(chatId);

		return json({
			response: response.text,
			timestamp: Date.now(),
			gfkAnalysis: nvcAnalysis,
			gfkViolations: Object.keys(nvcViolations).length > 0 ? nvcViolations : null,
			pathSwitchAnalysis,
			pathSwitched: pathSwitchedEarly,
			newPath: earlyNewPathId,
			currentPath: finalPath?.activePath,
			pathState: finalPath
		});
	} catch (error) {
		console.error('Error sending message:', error);
		return json({ error: 'Failed to send message' }, { status: 500 });
	}
};
