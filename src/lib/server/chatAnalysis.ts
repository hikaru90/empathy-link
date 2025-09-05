/**
 * Automatische Gesprächsanalyse ohne benutzeridentifizierbare Informationen
 * Analysiert Gesprächsfluss, Orchestrator-Effektivität und GFK-Konformität
 */

import { ai } from './gemini';
import { pb } from '$scripts/pocketbase';

export interface ChatAnalysisResult {
	// Gesprächsfluss-Analyse
	conversationFlow: {
		totalMessages: number;
		pathSwitches: number;
		averageMessagesPerPath: number;
		pathSequence: string[];
		flowRating: number; // 1-10
		flowExplanation: string;
	};
	
	// Orchestrator-Effektivität
	orchestratorEffectiveness: {
		switchAccuracy: number; // 1-10
		switchTiming: number; // 1-10
		userGuidance: number; // 1-10
		overallEffectiveness: number; // 1-10
		improvements: string[];
	};
	
	// GFK-Konformität
	nvcCompliance: {
		observationVsEvaluation: number; // 1-10
		feelingsVsThoughts: number; // 1-10
		needsVsStrategies: number; // 1-10
		requestsVsDemands: number; // 1-10
		overallCompliance: number; // 1-10
		strengthsAndWeaknesses: string;
	};
	
	// Allgemeine Bewertung
	overallAssessment: {
		conversationQuality: number; // 1-10
		userEngagement: number; // 1-10
		goalAchievement: number; // 1-10
		recommendedImprovements: string[];
	};
}

/**
 * Anonymisiert Gesprächsdaten durch Entfernung aller benutzeridentifizierbaren Informationen
 */
export const anonymizeConversation = (history: any[]): string => {
	return history
		.filter(msg => !msg.hidden && !msg.pathMarker && msg.parts?.[0]?.text?.trim())
		.map((msg, index) => {
			const role = msg.role === 'user' ? 'Nutzer' : 'AI';
			let text = msg.parts[0].text;
			
			// Entferne potentiell identifizierbare Informationen
			text = text
				.replace(/\b[A-Z][a-z]+\b/g, '[NAME]') // Namen
				.replace(/\b\d{1,2}\.\d{1,2}\.\d{2,4}\b/g, '[DATUM]') // Daten
				.replace(/\b\d{10,}\b/g, '[NUMMER]') // Lange Zahlen
				.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]') // E-Mails
				.replace(/\b(?:ich heiße|mein name ist|ich bin)\s+[A-Z][a-z]+/gi, 'ich heiße [NAME]'); // Explizite Namen
			
			return `${role}: ${text}`;
		})
		.join('\n\n');
};

/**
 * Extrahiert Pfad-Sequenz aus dem Gesprächsverlauf
 */
export const extractPathSequence = (history: any[]): string[] => {
	const pathSequence: string[] = [];
	
	for (const msg of history) {
		if (msg.pathMarker) {
			if (msg.pathMarker.type === 'path_start') {
				pathSequence.push(msg.pathMarker.path);
			} else if (msg.pathMarker.type === 'path_switch') {
				pathSequence.push(msg.pathMarker.path);
			}
		}
	}
	
	return pathSequence;
};

/**
 * Analysiert den gesamten Gesprächsfluss automatisch
 */
export const analyzeChatFlow = async (
	chatId: string, 
	history: any[], 
	locale: string = 'de'
): Promise<ChatAnalysisResult> => {
	console.log('🔍 Starte automatische Gesprächsanalyse für Chat:', chatId);
	
	// Anonymisiere Gesprächsdaten
	const anonymizedConversation = anonymizeConversation(history);
	const pathSequence = extractPathSequence(history);
	
	// Grundlegende Statistiken
	const totalMessages = history.filter(msg => !msg.hidden && !msg.pathMarker && msg.parts?.[0]?.text?.trim()).length;
	const pathSwitches = pathSequence.length - 1;
	const averageMessagesPerPath = pathSwitches > 0 ? totalMessages / pathSequence.length : totalMessages;
	
	console.log('📊 Grundstatistiken:', { totalMessages, pathSwitches, pathSequence });
	
	// AI-basierte Analyse
	const analysisPrompt = `
Analysiere diese anonymisierte Gesprächsunterhaltung basierend auf den Prinzipien der Gewaltfreien Kommunikation und effektiver Gesprächsführung.

**Gesprächsdaten (anonymisiert):**
${anonymizedConversation}

**Pfad-Sequenz:**
${pathSequence.join(' → ')}

**Zu analysierende Aspekte:**

1. **Gesprächsfluss (1-10 Punkte):**
   - War der Übergang zwischen den Themen natürlich?
   - Wurde der Nutzer angemessen geführt?
   - Gab es logische Brüche oder Verwirrung?

2. **Orchestrator-Effektivität (1-10 Punkte):**
   - Waren die Pfadwechsel zur richtigen Zeit?
   - Wurden hilfreiche Richtungsvorschläge gemacht?
   - War die Meta-Führung angemessen?

3. **GFK-Konformität (1-10 Punkte):**
   - Beobachtung vs. Bewertung
   - Gefühle vs. Gedanken  
   - Bedürfnisse vs. Strategien
   - Bitten vs. Forderungen

4. **Allgemeine Qualität (1-10 Punkte):**
   - Engagement des Nutzers
   - Zielerreichung
   - Gesprächsqualität

**Antworte ausschließlich mit einem JSON-Objekt in diesem exakten Format:**

{
  "conversationFlow": {
    "flowRating": 8,
    "flowExplanation": "Das Gespräch folgte einer natürlichen Progression..."
  },
  "orchestratorEffectiveness": {
    "switchAccuracy": 7,
    "switchTiming": 8,
    "userGuidance": 9,
    "overallEffectiveness": 8,
    "improvements": ["Frühere Erkennung von...", "Bessere Vorbereitung auf..."]
  },
  "nvcCompliance": {
    "observationVsEvaluation": 8,
    "feelingsVsThoughts": 7,
    "needsVsStrategies": 9,
    "requestsVsDemands": 8,
    "overallCompliance": 8,
    "strengthsAndWeaknesses": "Stärken: Klare Bedürfnisartikulation. Schwächen: Gelegentliche Bewertungen statt Beobachtungen."
  },
  "overallAssessment": {
    "conversationQuality": 8,
    "userEngagement": 9,
    "goalAchievement": 7,
    "recommendedImprovements": ["Mehr Zeit für...", "Stärkere Fokussierung auf..."]
  }
}`;

	try {
		const analysisChat = ai.chats.create({
			model: 'gemini-2.5-flash',
			config: {
				temperature: 0.1, // Niedrige Temperatur für konsistente Analyse
				systemInstruction: 'Du bist ein Experte für Gesprächsanalyse und Gewaltfreie Kommunikation. Analysiere Gespräche objektiv und konstruktiv.'
			}
		});

		const result = await analysisChat.sendMessage({ message: analysisPrompt });
		const responseText = result.text || '';
		
		console.log('🤖 AI-Analyse Rohantwort:', responseText.substring(0, 200) + '...');
		
		// Parse JSON response
		let cleanedResponseText = responseText.trim();
		if (cleanedResponseText.startsWith('```json')) {
			cleanedResponseText = cleanedResponseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
		} else if (cleanedResponseText.startsWith('```')) {
			cleanedResponseText = cleanedResponseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
		}
		
		const aiAnalysis = JSON.parse(cleanedResponseText);
		
		// Kombiniere AI-Analyse mit Grundstatistiken
		const fullAnalysis: ChatAnalysisResult = {
			conversationFlow: {
				totalMessages,
				pathSwitches,
				averageMessagesPerPath: Math.round(averageMessagesPerPath * 10) / 10,
				pathSequence,
				flowRating: aiAnalysis.conversationFlow.flowRating,
				flowExplanation: aiAnalysis.conversationFlow.flowExplanation
			},
			orchestratorEffectiveness: aiAnalysis.orchestratorEffectiveness,
			nvcCompliance: aiAnalysis.nvcCompliance,
			overallAssessment: aiAnalysis.overallAssessment
		};
		
		console.log('✅ Gesprächsanalyse abgeschlossen:', {
			flowRating: fullAnalysis.conversationFlow.flowRating,
			effectiveness: fullAnalysis.orchestratorEffectiveness.overallEffectiveness,
			nvcCompliance: fullAnalysis.nvcCompliance.overallCompliance,
			quality: fullAnalysis.overallAssessment.conversationQuality
		});
		
		return fullAnalysis;
		
	} catch (error) {
		console.error('❌ Fehler bei der Gesprächsanalyse:', error);
		
		// Fallback-Analyse mit Grundstatistiken
		return {
			conversationFlow: {
				totalMessages,
				pathSwitches,
				averageMessagesPerPath: Math.round(averageMessagesPerPath * 10) / 10,
				pathSequence,
				flowRating: 5,
				flowExplanation: 'Automatische Analyse fehlgeschlagen - nur Grundstatistiken verfügbar'
			},
			orchestratorEffectiveness: {
				switchAccuracy: 5,
				switchTiming: 5,
				userGuidance: 5,
				overallEffectiveness: 5,
				improvements: ['Analyse-Fehler - keine spezifischen Verbesserungen verfügbar']
			},
			nvcCompliance: {
				observationVsEvaluation: 5,
				feelingsVsThoughts: 5,
				needsVsStrategies: 5,
				requestsVsDemands: 5,
				overallCompliance: 5,
				strengthsAndWeaknesses: 'Analyse fehlgeschlagen'
			},
			overallAssessment: {
				conversationQuality: 5,
				userEngagement: 5,
				goalAchievement: 5,
				recommendedImprovements: ['Analyse-System überprüfen']
			}
		};
	}
};

/**
 * Speichert Feedback und Analyse-Ergebnisse in einem einzigen chatFeedback-Record
 */
export const saveChatFeedback = async (
	chatId: string,
	analysis: ChatAnalysisResult,
	userFeedback?: any,
	userId?: string
): Promise<string> => {
	try {
		console.log('💾 Preparing to save feedback record...');
		console.log('💾 ChatId:', chatId);
		console.log('💾 UserId:', userId);
		console.log('💾 Has userFeedback:', !!userFeedback);
		console.log('💾 Analysis summary:', {
			conversationQuality: analysis.overallAssessment.conversationQuality,
			nvcCompliance: analysis.nvcCompliance.overallCompliance,
			orchestratorEffectiveness: analysis.orchestratorEffectiveness.overallEffectiveness
		});

		const feedbackData = {
			chatId,
			userId: userId || null,
			submittedAt: new Date().toISOString(),
			analyzedAt: new Date().toISOString(),
			
			// User-Feedback-Felder (nullable wenn kein Feedback)
			helpfulness: userFeedback?.helpfulness || null,
			understanding: userFeedback?.understanding || null,
			newInsights: userFeedback?.newInsights || null,
			wouldRecommend: userFeedback?.wouldRecommend || null,
			bestAspects: userFeedback?.bestAspects || null,
			improvements: userFeedback?.improvements || null,
			additionalComments: userFeedback?.additionalComments || null,
			
			// Automatische Analyse (immer vorhanden)
			automaticAnalysis: analysis,
			conversationQuality: analysis.overallAssessment.conversationQuality,
			nvcCompliance: analysis.nvcCompliance.overallCompliance,
			orchestratorEffectiveness: analysis.orchestratorEffectiveness.overallEffectiveness,
			pathSwitches: analysis.conversationFlow.pathSwitches,
			totalMessages: analysis.conversationFlow.totalMessages
		};

		console.log('💾 Creating record with data keys:', Object.keys(feedbackData));
		const record = await pb.collection('chatFeedback').create(feedbackData);
		
		console.log('💾 Feedback und Gesprächsanalyse gespeichert:', record.id);
		return record.id;
		
	} catch (error) {
		console.error('❌ Fehler beim Speichern des Feedbacks:', error);
		if (error instanceof Error) {
			console.error('❌ Error details:', error.message);
			console.error('❌ Stack trace:', error.stack);
		}
		throw error;
	}
};