// Gemini pricing per million tokens as of latest pricing
// https://ai.google.dev/pricing
export const GEMINI_PRICING = {
	// Input tokens (per million)
	INPUT_PRICE_PER_MILLION: 0.075, // $0.075 per 1M input tokens
	// Output tokens (per million)
	OUTPUT_PRICE_PER_MILLION: 0.30, // $0.30 per 1M output tokens
} as const;

export interface TokenCostBreakdown {
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	inputCostUSD: number;
	outputCostUSD: number;
	totalCostUSD: number;
	inputCostCents: number;
	outputCostCents: number;
	totalCostCents: number;
}

/**
 * Calculate the cost of tokens in USD and cents
 */
export function calculateTokenCost(inputTokens: number, outputTokens: number): TokenCostBreakdown {
	const inputCostUSD = (inputTokens / 1000000) * GEMINI_PRICING.INPUT_PRICE_PER_MILLION;
	const outputCostUSD = (outputTokens / 1000000) * GEMINI_PRICING.OUTPUT_PRICE_PER_MILLION;
	const totalCostUSD = inputCostUSD + outputCostUSD;

	return {
		inputTokens,
		outputTokens,
		totalTokens: inputTokens + outputTokens,
		inputCostUSD,
		outputCostUSD,
		totalCostUSD,
		inputCostCents: Math.round(inputCostUSD * 100 * 100) / 100, // Round to 2 decimal places
		outputCostCents: Math.round(outputCostUSD * 100 * 100) / 100,
		totalCostCents: Math.round(totalCostUSD * 100 * 100) / 100,
	};
}

/**
 * Aggregate token costs from multiple traces
 */
export function aggregateTokenCosts(traces: Array<{inputTokens?: number; outputTokens?: number}>): TokenCostBreakdown {
	const totalInputTokens = traces.reduce((sum, trace) => sum + (trace.inputTokens || 0), 0);
	const totalOutputTokens = traces.reduce((sum, trace) => sum + (trace.outputTokens || 0), 0);

	return calculateTokenCost(totalInputTokens, totalOutputTokens);
}