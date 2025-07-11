import { getContext, setContext } from 'svelte';

interface ComponentStepInfo {
	componentId: string;
	totalSteps: number;
	currentStep: number;
	pageIndex: number;
	blockIndex: number;
}

interface ComponentStepState {
	pageIndex: number;
	blockIndex: number;
	currentStep: number;
	totalSteps: number;
	componentType: string;
}

interface LearningNavigationContext {
	currentPage: number;
	totalPages: number;
	canGoNext: boolean;
	canGoPrev: boolean;
	gotoNextPage: () => void;
	gotoPrevPage: () => void;
	gotoPage: (page: number) => void;
	aiQuestionStep?: 'question' | 'response';
	setAIQuestionStep: (step: 'question' | 'response' | undefined) => void;
	// Component-based step management
	registerComponentSteps: (info: ComponentStepInfo) => void;
	unregisterComponentSteps: (componentId: string) => void;
	getComponentSteps: () => ComponentStepInfo[];
	// Global step state management
	getComponentStepState: (pageIndex: number, blockIndex: number) => ComponentStepState | null;
	setComponentStepState: (pageIndex: number, blockIndex: number, stepState: ComponentStepState) => void;
	updateComponentStepState?: (pageIndex: number, blockIndex: number, componentType: string, currentStep: number, totalSteps: number) => void;
	computeComponentStep: (pageIndex: number, blockIndex: number, componentType: string, session: any) => number;
}

const LEARNING_CONTEXT_KEY = Symbol('learning-navigation');

export function setLearningContext(context: LearningNavigationContext) {
	setContext(LEARNING_CONTEXT_KEY, context);
}

export function getLearningContext(): LearningNavigationContext | undefined {
	return getContext(LEARNING_CONTEXT_KEY);
}

export type { ComponentStepInfo, ComponentStepState, LearningNavigationContext }; 