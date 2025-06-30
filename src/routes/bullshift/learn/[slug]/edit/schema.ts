import { z } from 'zod';

export interface Content {
  page: number;
  name: string;
  content: ContentBlock[];
}

export type ContentBlock =
  | TextBlock
  | ListBlock
  | HeadingBlock
  | TaskBlock
  | TimerBlock
  | BodymapBlock
  | TaskCompletionBlock
  | SortableBlock
  | MultipleChoiceBlock;

export interface TextBlock {
  type: "text";
  content: string;
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
}

export interface TaskBlock {
  type: "task";
  duration: number; // in seconds
  content: string;
}

export interface TimerBlock {
  type: "timer";
  duration: number; // in seconds
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

export interface TopicVersion {
  id: string;
  titleDE: string;
  titleEN: string;
  descriptionDE: string;
  descriptionEN: string;
  category: string;
  image: string;
  content: Content[];
  topic: string;
  created: string;
  updated: string;
}

// Zod schemas for content blocks
const textBlockSchema = z.object({
  type: z.literal("text"),
  content: z.string()
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
  content: z.string()
});

const taskBlockSchema = z.object({
  type: z.literal("task"),
  duration: z.number().min(0),
  content: z.string()
});

const timerBlockSchema = z.object({
  type: z.literal("timer"),
  duration: z.number().min(0)
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

const contentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  listBlockSchema,
  headingBlockSchema,
  taskBlockSchema,
  timerBlockSchema,
  bodymapBlockSchema,
  taskCompletionBlockSchema,
  sortableBlockSchema,
  multipleChoiceBlockSchema
]);

const contentSchema = z.object({
  page: z.number().min(1),
  name: z.string().min(1, "Page name is required"),
  content: z.array(contentBlockSchema)
});

export const topicVersionFormSchema = z.object({
  titleDE: z.string().optional(),
  titleEN: z.string().optional(),
  descriptionDE: z.string().optional(),
  descriptionEN: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  content: z.array(contentSchema).optional()
});

export type TopicVersionFormSchema = typeof topicVersionFormSchema;



// Learning Session Response Types
export interface SessionResponse {
  pageIndex: number;
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