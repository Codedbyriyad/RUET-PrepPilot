export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

export interface StudyTopic {
  id: string;
  name: string;
  category: string;
  priority: PriorityLevel;
  whyItMatters: string;
  studentWeaknessNote: string;
  previousQuestionRelevance: string;
  estimatedMinutes: number;
  isMastered: boolean;
  keyConcepts: string[];
  sampleQuestion?: string;
  expectedMarks?: number;
}

export interface DailyPlanDay {
  dayNumber: number;
  dateLabel: string;
  focusTitle: string;
  topics: string[];
  totalHours: number;
  milestone: string;
}

export interface StudyPlan {
  courseName: string;
  courseCode: string;
  examDate: string;
  generatedAt: string;
  overallStrategy: string;
  readinessScore: number;
  totalEstimatedHours: number;
  highPriorityCount: number;
  urgentPriorityCount: number;
  topics: StudyTopic[];
  dailySchedule: DailyPlanDay[];
  quickTips: string[];
}

export interface CoursePreset {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  semester: string;
  syllabusSnippet: string;
  previousQuestions: string;
  commonWeakTopics: string[];
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor' | 'system';
  text: string;
  timestamp: string;
  topic?: string;
  hintLevel?: number;
  practiceQuestion?: {
    question: string;
    marks: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  };
}

export interface PlanGenerationRequest {
  courseName: string;
  courseCode: string;
  examDate: string;
  courseMaterialText: string;
  previousQuestionsText: string;
  weakTopics: string[];
  dailyAvailableHours?: number;
}
