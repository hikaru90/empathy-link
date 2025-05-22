export interface Content {
  page: number;
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

export interface TopicVersions {
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