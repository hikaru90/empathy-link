/**
 * Database-driven prompt system with shortcode support
 * Replaces hardcoded prompts from paths.ts with editable database prompts
 */

import { pb } from '$scripts/pocketbase';
import type PocketBase from 'pocketbase';

export interface DbPrompt {
	id: string;
	slug: string;
	name: string;
	content: string;
	recurring: boolean;
	category: 'path' | 'system' | 'preference' | 'rule' | 'other';
	description?: string;
	active: boolean;
	path_config?: {
		entryCondition?: string;
		exitCondition?: string;
		suggestedNext?: string[];
	} | null;
	created: string;
	updated: string;
}

export interface PathDefinition {
	id: string;
	name: string;
	systemPrompt: string;
	entryCondition?: string;
	exitCondition?: string;
	suggestedNext?: string[];
}

// Cache for prompts to avoid frequent database calls
const promptCache = new Map<string, DbPrompt>();
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get a prompt from the database by slug
 */
export async function getPrompt(slug: string, authenticatedPb?: PocketBase): Promise<DbPrompt | null> {
	try {
		// Use authenticated instance if provided, otherwise fall back to global
		const pbInstance = authenticatedPb || pb;
		console.log(`🔍 Getting prompt for slug: ${slug}`);
		console.log(`🔐 Using authenticated instance: ${!!authenticatedPb}`);
		
		// Check cache first
		if (promptCache.has(slug) && Date.now() < cacheExpiry) {
			console.log(`✅ Found prompt in cache: ${slug}`);
			return promptCache.get(slug)!;
		}

		// If cache is expired, refresh all prompts
		if (Date.now() >= cacheExpiry) {
			console.log(`🔄 Cache expired, refreshing prompts from database...`);
			await refreshPromptCache(pbInstance);
		}

		const cachedPrompt = promptCache.get(slug);
		if (cachedPrompt) {
			console.log(`✅ Found prompt after cache refresh: ${slug}`);
			return cachedPrompt;
		} else {
			console.log(`❌ Prompt not found in database: ${slug}`);
			return null;
		}
	} catch (error) {
		console.error(`Error fetching prompt ${slug}:`, error);
		return null;
	}
}

/**
 * Refresh the entire prompt cache from database
 */
async function refreshPromptCache(pbInstance: PocketBase): Promise<void> {
	try {
		console.log(`🔄 Refreshing prompt cache from database...`);
		const prompts = await pbInstance.collection('prompts').getFullList<DbPrompt>({
			filter: 'active = true',
			sort: 'slug'
		});

		console.log(`📊 Found ${prompts.length} active prompts in database:`);
		prompts.forEach(prompt => {
			console.log(`  - ${prompt.slug} (${prompt.category})`);
		});

		promptCache.clear();
		prompts.forEach(prompt => {
			promptCache.set(prompt.slug, prompt);
		});

		cacheExpiry = Date.now() + CACHE_DURATION;
		console.log(`✅ Prompt cache refreshed, expires in ${CACHE_DURATION / 1000}s`);
	} catch (error) {
		console.error('Error refreshing prompt cache:', error);
		// Extend cache expiry on error to avoid constant retries
		cacheExpiry = Date.now() + (CACHE_DURATION / 10);
	}
}

/**
 * Process shortcodes in prompt content
 * Supports nested shortcodes like [importantRules] -> [answerLengthPreference]
 */
export async function processShortcodes(
	content: string, 
	userContext?: any,
	processedSlugs = new Set<string>(),
	authenticatedPb?: PocketBase
): Promise<string> {
	// Find all shortcodes in the format [slugName]
	const shortcodeRegex = /\[([a-z0-9_-]+)\]/gi;
	const shortcodes = [...content.matchAll(shortcodeRegex)];

	if (shortcodes.length === 0) {
		return content;
	}

	let processedContent = content;

	for (const shortcode of shortcodes) {
		const [fullMatch, slug] = shortcode;

		// Prevent infinite loops
		if (processedSlugs.has(slug)) {
			console.warn(`Circular shortcode reference detected: ${slug}`);
			continue;
		}

		// Handle dynamic preference prompts
		if (slug === 'answerLengthPreference' && userContext) {
			const dynamicContent = generateAnswerLengthPreference(userContext);
			processedContent = processedContent.replace(fullMatch, dynamicContent);
			continue;
		}

		if (slug === 'toneOfVoicePreference' && userContext) {
			const dynamicContent = generateToneOfVoicePreference(userContext);
			processedContent = processedContent.replace(fullMatch, dynamicContent);
			continue;
		}

		if (slug === 'nvcKnowledgePreference' && userContext) {
			const dynamicContent = generateNvcKnowledgePreference(userContext);
			processedContent = processedContent.replace(fullMatch, dynamicContent);
			continue;
		}

		// Handle database prompts
		const prompt = await getPrompt(slug, authenticatedPb);
		if (prompt) {
			// Add to processed set to prevent cycles
			const newProcessedSlugs = new Set(processedSlugs);
			newProcessedSlugs.add(slug);

			// Recursively process any shortcodes in the retrieved prompt
			const resolvedContent = await processShortcodes(
				prompt.content, 
				userContext, 
				newProcessedSlugs,
				authenticatedPb
			);
			
			processedContent = processedContent.replace(fullMatch, resolvedContent);
		} else {
			console.warn(`Shortcode prompt not found: ${slug}`);
			// Leave shortcode as-is if not found
		}
	}

	return processedContent;
}

/**
 * Generate dynamic answer length preference content
 */
function generateAnswerLengthPreference(userContext: any): string {
	if (userContext?.aiAnswerLength === 'short') {
		return `Antworte in maximal 1-2 Sätzen.`;
	} else if (userContext?.aiAnswerLength === 'medium') {
		return `Antworte in maximal 3 Sätzen.`;
	} else if (userContext?.aiAnswerLength === 'long') {
		return `Antworte in maximal 4 Sätzen.`;
	}
	return '';
}

/**
 * Generate dynamic tone of voice preference content
 */
function generateToneOfVoicePreference(userContext: any): string {
	if (userContext?.toneOfVoice === 'analytical') {
		return '- Verwende einen sachlichen, strukturierten Kommunikationsstil\n- Fokussiere auf logische Zusammenhänge und konkrete Schritte';
	} else if (userContext?.toneOfVoice === 'heartfelt') {
		return '- Verwende einen empathischen, warmherzigen Kommunikationsstil\n- Betone emotionale Unterstützung und Verständnis';
	}
	return '';
}

/**
 * Generate dynamic NVC knowledge preference content
 */
function generateNvcKnowledgePreference(userContext: any): string {
	if (userContext?.nvcKnowledge === 'beginner') {
		return '- Erkläre GFK-Konzepte und -Begriffe wenn nötig\n- Verwende einfache Sprache und führe den Nutzer behutsam durch den Prozess';
	} else if (userContext?.nvcKnowledge === 'advanced') {
		return '- Nutze GFK-Fachbegriffe selbstverständlich\n- Fokussiere auf subtile Aspekte und fortgeschrittene Techniken';
	}
	return '';
}

/**
 * Get a complete path definition from database prompt
 */
export async function getPathDefinition(pathId: string, authenticatedPb?: PocketBase): Promise<PathDefinition | null> {
	const prompt = await getPrompt(pathId, authenticatedPb);
	if (!prompt || prompt.category !== 'path') {
		return null;
	}

	return {
		id: prompt.slug,
		name: prompt.name,
		systemPrompt: prompt.content,
		entryCondition: prompt.path_config?.entryCondition,
		exitCondition: prompt.path_config?.exitCondition,
		suggestedNext: prompt.path_config?.suggestedNext
	};
}

/**
 * Get all active path definitions
 */
export async function getAllPaths(authenticatedPb?: PocketBase): Promise<Record<string, PathDefinition>> {
	try {
		const pbInstance = authenticatedPb || pb;
		const prompts = await pbInstance.collection('prompts').getFullList<DbPrompt>({
			filter: 'active = true && category = "path"',
			sort: 'slug'
		});

		const paths: Record<string, PathDefinition> = {};
		
		for (const prompt of prompts) {
			paths[prompt.slug] = {
				id: prompt.slug,
				name: prompt.name,
				systemPrompt: prompt.content,
				entryCondition: prompt.path_config?.entryCondition,
				exitCondition: prompt.path_config?.exitCondition,
				suggestedNext: prompt.path_config?.suggestedNext
			};
		}

		return paths;
	} catch (error) {
		console.error('Error fetching all paths:', error);
		return {};
	}
}

/**
 * Get system prompt for path with shortcode processing and user context
 */
export async function getSystemPromptForPath(
	pathId: string, 
	userContext?: any, 
	memoryContext?: string,
	authenticatedPb?: PocketBase
): Promise<string> {
	const prompt = await getPrompt(pathId, authenticatedPb);
	if (!prompt) {
		throw new Error(`Prompt not found: ${pathId}`);
	}

	let systemPrompt = prompt.content;
	
	// Add memory context for memory path
	if (pathId === 'memory' && memoryContext) {
		systemPrompt = systemPrompt.replace(
			'**DEINE ROLLE:**',
			`**VERFÜGBARE ERINNERUNGEN:**
${memoryContext}

**DEINE ROLLE:**`
		);
	}
	
	// Add user name context if available
	if (userContext?.firstName) {
		systemPrompt = `Du sprichst mit ${userContext.firstName}. ${systemPrompt}`;
	}
	
	// Process all shortcodes with user context
	systemPrompt = await processShortcodes(systemPrompt, userContext, new Set<string>(), authenticatedPb);
	
	return systemPrompt;
}

/**
 * Suggest next paths for a given path
 */
export async function suggestNextPaths(currentPath: string, authenticatedPb?: PocketBase): Promise<PathDefinition[]> {
	const path = await getPathDefinition(currentPath, authenticatedPb);
	if (!path || !path.suggestedNext) return [];
	
	const suggestions: PathDefinition[] = [];
	
	for (const pathId of path.suggestedNext) {
		const suggestedPath = await getPathDefinition(pathId, authenticatedPb);
		if (suggestedPath) {
			suggestions.push(suggestedPath);
		}
	}
	
	return suggestions;
}

/**
 * Clear the prompt cache (useful for development/testing)
 */
export function clearPromptCache(): void {
	promptCache.clear();
	cacheExpiry = 0;
}