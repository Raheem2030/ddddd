export type Year = 'السنة الثانية' | 'السنة الثالثة' | 'السنة الرابعة' | 'السنة الخامسة';
export type Semester = 'الفصل الأول' | 'الفصل الثاني';
export type SubjectTypeFilter = 'نظري' | 'عملي';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export interface Subject {
  id: string;
  name: string;
  year: Year;
  semester: Semester;
  type: string; // e.g., 'نظري', 'عملي', 'نظري + عملي'
}

export type CardType = 'text' | 'media' | 'interactive';

export interface BaseCard {
  id: string;
  type: CardType;
  title: string;
}

export interface TextSubPanel {
  title: string;
  content: string;
  icon: 'atom' | 'capsule' | 'list' | 'flame' | 'hourglass' | 'flask' | 'book';
  color: 'blue' | 'purple';
}

export interface TextCardData extends BaseCard {
  type: 'text';
  content?: string[]; // Paragraphs or bullet points
  subPanels?: TextSubPanel[];
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'diagram';
  url: string;
  title: string;
  caption?: string;
}

export interface MediaCardData extends BaseCard {
  type: 'media';
  items: MediaItem[];
}

export interface InteractiveCardData extends BaseCard {
  type: 'interactive';
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export type ContentCard = TextCardData | MediaCardData | InteractiveCardData;

export interface Capsule {
  id: string;
  title: string;
  description?: string;
  cards: ContentCard[];
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  capsules: Capsule[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'link';
  size?: string;
  url?: string;
  description?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questionCount: number;
  durationMinutes: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface SubjectContent {
  subjectId: string;
  chapters: Chapter[];
  resources?: Resource[];
  quizzes?: Quiz[];
}
