import { z } from 'zod';

// Remove the Content interface - we'll work directly with ContentBlock array

export type ContentBlock =
  | TextBlock
  | ListBlock
  | HeadingBlock
  | TaskBlock
  | TimerBlock
  | BreatheBlock
  | BodymapBlock
  | TaskCompletionBlock
  | SortableBlock
  | MultipleChoiceBlock
  | AIQuestionBlock
  | FeelingsDetectiveBlock
  | ImageBlock
  | AudioBlock
  | NextPageBlock
  | PageNavigationBlock;

export interface TextBlock {
  type: "text";
  content: string;
  ctaText?: string; // Optional CTA button text
  sources?: {
    sort: number;
    title: string;
    url: string;
    author: string;
  }[];
}

export interface ListBlock {
  type: "list";
  items: {
    title: string;
    text: string;
  }[];
}

export interface HeadingBlock {
  type: "heading";
  hierarchy: number; // e.g., 1 for h1, 2 for h2
  content: string;
  subheading?: string; // Optional subheading text
}

export interface TaskBlock {
  type: "task";
  duration?: number; // in seconds, optional
  content: string;
}

export interface TimerBlock {
  type: "timer";
  duration: number; // in seconds
}

export interface BreatheBlock {
  type: "breathe";
  duration?: number; // duration in seconds, default 60 (1 minute)
}

export interface BodymapBlock {
  type: "bodymap";
}

export interface TaskCompletionBlock {
  type: "taskCompletion";
  taskId?: string; // Optional reference to link with specific task
  allowNotes?: boolean; // Whether to show notes field
  notesPlaceholder?: string; // Custom placeholder for notes
}

export interface SortableBlock {
  type: "sortable";
  bucketA: string; // Name of first bucket
  bucketB: string; // Name of second bucket
  items: {
    text: string;
    correctBucket: "A" | "B"; // Which bucket this item belongs to
  }[];
}

export interface MultipleChoiceBlock {
  type: "multipleChoice";
  questions: {
    question: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
    explanation?: string;
  }[];
  allowMultiple?: boolean; // Whether multiple correct answers are allowed
}

export interface AIQuestionBlock {
  type: "aiQuestion";
  question: string;
  systemPrompt: string;
  placeholder?: string; // Optional placeholder for the answer field
}

export interface FeelingsDetectiveBlock {
  type: "feelingsDetective";
  question?: string; // Optional custom question for situation input
}

export interface ImageBlock {
  type: "image";
  src: string; // URL or file path
  alt?: string; // Alt text for accessibility
  caption?: string; // Optional caption
  width?: number; // Optional width constraint
  alignment?: 'left' | 'center' | 'right'; // Image alignment
}

export interface AudioBlock {
  type: "audio";
  src: string; // URL or file path to audio file
  content?: string; // Optional markdown content to display with the audio
  title?: string; // Optional title for the audio
  transcript?: string; // Optional transcript
  autoplay?: boolean; // Whether to autoplay (default false)
  loop?: boolean; // Whether to loop (default false)
  controls?: boolean; // Whether to show controls (default true)
}

export interface NextPageBlock {
  type: "nextPage";
  text?: string; // Button text (default: "Next")
  variant?: 'default' | 'minimal' | 'floating' | 'large'; // Button style
  disabled?: boolean; // Whether button is disabled
  customAction?: string; // Optional custom action identifier
}

export interface PageNavigationBlock {
  type: "pageNavigation";
  showNext?: boolean; // Show next button (default: true)
  showPrev?: boolean; // Show previous button (default: false)
  nextText?: string; // Next button text (default: "Next")
  prevText?: string; // Previous button text (default: "Previous")
  variant?: 'default' | 'minimal' | 'floating' | 'inline'; // Navigation style
  nextDisabled?: boolean; // Whether next is disabled
  prevDisabled?: boolean; // Whether prev is disabled
}

export interface TopicVersion {
  id: string;
  titleDE: string;
  titleEN: string;
  descriptionDE: string;
  descriptionEN: string;
  category: string;
  image: string;
  content: ContentBlock[];
  topic: string;
  created: string;
  updated: string;
}

// Zod schemas for content blocks
const textBlockSchema = z.object({
  type: z.literal("text"),
  content: z.string(),
  ctaText: z.string().optional(), // Optional CTA button text
  sources: z.array(z.object({
    sort: z.number(),
    title: z.string(),
    url: z.string(),
    author: z.string()
  })).optional() // Optional sources list
});

const listBlockSchema = z.object({
  type: z.literal("list"),
  items: z.array(z.object({
    title: z.string(),
    text: z.string()
  }))
});

const headingBlockSchema = z.object({
  type: z.literal("heading"),
  hierarchy: z.number().min(1).max(6),
  content: z.string(),
  subheading: z.string().optional()
});

const taskBlockSchema = z.object({
  type: z.literal("task"),
  duration: z.number().min(0).optional(),
  content: z.string()
});

const timerBlockSchema = z.object({
  type: z.literal("timer"),
  duration: z.number().min(0)
});

const breatheBlockSchema = z.object({
  type: z.literal("breathe"),
  duration: z.union([z.literal(15), z.literal(30), z.literal(60), z.literal(120)]).optional() // 15s, 30s, 1min, 2min
});

const bodymapBlockSchema = z.object({
  type: z.literal("bodymap")
});

const taskCompletionBlockSchema = z.object({
  type: z.literal("taskCompletion"),
  taskId: z.string().optional(),
  allowNotes: z.boolean().optional(),
  notesPlaceholder: z.string().optional()
});

const sortableBlockSchema = z.object({
  type: z.literal("sortable"),
  bucketA: z.string(),
  bucketB: z.string(),
  items: z.array(z.object({
    text: z.string(),
    correctBucket: z.enum(["A", "B"])
  }))
});

const multipleChoiceBlockSchema = z.object({
  type: z.literal("multipleChoice"),
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.object({
      text: z.string(),
      isCorrect: z.boolean()
    })),
    explanation: z.string().optional()
  })),
  allowMultiple: z.boolean().optional()
});

const aiQuestionBlockSchema = z.object({
  type: z.literal("aiQuestion"),
  question: z.string(),
  systemPrompt: z.string(),
  placeholder: z.string().optional()
});

const feelingsDetectiveBlockSchema = z.object({
  type: z.literal("feelingsDetective"),
  question: z.string().optional()
});

const imageBlockSchema = z.object({
  type: z.literal("image"),
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().optional(),
  alignment: z.enum(['left', 'center', 'right']).optional()
});

const audioBlockSchema = z.object({
  type: z.literal("audio"),
  src: z.string(),
  content: z.string().optional(),
  title: z.string().optional(),
  transcript: z.string().optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  controls: z.boolean().optional()
});

const nextPageBlockSchema = z.object({
  type: z.literal("nextPage"),
  text: z.string().optional(),
  variant: z.enum(['default', 'minimal', 'floating', 'large']).optional(),
  disabled: z.boolean().optional(),
  customAction: z.string().optional()
});

const pageNavigationBlockSchema = z.object({
  type: z.literal("pageNavigation"),
  showNext: z.boolean().optional(),
  showPrev: z.boolean().optional(),
  nextText: z.string().optional(),
  prevText: z.string().optional(),
  variant: z.enum(['default', 'minimal', 'floating', 'inline']).optional(),
  nextDisabled: z.boolean().optional(),
  prevDisabled: z.boolean().optional()
});

const contentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  listBlockSchema,
  headingBlockSchema,
  taskBlockSchema,
  timerBlockSchema,
  breatheBlockSchema,
  bodymapBlockSchema,
  taskCompletionBlockSchema,
  sortableBlockSchema,
  multipleChoiceBlockSchema,
  aiQuestionBlockSchema,
  feelingsDetectiveBlockSchema,
  imageBlockSchema,
  audioBlockSchema,
  nextPageBlockSchema,
  pageNavigationBlockSchema
]);

export const topicVersionFormSchema = z.object({
  titleDE: z.string().optional(),
  titleEN: z.string().optional(),
  descriptionDE: z.string().optional(),
  descriptionEN: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  content: z.array(contentBlockSchema).optional()
});

export type TopicVersionFormSchema = typeof topicVersionFormSchema;



// Learning Session Response Types
export interface SessionResponse {
  blockIndex: number;
  blockType: ContentBlock['type'];
  response: any;
  timestamp: string;
  // Version-independent identification
  blockContent: ContentBlock; // Snapshot of the actual content block at time of response
  topicVersionId: string; // The version this response was created for
}

export interface TaskResponse extends SessionResponse {
  blockType: 'task';
  response: {
    completed: boolean;
    notes?: string;
    timeSpent?: number; // in seconds
  };
}

export interface BodymapResponse extends SessionResponse {
  blockType: 'bodymap';
  response: {
    points: Array<{
      x: number;
      y: number;
      feelings: string[]; // feeling IDs
    }>;
  };
}

export interface TimerResponse extends SessionResponse {
  blockType: 'timer';
  response: {
    completed: boolean;
    actualDuration?: number; // how long they actually spent
  };
}

export interface TaskCompletionResponse extends SessionResponse {
  blockType: 'taskCompletion';
  response: {
    completed: boolean;
    notes?: string;
    timeSpent?: number; // in seconds
  };
}

export interface SortableResponse extends SessionResponse {
  blockType: 'sortable';
  response: {
    userSorting: { [itemText: string]: "A" | "B" | null };
    completed: boolean;
  };
}

export interface MultipleChoiceResponse extends SessionResponse {
  blockType: 'multipleChoice';
  response: {
    questionResponses: {
      questionIndex: number;
      selectedOptions: number[];
      isCorrect: boolean;
      timeSpent: number;
    }[];
    completed: boolean;
    totalTimeSpent: number;
  };
}

export interface AIQuestionResponse extends SessionResponse {
  blockType: 'aiQuestion';
  response: {
    userAnswer: string;
    aiResponse: string;
    timestamp: string;
    responseTime?: number; // time taken to get AI response
  };
}

export interface FeelingsDetectiveResponse extends SessionResponse {
  blockType: 'feelingsDetective';
  response: {
    situationInput: string;
    aiReflection: string;
    thoughtsInput: string;
    selectedFeelings: string[]; // feeling IDs
    aiSummary: string;
    timestamp: string;
    responseTime?: number;
  };
}

export interface LearningSession {
  id: string;
  user: string;
  topic: string;
  topicVersion: string;
  currentPage: number;
  responses: SessionResponse[];
  created: string;
  updated: string;
  completed?: boolean;
  completedAt?: string;
  feedback?: ModuleFeedback; // Optional feedback when module is completed
}

export interface ModuleFeedback {
  rating: number; // 1-5 star rating
  feedback: string; // User's general feedback
  improvements: string; // Suggestions for improvements
  submittedAt: string; // Timestamp when feedback was submitted
}