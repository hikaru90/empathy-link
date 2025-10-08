import { pb } from '$scripts/pocketbase';
import {
	GoogleGenAI,
	Type,
} from '@google/genai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import type { HistoryEntry } from '$routes/api/ai/selfempathy/initChat/+server';
import type { Chat, CreateChatParameters } from '@google/genai';
import { m } from '$lib/translations';
import { encryptChatHistory, decryptChatHistory } from '$lib/utils/chatEncryption.js';
import { saveTrace } from './tools';
import {
	type PathState,
	type PathMarker,
	createPathMarker,
	getSystemPromptForPath,
	analyzePathCompletion,
	CONVERSATION_PATHS
} from './paths';

// Initialize Gemini once
export const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });

export const selfempathyChats = new Map<string, Chat>();
// Remove persistent chat storage - we'll create chats on demand
export const chatPaths = new Map<string, PathState>();

// Utility function to convert DB history to Gemini format with sliding window
export const convertHistoryToGemini = (dbHistory: any[], maxMessages: number = 20) => {
	const filtered = dbHistory
		// Filter out path markers and other non-conversational entries
		.filter(entry =>
			!entry.pathMarker &&
			entry.role &&
			entry.parts &&
			entry.parts[0]?.text &&
			entry.parts[0].text.trim() !== ''
		)
		// Convert to Gemini format
		.map(entry => ({
			role: entry.role,
			parts: entry.parts
		}));

	// Implement sliding window: keep only the most recent messages
	// Always ensure we start with a user message (Gemini requirement)
	if (filtered.length <= maxMessages) {
		return filtered;
	}

	const recentMessages = filtered.slice(-maxMessages);

	// Ensure first message is from user (Gemini requirement)
	if (recentMessages.length > 0 && recentMessages[0].role !== 'user') {
		// Find the first user message in the recent slice
		const firstUserIndex = recentMessages.findIndex(msg => msg.role === 'user');
		if (firstUserIndex > 0) {
			return recentMessages.slice(firstUserIndex);
		}
	}

	return recentMessages;
};

export const getIds = (map: Map<string, Chat>) => {
	return Array.from(map.keys());
};

// GFK Analysis Types
export type GfkResult = {
	score: number;
	explanation: string | null;
};

export type GfkAnalysis = {
	Beobachtung_vs_Bewertung: GfkResult;
	Gefühle_vs_Gedanken: GfkResult;
	Bedürfnisse_vs_Strategien: GfkResult;
	Bitte_vs_Forderung: GfkResult;
};

export type Sensitivity = {
	Beobachtung_vs_Bewertung: number;
	Gefühle_vs_Gedanken: number;
	Bedürfnisse_vs_Strategien: number;
	Bitte_vs_Forderung: number;
};

export function flagViolations(analysis: GfkAnalysis, sensitivity: Sensitivity) {
	const flagged: Record<string, { score: number; explanation: string }> = {};

	for (const key of Object.keys(analysis) as (keyof GfkAnalysis)[]) {
		const { score, explanation } = analysis[key];
		if (score >= sensitivity[key]) {
			flagged[key] = { score, explanation: explanation ?? "" };
		}
	}

	return flagged;
}

// GFK Analysis Function
export const analyzeGfkCompliance = async (
	message: string,
	locale: string = 'de',
	chatId?: string,
	userId?: string
): Promise<GfkAnalysis> => {
	console.log('::analyzeGfkCompliance');
	try {
		const systemPrompt = locale === 'de'
			? `Du bist ein Experte für Gewaltfreie Kommunikation (GFK) nach Marshall Rosenberg. Analysiere die gegebene Nachricht und bewerte, wie sehr sie von den vier Grundprinzipien der GFK abweicht.

Bewerte jede Kategorie auf einer Skala von 0-10:
- 0: Perfekt GFK-konform
- 5: Teilweise problematisch
- 10: Starke Abweichung von GFK-Prinzipien

Analysiere folgende Bereiche:

1. **Beobachtung_vs_Bewertung**: Enthält die Nachricht Bewertungen, Interpretationen oder Urteile statt objektiver Beobachtungen?
2. **Gefühle_vs_Gedanken**: Werden echte Gefühle ausgedrückt oder als Gedanken getarnte "Gefühle" (z.B. "Ich fühle mich verraten")?
3. **Bedürfnisse_vs_Strategien**: Werden zugrundeliegende Bedürfnisse benannt oder nur Strategien/Lösungen vorgeschlagen?
4. **Bitte_vs_Forderung**: Wenn eine Bitte geäußert wird, klingt sie wie eine Forderung oder eine echte Bitte?

Antworte ausschließlich mit einem JSON-Objekt in diesem Format:
{
  "Beobachtung_vs_Bewertung": {"score": 0-10, "explanation": "kurze Erklärung"},
  "Gefühle_vs_Gedanken": {"score": 0-10, "explanation": "kurze Erklärung"},
  "Bedürfnisse_vs_Strategien": {"score": 0-10, "explanation": "kurze Erklärung"},
  "Bitte_vs_Forderung": {"score": 0-10, "explanation": "kurze Erklärung"}
}`
			: `You are an expert in Nonviolent Communication (NVC) by Marshall Rosenberg. Analyze the given message and rate how much it deviates from the four core NVC principles.

Rate each category on a scale of 0-10:
- 0: Perfect NVC compliance
- 5: Partially problematic
- 10: Strong deviation from NVC principles

Analyze these areas:

1. **Beobachtung_vs_Bewertung**: Does the message contain evaluations, interpretations, or judgments instead of objective observations?
2. **Gefühle_vs_Gedanken**: Are real feelings expressed or thoughts disguised as "feelings" (e.g., "I feel betrayed")?
3. **Bedürfnisse_vs_Strategien**: Are underlying needs mentioned or only strategies/solutions proposed?
4. **Bitte_vs_Forderung**: If a request is made, does it sound like a demand or a genuine request?

Respond exclusively with a JSON object in this format:
{
  "Beobachtung_vs_Bewertung": {"score": 0-10, "explanation": "brief explanation"},
  "Gefühle_vs_Gedanken": {"score": 0-10, "explanation": "brief explanation"},
  "Bedürfnisse_vs_Strategien": {"score": 0-10, "explanation": "brief explanation"},
  "Bitte_vs_Forderung": {"score": 0-10, "explanation": "brief explanation"}
}`;

		const model = ai.chats.create({
			model: 'gemini-2.5-flash',
			config: {
				temperature: 0.1, // Low temperature for consistent analysis
				systemInstruction: systemPrompt
			}
		});

		const result = await model.sendMessage({
			message: `Analysiere diese Nachricht: "${message}"`
		});

		const responseText = result.text || '';
		console.log('GFK Analysis response:', responseText);

		// Clean the response text (remove markdown code blocks if present)
		let cleanedResponseText = responseText.trim();
		if (cleanedResponseText.startsWith('```json')) {
			cleanedResponseText = cleanedResponseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
		} else if (cleanedResponseText.startsWith('```')) {
			cleanedResponseText = cleanedResponseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
		}

		// Parse the JSON response
		const analysis = JSON.parse(cleanedResponseText) as GfkAnalysis;
		console.log('::analyzeGfkCompliance - analysis', analysis);

		// Save trace for monitoring if chatId and userId are provided
		if (chatId && userId) {
			saveTrace(
				'analyzeGfkCompliance',
				message,
				'bullshift',
				chatId,
				userId,
				cleanedResponseText,
				result,
				systemPrompt
			);
		}

		return analysis;

	} catch (error) {
		console.error('Error in GFK analysis:', error);
		// Return neutral analysis in case of error
		return {
			Beobachtung_vs_Bewertung: { score: 0, explanation: null },
			Gefühle_vs_Gedanken: { score: 0, explanation: null },
			Bedürfnisse_vs_Strategien: { score: 0, explanation: null },
			Bitte_vs_Forderung: { score: 0, explanation: null }
		};
	}
};

// Path Switching Analysis Types
export type PathSwitchAnalysis = {
	shouldSwitch: boolean;
	confidence: number;
	suggestedPath: string | null;
	reason: string;
	currentPathComplete: boolean;
};

// Path Switching Analysis Function
export const analyzePathSwitchingIntent = async (
	message: string,
	currentPath: string,
	recentHistory: Array<{ role: string; content: string }>,
	locale: string = 'de',
	chatId?: string,
	userId?: string
): Promise<PathSwitchAnalysis> => {
	console.log('::analyzePathSwitchingIntent');
	try {
		const systemPrompt = `Du bist ein Experte für Gesprächsanalyse und Gewaltfreie Kommunikation. Analysiere, ob der Nutzer zu einem anderen Gesprächspfad wechseln  sollte.

Aktueller Pfad: ${currentPath}
Verfügbare Pfade:
- idle: Gesprächsführung (Meta-Ebene, Richtungsvorschläge, Gesprächsorchestrierung)
- self_empathy: Selbst-Empathie (eigene Gefühle und Bedürfnisse verstehen)
- other_empathy: Fremd-Empathie (Empathie für andere Personen entwickeln)  
- action_planning: Handlungsplanung (konkrete Schritte planen)
- conflict_resolution: Konfliktlösung (Probleme mit anderen lösen)
- memory: Erinnerungen abrufen (gespeicherte Informationen über den Nutzer)
- feedback: Gespräch beenden (Feedback sammeln und Gespräch abschließen)

FALL A: Der Nutzer befindet sich im Pfad "idle":
1. Du kannst gerne einen wechsel zu einem anderen Pfad vorschlagen sobald der Nutzer ein Ziel definiert hat.

FALL B: Der Nutzer befindet sich bereits in einem anderen Pfad: 

KITERIEN FÜR EINEN PFADWECHSEL (ALLE müssen erfüllt sein):
1. **Explizite Wechselabsicht**: Der Nutzer hat klar und eindeutig einen anderen Themenbereich erwähnt
2. **Eindeutige Signale**: Die Nachricht enthält unmissverständliche Wechselsignale
3. **Kontextpassung**: Der vorgeschlagene Pfad passt perfekt zum Nutzerinhalt

NUR bei diesen sehr klaren Beispielen wechseln:

Beispiele für explizite Wechselabsichten:
- "ich würde gerne empathie für jemand anderen aufbringen"
- "können wir jetzt zur handlungsplanung"
- "ich möchte einen konflikt lösen"
- "wie kann ich das problem angehen"
- "was erinnerst du dich über mich"
- "was weißt du noch von mir"
- "erinnerst du dich an unsere früheren gespräche"
- "was haben wir früher besprochen"

STANDARD: Wenn Zweifel besteht, NICHT wechseln. Confidence unter 80 sollte shouldSwitch = false ergeben.

Antworte ausschließlich mit einem JSON-Objekt:
{
  "shouldSwitch": boolean,
  "confidence": 0-100,
  "suggestedPath": "path_id oder null",
  "reason": "kurze Erklärung der Analyse",
  "currentPathComplete": boolean
}`;

		const model = ai.chats.create({
			model: 'gemini-2.5-flash',
			config: {
				temperature: 0.1, // Low temperature for consistent analysis
				systemInstruction: systemPrompt
			}
		});

		// Include recent context for better analysis
		const contextMessage = `Aktuelle Nachricht: "${message}"

Letzter Gesprächsverlauf:
${recentHistory.slice(-4).map(h => `${h.role}: ${h.content}`).join('\n')}

Analysiere diese Nachricht auf Pfadwechselabsicht.`;

		const result = await model.sendMessage({ message: contextMessage });
		const responseText = result.text || '{}';
		console.log('Path switching analysis response:', responseText);

		// Clean the response text (remove markdown code blocks if present)
		let cleanedResponseText = responseText.trim();
		if (cleanedResponseText.startsWith('```json')) {
			cleanedResponseText = cleanedResponseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
		} else if (cleanedResponseText.startsWith('```')) {
			cleanedResponseText = cleanedResponseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
		}

		// Parse the JSON response
		const analysis = JSON.parse(cleanedResponseText) as PathSwitchAnalysis;
		console.log('::analyzePathSwitchingIntent - analysis', analysis);
		console.log('🔍 Path switching analysis details:', {
			shouldSwitch: analysis.shouldSwitch,
			confidence: analysis.confidence,
			suggestedPath: analysis.suggestedPath,
			reason: analysis.reason,
			currentPathComplete: analysis.currentPathComplete
		});

		// Save trace for monitoring if chatId and userId are provided
		if (chatId && userId) {
			saveTrace(
				'analyzePathSwitchingIntent',
				message,
				'bullshift',
				chatId,
				userId,
				cleanedResponseText,
				result,
				systemPrompt
			);
		}

		return analysis;

	} catch (error) {
		console.error('Error in path switching analysis:', error);
		// Return neutral analysis in case of error
		return {
			shouldSwitch: false,
			confidence: 0,
			suggestedPath: null,
			reason: 'Analysis error',
			currentPathComplete: false
		};
	}
};

export const sendMessage = async (
	chatId: string,
	chat: Chat,
	message: string,
	history: HistoryEntry[]
) => {
	try {
		console.log('message', message);
		// Send the message directly without modifying chat history
		const result = await chat.sendMessage({ message });
		const responseText = result.text || '';
		const responseJson = JSON.parse(responseText);
		console.log('responseJson from sendMessage', responseJson);

		// Store in DB with full metadata (this format is only for our database)
		await pb.collection('chats').update(chatId, {
			history: encryptChatHistory(await chat.getHistory()),
			updated: new Date().toISOString()
		});

		return responseJson;
	} catch (error) {
		console.error('error in sendMessage', error);
		return { error: 'Failed to send message' };
	}
};

// Add this helper function to fetch and format user memories
const getUserMemories = async (userId: string, userMessage?: string): Promise<string> => {
	try {
		// Import hybrid memory system dynamically to avoid circular dependencies
		const { getRelevantMemories } = await import('./hybridMemory.js');

		// If we have a user message, use vector-based retrieval for context-aware memories
		if (userMessage) {
			return await getRelevantMemories(userId, userMessage, 5);
		}

		// Fallback to PocketBase for backward compatibility
		const memories = await pb.collection('memories').getFullList({
			filter: `user = "${userId}"`,
			sort: '-created'
		});

		if (memories.length === 0) {
			return '';
		}

		const memoryContext = memories.map(memory => {
			const confidenceLevel = memory.confidence === 'certain' ? '(high confidence)' :
				memory.confidence === 'likely' ? '(medium confidence)' :
					'(low confidence)';
			return `- ${memory.key}: ${memory.value} ${confidenceLevel}`;
		}).join('\n');

		return `\n\nPrevious information about this user from past conversations:\n${memoryContext}\n\nPlease use this context to personalize your responses while being natural about it.`;
	} catch (error) {
		console.error('Error fetching user memories:', error);
		return '';
	}
};

export const getSystemInstruction = async (user: any, locale: string) => {
	console.log('user object in getSystemInstruction:', user);

	// Handle different possible user object structures
	const firstName = user?.firstName || user?.first_name || user?.name || 'there';
	// Capitalize first letter
	const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

	// Get user memories
	const memoriesContext = user?.id ? await getUserMemories(user.id) : '';

	// Call the translation function directly with the variables
	const baseInstruction = m.ai_system_selfempathy({
		firstName: capitalizedFirstName,
		locale: locale
	});

	return baseInstruction + memoriesContext;
};

export const getConfig = async (user: object, locale: string) => {
	return {
		// temperature: 0.3,
		systemInstruction: await getSystemInstruction(user, locale)
		// tools: [
		// 	{
		// 		functionDeclarations: [saveObservationFunctionDeclaration]
		// 	}
		// ],
		// toolConfig: {
		// 	functionCallingConfig: {
		// 		mode: FunctionCallingConfigMode.AUTO,
		// 		// allowedFunctionNames: ['save_message']
		// 	},
		// }
	};
};

export const getModel = async (user: object, locale: string, history?: HistoryEntry[]) => {
	const feelings = await pb.collection('feelings').getFullList({
		sort: 'category,sort'
	});
	const needs = await pb.collection('needs').getFullList({
		sort: 'category,sort'
	});

	const systemInstruction = await getSystemInstruction(user, locale);

	const model: CreateChatParameters = {
		model: 'gemini-2.5-flash',
		config: await getConfig(user, locale)
	};

	if (history) {
		model.history = history;
	}

	return { model, systemInstruction };
};

// Create NVC-aware system instruction based on analysis
export const createNvcAwareSystemInstruction = (
	baseSystemInstruction: string,
	nvcAnalysis: GfkAnalysis | null,
	nvcViolations: Record<string, { score: number; explanation: string }>,
	locale: string = 'de'
): string => {
	if (!nvcAnalysis || Object.keys(nvcViolations).length === 0) {
		return baseSystemInstruction;
	}

	const violationText = locale === 'de'
		? `\n\nWICHTIG: Der Nutzer hat gerade eine Nachricht gesendet, die von den GFK-Prinzipien abweicht. Hier sind die erkannten Probleme:\n\n${Object.entries(nvcViolations)
			.map(([key, violation]) => `**${key.replace(/_/g, ' ')}** (Bewertung: ${violation.score}/10): ${violation.explanation}`)
			.join('\n')}\n\nBitte reagiere einfühlsam auf diese Abweichungen und hilf dem Nutzer dabei, seine Kommunikation im Sinne der Gewaltfreien Kommunikation zu verbessern. Gehe auf die spezifischen Probleme ein und biete konstruktive Alternativen an.`
		: `\n\nIMPORTANT: The user just sent a message that deviates from NVC principles. Here are the identified issues:\n\n${Object.entries(nvcViolations)
			.map(([key, violation]) => `**${key.replace(/_/g, ' ')}** (Score: ${violation.score}/10): ${violation.explanation}`)
			.join('\n')}\n\nPlease respond empathetically to these deviations and help the user improve their communication according to Nonviolent Communication principles. Address the specific issues and offer constructive alternatives.`;

	return baseSystemInstruction + violationText;
};

// Create a new chat instance with updated system instruction
export const createChatWithNvcContext = async (
	user: any,
	locale: string,
	history: any[] = [],
	nvcAnalysis: GfkAnalysis | null = null,
	nvcViolations: Record<string, { score: number; explanation: string }> = {}
) => {
	const { model: baseModel, systemInstruction: baseSystemInstruction } = await getModel(user, locale);

	// Create NVC-aware system instruction
	const nvcAwareSystemInstruction = createNvcAwareSystemInstruction(
		baseSystemInstruction,
		nvcAnalysis,
		nvcViolations,
		locale
	);

	// Create new model with updated system instruction
	const nvcAwareModel = {
		...baseModel,
		config: {
			...baseModel.config,
			systemInstruction: nvcAwareSystemInstruction
		},
		history: history
	};

	return ai.chats.create(nvcAwareModel);
};

export const initChat = async (user: any, locale: string, initialPath?: string, authenticatedPb?: any) => {
	const pathId = initialPath || 'idle';
	console.log('initChat called with pathId:', pathId);

	// Create initial path state
	const pathState: PathState = {
		activePath: pathId,
		pathHistory: [pathId],
		startedAt: Date.now()
	};

	// Create initial path marker
	const pathMarker = createPathMarker('path_start', pathId);

	// Create initial history with path marker
	let initialHistory = [
		// Hidden user message to satisfy Gemini's requirement
		{
			role: 'user',
			parts: [{ text: '[System: Chat initialisiert]' }],
			timestamp: Date.now(),
			hidden: true // Mark as hidden so it doesn't show in UI
		},
		// Path marker as model message (text will not be displayed, only visual indicator)
		{
			role: 'model',
			parts: [{ text: '' }], // Empty text - only pathMarker is used for display
			timestamp: Date.now(),
			pathMarker
		}
	];

	// If starting with idle path, add proactive welcome message
	if (pathId === 'idle') {
		const welcomeMessage1 = `Ich begleite dich dabei, schwierige Situationen zu erforschen – ob Streit mit einer wichtigen Person oder ein innerer Konflikt, bei dem du hin- und hergerissen bist.<br/><br/>Es geht dabei nicht um Tipps oder fertige Lösungen, sondern ich helfe dir, deine eigenen Gefühle und Gedanken zu sortieren. So findest du selbst heraus, was dir wichtig ist.<br/><br/>Manchmal schauen wir gemeinsam auf deine Sicht, manchmal auf die Perspektive der anderen Person. Wichtig ist: Du kannst hier nichts falsch machen. Alles, was dich bewegt, hat hier seinen Platz. <br/><br/>Und deine Gespräche bleiben natürlich privat und sicher – sie gehören nur dir. Was beschäftigt dich gerade?`;

		const welcomeMessage2 = `Was kann ich heute für Dich tun?`;

		initialHistory.push({
			role: 'model',
			parts: [{ text: welcomeMessage1 }],
			timestamp: Date.now()
		});
		initialHistory.push({
			role: 'model',
			parts: [{ text: welcomeMessage2 }],
			timestamp: Date.now()
		});
	}

	const dbChat = await (authenticatedPb || pb).collection('chats').create({
		history: encryptChatHistory(initialHistory),
		user: user.id,
		module: 'bullshift',
		pathState
	});

	// Get system instruction for the specific path
	const systemInstruction = await getSystemPromptForPath(pathId, user, undefined, authenticatedPb);

	// Store only the path state (no persistent Gemini chat)
	chatPaths.set(dbChat.id, pathState);

	return {
		chatId: dbChat.id,
		systemInstruction,
		activePath: pathId,
		pathState
	};
};

/**
 * Switch to a new conversation path
 */
export const switchPath = async (
	chatId: string,
	newPathId: string,
	user: any,
	locale: string,
	authenticatedPb?: any
): Promise<{
	success: boolean;
	newSystemInstruction?: string;
	pathMarkers?: PathMarker[];
}> => {
	try {
		const currentPathState = chatPaths.get(chatId);
		const chatInDb = await (authenticatedPb || pb).collection('chats').getOne(chatId);

		// Decrypt history if it exists
		if (chatInDb && chatInDb.history) {
			chatInDb.history = decryptChatHistory(chatInDb.history);
		}

		if (!currentPathState || !chatInDb) {
			throw new Error('Chat not found');
		}

		const previousPath = currentPathState.activePath;

		// Create path markers
		const endMarker = createPathMarker('path_end', previousPath || '');
		const switchMarker = createPathMarker('path_switch', newPathId, previousPath || undefined);
		const startMarker = createPathMarker('path_start', newPathId);

		// Update path state
		const newPathState: PathState = {
			activePath: newPathId,
			pathHistory: [...currentPathState.pathHistory, newPathId],
			startedAt: currentPathState.startedAt,
			lastSwitch: Date.now()
		};

		// Get new system instruction
		const newSystemInstruction = await getSystemPromptForPath(newPathId, user, undefined, authenticatedPb);

		// Update database with new path state only (path markers will be added by send endpoint)
		await (authenticatedPb || pb).collection('chats').update(chatId, {
			pathState: newPathState
		});

		// If switching to idle path, we need to add a proactive message
		// This will be handled by the send endpoint when it detects the switch

		// Update path state in memory
		chatPaths.set(chatId, newPathState);

		return {
			success: true,
			newSystemInstruction,
			pathMarkers: [endMarker, switchMarker, startMarker]
		};
	} catch (error) {
		console.error('Error switching path:', error);
		return { success: false };
	}
};

/**
 * Check if current path should end and suggest next paths
 */
export const checkPathCompletion = async (
	chatId: string,
	messages: Array<{ role: string; content: string }>
): Promise<{
	shouldEnd: boolean;
	confidence: number;
	reason: string;
	suggestedPaths?: string[];
}> => {
	const currentPathState = chatPaths.get(chatId);
	if (!currentPathState || !currentPathState.activePath) {
		return { shouldEnd: false, confidence: 0, reason: 'No active path' };
	}

	try {
		const result = await analyzePathCompletion(
			messages,
			currentPathState.activePath,
			ai
		);

		return result;
	} catch (error) {
		console.error('Error checking path completion:', error);
		return { shouldEnd: false, confidence: 0, reason: 'Analysis error' };
	}
};

/**
 * Get current path state for a chat
 */
export const getCurrentPath = (chatId: string): PathState | null => {
	return chatPaths.get(chatId) || null;
};

/**
 * Get available paths for switching
 */
export const getAvailablePaths = () => {
	return Object.values(CONVERSATION_PATHS);
};
