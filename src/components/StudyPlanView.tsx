import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  GraduationCap, 
  HelpCircle, 
  ArrowRight,
  Filter,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { PriorityLevel, StudyPlan, StudyTopic } from '../types';
import { GeminiBadge } from './GeminiBadge';

interface StudyPlanViewProps {
  studyPlan: StudyPlan;
  onStartTutorOnTopic: (topic: StudyTopic) => void;
  onToggleMastery: (topicId: string) => void;
  onNavigateToMaterials: () => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  studyPlan,
  onStartTutorOnTopic,
  onToggleMastery,
  onNavigateToMaterials,
}) => {
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'all' | PriorityLevel>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Extract unique categories
  const categories = Array.from(new Set(studyPlan.topics.map((t) => t.category)));

  // Filter topics
  const filteredTopics = studyPlan.topics.filter((topic) => {
    const matchesPriority = selectedPriorityFilter === 'all' || topic.priority === selectedPriorityFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || topic.category === selectedCategoryFilter;
    return matchesPriority && matchesCategory;
  });

  const masteredCount = studyPlan.topics.filter((t) => t.isMastered).length;
  const totalTopics = studyPlan.topics.length;
  const masteryPercentage = Math.round((masteredCount / totalTopics) * 100);

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
            <Flame className="w-3 h-3 text-red-600" />
            <span>Urgent</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <span>High Yield</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
            <span>Medium</span>
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <span>Review</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
              {studyPlan.courseCode}
            </span>
            <span className="text-xs text-slate-400 font-medium">•</span>
            <span className="text-xs text-slate-600 font-medium">Exam Date: {studyPlan.examDate}</span>
            <GeminiBadge variant="subtle" label="Prioritized by Gemini" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Personalized Study Plan
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {studyPlan.overallStrategy}
          </p>
        </div>

        {/* Quick Progress Indicator */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs self-start md:self-auto min-w-[200px]">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Mastery Progress</span>
            <span className="font-bold text-indigo-600">{masteredCount}/{totalTopics}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Topics Matrix (8 cols), Right Daily Roadmap (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Prioritized Topics List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Filter:</span>
              </span>
              {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriorityFilter(p)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize transition-colors ${
                    selectedPriorityFilter === p
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {categories.length > 1 && (
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Modules ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Topics List */}
          <div className="space-y-4">
            {filteredTopics.map((topic, idx) => {
              const isExpanded = expandedTopicId === topic.id;
              return (
                <div
                  key={topic.id || idx}
                  className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all shadow-xs ${
                    topic.isMastered
                      ? 'border-emerald-200/80 bg-emerald-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Topic Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => onToggleMastery(topic.id)}
                        title={topic.isMastered ? 'Mark unmastered' : 'Mark mastered'}
                        className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          topic.isMastered
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300 hover:border-indigo-600'
                        }`}
                      >
                        {topic.isMastered && <CheckCircle className="w-3.5 h-3.5" />}
                      </button>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getPriorityBadge(topic.priority)}
                          <span className="text-xs text-slate-500 font-medium">
                            {topic.category}
                          </span>
                          {topic.expectedMarks && (
                            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-100">
                              ~{topic.expectedMarks} Marks
                            </span>
                          )}
                        </div>

                        <h3
                          className={`text-base sm:text-lg font-bold tracking-tight ${
                            topic.isMastered ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {topic.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{topic.estimatedMinutes}m</span>
                    </div>
                  </div>

                  {/* Clean 3 Core Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <span className="font-bold text-slate-700 text-[10px] uppercase block mb-1">
                        Why It Matters:
                      </span>
                      <p className="text-slate-600 leading-relaxed">{topic.whyItMatters}</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <span className="font-bold text-slate-700 text-[10px] uppercase block mb-1">
                        Target Focus:
                      </span>
                      <p className="text-slate-600 leading-relaxed">{topic.studentWeaknessNote}</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <span className="font-bold text-slate-700 text-[10px] uppercase block mb-1">
                        RUET Past Exams:
                      </span>
                      <p className="text-indigo-900 font-medium leading-relaxed">
                        {topic.previousQuestionRelevance}
                      </p>
                    </div>
                  </div>

                  {/* Sample Question Toggle */}
                  {topic.sampleQuestion && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Hide Sample Question' : 'View Sample Exam Question'}</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 space-y-1 font-mono leading-relaxed">
                          <p className="whitespace-pre-wrap">{topic.sampleQuestion}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Row */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onToggleMastery(topic.id)}
                      className={`text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        topic.isMastered ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{topic.isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
                    </button>

                    <button
                      id={`study-tutor-btn-${topic.id}`}
                      onClick={() => onStartTutorOnTopic(topic)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-amber-300" />
                      <span>Start AI Tutoring</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Daily Study Plan Roadmap (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 sticky top-20">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Daily Roadmap</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {studyPlan.dailySchedule.length} Days
              </span>
            </div>

            <div className="space-y-3">
              {studyPlan.dailySchedule.map((day) => (
                <div key={day.dayNumber} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{day.dateLabel}</span>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-100">
                      {day.totalHours}h
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-700">{day.focusTitle}</h4>

                  <ul className="text-xs text-slate-600 space-y-1">
                    {day.topics.map((t, tIdx) => (
                      <li key={tIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span className="line-clamp-1">{t}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">Goal: </span>
                    {day.milestone}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onNavigateToMaterials}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-center"
            >
              Update Materials & Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
