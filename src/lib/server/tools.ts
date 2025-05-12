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

		const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
		const model = {
			model: 'gemini-1.5-flash',
			config: {
				systemInstruction: `Your task is to analyze a completed chat session that follows the Nonviolent Communication (NVC) framework. The session consists of a conversation between a user and the AI, where the user works through a real-life situation by describing:
			
			- Observation (what happened)
			- Feelings (emotions triggered)
			- Needs (underlying needs)
			- Request (desired outcome)

			This is the feelings list you know:
				${feelings.join(', ')}

			This is the needs list you know:
				${needs.join(', ')}

			You must extract the following data from the full chat transcript:

			1. title: A short, descriptive title summarizing the situation (max ~10 words).
			2. observation: The factual observation as per NVC (objective, no judgment).
			3. feelings: A selection from the feelings list matching the users feelings.
			4. needs: A selection from the needs list matching the users needs.
			5. request: The clearest actionable request made by the user (if any).

			And compute the following numeric stats from the chat:
			6. sentimentPolarity: Overall emotional polarity of the session (–1 = very negative, 0 = neutral, +1 = very positive).
			7. intensityRatio: Proportion of high-intensity emotional expressions (0.0 to 1.0 scale).	
			8. emotionalBalance: Ratio of positive to negative emotion mentions (float, e.g., 0.5 means 50% positive).
			9. triggerCount: Number of distinct instances of conflict triggers or tension points (count of negative emotion peaks or conflict phrases).
			10. resolutionCount: Number of messages where the user proposed or considered solutions or resolutions.
			11. escalationRate: Proportion of messages that escalate emotional intensity or negativity (0.0 to 1.0 scale).
			12. empathyRate: Proportion of messages where the user reflects, validates, or shows empathy toward others (0.0 to 1.0 scale).
			13. messageLength: Average message length in words (float).
			14. readabilityScore: Average readability score of the user's messages (Flesch–Kincaid, float).

			Rules:
			- The analysis should reflect only the user's messages (ignore AI messages for emotional stats unless otherwise stated).
			- When analyzing feelings, exclusively use the feelings list.
			- When analyzing needs, exclusively use the needs list.
			- IMPORTANT: you **must not** output any feeling or need that is not in the lists below. If no exact match exists, map the user’s expression to the single closest term from the list.  
			- Keep feelings and needs lists concise (no duplicates, lowercase single words).
			- Only save a request if a clear actionable request was made; otherwise return an empty string.
			`,
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
export const extractMemories = async (userId: string) => {
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
	state: State
): Promise<State> => {
	const systemInstruction = `You are a tool in a chain of nonviolent communication ai steps. You are presented with a message and a state of a chat.You are responsible for defining the current step of the chat. Your Job is to check if based on the state and the message it is time to get to the next step.
	
	The state you are working with is:
	${JSON.stringify(state)}

	The Steps are:
	- observation
	- feelings
	- needs
	- request

	Please make sure to only return the current step of the chat in the currentStep field.
	`;

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
	state?: object
): Promise<boolean> => {
	const systemInstruction = `You are a tool in a chain of nonviolent communication ai steps. You are presented with a message and a state of a chat.You are responsible for identifying if extracting an observation in a message is needed. 
	
	The state you are working with is:

	Please make sure to only return true if you think that all these criteria apply: 
	- the observation is previously unknown
      
	For responding, you have the following rules:
	- you always respond in your specified JSON schema 
	- you only return a boolean value in the saveObservation field
	`;

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
	state: State
) => {
	const systemInstruction = `Your task is to guide the user through the observation step of the Nonviolent Communication (NVC) process. The user will tell you about a story or a situation. Your job is to extract the observation from the story.

Goals:
- Allow the user to vent and express their situation freely and naturally.
- Gently explain the purpose of this step: clarifying the facts of what happened, without interpretation, judgment, or emotion.
- Extract the observation: a clear, objective statement of the facts—just what was seen, heard, or otherwise perceived—according to NVC principles.

Behavior:
- Be empathetic and supportive while the user shares their situation.
- Do NOT rush to interrupt or correct the user. Let them tell their story first.
- After the user has shared enough, summarize the factual observation in a clear, neutral sentence.
- If their description includes judgments, feelings, or assumptions, kindly rephrase it into an objective observation (e.g., instead of “My boss treated me unfairly,” focus on the fact: “Your boss told you your work was unsatisfactory in front of the team”).
- If their description includes judgments, feelings, or assumptions, kindly rephrase it into an objective observation (e.g., instead of “My boss treated me unfairly,” focus on the fact: “Your boss told you your work was unsatisfactory in front of the team”).
- if the user is not sharing a story, ask them what is on their mind.
- if no observation can be made, don't save one and just respond to the user until something relevant comes up.

Output:
- Provide a brief, neutral summary of the observation to save to the database.
- Optionally, explain briefly why this is the observation (to reinforce learning).
- A response to send to the user.
`;

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
