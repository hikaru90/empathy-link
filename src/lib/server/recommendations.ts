import { pb } from '$scripts/pocketbase';
import type { GoogleGenAI } from '@google/genai';

export interface RecommendationMatch {
	id: string;
	slug: string;
	title: string;
	description: string;
	category: string;
	confidence: number;
	reason: string;
}

export interface ContentPiece {
	id: string;
	slug: string;
	title: string;
	description: string;
	category: string;
	categoryName: string;
}

class RecommendationService {
	private cachedContent: ContentPiece[] = [];
	private lastCacheUpdate = 0;
	private cacheExpiry = 5 * 60 * 1000; // 5 minutes

	/**
	 * Get all learning content with caching
	 */
	private async getContent(): Promise<ContentPiece[]> {
		const now = Date.now();
		
		if (this.cachedContent.length > 0 && now - this.lastCacheUpdate < this.cacheExpiry) {
			return this.cachedContent;
		}

		try {
			const topics = await pb.collection('topics').getFullList({
				filter: '',
				sort: 'order',
				expand: 'currentVersion, currentVersion.category'
			});

			// Fetch detailed topic versions with category information
			const topicVersions = await pb.collection('topicVersions').getFullList({
				filter: topics.map(topic => `id = "${topic.currentVersion}"`).join(' || '),
				expand: 'category'
			});

			// Create lookup map for topic versions
			const versionMap = new Map();
			topicVersions.forEach(version => {
				versionMap.set(version.id, version);
			});

			this.cachedContent = topics.map(topic => {
				const version = versionMap.get(topic.currentVersion);
				return {
					id: topic.id,
					slug: topic.slug,
					title: version?.titleDE || version?.titleEN || 'Untitled',
					description: version?.descriptionDE || version?.descriptionEN || version?.summary || '',
					category: version?.category || '',
					categoryName: version?.expand?.category?.nameDE || version?.expand?.category?.nameEN || 'General'
				};
			});

			this.lastCacheUpdate = now;
			console.log('📚 Cached learning content:', this.cachedContent.length, 'items');
			
			return this.cachedContent;
		} catch (error) {
			console.error('❌ Error fetching learning content:', error);
			return this.cachedContent; // Return cached content on error
		}
	}

	/**
	 * Analyze conversation and generate recommendations using AI
	 */
	async generateRecommendations(
		userMessage: string, 
		aiResponse: string, 
		conversationContext: string,
		genAI: GoogleGenAI
	): Promise<RecommendationMatch[]> {
		try {
			const content = await this.getContent();
			
			if (content.length === 0) {
				console.log('📚 No learning content available for recommendations');
				return [];
			}

			// Create content summary for the AI prompt
			const contentSummary = content.map(c => 
				`ID: ${c.id} | Title: ${c.title} | Category: ${c.categoryName} | Description: ${c.description}`
			).join('\n');

			const prompt = `Analysiere das folgende Gespräch und empfehle NUR dann passende Lerninhalte, wenn der Nutzer ein EXPLIZITES Problem oder Lernbedürfnis äußert.

GESPRÄCH:
User: ${userMessage}
AI: ${aiResponse}

KONTEXT DER UNTERHALTUNG:
${conversationContext}

VERFÜGBARE LERNINHALTE:
${contentSummary}

WICHTIGE REGEL - EMPFEHLE NUR BEI EXPLIZITEN PROBLEMEN:
- Empfehle NUR wenn der Nutzer ausdrücklich sagt, dass er etwas nicht weiß, lernen möchte oder Hilfe braucht
- Empfehle NICHT bei normalen Gefühlsäußerungen wie "Ich bin traurig" oder "Ich fühle mich gut"
- Empfehle NICHT bei allgemeinen Gesprächen oder wenn jemand nur Gefühle beschreibt
- Empfehle NICHT nur weil Wörter wie "Gefühl", "Bedürfnis" oder ähnliches erwähnt werden

EMPFEHLE NUR BEI BEISPIELEN WIE:
- "Ich weiß nicht, was ich fühle"
- "Ich verstehe meine Bedürfnisse nicht"
- "Ich brauche Hilfe dabei, meine Gefühle zu verstehen"
- "Kannst du mir beibringen, wie ich..."
- "Ich möchte lernen, wie..."

EMPFEHLE NICHT BEI:
- "Ich bin traurig" 
- "Ich fühle mich schlecht"
- "Das macht mich wütend"
- Normalen Gefühlsbeschreibungen oder Situationsschilderungen

Antworte in folgendem JSON-Format:
{
  "recommendations": [
    {
      "id": "content-id",
      "confidence": 0.8,
      "reason": "Kurze Begründung warum dieser Inhalt relevant ist"
    }
  ]
}

STRENGE REGELN:
- Empfehle maximal 2 Inhalte
- Confidence sollte zwischen 0.7 und 1.0 liegen (höhere Schwelle als vorher)
- NUR empfehlen wenn der Nutzer EXPLIZIT um Hilfe bittet oder Unwissen äußert
- Reason sollte auf Deutsch und prägnant sein
- Falls KEINE explizite Lernabsicht erkennbar ist, gib IMMER ein leeres recommendations Array zurück`;

			const model = {
				model: 'gemini-2.0-flash-lite',
				config: {
					systemInstruction: prompt,
					responseMimeType: 'application/json',
					responseSchema: {
						type: 'object',
						properties: {
							recommendations: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id: { type: 'string' },
										confidence: { type: 'number' },
										reason: { type: 'string' }
									},
									required: ['id', 'confidence', 'reason']
								}
							}
						},
						required: ['recommendations']
					}
				}
			};

			const chat = genAI.chats.create(model);
			const result = await chat.sendMessage({ message: '' });
			const responseText = result.text;
			
			console.log('🤖 AI recommendation response:', responseText);

			// Parse AI response (structured output returns JSON directly)
			const aiAnalysis = JSON.parse(responseText || '{"recommendations": []}');
			const recommendations: RecommendationMatch[] = [];

			// Map AI recommendations to full content data
			for (const rec of aiAnalysis.recommendations || []) {
				const contentItem = content.find(c => c.id === rec.id);
				if (contentItem && rec.confidence >= 0.7) {
					recommendations.push({
						id: contentItem.id,
						slug: contentItem.slug,
						title: contentItem.title,
						description: contentItem.description,
						category: contentItem.categoryName,
						confidence: rec.confidence,
						reason: rec.reason
					});
				}
			}

			console.log('📚 Generated recommendations:', recommendations.length);
			return recommendations.sort((a, b) => b.confidence - a.confidence);

		} catch (error) {
			console.error('❌ Error generating recommendations:', error);
			return [];
		}
	}

	/**
	 * Get conversation context for better recommendations
	 */
	extractConversationContext(history: any[]): string {
		try {
			// Get last 10 messages for context
			const recentMessages = history
				.slice(-10)
				.filter(msg => !msg.pathMarker && !msg.hidden && msg.parts?.[0]?.text)
				.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.parts[0].text}`)
				.join('\n');

			return recentMessages || 'Keine Gesprächshistorie verfügbar';
		} catch (error) {
			console.error('❌ Error extracting conversation context:', error);
			return 'Fehler beim Extrahieren des Gesprächskontexts';
		}
	}

	/**
	 * Check if recommendations should be generated based on conversation state
	 */
	shouldGenerateRecommendations(
		currentPath: any, 
		userMessage: string, 
		aiResponse: string
	): boolean {
		// Don't recommend during feedback or other special paths
		if (currentPath?.activePath === 'feedback') {
			return false;
		}

		// Don't recommend for very short messages
		if (userMessage.length < 10 && aiResponse.length < 50) {
			return false;
		}

		// Don't recommend if AI response is just greeting or procedural
		const procedural = ['hallo', 'guten tag', 'willkommen', 'danke', 'tschüss'];
		const aiText = aiResponse.toLowerCase();
		if (procedural.some(word => aiText.includes(word) && aiText.length < 100)) {
			return false;
		}

		return true;
	}
}

export const recommendationService = new RecommendationService();