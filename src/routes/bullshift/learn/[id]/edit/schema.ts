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
  | BodymapBlock;

export interface TextBlock {
  type: "text";
  content: string;
}

export interface ListBlock {
  type: "list";
  items: string[];
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
  items: z.array(z.string())
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

const contentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  listBlockSchema,
  headingBlockSchema,
  taskBlockSchema,
  timerBlockSchema,
  bodymapBlockSchema
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