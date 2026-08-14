import { PlanGenerationRequest, StudyPlan, TutorMessage } from '../types';

export async function generateStudyPlan(data: PlanGenerationRequest): Promise<StudyPlan> {
  const response = await fetch('/api/analyze-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate personalized study plan with Gemini.');
  }

  return response.json();
}

export async function sendTutorMessage(params: {
  topicName: string;
  courseName: string;
  userMessage: string;
  history: TutorMessage[];
  mode?: 'socratic' | 'hint' | 'simplify' | 'test' | 'cheatsheet';
  currentDifficulty?: string;
}): Promise<{ reply: string; mode: string; timestamp: string }> {
  const response = await fetch('/api/tutor-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to communicate with AI Tutor.');
  }

  return response.json();
}

export async function generatePracticeQuestion(params: {
  topicName: string;
  courseName: string;
  difficulty?: string;
}): Promise<{
  question: string;
  marks: number;
  conceptTested: string;
  hint1: string;
  hint2: string;
  keyRubric: string[];
}> {
  const response = await fetch('/api/generate-practice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate practice question.');
  }

  return response.json();
}

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean; model: string }> {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) return { status: 'error', hasApiKey: false, model: 'gemini-3.5-flash' };
    return response.json();
  } catch (e) {
    return { status: 'offline', hasApiKey: false, model: 'gemini-3.5-flash' };
  }
}
