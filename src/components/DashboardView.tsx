import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  BookOpen, 
  HelpCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { StudyPlan, StudyTopic } from '../types';
import { GeminiBadge } from './GeminiBadge';

interface DashboardViewProps {
  studyPlan: StudyPlan | null;
  onNavigateToMaterials: () => void;
  onNavigateToPlan: () => void;
  onStartTutorSession: (topic?: StudyTopic) => void;
  onToggleMastery: (topicId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  studyPlan,
  onNavigateToMaterials,
  onNavigateToPlan,
  onStartTutorSession,
  onToggleMastery,
}) => {
  // Countdown simulation (relative to exam date)
  const [countdown, setCountdown] = useState({
    days: 3,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!studyPlan) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6">
        <div className="text-center bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 shadow-xs">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Welcome to RUET PrepPilot
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
            Upload your RUET course materials and previous exam questions to generate a focused, high-yield study plan and Socratic tutoring session.
          </p>
          <button
            id="get-started-materials-btn"
            onClick={onNavigateToMaterials}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
          >
            <span>Set Up Materials & Generate Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Calculate dynamic readiness score based on mastered topics
  const totalTopics = studyPlan.topics.length;
  const masteredCount = studyPlan.topics.filter((t) => t.isMastered).length;
  const masteryPercentage = totalTopics > 0 ? Math.round((masteredCount / totalTopics) * 100) : 0;
  const currentReadiness = Math.min(100, Math.round(studyPlan.readinessScore * 0.5 + masteryPercentage * 0.5));

  // Determine the "Focus Now" highest priority unmastered topic
  const focusTopic =
    studyPlan.topics.find((t) => !t.isMastered && t.priority === 'urgent') ||
    studyPlan.topics.find((t) => !t.isMastered && t.priority === 'high') ||
    studyPlan.topics.find((t) => !t.isMastered) ||
    studyPlan.topics[0];

  const urgentCount = studyPlan.topics.filter((t) => t.priority === 'urgent' && !t.isMastered).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Simple Course & Countdown Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              {studyPlan.courseCode}
            </span>
            <span className="text-xs text-slate-400 font-medium">•</span>
            <span className="text-xs text-slate-500 font-medium">RUET Semester Final</span>
            <GeminiBadge variant="subtle" label="Gemini 3.5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {studyPlan.courseName}
          </h1>
        </div>

        {/* Minimal Countdown Indicator */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs self-start sm:self-auto">
          <Clock className="w-4 h-4 text-indigo-600" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Exam Countdown</div>
            <div className="text-sm font-bold text-slate-900 font-mono">
              {countdown.days}d {countdown.hours}h {countdown.minutes}m
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main "Focus Now" Hero Card with Single Obvious Primary CTA */}
      <div className="bg-white border-2 border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Focus Now</span>
              </span>
              {focusTopic?.expectedMarks && (
                <span className="text-xs font-semibold text-slate-500">
                  ~{focusTopic.expectedMarks} Marks in Final
                </span>
              )}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {focusTopic?.name}
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                {focusTopic?.whyItMatters}
              </p>
            </div>

            {focusTopic?.studentWeaknessNote && (
              <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200/60 rounded-lg p-2.5">
                <span className="font-semibold text-slate-800">Your target focus: </span>
                <span>{focusTopic.studentWeaknessNote}</span>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0 flex flex-col items-stretch sm:items-center gap-2">
            <button
              id="dashboard-start-study-session-btn"
              onClick={() => onStartTutorSession(focusTopic)}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2.5 active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start Study Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 text-center font-medium">
              Socratic AI Tutor • ~{focusTopic?.estimatedMinutes || 60} mins
            </span>
          </div>
        </div>
      </div>

      {/* 3. Short Personalized Study Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Personalized Study Summary</h3>
          <button
            id="view-full-plan-link-btn"
            onClick={onNavigateToPlan}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View Full Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          {studyPlan.overallStrategy}
        </p>

        {/* 3 Simple Snapshot Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="text-xs text-slate-500 font-medium">Exam Readiness</div>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{currentReadiness}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentReadiness}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="text-xs text-slate-500 font-medium">Estimated Prep Time</div>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
              {studyPlan.totalEstimatedHours} hours
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5">Across {studyPlan.dailySchedule.length} study days</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="text-xs text-slate-500 font-medium">Topic Mastery</div>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
              {masteredCount} of {totalTopics}
            </div>
            <div className="text-[11px] text-red-600 font-medium mt-1.5">
              {urgentCount > 0 ? `${urgentCount} urgent remaining` : 'All urgent mastered'}
            </div>
          </div>
        </div>

        {/* Next High-Yield Topics List */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Key Exam Topics
          </div>
          <div className="divide-y divide-slate-100">
            {studyPlan.topics.slice(0, 3).map((topic) => (
              <div
                key={topic.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onToggleMastery(topic.id)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      topic.isMastered ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {topic.isMastered && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <span
                    className={`font-semibold ${
                      topic.isMastered ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {topic.name}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">({topic.category})</span>
                </div>

                <button
                  onClick={() => onStartTutorSession(topic)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
