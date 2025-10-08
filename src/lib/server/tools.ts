import { pb } from '$scripts/pocketbase';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenAI, Type } from '@google/genai';
import type { GenerateContentResponse } from '@google/genai';
import type { State } from '$routes/api/ai/bullshift/send/+server';
import type { HistoryEntry } from '$routes/api/ai/selfempathy/initChat/+server';
import { m, setLocale } from '$lib/translations';
import { decryptChatHistory } from '$lib/utils/chatEncryption.js';

interface Chat {
	id: string;
	user: string;
	module: string;
	history: HistoryEntry[];
	feelings: string[];
	needs: string[];
	memoryProcessed: boolean;
	analyzed: boolean;
	analysis: string;
	created: string;
	updated: string;
}

// Load localized prompts
const loadPrompts = async (locale: string) => {
	const messages = await import(`../../../messages/${locale}.json`);
	return messages.default;
};

const getLocalizedPrompt = (promptKey: string, variables: Record<string, any> = {}) => {
	// Call the translation function directly with variables
	return m[`ai_prompts_${promptKey}` as keyof typeof m](variables);
};

export const analyzeChat = async (chatId: string, userId: string, locale: string, pb: any) => {
	try {
		console.log('🔍 [analyzeChat] START - chatId:', chatId, 'userId:', userId, 'locale:', locale);
		console.log('🔍 [analyzeChat] setLocale available:', typeof setLocale);

		console.log('🔍 [analyzeChat] Step 1: Fetching feelings from database');
		const feelingsRecords = await pb.collection('feelings').getFullList({
			sort: 'category,sort'
		});
		console.log('🔍 [analyzeChat] Step 1 SUCCESS: Fetched', feelingsRecords.length, 'feelings');

		// Always use German feelings and needs
		const feelings = feelingsRecords.map((feeling) => {
			return feeling.nameDE
		});

		console.log('🔍 [analyzeChat] Step 2: Fetching needs from database');
		const needsRecords = await pb.collection('needs').getFullList({
			sort: 'category,sort'
		});
		console.log('🔍 [analyzeChat] Step 2 SUCCESS: Fetched', needsRecords.length, 'needs');

		const needs = needsRecords.map((need) => {
			return need.nameDE
		});

		console.log('🔍 [analyzeChat] Step 3: Fetching chat record for chatId:', chatId);
		const chatRecord = await pb.collection('chats').getOne(chatId);
		console.log('🔍 [analyzeChat] Step 3 SUCCESS: Chat record found, history length:', chatRecord.history?.length || 0);

		console.log('🔍 [analyzeChat] Step 4: Decrypting chat history');
		const decryptedHistory = decryptChatHistory(chatRecord.history);
		console.log('🔍 [analyzeChat] Step 4 SUCCESS: Decrypted history length:', decryptedHistory.length);

		// Include both user and model messages for context, but exclude path markers and hidden messages
		console.log('🔍 [analyzeChat] Step 5: Filtering relevant messages');
		const relevantMessages = decryptedHistory
			.filter((chat: HistoryEntry) =>
				(chat.role === 'user' || chat.role === 'model') &&
				!chat.pathMarker &&
				!chat.hidden
			);
		console.log('🔍 [analyzeChat] Step 5 SUCCESS: Filtered to', relevantMessages.length, 'relevant messages');

		const concatenatedHistory = relevantMessages
			.map((chat: HistoryEntry) => JSON.stringify(chat))
			.join('\n');

		console.log('🔍 [analyzeChat] Step 6: Concatenated history length:', concatenatedHistory.length, 'characters');

		console.log('🔍 [analyzeChat] Step 7: Preparing system instruction with', feelings.length, 'feelings and', needs.length, 'needs');

		// Always use German locale for consistency
		setLocale('de');

		// Include full lists in message, with clear instructions not to echo them
		const message = `
Chat History:
${concatenatedHistory}

Available Feelings (select from these, DO NOT echo them back):
${feelings.join(', ')}

Available Needs (select from these, DO NOT echo them back):
${needs.join(', ')}

IMPORTANT: Your response must ONLY contain the JSON object with the analysis. Do NOT include the lists above in your response.
		`;

		// System instruction without the full lists
		const systemInstruction = getLocalizedPrompt('analyzeChat', {
			feelings: '[See message for full list]',
			needs: '[See message for full list]'
		});

		console.log('🔍 [analyzeChat] Step 7 SUCCESS: System instruction length:', systemInstruction.length, 'characters');

		// Always use German enum values
		const clarityEnumValues = ['Unspezifisch', 'Vage', 'Spezifisch & Umsetzbar'];

		console.log('🔍 [analyzeChat] Step 8: Initializing Gemini AI');
		const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
		const model = {
			model: 'gemini-2.0-flash-lite',
			config: {
				systemInstruction,
				responseMimeType: 'application/json',
				maxOutputTokens: 8192, // Increase token limit to prevent truncation
				temperature: 0.3, // Lower temperature for more structured output
				responseSchema: {
					type: Type.OBJECT,
					properties: {
						emotionalShift: {
							type: Type.STRING,
							description: 'Brief description of emotional journey (max 100 words)'
						},
						iStatementMuscle: {
							type: Type.NUMBER,
							description: 'Percentage (0-100) of I-statements vs You-statements usage'
						},
						clarityOfAsk: {
							type: Type.STRING,
							enum: clarityEnumValues,
							description: 'Clarity level of the final request'
						},
						empathyAttempt: {
							type: Type.BOOLEAN,
							description: 'Whether user tried to understand other person perspective'
						},
						feelingVocabulary: {
							type: Type.NUMBER,
							description: 'Number of distinct feeling words used'
						},
						dailyWin: {
							type: Type.STRING,
							description: 'Short encouraging statement (max 50 words)'
						},
						title: {
							type: Type.STRING,
							description: 'A short title for the session (max 10 words)'
						},
						observation: {
							type: Type.STRING,
							description: 'The factual observation as per NVC (concise, max 150 words)'
						},
						feelings: {
							type: Type.ARRAY,
							items: {
								type: Type.STRING,
							},
							description: 'Array of feeling words from the provided list'
						},
						needs: {
							type: Type.ARRAY,
							items: {
								type: Type.STRING,
							},
							description: 'Array of need words from the provided list'
						},
						request: {
							type: Type.STRING,
							description: 'The clearest actionable request (concise, max 100 words)'
						}
					},
					required: ['emotionalShift', 'iStatementMuscle', 'clarityOfAsk', 'empathyAttempt', 'feelingVocabulary', 'dailyWin', 'title', 'observation', 'feelings', 'needs', 'request']
				}
			}
		}
		console.log('🔍 [analyzeChat] Step 8 SUCCESS: Model configured with maxOutputTokens: 8192');

		console.log('🔍 [analyzeChat] Step 9: Creating chat and sending message to Gemini');
		const chat = ai.chats.create(model);
		const result = await chat.sendMessage({ message });
		console.log('🔍 [analyzeChat] Step 9 SUCCESS: Received response from Gemini');

		console.log('🔍 [analyzeChat] Step 10: Parsing Gemini response');
		const response = result.text;
		console.log('🔍 [analyzeChat] Step 10a: Response text length:', response?.length || 0);
		console.log('🔍 [analyzeChat] Step 10b: Response preview (first 500 chars):', response?.substring(0, 500));

		// If response is suspiciously long, log more details
		if (response && response.length > 5000) {
			console.error('⚠️ [analyzeChat] WARNING: Response is abnormally long!');
			console.error('⚠️ [analyzeChat] Response length:', response.length);
			console.error('⚠️ [analyzeChat] Response start:', response.substring(0, 1000));
			console.error('⚠️ [analyzeChat] Response end:', response.substring(response.length - 1000));
		}

		let responseJson;
		try {
			// Try to parse the response as-is first
			responseJson = JSON.parse(response || '{}');
			console.log('🔍 [analyzeChat] Step 10 SUCCESS: Parsed JSON response');
		} catch (parseError) {
			console.error('❌ [analyzeChat] Step 10 JSON parse error:', parseError.message);
			console.error('❌ [analyzeChat] Parse error position:', parseError.message.match(/position (\d+)/)?.[1]);
			console.error('❌ [analyzeChat] Full response length:', response?.length);
			console.error('❌ [analyzeChat] Response around error position:', response?.substring(26500, 26600));

			// Try to fix common JSON issues
			try {
				// Remove markdown code blocks if present
				let cleanedResponse = response.trim();
				if (cleanedResponse.startsWith('```json')) {
					cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
				} else if (cleanedResponse.startsWith('```')) {
					cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
				}

				// Try parsing the cleaned response
				responseJson = JSON.parse(cleanedResponse);
				console.log('🔍 [analyzeChat] Step 10 SUCCESS: Parsed cleaned JSON response');
			} catch (secondParseError) {
				console.error('❌ [analyzeChat] Step 10 Second parse attempt failed:', secondParseError.message);

				// If all else fails, return a safe fallback
				console.log('🔍 [analyzeChat] Using fallback empty response');
				responseJson = {
					emotionalShift: '',
					iStatementMuscle: 0,
					clarityOfAsk: 'Unspezifisch',
					empathyAttempt: false,
					feelingVocabulary: 0,
					dailyWin: '',
					title: '',
					observation: '',
					feelings: [],
					needs: [],
					request: ''
				};
			}
		}

		console.log('🔍 [analyzeChat] Step 10c: Response fields:', Object.keys(responseJson));
		console.log('🔍 [analyzeChat] Step 10d: observation:', responseJson.observation);
		console.log('🔍 [analyzeChat] Step 10e: feelings:', responseJson.feelings);
		console.log('🔍 [analyzeChat] Step 10f: needs:', responseJson.needs);
		console.log('🔍 [analyzeChat] Step 10g: request:', responseJson.request);

		console.log('🔍 [analyzeChat] Step 11: Saving trace for token usage tracking');
		// Save trace for token usage tracking
		saveTrace(
			'analyzeChat',
			message,
			'bullshift',
			chatId,
			userId,
			response,
			result,
			systemInstruction,
			pb
		);
		console.log('🔍 [analyzeChat] Step 11 SUCCESS: Trace saved');

		console.log('🔍 [analyzeChat] COMPLETE - Returning analysis result');
		return responseJson;
	} catch (error) {
		console.error('❌ [analyzeChat] ERROR at some step:', error);
		console.error('❌ [analyzeChat] Error name:', error?.name);
		console.error('❌ [analyzeChat] Error message:', error?.message);
		console.error('❌ [analyzeChat] Error stack:', error?.stack);
		console.error('❌ [analyzeChat] chatId:', chatId);
		console.error('❌ [analyzeChat] userId:', userId);
		console.error('❌ [analyzeChat] locale:', locale);

		// Return a safe fallback object to prevent the endpoint from crashing
		return {
			emotionalShift: '',
			iStatementMuscle: 0,
			clarityOfAsk: 'Unspezifisch',
			empathyAttempt: false,
			feelingVocabulary: 0,
			dailyWin: '',
			title: '',
			observation: '',
			feelings: [],
			needs: [],
			request: ''
		};
	}
};

// Memory Extraction
export const extractMemories = async (userId: string, locale: string = 'en', specificChatId?: string) => {
	console.log(`Extracting memories for user: ${userId}${specificChatId ? ` from chat: ${specificChatId}` : ''}`);
	try {
		// Get specific chat or unprocessed chats for this user
		const userChats = specificChatId 
			? await pb.collection('chats').getFullList({
				filter: `user = "${userId}" && id = "${specificChatId}"`,
				sort: '-created'
			})
			: await pb.collection('chats').getFullList({
				filter: `user = "${userId}" && memoryProcessed = false`,
				sort: '-created'
			});
		console.log('userChats found:', userChats.length);
		console.log('Chat IDs being processed:', userChats.map(chat => chat.id));
		
		if (userChats.length === 0) {
			console.log('No unprocessed chats found');
			return;
		}

		// Decrypt chat histories before processing
		const concatenatedHistory = userChats
			.map((chat) => {
				const decryptedHistory = decryptChatHistory(chat.history);
				return JSON.stringify(decryptedHistory);
			})
			.join('\n');

		if (!concatenatedHistory) {
			console.log('concatenatedHistory is empty, skipping memory extraction');
			return;
		}

		const message = `
      The chat history is:
      ${concatenatedHistory}
      `;

		console.log('Extracting memories from chat history');
		console.log('FULL CHAT HISTORY BEING ANALYZED:');
		console.log(concatenatedHistory);

		const systemInstruction = getLocalizedPrompt('extractMemories');

		const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
		const model = {
			model: 'gemini-2.0-flash-lite',
			config: {
				systemInstruction,
				responseMimeType: 'application/json',
				responseSchema: {
					type: Type.ARRAY,
					items: {
						type: Type.OBJECT,
						properties: {
							aspectType: {
								type: Type.STRING,
								enum: ['identity', 'emotion', 'relationship', 'value'],
								description: 'Type of the aspect'
							},
							key: {
								type: Type.STRING,
								description: 'The heading you would give to the information you want to remember'
							},
							value: {
								type: Type.STRING,
								description: 'The content of the aspect you want to remember'
							},
							confidence: {
								type: Type.STRING,
								enum: ['speculative', 'likely', 'certain'],
								description: 'Confidence of the aspect'
							}
						},
						required: ['aspectType', 'key', 'value', 'confidence']
					}
				}
			}
		};
		const chat = ai.chats.create(model);
		const result = await chat.sendMessage({ message });
		const response = result.text;
		const responseJson = JSON.parse(response || '{}');

		console.log('Extracted memories:', responseJson.length);

		// Create memories using the new vector system
		const { createHybridMemory } = await import('./hybridMemory.js');
		
		for (const aspect of responseJson) {
			try {
				await createHybridMemory(
					userId,
					aspect.value,
					aspect.aspectType,
					aspect.key,
					aspect.confidence,
					userChats[0]?.id // Use the most recent chat ID
				);
				console.log(`Created memory: [${aspect.aspectType}] ${aspect.value}`);
			} catch (error) {
				console.error('Error creating memory:', error);
			}
		}

		// Mark all processed chats as memoryProcessed
		for (const chatRecord of userChats) {
			try {
				await pb.collection('chats').update(chatRecord.id, {
					memoryProcessed: true
				});
			} catch (error) {
				console.error('Error updating chat record:', error);
			}
		}
		
		console.log('Memory extraction completed successfully');
		return true;
	} catch (error) {
		console.error('Error extracting memories:', error);
		return false;
	}
};
export const saveTrace = async (
	functionName: string,
	message: string,
	module: string,
	chatId: string,
	userId: string,
	response?: string,
	result?: GenerateContentResponse,
	systemInstruction?: string,
	pbInstance?: any
) => {
	let traceData: any;
	try {
		console.log(':::saveTrace');
		const inputTokenCount = result?.usageMetadata?.promptTokenCount;
		const outputTokenCount = result?.usageMetadata?.candidatesTokenCount;

		// Only skip if essential fields are completely missing
		if (!functionName || !message || !module) {
			return;
		}

		traceData = {
			functionName,
			message: message.substring(0, 5000), // Limit message length to prevent DB issues
			response: response?.substring(0, 10000), // Limit response length
			module: module,
			// For path-testing module, don't try to link to non-existent chat records
			chat: module === 'path-testing' ? null : (chatId || null),
			user: userId || null, // Allow null if userId is invalid
			inputTokens: inputTokenCount || 0,
			outputTokens: outputTokenCount || 0,
			// Only include systemInstruction if it's short enough
			...(systemInstruction && systemInstruction.length <= 1000 && { systemInstruction }),
			// Store the test chatId as metadata for path testing
			...(module === 'path-testing' && chatId && { testChatId: chatId })
		};
		
		// console.log(':::saveTrace data:', traceData);
		
		// Use passed pb instance or fall back to shared pb for backward compatibility
		const pbToUse = pbInstance || pb;
		const trace = await pbToUse.collection('traces').create(traceData);
		// console.log(':::saveTrace done: ', trace);
	} catch (error) {
		// Log error but don't let it propagate - trace failures should never affect core functionality
		if (typeof window === 'undefined') {
			console.warn('Failed to save trace (non-critical):', {
				functionName,
				module,
				chatId,
				userId,
				error: error instanceof Error ? error.message : String(error),
				errorDetails: error instanceof Error ? error.stack : String(error),
				data: traceData
			});
		}
	}
};
export const tools = {};

//Get current step
export const defineCurrentStep = async (
	message: string,
	chatId: string,
	userId: string,
	state: State,
	locale: string = 'en'
): Promise<State> => {
	const systemInstruction = getLocalizedPrompt('defineCurrentStep', {
		state: JSON.stringify(state)
	});

	const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
	const model = {
		model: 'gemini-2.0-flash-lite',
		config: {
			systemInstruction,
			responseMimeType: 'application/json',
			responseSchema: {
				type: Type.OBJECT,
				properties: {
					currentStep: {
						type: Type.STRING,
						enum: ['observation', 'feelings', 'needs', 'request'],
						description: 'The current Step of the Conversation'
					}
				},
				required: ['currentStep']
			}
		}
	};
	const chat = ai.chats.create(model);
	const result = await chat.sendMessage({ message });
	const response = result.text;
	const responseJson = JSON.parse(response || '{}');

	state.currentStep = responseJson.currentStep;

	saveTrace(
		'defineCurrentStep',
		message,
		'bullshift',
		chatId,
		userId,
		response,
		result,
		systemInstruction
	);

	return state;
};

// Save State
export const shouldSaveObservationTool = async (
	message: string,
	chatId: string,
	userId: string,
	locale: string = 'en',
	state?: object
): Promise<boolean> => {
	const systemInstruction = getLocalizedPrompt('shouldSaveObservation');

	const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
	const model = {
		model: 'gemini-2.0-flash-lite',
		config: {
			systemInstruction,
			responseMimeType: 'application/json',
			responseSchema: {
				type: Type.OBJECT,
				properties: {
					saveObservation: {
						type: Type.BOOLEAN,
						description: 'Whether an observation should be extracted from the message'
					}
				},
				required: ['saveObservation']
			}
		}
	};
	const chat = ai.chats.create(model);
	const result = await chat.sendMessage({ message });
	const response = result.text;
	const responseJson = JSON.parse(response || '{}');

	saveTrace(
		'shouldSaveObservation',
		message,
		'bullshift',
		chatId,
		userId,
		response,
		result,
		systemInstruction
	);

	return responseJson.saveObservation;
};
export const saveObservation = async (
	message: string,
	chatId: string,
	userId: string,
	state: State,
	locale: string = 'en'
) => {
	const systemInstruction = getLocalizedPrompt('saveObservation');

	const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
	const model = {
		model: 'gemini-2.0-flash-lite',
		config: {
			systemInstruction,
			responseMimeType: 'application/json',
			responseSchema: {
				type: Type.OBJECT,
				properties: {
					observation: {
						type: Type.STRING,
						description: 'The observation to save to the database'
					},
					observationExplanation: {
						type: Type.STRING,
						description: 'A short explanation of why this is the observation'
					}
				},
				required: ['observation', 'observationExplanation']
			}
		}
	};
	const chat = ai.chats.create(model);
	const result = await chat.sendMessage({ message });
	const response = result.text;
	const responseJson = JSON.parse(response || '{}');

	state.observation = responseJson.observation;

	console.log('saveObservation responseJson', responseJson);

	saveTrace(
		'saveObservation',
		message,
		'bullshift',
		chatId,
		userId,
		response,
		result,
		systemInstruction
	);

	return { state };
};

export const shouldAnalyzeFeelingsTool = async (
	message: string,
	chatId: string,
	userId: string,
	locale: string = 'en'
): Promise<boolean> => {
	const systemInstruction = getLocalizedPrompt('shouldAnalyzeFeelings');

	const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
	const model = {
		model: 'gemini-2.0-flash-lite',
		config: {
			systemInstruction,
			responseMimeType: 'application/json',
			responseSchema: {
				type: Type.OBJECT,
				properties: {
					needsAnalysis: {
						type: Type.BOOLEAN,
						description: 'Whether the message needs an analysis of feelings'
					}
				},
				required: ['needsAnalysis']
			}
		}
	};
	const chat = ai.chats.create(model);
	const result = await chat.sendMessage({ message });
	const response = result.text;
	const responseJson = JSON.parse(response || '{}');

	saveTrace(
		'shouldAnalyzeFeelingsTool',
		message,
		'bullshift',
		chatId,
		userId,
		response,
		result,
		systemInstruction
	);

	return responseJson.needsAnalysis;
};
export const analyzeAndSaveFeelings = async (message: string, chatId: string, userId: string, locale: string = 'en') => {
	const feelings = await pb.collection('feelings').getFullList({
		sort: 'category,sort'
	});
	const systemInstruction = getLocalizedPrompt('analyzeAndSaveFeelings', {
		feelings: feelings.map((feeling) => feeling.nameEn).join(', ')
	});

	const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
	const model = {
		model: 'gemini-2.0-flash-lite',
		config: {
			systemInstruction,
			responseMimeType: 'application/json',
			responseSchema: {
				type: Type.OBJECT,
				properties: {
					feelings: {
						type: Type.ARRAY,
						items: {
							type: Type.STRING
						}
					}
				},
				required: ['feelings']
			}
		}
	};
	const chat = ai.chats.create(model);
	const result = await chat.sendMessage({ message });
	const response = result.text;
	const responseJson = JSON.parse(response || '{}');

	console.log('feelings', responseJson.feelings);
	let oldFeelings = [];
	const chatRecord = await pb.collection('chats').getOne(chatId);
	if (chatRecord.feelings) {
		oldFeelings = chatRecord.feelings;
	}
	let newFeelings = [...oldFeelings, ...responseJson.feelings];
	newFeelings = [...new Set(newFeelings)];

	await pb.collection('chats').update(chatId, {
		feelings: newFeelings
	});

	saveTrace(
		'analyzeAndSaveFeelings',
		message,
		'bullshift',
		chatId,
		userId,
		response,
		result,
		systemInstruction
	);

	return responseJson.feelings;
};
