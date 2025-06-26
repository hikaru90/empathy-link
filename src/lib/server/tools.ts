import { pb } from '$scripts/pocketbase';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenAI, Type } from '@google/genai';
import type { GenerateContentResponse } from '@google/genai';
import type { State } from '$routes/api/ai/bullshift/send/+server';
import type { HistoryEntry } from '$routes/api/ai/selfempathy/initChat/+server';

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

const getLocalizedPrompt = async (locale: string, promptKey: string, variables: Record<string, any> = {}) => {
	try {
		const messages = await loadPrompts(locale);
		let prompt = messages[`ai_prompts_${promptKey}`];
		
		if (!prompt) {
			console.error(`Missing prompt key: ai_prompts_${promptKey} for locale: ${locale}`);
			// Fallback to English if the prompt doesn't exist in the requested locale
			if (locale !== 'en') {
				const enMessages = await loadPrompts('en');
				prompt = enMessages[`ai_prompts_${promptKey}`];
			}
			
			if (!prompt) {
				throw new Error(`Prompt key ai_prompts_${promptKey} not found in any locale`);
			}
		}
		
		// Replace variables in the prompt
		Object.entries(variables).forEach(([key, value]) => {
			prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
		});
		
		return prompt;
	} catch (error) {
		console.error('Error loading localized prompt:', error);
		throw error;
	}
};

export const analyzeChat = async (chatId: string, userId: string, locale: string) => {
	try {
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

		const systemInstruction = await getLocalizedPrompt(locale, 'analyzeChat', {
			feelings: feelings.join(', '),
			needs: needs.join(', ')
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

		return responseJson;
	} catch (error) {
		console.error('Error analyzing chat:', error);
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

			const systemInstruction = await getLocalizedPrompt(locale, 'extractMemories');

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
							}
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
	systemInstruction?: string
) => {
	try {
		const inputTokenCount = result?.usageMetadata?.promptTokenCount;
		const outputTokenCount = result?.usageMetadata?.candidatesTokenCount;

		const trace = await pb.collection('traces').create({
			functionName,
			message,
			response,
			module: module,
			chat: chatId,
			user: userId,
			inputTokens: inputTokenCount,
			outputTokens: outputTokenCount,
			systemInstruction
		});
	} catch (error) {
		console.error('Error saving trace:', error);
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
	const systemInstruction = await getLocalizedPrompt(locale, 'defineCurrentStep', {
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
	const systemInstruction = await getLocalizedPrompt(locale, 'shouldSaveObservation');

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
	const systemInstruction = await getLocalizedPrompt(locale, 'saveObservation');

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
	const systemInstruction = await getLocalizedPrompt(locale, 'shouldAnalyzeFeelings');

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
	const systemInstruction = await getLocalizedPrompt(locale, 'analyzeAndSaveFeelings', {
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
