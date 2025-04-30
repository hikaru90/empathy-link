import { pb } from '$scripts/pocketbase';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenAI, Type } from '@google/genai';
import type { GenerateContentResponse } from '@google/genai';
import { z } from 'zod';

export const extractMemories = async () => {
	try {
		const memories = await pb.collection('memoryExtractionQueue').getFullList({
			filter: `status = "pending"`,
			sort: '-created'
		});
		console.log('memories', memories);
		for (const memory of memories) {
			const userId = memory.user;
			const userChats = await pb.collection('chats').getFullList({
				filter: `user = "${userId}" && memoryProcessed = false`,
				sort: '-created'
			});
			console.log('userChats', userChats);
			const concatenatedHistory = userChats.map((chat) => JSON.stringify(chat.history)).join('\n');

			if (!concatenatedHistory) throw 'concatenatedHistory is empty, skipping memory extraction';

			const message = `
      The chat history is:
      ${concatenatedHistory}
      `;

			console.log('message', message);

			const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
			const model = {
				model: 'gemini-1.5-flash',
				config: {
					systemInstruction: `You are a tool in a chain of nonviolent communication tools. You will receive the history of one or multiple chat histories in json format, including model messages for context. Your job is to analyze a conversation to identify CORE ASPECTS of the user's personality, emotional patterns, and life context. Extract only information critical for building a longitudinal understanding of their:

          [1] Core Identity (permanent/semi-permanent traits):
          - Cultural/ethnic identity
          - Neurotype (e.g., ADHD, autism mentions)
          - Gender identity & sexual orientation
          - Core values/beliefs (moral, political, spiritual)
          - Major disabilities/chronic conditions

          [2] Emotional Patterns (recurring states):
          - Repeated emotional triggers (e.g., "My boss always makes me feel...")
          - Persistent fears/anxieties
          - Chronic stressors
          - Recurring sources of joy

          [3] Relationship Web:
          - Key people (family, partners, close friends)
          - Relationship status patterns
          - Recurring conflicts
          - Support network gaps

          [4] Values & Boundaries:
          - Expressed dealbreakers
          - Communication preferences
          - Topics marked as sensitive/off-limits

          [INSTRUCTIONS]
          1. Only analyze user messages. Use model or system messages as context only.
          2. Ignore transient states (like "I'm tired today")
          3. Never record Personal Identifiable Information
          4. Use 3-level confidence scoring (speculative, likely, certain)
          5. Only return the aspects that are critical for building a longitudinal understanding of the user's personality, emotional patterns, and life context.
          `,
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

			await pb.collection('memoryExtractionQueue').update(memory.id, {
				status: 'done'
			});

			return responseJson;
		}
	} catch (error) {
		console.error('Error extracting memories:', error);
	}
};

export const queueMemoryExtraction = async (userId: string, status: string) => {
	try {
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

export const tools = {
	// get_user_data: {
	//   description: "Fetches user data from PocketBase",
	//   parameters: { user_id: "string" },
	//   execute: async (params) => {
	//     const user = await pb.collection('users').getOne(params.user_id);
	//     return user;
	//   }
	// },
	// calculate: {
	//   description: "Evaluates a mathematical expression",
	//   parameters: { expression: "string" },
	//   execute: ({ expression }) => {
	//     try {
	//       return eval(expression).toString();
	//     } catch {
	//       return "Calculation error";
	//     }
	//   }
	// }
	// indentifyFeelings: {
	//   description: "Identify the feelings of the user",
	//   parameters: z.object({
	//     message: z.string().describe("The text message from the user"),
	//   }),
	//   execute: async (params: { message: string }) => {
	//     // Use PocketBase's search capabilities
	//     const results = await pb.collection('feelings').getList(1, params.limit, {
	//       filter: `name ~ "${params.query}" || description ~ "${params.query}"`,
	//       sort: '-created'
	//     });
	//     return results.items.map(item => ({
	//       id: item.id,
	//       name: item.name,
	//       summary: `${item.description.slice(0, 100)}...`,
	//       key_attributes: {
	//         physical: item.physical_sensations.slice(0, 3),
	//         triggers: item.common_triggers.slice(0, 3)
	//       }
	//     }));
	//   }
	// }
};

export const shouldAnalyzeFeelingsTool = async (
	message: string,
	chatId: string,
	userId: string
): Promise<boolean> => {
	const systemInstruction = `You are a tool in a chain of nonviolent communication ai steps. You are responsible for identifying if analyzing feelings in a message is needed. Please make sure to only return true if you think that there is a true feeling based on nonviolent communication in the message.
      
	You always respond in your specified JSON schema and only return a boolean value for the needsAnalysis field.`;

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

	saveTrace('shouldAnalyzeFeelingsTool', message, 'bullshift', chatId, userId, response, result, systemInstruction);

	return responseJson.needsAnalysis;
};

export const analyzeAndSaveFeelings = async (message: string, chatId: string, userId: string) => {
	const feelings = await pb.collection('feelings').getFullList({
		sort: 'category,sort'
	});
	const systemInstruction = `You are a tool in a chain of nonviolent communication ai steps. You are responsible for analyzing the feelings of the user based on the following feelings: \n
      ${feelings.map((feeling) => feeling.nameEn).join(', ')}.

      You always respond in your specified JSON schema and only return a lowercase array of strings in the feelings field. Make sure the feelings are returned in the language of the message.`;

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

	saveTrace('analyzeAndSaveFeelings', message, 'bullshift', chatId, userId, response, result,systemInstruction);

	return responseJson.feelings;
};
