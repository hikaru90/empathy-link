import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$scripts/pocketbase';
import { getCurrentPath } from '$lib/server/gemini';
import { encryptChatHistory, decryptChatHistory } from '$lib/utils/chatEncryption.js';

// Helper function to extract feedback from conversation (moved from send endpoint)
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

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { chatId } = await request.json();
		if (!chatId) {
			return json({ error: 'Missing chatId' }, { status: 400 });
		}

		console.log('📝 Processing feedback for chat:', chatId);

		// Check if we're in feedback path
		const currentPath = getCurrentPath(chatId);
		if (currentPath?.activePath !== 'feedback') {
			console.log('📝 Not in feedback path, no processing needed');
			return json({ feedbackSaved: false, message: 'Not in feedback path' });
		}

		// Get chat from database
		const chat = await pb.collection('chats').getOne(chatId);
		if (!chat) {
			return json({ error: 'Chat not found' }, { status: 404 });
		}
		
		// Decrypt chat history before processing
		if (chat.history) {
			chat.history = decryptChatHistory(chat.history);
		}

		// Verify user owns chat
		if (chat.user !== user.id) {
			return json({ error: 'Unauthorized access to chat' }, { status: 403 });
		}

		// Check if feedback already processed
		if (chat.feedbackId) {
			const existingFeedback = await pb.collection('chatFeedback').getOne(chat.feedbackId);
			if (existingFeedback.feedbackCompletedAt) {
				console.log('📝 Feedback already processed');
				return json({ feedbackSaved: false, message: 'Feedback already processed' });
			}
		}

		// Extract feedback from conversation
		const extractedFeedback = extractFeedbackFromConversation(chat.history);
		if (!extractedFeedback) {
			console.log('📝 Could not extract complete feedback from conversation');
			return json({ feedbackSaved: false, message: 'Incomplete feedback' });
		}

		console.log('📝 Complete user feedback extracted, updating feedback record...');

		if (chat.feedbackId) {
			// Update the existing feedback record with user responses
			await pb.collection('chatFeedback').update(chat.feedbackId, {
				helpfulness: extractedFeedback.helpfulness || null,
				understanding: extractedFeedback.understanding !== undefined ? extractedFeedback.understanding : null,
				newInsights: extractedFeedback.newInsights !== undefined ? extractedFeedback.newInsights : null,
				wouldRecommend: extractedFeedback.wouldRecommend !== undefined ? extractedFeedback.wouldRecommend : null,
				bestAspects: extractedFeedback.bestAspects || null,
				improvements: extractedFeedback.improvements || null,
				additionalComments: extractedFeedback.additionalComments || null,
				feedbackCompletedAt: new Date().toISOString()
			});

			// Add confirmation message to chat history
			const updatedHistory = [...chat.history];
			updatedHistory.push({
				role: 'model',
				parts: [{ text: `_Dein Feedback wurde gespeichert_ ✅` }],
				timestamp: Date.now(),
				feedbackConfirmation: true,
				hidden: false
			});

			// Update chat with new history including feedback confirmation (encrypt before storing)
			await pb.collection('chats').update(chatId, { history: encryptChatHistory(updatedHistory) });

			console.log('✅ Complete user feedback successfully stored in feedback record:', chat.feedbackId);
			
			return json({ 
				feedbackSaved: true, 
				feedbackData: extractedFeedback,
				message: 'Feedback processed successfully' 
			});
		} else {
			console.log('⚠️ No feedback record found to update');
			return json({ feedbackSaved: false, message: 'No feedback record found' });
		}

	} catch (error) {
		console.error('❌ Error processing feedback:', error);
		return json({ error: 'Failed to process feedback' }, { status: 500 });
	}
};