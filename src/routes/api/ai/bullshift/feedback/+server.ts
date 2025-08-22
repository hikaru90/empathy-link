import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$scripts/pocketbase';
import { analyzeChatFlow, saveChatFeedback } from '$lib/server/chatAnalysis';

export interface UserFeedback {
	helpfulness: number; // 1-10
	understanding: boolean;
	newInsights: boolean;
	wouldRecommend: boolean;
	bestAspects: string;
	improvements: string;
	additionalComments: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { chatId, feedback, locale } = await request.json();

		if (!chatId) {
			return json({ error: 'Missing chatId' }, { status: 400 });
		}

		console.log('📝 Feedback erhalten für Chat:', chatId);

		// Chat aus Datenbank laden
		const chat = await pb.collection('chats').getOne(chatId);
		if (!chat) {
			return json({ error: 'Chat not found' }, { status: 404 });
		}

		// Verifikation: Benutzer gehört Chat
		if (chat.user !== user.id) {
			return json({ error: 'Unauthorized access to chat' }, { status: 403 });
		}

		// Prüfe ob bereits eine automatische Analyse existiert
		let analysisResult;
		let feedbackRecordId;
		
		if (chat.feedbackId) {
			// Analyse bereits vorhanden - aktualisiere mit User-Feedback
			console.log('📝 Bestehende Analyse gefunden - füge User-Feedback hinzu');
			
			if (feedback) {
				const existingRecord = await pb.collection('chatFeedback').update(chat.feedbackId, {
					// User-Feedback-Felder aktualisieren
					helpfulness: feedback.helpfulness || null,
					understanding: feedback.understanding || null,
					newInsights: feedback.newInsights || null,
					wouldRecommend: feedback.wouldRecommend || null,
					bestAspects: feedback.bestAspects || null,
					improvements: feedback.improvements || null,
					additionalComments: feedback.additionalComments || null
				});
				
				feedbackRecordId = existingRecord.id;
				console.log('💾 User-Feedback zu bestehender Analyse hinzugefügt');
			} else {
				feedbackRecordId = chat.feedbackId;
			}
			
			// Bestehende Analyse für Antwort laden
			const existingFeedback = await pb.collection('chatFeedback').getOne(chat.feedbackId);
			analysisResult = existingFeedback.automaticAnalysis;
		} else {
			// Neue Analyse erstellen
			console.log('🔍 Starte neue automatische Gesprächsanalyse...');
			analysisResult = await analyzeChatFlow(chatId, chat.history, locale || 'de');

			// Benutzer-Feedback und Analyse in einem Record speichern
			feedbackRecordId = await saveChatFeedback(
				chatId, 
				analysisResult, 
				feedback, // kann null sein
				user.id
			);
		}

		// Chat als feedback-analysiert markieren
		await pb.collection('chats').update(chatId, {
			feedbackReceived: true,
			feedbackReceivedAt: new Date().toISOString(),
			feedbackId: feedbackRecordId
		});

		console.log('✅ Feedback-Verarbeitung abgeschlossen');

		return json({
			success: true,
			feedbackId: feedbackRecordId,
			analysisResult: {
				conversationQuality: analysisResult.overallAssessment.conversationQuality,
				nvcCompliance: analysisResult.nvcCompliance.overallCompliance,
				orchestratorEffectiveness: analysisResult.orchestratorEffectiveness.overallEffectiveness,
				// Keine detaillierten Daten an Frontend senden
			}
		});

	} catch (error) {
		console.error('❌ Fehler bei Feedback-Verarbeitung:', error);
		return json({ error: 'Failed to process feedback' }, { status: 500 });
	}
};

// GET endpoint für Feedback-Statistiken (nur für Administratoren)
export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const user = locals.user;
		if (!user || !user.isAdmin) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const period = url.searchParams.get('period') || '7d'; // 7d, 30d, 90d
		
		// Berechne Datum basierend auf Zeitraum
		const now = new Date();
		const daysBack = period === '30d' ? 30 : period === '90d' ? 90 : 7;
		const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

		// Alle Feedback-Records (mit und ohne User-Feedback)
		const allStats = await pb.collection('chatFeedback').getList(1, 1000, {
			filter: `submittedAt >= "${startDate.toISOString()}"`,
			sort: '-submittedAt'
		});

		// Filter für Records mit User-Feedback
		const feedbackStats = {
			items: allStats.items.filter(item => item.helpfulness !== null),
			totalItems: allStats.items.filter(item => item.helpfulness !== null).length
		};

		// Alle Records haben automatische Analyse
		const analysisStats = allStats;

		// Aggregierte Statistiken berechnen
		const avgHelpfulness = feedbackStats.items.reduce((sum, item) => 
			sum + (item.helpfulness || 0), 0) / Math.max(feedbackStats.items.length, 1);

		const avgConversationQuality = analysisStats.items.reduce((sum, item) => 
			sum + (item.conversationQuality || 0), 0) / Math.max(analysisStats.items.length, 1);

		const avgNvcCompliance = analysisStats.items.reduce((sum, item) => 
			sum + (item.nvcCompliance || 0), 0) / Math.max(analysisStats.items.length, 1);

		const avgOrchestratorEffectiveness = analysisStats.items.reduce((sum, item) => 
			sum + (item.orchestratorEffectiveness || 0), 0) / Math.max(analysisStats.items.length, 1);

		return json({
			period,
			statistics: {
				totalFeedbacks: feedbackStats.totalItems,
				totalAnalyses: analysisStats.totalItems,
				averageHelpfulness: Math.round(avgHelpfulness * 10) / 10,
				averageConversationQuality: Math.round(avgConversationQuality * 10) / 10,
				averageNvcCompliance: Math.round(avgNvcCompliance * 10) / 10,
				averageOrchestratorEffectiveness: Math.round(avgOrchestratorEffectiveness * 10) / 10,
				recommendationRate: feedbackStats.items.filter(item => 
					item.wouldRecommend).length / Math.max(feedbackStats.items.length, 1)
			},
			recentFeedbacks: feedbackStats.items.slice(0, 10).map(item => ({
				id: item.id,
				helpfulness: item.helpfulness,
				understanding: item.understanding,
				newInsights: item.newInsights,
				wouldRecommend: item.wouldRecommend,
				submittedAt: item.submittedAt
				// Keine Freitext-Kommentare für Datenschutz
			}))
		});

	} catch (error) {
		console.error('❌ Fehler beim Laden der Feedback-Statistiken:', error);
		return json({ error: 'Failed to load feedback statistics' }, { status: 500 });
	}
};