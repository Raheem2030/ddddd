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

export type CardType = 'text' | 'media' | 'interactive' | 'simulator' | 'flashcards';

export interface TextSubPanel {
  title: string;
  content: string;
  icon: 'atom' | 'capsule' | 'list' | 'flame' | 'hourglass' | 'flask' | 'book';
  color: 'blue' | 'purple';
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'diagram';
  url: string;
  title: string;
  caption?: string;
}

export interface ContentCard {
  id: string;
  title: string;
  type?: 'text' | 'media' | 'interactive' | 'simulator' | 'flashcards';
  
  // Text content
  content?: string[];
  subPanels?: TextSubPanel[];
  
  // Media content
  items?: MediaItem[];
  
  // Interactive content
  question?: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation?: string;

  // Simulator content
  simulatorId?: string;

  // Flashcards content
  terms?: Term[];
}

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
  type?: 'quiz' | 'simulator';
  path?: string; // Optional custom route path
  questionCount?: number;
  durationMinutes?: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Term {
  arabic: string;
  latin?: string;
  english?: string;
  description?: string;
}

export interface Compilation {
  id: string;
  title: string;
  description?: string;
  terms: Term[];
}

export interface SubjectContent {
  subjectId: string;
  chapters: Chapter[];
  resources?: Resource[];
  quizzes?: Quiz[];
  compilations?: Compilation[];
}
