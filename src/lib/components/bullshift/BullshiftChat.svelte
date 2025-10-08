<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Mascot2 from '$lib/components/Mascot2.svelte';
	import { preventDefault } from 'svelte/legacy';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import X from 'lucide-svelte/icons/x';
	import SquareCheck from 'lucide-svelte/icons/square-check';
	import Bug from 'lucide-svelte/icons/bug';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import IconPaperPlane from '$assets/icons/icon-paper-plane.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import AutoTextarea from '$lib/components/AutoTextarea.svelte';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { pb } from '$scripts/pocketbase';
	import { getLocale } from '$src/paraglide/runtime';
	import { scroll } from '$store/page';
	import TypewriterText from '$lib/components/TypewriterText.svelte';
	import { invalidateAll } from '$app/navigation';
	import RecommendationCard from '$lib/components/RecommendationCard.svelte';

	interface Feeling {
		id: string;
		nameDE: string;
		nameEN: string;
		category: string;
		positive: boolean;
		sort: number;
	}

	interface Need {
		id: string;
		nameDE: string;
		nameEN: string;
		category: string;
		sort: number;
	}

	interface Props {
		chatId: string;
		history?: any[];
		systemInstruction: string;
		user: App.User;
		class?: string | undefined;
	}

	let {
		chatId = $bindable(),
		history = $bindable([]),
		systemInstruction,
		user,
		class: className = undefined
	}: Props = $props();

	let userMessage = $state('');
	let isLoading = $state(false);
	let chatContainer: HTMLDivElement | undefined = $state();
	let textareaRef: HTMLTextAreaElement | undefined = $state();
	let chatTerminationModalVisible = $state(false);
	let analyzerIsRunning = $state(false);
	let analyzerFailed = $state(false);
	let memorizerIsRunning = $state(false);
	let memorizerFailed = $state(false);
	let chatAnalysisModalVisible = $state(false);
	let chatAnalysisId = $state('');
	let feelings = $state<Feeling[]>([]);
	let needs = $state<Need[]>([]);
	let feelingSelectorVisible = $state(false);
	let needSelectorVisible = $state(false);
	let errorMessage = $state('');
	let startAnimation = $state(false);
	let text1Done = $state(false);
	let text2Done = $state(false);
	let scrollingEnabled = $state(true);
	let suggestion = $state<string | undefined>(undefined);
	let isMobile = $state(false);
	let viewportHeight = $state(window.innerHeight);
	let lastFailedMessage = $state<string>('');
	let showModelOverloadError = $state(false);
	const chatAnalysisSuccessDuration = 3;

	// Get the current locale reactively
	const locale = $derived(getLocale());

	// Reset animation states on mount
	onMount(() => {
		text1Done = false;
		text2Done = false;
		chatTerminationModalVisible = false;
		
		// If history has more than 4 items, skip animations and show content immediately
		if (history.length > 4) {
			text1Done = true;
			text2Done = true;
			scrollingEnabled = true;
		} else if (history.length === 4) {
			// For initial chat, disable scrolling until animations complete
			scrollingEnabled = false;
		}
	});

	// Detect mobile and viewport changes
	$effect(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth <= 768;
			viewportHeight = window.innerHeight;
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		window.addEventListener('orientationchange', checkMobile);

		// Use ResizeObserver to detect viewport changes (like virtual keyboard)
		if (typeof ResizeObserver !== 'undefined') {
			const resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					if (entry.target === document.documentElement) {
						// Viewport size changed (likely virtual keyboard)
						setTimeout(() => {
							checkMobile();
							// Re-scroll if we're on mobile and the viewport changed
							if (isMobile && chatContainer && scrollingEnabled) {
								chatContainer.scrollTop = chatContainer.scrollHeight;
							}
						}, 100);
					}
				}
			});

			resizeObserver.observe(document.documentElement);

			return () => {
				resizeObserver.disconnect();
				window.removeEventListener('resize', checkMobile);
				window.removeEventListener('orientationchange', checkMobile);
			};
		}

		return () => {
			window.removeEventListener('resize', checkMobile);
			window.removeEventListener('orientationchange', checkMobile);
		};
	});

	// Add scroll event listener to ensure chat stays at bottom on mobile
	$effect(() => {
		if (chatContainer && isMobile) {
			const handleScroll = () => {
				// If user scrolls up, don't auto-scroll down
				// If user scrolls near bottom, auto-scroll to bottom
				const isNearBottom =
					chatContainer!.scrollTop + chatContainer!.clientHeight >=
					chatContainer!.scrollHeight - 100;
				if (isNearBottom) {
					// User is near bottom, ensure we stay at bottom
					setTimeout(() => {
						if (chatContainer && scrollingEnabled) {
							chatContainer.scrollTop = chatContainer.scrollHeight;
						}
					}, 50);
				}
			};

			chatContainer.addEventListener('scroll', handleScroll);

			return () => {
				if (chatContainer) {
					chatContainer.removeEventListener('scroll', handleScroll);
				}
			};
		}
	});

	const sendMessage = async () => {
		const messageToSend = userMessage.trim();
		if (!messageToSend) return;

		// Check token usage before sending message
		console.log('=== CHECKING TOKEN USAGE ===');
		try {
			const tokenCheckResponse = await fetch('/api/ai/checkTokenUsage', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: messageToSend // Let the API estimate tokens from the actual message
				})
			});

			console.log('Token check response status:', tokenCheckResponse.status);

			if (tokenCheckResponse.ok) {
				const tokenData = await tokenCheckResponse.json();
				console.log('Token check data:', tokenData);

				if (!tokenData.canSendMessage) {
					console.log('TOKEN LIMIT REACHED - BLOCKING MESSAGE');
					// Show error message to user
					errorMessage = `Du hast dein Token-Limit erreicht (${tokenData.tokenUsage.totalUsed}/${tokenData.tokenUsage.totalLimit} Tokens verwendet). Bitte kontaktiere den Support für eine Erhöhung.`;

					// Add error message to chat history as a red bubble
					history = [
						...history,
						{ role: 'user', parts: [{ text: messageToSend }], timestamp: Date.now() },
						{ role: 'error', parts: [{ text: errorMessage }], timestamp: Date.now() }
					];

					userMessage = ''; // Clear input
					setTimeout(() => {
						scrollDown();
					}, 50);
					return;
				} else {
					console.log('Token check passed - allowing message');
				}
			} else {
				console.log('Token check failed with status:', tokenCheckResponse.status);
			}
		} catch (error) {
			console.error('Failed to check token usage:', error);
			// Continue with message sending if token check fails (fail-open approach)
		}

		history = [
			...history,
			{ role: 'user', parts: [{ text: messageToSend }], timestamp: Date.now() }
		];
		userMessage = ''; // Clear input immediately

		// Scroll down after adding user message
		// Use a longer delay on mobile to account for virtual keyboard
		const scrollDelay = isMobile ? 300 : 50;
		setTimeout(() => {
			scrollDown();
		}, scrollDelay);

		handleSendMessage(messageToSend);
	};

	const handleSendMessage = async (messageToSend: string) => {
		isLoading = true;
		try {
			const response = await fetch('/api/ai/bullshift/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chatId,
					message: messageToSend,
					systemInstruction,
					locale: locale
				})
			});

			// Handle authentication errors gracefully - do NOT redirect to login
			if (response.status === 401) {
				const data = await response.json().catch(() => ({ error: 'Authentication failed' }));
				console.log('API authentication failed, but keeping user logged in:', data);

				// Set error message for user instead of redirecting
				errorMessage = 'Deine Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.';
				isLoading = false;
				return;
			}

			// Handle 503 model overloaded error specially
			if (response.status === 503) {
				const errorData = await response.json().catch(() => ({}));
				if (errorData.error === 'MODEL_OVERLOADED') {
					lastFailedMessage = messageToSend;
					showModelOverloadError = true;
					isLoading = false;
					return;
				}
			}

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('data from /send', data);
			if (data.error) throw new Error(data.error);

			// If path switching or feedback was saved, refresh complete history from database
			if (data.pathSwitched || data.feedbackSaved) {
				console.log('Path was switched or feedback saved, refreshing history from database');
				// Fetch updated history from database to get path markers and feedback confirmation
				const historyResponse = await fetch(`/api/ai/bullshift/getHistory?chatId=${chatId}`);
				if (historyResponse.ok) {
					const historyData = await historyResponse.json();
					history = historyData.history || [];
				} else {
					// Fallback: just add AI response to local history
					const aiMessage: any = {
						role: 'model',
						parts: [{ text: data.response }],
						timestamp: data.timestamp
					};
					// if (data.recommendations && data.recommendations.length > 0) {
					//	aiMessage.recommendations = data.recommendations;
					// }
					history = [...history, aiMessage];
				}
			} else {
				// No path switch or feedback saved, just add the AI response to local history
				const aiMessage: any = {
					role: 'model',
					parts: [{ text: data.response }],
					timestamp: data.timestamp
				};
				// if (data.recommendations && data.recommendations.length > 0) {
				//	aiMessage.recommendations = data.recommendations;
				// }
				history = [...history, aiMessage];
			}

			// Now that we have the AI's response, generate a suggestion for the user's next message
			// await suggestResponse();
		} catch (error) {
			console.error('Failed to send message:', error);

			// Create user-friendly error message
			let userFriendlyError = 'Ein Fehler ist aufgetreten: ';

			if (error instanceof Error) {
				// Handle specific error types
				if (error.message.includes('Network') || error.message.includes('fetch')) {
					userFriendlyError = userFriendlyError + 'Netzwerkfehler. Bitte versuche es erneut.';
				} else if (error.message.includes('401')) {
					userFriendlyError = userFriendlyError + 'Sitzung abgelaufen. Bitte melde dich erneut an.';
				} else if (error.message.includes('500')) {
					userFriendlyError = userFriendlyError + 'Serverfehler. Bitte versuche es später erneut.';
				} else if (error.message.includes('429')) {
					userFriendlyError =
						userFriendlyError +
						'Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.';
				} else {
					userFriendlyError = error.message || userFriendlyError;
				}
			}

			// Add error message to chat history as a red bubble
			history = [
				...history,
				{ role: 'user', parts: [{ text: messageToSend }], timestamp: Date.now() },
				{ role: 'error', parts: [{ text: userFriendlyError }], timestamp: Date.now() }
			];
		} finally {
			isLoading = false;
			setTimeout(() => {
				scrollDown();
			}, 50);
		}
	};
	const getFeelings = async () => {
		feelings = await pb.collection('feelings').getFullList({
			sort: '-positive,category,sort'
		});
	};
	const getNeeds = async () => {
		needs = await pb.collection('needs').getFullList({
			sort: 'category,sort'
		});
	};
	const scrollDown = () => {
		console.log('scrollDown function called, scrollingEnabled:', scrollingEnabled);
		if (!scrollingEnabled) {
			console.log('Scrolling disabled, skipping scroll');
			return;
		}
		// Use requestAnimationFrame to ensure DOM has updated
		requestAnimationFrame(() => {
			// Find the last message element - try multiple selectors
			const lastMessage = document.querySelector('.message:last-of-type');
			const allMessages = document.querySelectorAll('.message');
			const lastMessageAlt = allMessages[allMessages.length - 1];

			console.log('Scrolling down:', {
				isMobile,
				hasLastMessage: !!lastMessage,
				hasLastMessageAlt: !!lastMessageAlt,
				allMessagesCount: allMessages.length,
				hasChatContainer: !!chatContainer,
				windowWidth: window.innerWidth,
				viewportHeight,
				chatContainerScrollHeight: chatContainer?.scrollHeight,
				chatContainerClientHeight: chatContainer?.clientHeight,
				historyLength: history.length
			});

			// Try to find the last message using either selector
			const targetMessage = lastMessage || lastMessageAlt;

			if (targetMessage) {
				console.log('Found last message, scrolling into view with 100px offset');
				// Temporarily add scroll margin to create the offset
				const originalScrollMargin = targetMessage.style.scrollMarginTop;
				targetMessage.style.scrollMarginTop = '80px';

				// Use scrollIntoView to scroll the correct scrollable parent
				targetMessage.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
					inline: 'nearest'
				});

				// Remove the scroll margin after scrolling
				setTimeout(() => {
					targetMessage.style.scrollMarginTop = originalScrollMargin;
				}, 500);

				console.log('Scroll: align last message with 100px offset from top');
			} else if (chatContainer) {
				console.log('No messages found, scrolling to bottom of container');
				// If no messages, scroll to bottom of chat container
				chatContainer.scrollTop = chatContainer.scrollHeight;
				console.log('No messages: set scrollTop to', chatContainer.scrollHeight);
			} else {
				console.log('No chat container found');
			}
		});
	};
	const flushMemory = async () => {
		await fetch('/api/ai/bullshift/flushMemory', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};
	const clearChat = async () => {
		console.log('user', user);
		try {
			const response = await fetch('/api/ai/bullshift/initChat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user: user, locale: locale })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			if (data.error) throw new Error(data.error);

			// Update the chat ID and clear history
			chatId = data.chatId;
			history = [];
			userMessage = '';
		} catch (error) {
			console.error('Failed to clear chat:', error);
		}
	};
	const memorizeChatFake = async () => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(true);
			}, 1000);
		});
	};

	const processFeedbackIfNeeded = async () => {
		console.log('🔍 Checking if feedback needs to be processed...');
		try {
			const response = await fetch('/api/ai/bullshift/processFeedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chatId })
			});

			if (response.ok) {
				const data = await response.json();
				if (data.feedbackSaved) {
					console.log('✅ Feedback processed successfully');
					// Refresh history to show feedback confirmation
					const historyResponse = await fetch(`/api/ai/bullshift/getHistory?chatId=${chatId}`);
					if (historyResponse.ok) {
						const historyData = await historyResponse.json();
						history = historyData.history || [];
					}
				}
			}
		} catch (error) {
			console.error('Error processing feedback:', error);
		}
	};
	const startAnalysis = async () => {
		chatAnalysisId = '';
		analyzerIsRunning = true;
		try {
			// First, process any pending feedback if we're in feedback path
			await processFeedbackIfNeeded();

			const [analysisResponse] = await Promise.all([
				analyzeChat(),
				new Promise((resolve) => setTimeout(resolve, 2000))
			]);

			chatAnalysisId = analysisResponse;
			console.log('chatAnalysisId', chatAnalysisId);
		} catch (error) {
			analyzerFailed = true;
			console.error('Failed to analyze chat:', error);
			return false;
		} finally {
			analyzerIsRunning = false;
		}

		memorizerIsRunning = true;
		try {
			const [memorizationResponse] = await Promise.all([
				extractMemories(),
				new Promise((resolve) => setTimeout(resolve, 2000))
			]);
		} catch (error) {
			memorizerFailed = true;
			console.error('Failed to memorize chat:', error);
			return false;
		} finally {
			memorizerIsRunning = false;
		}
	};
	const analyzeChat = async (): Promise<string> => {
		// Validate required data
		if (!locale || !chatId) {
			throw new Error('Missing required data for chat analysis');
		}

		const response = await fetch('/api/ai/bullshift/analyzeChat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ locale: locale, chatId })
		});

		// Handle authentication errors gracefully - do NOT redirect to login
		if (response.status === 401) {
			const data = await response.json().catch(() => ({ error: 'Authentication failed' }));
			console.log('AnalyzeChat authentication failed, but keeping user logged in:', data);
			throw new Error(
				'Chat-Analyse fehlgeschlagen: Authentifizierung nicht möglich. Bitte versuche es erneut.'
			);
		}

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		// Validate response data
		if (!data.analysis?.id || !data.initiatedChat?.chatId) {
			throw new Error('Invalid response data from server');
		}

		chatAnalysisId = data.analysis.id;
		// Update to the new chat ID that was created during analysis
		chatId = data.initiatedChat.chatId;
		// Clear the history since we have a new chat
		history = [];
		return data.analysis.id;
	};
	const extractMemories = async (): Promise<boolean> => {
		const response = await fetch('/api/ai/bullshift/extractMemories', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		});

		// Handle authentication errors gracefully - do NOT redirect to login
		if (response.status === 401) {
			const data = await response.json().catch(() => ({ error: 'Authentication failed' }));
			console.log('ExtractMemories authentication failed, but keeping user logged in:', data);
			throw new Error(
				'Erinnerungen konnten nicht extrahiert werden: Authentifizierung fehlgeschlagen.'
			);
		}

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return true;
	};
	const safelyParseJSON = (jsonString: string) => {
		try {
			return JSON.parse(jsonString);
		} catch (error) {
			return '';
		}
	};
	const addAndSendText = (text: string) => {
		addText(text);
		sendMessage();
	};

	// Function to regenerate the last failed message
	const regenerateMessage = async () => {
		if (!lastFailedMessage) return;
		
		showModelOverloadError = false;
		userMessage = lastFailedMessage;
		await handleSendMessage(lastFailedMessage);
		lastFailedMessage = '';
	};

	// Function to dismiss the error
	const dismissError = () => {
		showModelOverloadError = false;
		lastFailedMessage = '';
	};
	const addText = (text: string) => {
		if (!textareaRef) {
			// Fallback to old behavior if no textarea ref
			let textToAdd = '';
			if (userMessage && userMessage[userMessage.length - 1] !== ' ') {
				textToAdd = ' ' + text;
			} else {
				textToAdd = text;
			}
			userMessage += textToAdd;
			return;
		}

		const textarea = textareaRef;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const currentValue = userMessage;

		// Determine what text to add
		let textToAdd = text;

		// Add space before if needed (cursor is not at start and previous char is not a space)
		if (start > 0 && currentValue[start - 1] !== ' ') {
			textToAdd = ' ' + text;
		}

		// Add space after if needed (cursor is not at end and next char is not a space)
		if (end < currentValue.length && currentValue[end] !== ' ') {
			textToAdd = textToAdd + ' ';
		}

		// Insert text at cursor position
		const newValue = currentValue.substring(0, start) + textToAdd + currentValue.substring(end);
		userMessage = newValue;

		// Set cursor position after the inserted text
		setTimeout(() => {
			const newCursorPos = start + textToAdd.length;
			textarea.setSelectionRange(newCursorPos, newCursorPos);
			textarea.focus();
		}, 0);
	};
	const suggestResponse = async () => {
		const lastMessages = history.slice(-4).map((msg) => msg.parts[0].text);
		console.log('lastMessages', lastMessages);
		const response = await fetch('/api/ai/bullshift/chatSuggestion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chatId: chatId,
				locale: locale,
				lastMessages: lastMessages
			})
		});
		const data = await response.json();
		console.log('data from /chatSuggestion', data);
		suggestion = data.suggestion;
		return data.suggestion;
	};

	const autoGrow = (element: HTMLTextAreaElement) => {
		element.style.height = '5px';
		element.style.height = element.scrollHeight + 'px';
	};

	onMount(async () => {
		startAnimation = true;
		text1Done = false;

		getFeelings();
		getNeeds();

		// Check for pending message after login redirect
		const pendingMessage = localStorage.getItem('pendingMessage');
		const pendingChatId = localStorage.getItem('pendingChatId');

		if (pendingMessage && pendingChatId === chatId) {
			userMessage = pendingMessage;
			localStorage.removeItem('pendingMessage');
			localStorage.removeItem('pendingChatId');
			console.log('Restored pending message after login:', pendingMessage);
		}

		if (history.length > 0) {
			// suggestResponse();
		}
	});

	$effect(() => {
		// Auto-hide modal when analysis is complete and successful
		if (
			!analyzerIsRunning &&
			!memorizerIsRunning &&
			!analyzerFailed &&
			!memorizerFailed &&
			chatAnalysisId &&
			chatTerminationModalVisible
		) {
			setTimeout(async () => {
				chatTerminationModalVisible = false;
				// Invalidate all data to retrigger the load function and get fresh chat data
				await invalidateAll();
			}, chatAnalysisSuccessDuration * 1000); // Show success state for 3 seconds before auto-hiding
		}
	});

	// Scroll to bottom when suggestion appears/disappears
	$effect(() => {
		if (suggestion !== undefined && scrollingEnabled) {
			// Suggestion state changed, scroll to bottom after a delay to allow for layout changes
			setTimeout(() => {
				scrollDown();
			}, 100);
		}
	});

	// Enable scrolling when both text animations are complete
	$effect(() => {
		if (history.length === 4 && text1Done && text2Done && !scrollingEnabled) {
			console.log('Both text animations complete, enabling scrolling');
			scrollingEnabled = true;
		}
	});

	// Scroll to bottom when chat container is ready and history is loaded
	$effect(() => {
		console.log('Scroll effect triggered:', {
			hasChatContainer: !!chatContainer,
			historyLength: history.length,
			chatId: chatId,
			scrollingEnabled: scrollingEnabled
		});

		if (chatContainer && history.length > 0 && scrollingEnabled) {
			console.log('Conditions met, attempting to scroll...');
			// Use multiple requestAnimationFrame calls to ensure DOM is fully rendered
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					console.log('Double requestAnimationFrame callback executing scrollDown');
					scrollDown();
				});
			});
		}
	});
</script>

{#if chatId && !chatTerminationModalVisible}
	<div class="">
		<!-- Model Overload Error Banner -->
		{#if showModelOverloadError}
			<div class="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
				<div class="flex items-start gap-3">
					<div class="flex-shrink-0">
						<RotateCcw class="h-5 w-5 text-orange-600" />
					</div>
					<div class="flex-1">
						<h3 class="text-sm font-medium text-orange-800">
							KI-Modell ist überlastet
						</h3>
						<p class="mt-1 text-sm text-orange-700">
							Das KI-Modell ist momentan überlastet. Deine Nachricht wurde nicht gesendet. 
							Du kannst es erneut versuchen oder einen Moment warten.
						</p>
						<div class="mt-3 flex gap-2">
							<Button
								size="sm"
								onclick={regenerateMessage}
								class="bg-orange-600 text-white hover:bg-orange-700"
							>
								<RotateCcw class="mr-2 h-4 w-4" />
								Erneut versuchen
							</Button>
							<Button
								variant="outline"
								size="sm"
								onclick={dismissError}
								class="border-orange-300 text-orange-700 hover:bg-orange-100"
							>
								Verwerfen
							</Button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div
			bind:this={chatContainer}
			class="messages overflow-y-auto scroll-smooth rounded-lg pt-4"
			class:pb-52={!suggestion}
			class:pb-80={suggestion}
			style="
				-webkit-overflow-scrolling: touch;
				overscroll-behavior: contain;
				scroll-behavior: smooth;
			"
		>
			{#if history.length === 4}
				<h1 class="mb-3 text-2xl font-light">
					<TypewriterText
						text="Hi {String(user?.firstName).charAt(0).toUpperCase() +
							String(user?.firstName).slice(
								1
							)}, ich begleite dich dabei, Konflikte und schwierige Situationen zu klären – Schritt für Schritt."
						onComplete={() => {
							text1Done = true;
							text2Done = true;
						}}
					/>
				</h1>
				<!-- <h2 class="mb-6 text-2xl font-light text-black/40">
					{#if text1Done}
						<TypewriterText
							text="Beschreib mir eine Situation, und ich helfe dir, sie zu verarbeiten. Vertrau mir – wir
					schaffen das gemeinsam!"
							onComplete={() => {
								text2Done = true;
							}}
						/>
					{/if}
				</h2> -->
			{/if}
			<div
				class="transition-opacity duration-700 {text2Done
					? 'pointer-events-auto opacity-100 h-auto'
					: 'pointer-events-none opacity-0 h-0'}"
			>
				{#each history.filter((msg) => !msg.hidden) as message}
					<!-- Path marker display -->
					{#if message.pathMarker}
						<div class="mb-4 flex justify-center">
							<div
								class="inline-flex items-center gap-2 rounded-full border border-green-900/5 bg-green-900/10 px-3 py-1 text-xs font-medium text-green-900"
							>
								{#if message.pathMarker.type === 'path_start'}
									{message.pathMarker.path
										.replace('_', ' ')
										.replace('idle', 'Gesprächsführung gestartet')
										.replace('self empathy', 'Selbst-Empathie gestartet')
										.replace('other empathy', 'Fremd-Empathie gestartet')
										.replace('action planning', 'Handlungsplanung gestartet')
										.replace('conflict resolution', 'Konfliktlösung gestartet')
										.replace('memory', 'Erinnerungen abrufen gestartet')
										.replace('feedback', 'Gespräch beenden gestartet')}
								{:else if message.pathMarker.type === 'path_end'}
									{message.pathMarker.path
										.replace('_', ' ')
										.replace('idle', 'Gesprächsführung abgeschlossen')
										.replace('self empathy', 'Selbst-Empathie abgeschlossen')
										.replace('other empathy', 'Fremd-Empathie abgeschlossen')
										.replace('action planning', 'Handlungsplanung abgeschlossen')
										.replace('conflict resolution', 'Konfliktlösung abgeschlossen')
										.replace('memory', 'Erinnerungen abrufen abgeschlossen')
										.replace('feedback', 'Gespräch beenden abgeschlossen')}
								{:else if message.pathMarker.type === 'path_switch'}
									{message.pathMarker.path
										.replace('_', ' ')
										.replace('idle', 'Zu Gesprächsführung gewechselt')
										.replace('self empathy', 'Zu Selbst-Empathie gewechselt')
										.replace('other empathy', 'Zu Fremd-Empathie gewechselt')
										.replace('action planning', 'Zu Handlungsplanung gewechselt')
										.replace('conflict resolution', 'Zu Konfliktlösung gewechselt')
										.replace('memory', 'Zu Erinnerungen abrufen gewechselt')
										.replace('feedback', 'Zu Gesprächsabschluss gewechselt')}
								{/if}
							</div>
						</div>
					{:else if !message.pathMarker}
						<!-- Show recommendations if available -->
						<!-- {#if message.role === 'model' && message.recommendations && message.recommendations.length > 0}
							<RecommendationCard recommendations={message.recommendations} />
						{/if} -->

						<!-- Regular message display -->
						<div
							aria-label={message.role}
							class="message {message.role} mb-4 flex {message.role === 'user'
								? 'ml-4 justify-end'
								: 'mr-4 justify-start'}"
						>
							<div
								class="inline-block break-words rounded-b-xl px-3 py-1.5 shadow-lg shadow-black/5 {message.role ===
								'user'
									? 'rounded-tl-xl rounded-tr border border-white/40 bg-offwhite '
									: message.role === 'error'
										? 'rounded-tl-md rounded-tr-xl border border-red-300 bg-red-100 text-red-800'
										: message.feedbackConfirmation
											? 'rounded-tl rounded-tr-xl border border-green-200 bg-green-50 text-green-800'
											: 'rounded-tl rounded-tr-xl border border-white bg-white/90'}"
							>
								<div class="flex items-start gap-2">
									<div class="markdown text-sm">
										{#if 'text' in message.parts[0]}
											{@html marked(message.parts[0].text)}
										{:else if 'functionCall' in message.parts[0]}
											<div class="text-xs">
												<span class="font-bold">Funktion:</span>
												{message.parts[0].functionCall.name}
												<span class="font-bold">Argumente:</span>
												{JSON.stringify(message.parts[0].functionCall.args)}
											</div>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
			{#if isLoading}
				<div class="flex items-center justify-start">
					<div
						class="flex items-center justify-center gap-0.5 rounded-full bg-white p-2 shadow-lg shadow-black/5"
					>
						<div class="size-1.5 animate-loadingFade rounded-full bg-black"></div>
						<div
							style="animation-delay: 250ms;"
							class="size-1.5 animate-loadingFade rounded-full bg-black"
						></div>
						<div
							style="animation-delay: 500ms;"
							class="delay-750 size-1.5 animate-loadingFade rounded-full bg-black"
						></div>
					</div>
				</div>
			{/if}

			<div class="flex items-center justify-center">
				<button
					class="{history.length > 4
						? 'pointer-events-auto opacity-100'
						: 'pointer-events-none opacity-0'} mb-4 flex items-center gap-2 rounded-full border border-black/10 py-1 pl-3 pr-2 text-sm transition"
					onclick={() => {
						text1Done = false;
						text2Done = false;
						chatTerminationModalVisible = true;
						startAnalysis();
					}}
				>
					Chat abschließen
					<SquareCheck class="size-4" />
				</button>
			</div>
		</div>

		<div class="fixed bottom-[62px] left-0 right-0 px-3 pb-5 pt-4">
			<div class="rounded-2xl bg-neutral-100 p-2">
				<div class="flex items-center justify-center">
					{#if history.length > 4}
						<div
							class="block max-h-0 w-full transition-all duration-500 {suggestion
								? 'mb-2 max-h-20'
								: ''}"
						>
							<button
								onclick={() => suggestion && addAndSendText(suggestion)}
								class="w-full rounded-xl border-l border-r border-t border-black/5 text-left text-sm text-black/40 transition delay-200 {suggestion
									? 'opacity-100'
									: 'opacity-0'}"
							>
								<div class="-mb-3 px-2 pt-1">
									{suggestion}
								</div>
								<div
									class="mb-[5px] flex translate-y-1/2 transform items-center justify-center gap-1 py-0.5 text-[10px]"
								>
									<div class="h-3 flex-grow rounded-bl-xl border-b border-black/5"></div>
									<div class="relative z-10 -mb-1.5 flex items-center">
										Vorschlag übernehmen
										<ChevronDown class="size-3" />
									</div>
									<div class="h-3 flex-grow rounded-br-xl border-b border-black/5"></div>
								</div>
							</button>
						</div>
					{/if}
				</div>

				<form
					onsubmit={sendMessage}
					class="relative z-10 flex flex-col gap-2 rounded-xl border border-white bg-gradient-to-b from-white to-offwhite p-2 shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
				>
					<AutoTextarea
						bind:value={userMessage}
						placeholder="Deine Nachricht..."
						class="flex-grow rounded-md bg-transparent px-2 py-1 outline-none"
						bind:textarea={textareaRef}
						onEnter={sendMessage}
					></AutoTextarea>

					<div
						class="{feelingSelectorVisible
							? 'flex'
							: 'hidden'} max-h-40 flex-wrap gap-1 overflow-y-auto overscroll-contain"
					>
						{#each feelings as feeling}
							<button
								type="button"
								onclick={() => addText(feeling.nameDE)}
								class="rounded-full border border-black/5 bg-white px-2 py-0.5 text-xs text-black active:bg-black/5 {feeling.positive
									? 'border-bullshift'
									: 'border-black/40'}">{feeling.nameDE}</button
							>
						{/each}
					</div>
					<div
						class="{needSelectorVisible
							? 'flex'
							: 'hidden'} max-h-40 flex-wrap gap-1 overflow-y-auto overscroll-contain"
					>
						{#each needs as need}
							<button
								type="button"
								onclick={() => addText(need.nameDE)}
								class="rounded-full border border-black/5 bg-white px-2 py-0.5 text-xs text-black active:bg-black/5"
								>{need.nameDE}</button
							>
						{/each}
					</div>

					<div class="flex items-end justify-between">
						<div class="flex items-center gap-2">
							<button
								type="button"
								onclick={() => {
									needSelectorVisible = false;
									feelingSelectorVisible = !feelingSelectorVisible;
								}}
								style={feelingSelectorVisible
									? ''
									: 'box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);'}
								class="flex items-center gap-1 rounded-full py-1 pl-1 pr-2 text-xs {feelingSelectorVisible
									? 'bg-black/10 text-black shadow-inner'
									: 'bg-white text-black/60'}"
							>
								<div
									class="w-[1.2em] rounded-full p-[0.1em] {feelingSelectorVisible
										? 'bg-black fill-white/80'
										: 'bg-black/10 fill-black/60'}"
								>
									{@html IconHeart}
								</div>
								Gefühle
							</button>
							<button
								type="button"
								onclick={() => {
									feelingSelectorVisible = false;
									needSelectorVisible = !needSelectorVisible;
								}}
								style="{needSelectorVisible
									? ''
									: 'box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);'}	"
								class="flex items-center gap-1 rounded-full py-1 pl-1 pr-2 text-xs {needSelectorVisible
									? 'bg-black/10 text-black shadow-inner'
									: 'bg-white text-black/60'}"
							>
								<div
									class="w-[1.2em] rounded-full p-[0.1em] {needSelectorVisible
										? 'bg-black fill-white/80'
										: 'bg-black/10 fill-black/60'}"
								>
									{@html IconSwirl}
								</div>
								Bedürfnisse
							</button>
						</div>
						<button
							type="submit"
							onclick={() => {
								feelingSelectorVisible = false;
								needSelectorVisible = false;
							}}
							aria-label="Send message"
							disabled={isLoading}
							style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
							class="flex size-10 items-center justify-center rounded-full bg-black text-white disabled:opacity-50"
						>
							<div class="w-[1.2em] fill-white">
								{@html IconPaperPlane}
							</div>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Custom non-interactive modal -->
<div
	class="fixed inset-0 z-[1001] flex flex-col items-center justify-between bg-background p-6 {chatTerminationModalVisible
		? 'pointer-events-auto scale-100 opacity-100'
		: 'pointer-events-none scale-90 opacity-0'} transition duration-300"
>
	<h3 class="text-lg font-semibold">Chat Auswertung</h3>

	{#if analyzerIsRunning || memorizerIsRunning}
		<!-- Loading state with sparkle pill -->
		<div class="-mt-10 flex flex-col items-center gap-3">
			<SparklePill fast={true} class="h-4 w-8 shadow-xl dark:shadow-gray-200/30" />
			{#if analyzerIsRunning}
				<p class="animate-pulse text-sm text-gray-600">Dein Chat wird ausgewertet</p>
			{:else if memorizerIsRunning}
				<p class="animate-pulse text-sm text-gray-600">Dein Chat wird abgespeichert</p>
			{/if}
		</div>
		<div></div>
	{:else if analyzerFailed || memorizerFailed}
		<!-- Error state -->
		<div class="-mt-10">
			{#if analyzerFailed}
				<p class="mb-4 text-sm text-red-600">Dein Chat konnte nicht ausgewertet werden.</p>
			{:else if memorizerFailed}
				<p class="mb-4 text-sm text-red-600">Dein Chat konnte nicht abgespeichert werden.</p>
			{/if}
		</div>
		<div>
			<Button
				class="bg-black text-white"
				onclick={() => {
					startAnalysis();
				}}
			>
				Erneut versuchen
			</Button>
		</div>
	{:else if chatAnalysisId}
		<!-- Success state -->
		<div class="-mt-10 flex flex-col items-center gap-3">
			<div class="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
				<SquareCheck class="h-6 w-6 text-teal-600" />
			</div>
			<p class="text-sm text-gray-600">Dein Chat wurde ausgewertet</p>
		</div>
		<div class="w-full">
			<a
				href="/bullshift/stats/chats/{chatAnalysisId}"
				class="relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-full bg-teal-600 py-2 pl-4 pr-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
			>
				<div
					class="block-animation absolute -ml-4 h-full w-full bg-teal-700"
					style="animation-duration: {chatAnalysisSuccessDuration}s;"
				></div>
				<div class="relative z-10 flex w-full items-center justify-between gap-2">
					Zur Analyse gehen
					<ChevronRight class="size-6 rounded-full bg-white/20 p-0.5" />
				</div>
			</a>
		</div>
	{:else}
		<!-- Initial state -->
		<div class="-mt-10 flex flex-col items-center gap-3">
			<SparklePill fast={true} class="h-4 w-8" />
			<p class="animate-pulse text-sm text-gray-600">Chat wird vorbereitet</p>
		</div>
		<div></div>
	{/if}
</div>

<style lang="scss">
	.block-animation {
		animation-name: block;
		animation-timing-function: linear;
	}
	@keyframes block {
		0% {
			width: 100%;
		}
		90% {
			width: 0;
		}
		100% {
			width: 0;
		}
	}
</style>
