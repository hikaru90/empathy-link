import { pb } from '$scripts/pocketbase';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenAI, Type } from '@google/genai';
import type { GenerateContentResponse } from '@google/genai';
import type { State } from '$routes/api/ai/bullshift/send/+server';
import type { HistoryEntry } from '$routes/api/ai/selfempathy/initChat/+server';
import { m, setLocale } from '$lib/translations';

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
		console.log('analyzeChat called with locale:', locale);
		console.log('Current setLocale available:', typeof setLocale);
		
		const feelingsRecords = await pb.collection('feelings').getFullList({
			sort: 'category,sort'
		})
		const feelings = feelingsRecords.map((feeling) => {
			return feeling[`name${locale.toUpperCase()}`]
		});
		const needsRecords = await pb.collection('needs').getFullList({
			sort: 'category,sort'
		})
		const needs = needsRecords.map((need) => {
			return need[`name${locale.toUpperCase()}`]
		});

		const chatRecord = await pb.collection('chats').getOne(chatId);
		const concatenatedHistory = chatRecord.history
			.map((chat: HistoryEntry) => JSON.stringify(chat))
			.join('\n');

		console.log('concatenatedHistory', concatenatedHistory);
		const message = `
      The chat history is:
      ${concatenatedHistory}
      `;

		console.log('About to call getLocalizedPrompt with feelings:', feelings.slice(0, 3));
		console.log('About to call getLocalizedPrompt with needs:', needs.slice(0, 3));
		
		const systemInstruction = getLocalizedPrompt('analyzeChat', {
			feelings: feelings.join(', '),
			needs: needs.join(', ')
		});
		
		console.log('Generated systemInstruction preview:', systemInstruction.substring(0, 200) + '...');

		const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
		const model = {
			model: 'gemini-1.5-flash',
			config: {
				systemInstruction,
				responseMimeType: 'application/json',
				responseSchema: {
					type: Type.OBJECT,
					properties: {
						title: {
							type: Type.STRING,
							description: 'The title of the chat'
						},
						observation: {
							type: Type.STRING,
							description: 'The observation of the chat'
						},
						feelings: {
							type: Type.ARRAY,
							items: {
								type: Type.STRING,
							},
							description: 'The feelings of the user based on the feelings list'
						},
						needs: {
							type: Type.ARRAY,
							items: {
								type: Type.STRING,
							},
							description: 'The needs of the user based on the needs list'
						},
						request: {
							type: Type.STRING,
							description: 'The request of the chat'
						},
						sentimentPolarity: {
							type: Type.NUMBER,
							description: 'The sentiment polarity of the chat'
						},
						intensityRatio: {
							type: Type.NUMBER,
							description: 'The intensity ratio of the chat'
						},
						emotionalBalance: {
							type: Type.NUMBER,
							description: 'The emotional balance of the chat'
						},
						triggerCount: {
							type: Type.NUMBER,
							description: 'The trigger count of the chat'
						},
						resolutionCount: {
							type: Type.NUMBER,
							description: 'The resolution count of the chat'
						},
						escalationRate: {
							type: Type.NUMBER,
							description: 'The escalation rate of the chat'
						},
						empathyRate: {
							type: Type.NUMBER,
							description: 'The empathy rate of the chat'
						},
						messageLength: {
							type: Type.NUMBER,
							description: 'The message length of the chat'
						},
						readabilityScore: {
							type: Type.NUMBER,
							description: 'The readability score of the chat'
						}
					}
				}
			}
		}
		const chat = ai.chats.create(model);
		const result = await chat.sendMessage({ message });
		console.log('result', result);
		const response = result.text;
		const responseJson = JSON.parse(response || '{}');

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

		return responseJson;
	} catch (error) {
		console.error('Error analyzing chat:', error);
		// Return a safe fallback object to prevent the endpoint from crashing
		return {
			title: '',
			observation: '',
			feelings: [],
			needs: [],
			request: '',
			sentimentPolarity: 0,
			intensityRatio: 0,
			emotionalBalance: 0,
			triggerCount: 0,
			resolutionCount: 0,
			escalationRate: 0,
			empathyRate: 0,
			messageLength: 0,
			readabilityScore: 0
		};
	}
};

// Memory Extraction
export const extractMemories = async (userId: string, locale: string = 'en') => {
	console.log(`status = "pending" && user = "${userId}"`);
	try {
		const memories = await pb.collection('memoryExtractionQueue').getFullList({
			filter: `status = "pending" && user = "${userId}"`,
			sort: '-created'
		});
		console.log('memories length', memories.length);
		for (const memory of memories) {
			const userChats = await pb.collection('chats').getFullList({
				filter: `user = "${userId}" && memoryProcessed = false`,
				sort: '-created'
			});
			console.log('userChats', userChats);
			const concatenatedHistory = userChats.map((chat) => JSON.stringify(chat.history)).join('\n');

			if (!concatenatedHistory) {
				await pb.collection('memoryExtractionQueue').update(memory.id, {
					status: 'done'
				});
				throw 'concatenatedHistory is empty, skipping memory extraction';
			}

			const message = `
      The chat history is:
      ${concatenatedHistory}
      `;

			console.log('message', message);

			const systemInstruction = getLocalizedPrompt('extractMemories');

			const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
			const model = {
				model: 'gemini-1.5-flash',
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

			console.log('responseJson', responseJson);

			for (const aspect of responseJson) {
				try {
					const aspectRecord = await pb.collection('memories').create({
						user: userId,
						type: aspect.aspectType,
						key: aspect.key,
						value: aspect.value,
						confidence: aspect.confidence
					});
				} catch (error) {
					// Log error but continue - memory extraction failures should not crash the app
					console.error('Error creating aspect record:', error);
				}
			}

			for (const chat of userChats) {
				try {
					await pb.collection('chats').update(chat.id, {
						memoryProcessed: true
					});
				} catch (error) {
					console.error('Error updating chat record:', error);
				}
			}

			const updatedMemory = await pb.collection('memoryExtractionQueue').update(memory.id, {
				status: 'done'
			});

			console.log('updatedMemory', updatedMemory);
		}
		return true;
	} catch (error) {
		console.error('Error extracting memories:', error);
	}
};
export const queueMemoryExtraction = async (userId: string, status: string) => {
	try {
		const userMemoryExtractions = await pb.collection('memoryExtractionQueue').getFullList({
			filter: `user = "${userId}" && status = "pending"`
		});

		if (userMemoryExtractions.length > 0) {
			return;
		}
		const queueMemoryExtraction = await pb
			.collection('memoryExtractionQueue')
			.create({ user: userId, status: status });
		return queueMemoryExtraction;
	} catch (error) {
		console.error('Error queueing memory extraction:', error);
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
			chat: chatId || null, // Allow null if chatId is invalid
			user: userId || null, // Allow null if userId is invalid
			inputTokens: inputTokenCount || 0,
			outputTokens: outputTokenCount || 0,
			// Only include systemInstruction if it's short enough
			...(systemInstruction && systemInstruction.length <= 1000 && { systemInstruction })
		};
		
		console.log(':::saveTrace data:', traceData);
		
		// Use passed pb instance or fall back to shared pb for backward compatibility
		const pbToUse = pbInstance || pb;
		const trace = await pbToUse.collection('traces').create(traceData);
		console.log(':::saveTrace done: ', trace);
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
		model: 'gemini-1.5-flash',
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
		model: 'gemini-1.5-flash',
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
		model: 'gemini-1.5-flash',
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
		model: 'gemini-1.5-flash',
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
		model: 'gemini-1.5-flash',
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
