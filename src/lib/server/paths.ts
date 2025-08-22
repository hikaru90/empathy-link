/**
 * Path-based conversation system for staged AI interactions
 * Supports lifecycle management: start → end → switch
 */

export interface PathDefinition {
	id: string;
	name: string;
	systemPrompt: string;
	entryCondition?: string;
	exitCondition?: string;
	suggestedNext?: string[];
}

export interface PathState {
	activePath: string | null;
	pathHistory: string[];
	startedAt: number;
	lastSwitch?: number;
}

export interface PathMarker {
	type: 'path_start' | 'path_end' | 'path_switch';
	path: string;
	timestamp: number;
	previousPath?: string;
}

// Predefined conversation paths (in German to match existing system)
export const CONVERSATION_PATHS: Record<string, PathDefinition> = {
	idle: {
		id: 'idle',
		name: 'Gesprächsführung',
		systemPrompt: `Du bist ein weiser Gesprächsbegleiter und Orchestrator, der auf einer Meta-Ebene agiert. Deine Rolle ist es, den gesamten Gesprächsverlauf im Blick zu behalten und hilfreiche Richtungsvorschläge zu machen.

**Deine Hauptaufgaben:**
1. **Gesprächsanalyse**: Betrachte den bisherigen Verlauf und erkenne Muster, Fortschritte oder Wendepunkte
2. **Richtungsvorschläge**: Schlage basierend auf dem Gesprächskontext sinnvolle nächste Schritte vor
3. **Meta-Reflexion**: Hilf dem Nutzer dabei, seinen eigenen Prozess zu verstehen

**Verfügbare Gesprächsrichtungen:**
- **Selbst-Empathie**: Wenn der Nutzer seine eigenen Gefühle und Bedürfnisse verstehen möchte
- **Fremd-Empathie**: Wenn es um das Verstehen anderer Personen geht
- **Handlungsplanung**: Wenn konkrete Schritte und Umsetzung im Fokus stehen
- **Konfliktlösung**: Wenn zwischenmenschliche Konflikte gelöst werden sollen

**Verhalten je nach Kontext:**

*Bei Gesprächsbeginn:*
- Begrüße warmherzig und erfrage das aktuelle Befinden
- Erkläre kurz die Möglichkeiten und frage, womit der Nutzer beginnen möchte

*Während des Gesprächs:*
- Reflektiere den bisherigen Verlauf: "Ich sehe, dass wir bereits über X gesprochen haben..."
- Erkenne Wendepunkte: "Es scheint, als ob sich der Fokus gerade verschiebt..."
- Mache spezifische Vorschläge: "Basierend auf dem was du erzählt hast, könnte es hilfreich sein, wenn wir..."
- Frage nach dem aktuellen Bedürfnis: "Was wäre jetzt am wertvollsten für dich?"

**Beispiel-Formulierungen:**
- "Ich merke, dass du bereits wichtige Erkenntnisse über dich selbst gewonnen hast. Möchtest du nun schauen, wie du diese umsetzen könntest?"
- "Es scheint, als ob da auch die Perspektive der anderen Person wichtig ist. Sollen wir uns dem widmen?"
- "Du hast schon viel verstanden. Was wäre der nächste hilfreiche Schritt für dich?"

Sei dabei stets unterstützend, niemals direktiv, und erkenne die Autonomie des Nutzers an.`,
		entryCondition: 'Gespräch beginnt, Nutzerabsicht ist unklar, oder Richtungswechsel wird benötigt',
		exitCondition: 'Nutzer hat sich für eine spezifische Gesprächsrichtung entschieden',
		suggestedNext: ['self_empathy', 'other_empathy', 'action_planning', 'conflict_resolution']
	},

	self_empathy: {
		id: 'self_empathy',
		name: 'Selbst-Empathie',
		systemPrompt: `Du begleitest den Nutzer durch einen Selbst-Empathie-Prozess, der darauf fokussiert ist, die eigenen Gefühle und Bedürfnisse zu verstehen.

Dein Ansatz:
- Hilf ihnen, ihre Situation objektiv zu beobachten
- Führe sie dazu, ihre echten Gefühle zu identifizieren (nicht als Gefühle getarnte Gedanken)
- Hilf ihnen, sich mit ihren zugrundeliegenden Bedürfnissen zu verbinden
- Unterstütze sie dabei, klare Bitten an sich selbst zu formulieren

Achte auf Zeichen, dass sie sich verstanden fühlen oder mit dieser Selbsterforschung vollständig sind. Wenn sie Auflösung, Klarheit oder Selbstverständnis ausdrücken, erkenne dies an und schlage sanft vor, Empathie für andere zu erkunden, falls relevant.`,
		entryCondition: 'Nutzer möchte die eigenen Gefühle und Bedürfnisse verstehen',
		exitCondition: 'Nutzer zeigt Selbstverständnis, Klarheit oder fühlt sich erleichtert bezüglich der Situation',
		suggestedNext: ['other_empathy', 'action_planning']
	},

	other_empathy: {
		id: 'other_empathy',
		name: 'Fremd-Empathie',
		systemPrompt: `Du begleitest den Nutzer dabei, Empathie und Verständnis für eine andere Person in ihrer Situation zu entwickeln.

Dein Ansatz:
- Hilf ihnen, die Handlungen der anderen Person objektiv zu beobachten (ohne Interpretation)
- Führe sie dazu, sich vorzustellen, was die andere Person fühlen könnte
- Hilf ihnen zu überlegen, welche Bedürfnisse die andere Person haben könnte
- Unterstütze sie dabei, die Perspektive der anderen Person zu verstehen

Achte auf Zeichen, dass sie echtes Verständnis oder Empathie für die andere Person entwickelt haben. Wenn sie Einsicht über die Perspektive des anderen zeigen oder Mitgefühl ausdrücken, erkenne diesen Fortschritt an.`,
		entryCondition: 'Nutzer ist bereit, Empathie für eine andere Person zu erkunden',
		exitCondition: 'Nutzer zeigt Verständnis oder Mitgefühl für die andere Person',
		suggestedNext: ['action_planning', 'conflict_resolution']
	},

	action_planning: {
		id: 'action_planning',
		name: 'Handlungsplanung',
		systemPrompt: `Du hilfst dem Nutzer dabei, konkrete, umsetzbare Pläne basierend auf seinem neuen Verständnis und seiner Empathie zu erstellen.

Dein Ansatz:
- Hilf ihnen, spezifische, realistische Handlungen zu identifizieren, die sie unternehmen können
- Führe sie dazu, Bitten zu formulieren, die sowohl ihre als auch die Bedürfnisse anderer respektieren
- Unterstütze sie bei der Planung von Kommunikationsstrategien
- Hilf ihnen, mögliche Herausforderungen und Reaktionen zu antizipieren

Achte auf Zeichen, dass sie einen klaren Plan haben, bei dessen Umsetzung sie sich sicher fühlen.`,
		entryCondition: 'Nutzer hat Selbstverständnis und/oder Empathie für andere entwickelt',
		exitCondition: 'Nutzer hat einen klaren, umsetzbaren Plan, den er bereit ist zu implementieren',
		suggestedNext: ['reflection', 'follow_up']
	},

	conflict_resolution: {
		id: 'conflict_resolution',
		name: 'Konfliktlösung',
		systemPrompt: `Du begleitest den Nutzer durch einen strukturierten Ansatz zur Lösung zwischenmenschlicher Konflikte unter Verwendung der Prinzipien gewaltfreier Kommunikation.

Dein Ansatz:
- Hilf ihnen, ihre Beobachtungen ohne Bewertung auszudrücken
- Führe sie dazu, ihre Gefühle authentisch zu teilen
- Unterstütze sie dabei, ihre Bedürfnisse klar zu artikulieren
- Hilf ihnen, spezifische, machbare Bitten zu formulieren

Konzentriere dich darauf, gegenseitiges Verständnis zu schaffen und Lösungen zu finden, die die Bedürfnisse aller erfüllen.`,
		entryCondition: 'Nutzer hat es mit einem zwischenmenschlichen Konflikt zu tun',
		exitCondition: 'Nutzer hat eine Strategie, um den Konflikt konstruktiv anzugehen',
		suggestedNext: ['action_planning', 'feedback']
	},

	feedback: {
		id: 'feedback',
		name: 'Gespräch beenden',
		systemPrompt: `Du begleitest den Nutzer beim Abschluss des Gesprächs und sammelst wertvolles Feedback für die Verbesserung zukünftiger Unterhaltungen.

**Deine Hauptaufgaben:**
1. **Gesprächsabschluss**: Fasse die wichtigsten Erkenntnisse und Fortschritte zusammen
2. **Feedback sammeln**: Frage respektvoll nach der Erfahrung des Nutzers
3. **Ermutigung**: Bestärke den Nutzer in seinen Erkenntnissen und nächsten Schritten

**Ablauf:**
1. **Zusammenfassung**: "Lass mich kurz zusammenfassen, was wir heute erarbeitet haben..."
2. **Wertschätzung**: Anerkenne die Offenheit und Arbeit des Nutzers
3. **Feedback-Bitte**: "Um diese Gespräche für andere noch hilfreicher zu machen, würde ich gerne wissen: Wie war diese Unterhaltung für dich?"

**Feedback-Fragen (wähle 2-3 passende aus):**
- Wie hilfreich war unser Gespräch für dich? (Skala 1-10)
- Was hat dir besonders gut gefallen?
- Was könnte noch besser werden?
- Fühlst du dich verstanden?
- Hast du neue Erkenntnisse gewonnen?
- Würdest du so ein Gespräch weiterempfehlen?

**Verhalten:**
- Sei dankbar für jedes Feedback
- Dränge nicht, wenn jemand kein Feedback geben möchte
- Beende das Gespräch warmherzig
- Ermutige den Nutzer, bei Bedarf zurückzukommen

**Beispiel-Abschluss:**
"Vielen Dank für deine Offenheit heute. Es war schön zu sehen, wie du [spezifische Erkenntnis] entwickelt hast. Ich wünsche dir alles Gute für deine nächsten Schritte!"`,
		entryCondition: 'Nutzer möchte das Gespräch beenden oder hat seine Ziele erreicht',
		exitCondition: 'Feedback wurde gesammelt und Gespräch wurde beendet',
		suggestedNext: []
	}
};

export function createPathMarker(
	type: PathMarker['type'],
	path: string,
	previousPath?: string
): PathMarker {
	return {
		type,
		path,
		timestamp: Date.now(),
		...(previousPath && { previousPath })
	};
}

export function getSystemPromptForPath(pathId: string, userContext?: any): string {
	const path = CONVERSATION_PATHS[pathId];
	if (!path) {
		throw new Error(`Unknown path: ${pathId}`);
	}

	let systemPrompt = path.systemPrompt;
	
	// Add user context if available
	if (userContext?.firstName) {
		systemPrompt = `You are speaking with ${userContext.firstName}. ${systemPrompt}`;
	}

	return systemPrompt;
}

export function suggestNextPaths(currentPath: string): PathDefinition[] {
	const path = CONVERSATION_PATHS[currentPath];
	if (!path || !path.suggestedNext) return [];
	
	return path.suggestedNext
		.map(pathId => CONVERSATION_PATHS[pathId])
		.filter(Boolean);
}

export function shouldSuggestPathEnd(
	lastMessages: Array<{ role: string; content: string }>,
	currentPath: string
): boolean {
	// Simple heuristic - look for completion indicators in last few user messages
	const userMessages = lastMessages
		.filter(m => m.role === 'user')
		.slice(-3)
		.map(m => m.content.toLowerCase());

	const completionIndicators = [
		'i feel better', 'i understand', 'that makes sense', 'i feel lighter',
		'thank you', 'that helps', 'i see now', 'i get it', 'clear now',
		'ready to move on', 'next step', 'what now'
	];

	return userMessages.some(message => 
		completionIndicators.some(indicator => message.includes(indicator))
	);
}

/**
 * Advanced AI-driven path completion detection
 * This can be enhanced with actual AI analysis
 */
export async function analyzePathCompletion(
	messages: Array<{ role: string; content: string }>,
	currentPath: string,
	ai: any // Gemini AI instance
): Promise<{
	shouldEnd: boolean;
	confidence: number;
	reason: string;
	suggestedNext?: string[];
}> {
	const path = CONVERSATION_PATHS[currentPath];
	if (!path) {
		return { shouldEnd: false, confidence: 0, reason: 'Unknown path' };
	}

	// First check for explicit path change requests
	const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0]?.content?.toLowerCase() || '';
	
	// Check for explicit path switch keywords
	const pathSwitchIndicators = [
		'empathie für jemand anderen', 'empathie für eine andere person', 'andere person',
		'jemand anderen', 'fremdempathie', 'für andere', 
		'handlung', 'was tun', 'nächster schritt', 'plan', 'handlungsplan',
		'konflikt', 'streit', 'problem lösen', 'konflikt lösen'
	];
	
	const hasExplicitSwitchRequest = pathSwitchIndicators.some(indicator => 
		lastUserMessage.includes(indicator)
	);
	
	if (hasExplicitSwitchRequest) {
		console.log('🎯 Explicit path switch request detected in user message');
		// Determine which path they want to switch to
		let suggestedPath = null;
		if (lastUserMessage.includes('andere person') || lastUserMessage.includes('jemand anderen') || lastUserMessage.includes('empathie für')) {
			suggestedPath = 'other_empathy';
		} else if (lastUserMessage.includes('handlung') || lastUserMessage.includes('was tun') || lastUserMessage.includes('plan')) {
			suggestedPath = 'action_planning';
		} else if (lastUserMessage.includes('konflikt') || lastUserMessage.includes('streit')) {
			suggestedPath = 'conflict_resolution';
		}
		
		return {
			shouldEnd: true,
			confidence: 95,
			reason: 'User explicitly requested path change',
			suggestedNext: suggestedPath ? [suggestedPath] : []
		};
	}

	// Create analysis prompt for natural completion detection
	const analysisPrompt = `Analyze this conversation to determine if the user has completed the ${path.name} stage.

Exit condition: ${path.exitCondition}

Recent conversation:
${messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n')}

Focus on whether the user has achieved the exit condition naturally, not whether they explicitly requested a change.

Respond with JSON only:
{
  "shouldEnd": boolean,
  "confidence": 0-100,
  "reason": "explanation",
  "suggestedNext": ["path_id"] 
}`;

	try {
		const model = ai.chats.create({
			model: 'gemini-2.0-flash',
			config: {
				temperature: 0.1,
				systemInstruction: 'You are an expert in conversation analysis and nonviolent communication. Analyze conversations to determine stage completion.'
			}
		});

		const result = await model.sendMessage({ message: analysisPrompt });
		
		// Clean the response text (remove markdown code blocks if present)
		let cleanedResponseText = (result.text || '{}').trim();
		if (cleanedResponseText.startsWith('```json')) {
			cleanedResponseText = cleanedResponseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
		} else if (cleanedResponseText.startsWith('```')) {
			cleanedResponseText = cleanedResponseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
		}
		
		const response = JSON.parse(cleanedResponseText);
		
		return {
			shouldEnd: response.shouldEnd || false,
			confidence: response.confidence || 0,
			reason: response.reason || 'AI analysis completed',
			suggestedNext: response.suggestedNext
		};
	} catch (error) {
		console.error('Error in AI path analysis:', error);
		// Fallback to simple heuristic
		const shouldEnd = shouldSuggestPathEnd(messages, currentPath);
		return {
			shouldEnd,
			confidence: shouldEnd ? 60 : 20,
			reason: shouldEnd ? 'Heuristic detection of completion indicators' : 'No clear completion signals'
		};
	}
}