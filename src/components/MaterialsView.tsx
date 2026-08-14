import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Calendar, 
  Plus, 
  X, 
  Check, 
  BookOpen, 
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { RUET_COURSE_PRESETS } from '../data/ruetPresets';
import { PlanGenerationRequest } from '../types';
import { GeminiBadge } from './GeminiBadge';

interface MaterialsViewProps {
  onGeneratePlan: (req: PlanGenerationRequest) => Promise<void>;
  isLoading: boolean;
  activeCourseName?: string;
  activeCourseCode?: string;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  onGeneratePlan,
  isLoading,
  activeCourseName,
  activeCourseCode,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ruet-cse-3201');
  const [courseName, setCourseName] = useState<string>(activeCourseName || 'Operating Systems & System Programming');
  const [courseCode, setCourseCode] = useState<string>(activeCourseCode || 'CSE 3201');
  const [examDate, setExamDate] = useState<string>('In 3 Days (Monday)');
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [courseMaterialText, setCourseMaterialText] = useState<string>(RUET_COURSE_PRESETS[0].syllabusSnippet);
  const [previousQuestionsText, setPreviousQuestionsText] = useState<string>(RUET_COURSE_PRESETS[0].previousQuestions);
  const [weakTopics, setWeakTopics] = useState<string[]>([
    "Banker's Algorithm & Safety Check",
    "Process Synchronization (Semaphores & Peterson's Solution)"
  ]);
  const [newWeakTopicInput, setNewWeakTopicInput] = useState<string>('');
  const [materialFileName, setMaterialFileName] = useState<string>('RUET_CSE3201_Syllabus_Slides.pdf');
  const [questionsFileName, setQuestionsFileName] = useState<string>('RUET_Final_Questions_2022_2023.pdf');
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  const materialFileInputRef = useRef<HTMLInputElement>(null);
  const questionsFileInputRef = useRef<HTMLInputElement>(null);

  // Load a RUET course preset
  const handleSelectPreset = (presetId: string) => {
    const preset = RUET_COURSE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setCourseName(preset.courseName);
      setCourseCode(preset.courseCode);
      setCourseMaterialText(preset.syllabusSnippet);
      setPreviousQuestionsText(preset.previousQuestions);
      setWeakTopics(preset.commonWeakTopics.slice(0, 3));
      setMaterialFileName(`${preset.courseCode.replace(/\s+/g, '_')}_Course_Notes.pdf`);
      setQuestionsFileName(`${preset.courseCode.replace(/\s+/g, '_')}_RUET_Past_Finals.pdf`);
    } else {
      setSelectedPresetId('custom');
    }
  };

  // Toggle or add weak topic
  const toggleWeakTopic = (topic: string) => {
    if (weakTopics.includes(topic)) {
      setWeakTopics(weakTopics.filter((t) => t !== topic));
    } else {
      setWeakTopics([...weakTopics, topic]);
    }
  };

  const handleAddCustomWeakTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeakTopicInput.trim() && !weakTopics.includes(newWeakTopicInput.trim())) {
      setWeakTopics([...weakTopics, newWeakTopicInput.trim()]);
      setNewWeakTopicInput('');
    }
  };

  // File upload handlers
  const handleMaterialFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMaterialFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text && text.trim().length > 0) {
          setCourseMaterialText(text);
        } else {
          setCourseMaterialText(`[Uploaded File: ${file.name} - ${Math.round(file.size / 1024)} KB]\n\nCourse Syllabus & Slide Outline:\n${courseMaterialText}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleQuestionsFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuestionsFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text && text.trim().length > 0) {
          setPreviousQuestionsText(text);
        } else {
          setPreviousQuestionsText(`[Uploaded Question Paper: ${file.name} - ${Math.round(file.size / 1024)} KB]\n\nPrevious RUET Semester Final Questions:\n${previousQuestionsText}`);
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle plan generation submit with simulated progress steps
  const handleSubmit = async () => {
    setAnalysisStep(1);
    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 600);

    try {
      await onGeneratePlan({
        courseName,
        courseCode,
        examDate,
        courseMaterialText,
        previousQuestionsText,
        weakTopics,
        dailyAvailableHours: dailyHours,
      });
    } finally {
      clearInterval(stepInterval);
      setAnalysisStep(0);
    }
  };

  const currentPreset = RUET_COURSE_PRESETS.find((p) => p.id === selectedPresetId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Course Setup</span>
            <GeminiBadge variant="subtle" label="Gemini Analysis" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Materials & Exam Information
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Provide course content and past questions to tailor your preparation plan.
          </p>
        </div>

        {/* 1-Click Course Preset Dropdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-2 sm:min-w-[240px] shadow-2xs">
          <label className="text-[10px] font-bold uppercase text-slate-400 block px-1 mb-1">
            Load Course Preset:
          </label>
          <select
            id="ruet-preset-select"
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
          >
            {RUET_COURSE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.courseCode} - {p.courseName.slice(0, 26)}...
              </option>
            ))}
            <option value="custom">Custom Course...</option>
          </select>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="space-y-6">
        {/* Section 1: Course & Schedule Details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Target Course & Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-700 mb-1">Course Code</label>
              <input
                type="text"
                id="course-code-input"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CSE 3201"
                className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Course Title</label>
              <input
                type="text"
                id="course-name-input"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Operating Systems & System Programming"
                className="w-full text-xs font-medium text-slate-900 border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Exam Date / Countdown</label>
              <input
                type="text"
                id="exam-date-input"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                placeholder="e.g. In 3 Days (Monday)"
                className="w-full text-xs font-medium text-slate-900 border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Daily Study Time</label>
                <span className="text-xs font-bold text-indigo-600">{dailyHours}h/day</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full mt-2 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Student Weak Areas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Your Weak Topics
            </h2>
            <span className="text-xs text-slate-400">{weakTopics.length} selected</span>
          </div>

          <p className="text-xs text-slate-500">
            Select or add topics you find difficult so Gemini gives them extra priority and Socratic scaffolding.
          </p>

          <div className="flex flex-wrap gap-2">
            {(currentPreset ? currentPreset.commonWeakTopics : []).map((topic) => {
              const isSelected = weakTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleWeakTopic(topic)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3 text-indigo-600" /> : <Plus className="w-3 h-3 text-slate-400" />}
                  <span>{topic}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleAddCustomWeakTopic} className="flex gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={newWeakTopicInput}
              onChange={(e) => setNewWeakTopicInput(e.target.value)}
              placeholder="Add another topic..."
              className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
            >
              Add
            </button>
          </form>
        </div>

        {/* Section 3: Course Materials & Questions Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Syllabus / Slides */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Course Slides / Syllabus
              </h3>
              <button
                type="button"
                onClick={() => materialFileInputRef.current?.click()}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload</span>
              </button>
              <input
                ref={materialFileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleMaterialFileUpload}
                className="hidden"
              />
            </div>

            {materialFileName && (
              <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-medium truncate">{materialFileName}</span>
              </div>
            )}

            <textarea
              id="course-material-textarea"
              rows={5}
              value={courseMaterialText}
              onChange={(e) => setCourseMaterialText(e.target.value)}
              placeholder="Paste syllabus modules, lecture slide notes..."
              className="w-full text-xs font-mono text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-y"
            />
          </div>

          {/* Previous Questions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Past RUET Exam Questions
              </h3>
              <button
                type="button"
                onClick={() => questionsFileInputRef.current?.click()}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload</span>
              </button>
              <input
                ref={questionsFileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleQuestionsFileUpload}
                className="hidden"
              />
            </div>

            {questionsFileName && (
              <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-medium truncate">{questionsFileName}</span>
              </div>
            )}

            <textarea
              id="previous-questions-textarea"
              rows={5}
              value={previousQuestionsText}
              onChange={(e) => setPreviousQuestionsText(e.target.value)}
              placeholder="Paste RUET previous exam questions with marks..."
              className="w-full text-xs font-mono text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-y"
            />
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-3 pt-2">
          <button
            id="generate-my-study-plan-btn"
            disabled={isLoading}
            onClick={handleSubmit}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-xs transition-all flex items-center justify-center gap-2.5 ${
              isLoading
                ? 'bg-indigo-400 cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
            }`}
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm sm:text-base">
              {isLoading ? 'Gemini is Analyzing Materials...' : 'Generate Personalized Study Plan with Gemini'}
            </span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>

          {/* Analysis Step Indicator */}
          {isLoading && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Analyzing course data with Gemini 3.5:</span>
              </div>
              <div className="space-y-1 pl-4 text-slate-600">
                <div className={analysisStep >= 1 ? 'font-semibold text-indigo-700' : 'text-slate-400'}>
                  {analysisStep >= 1 ? '✓' : '○'} 1. Extracting syllabus modules & topics
                </div>
                <div className={analysisStep >= 2 ? 'font-semibold text-indigo-700' : 'text-slate-400'}>
                  {analysisStep >= 2 ? '✓' : '○'} 2. Analyzing RUET Finals question frequency & marks
                </div>
                <div className={analysisStep >= 3 ? 'font-semibold text-indigo-700' : 'text-slate-400'}>
                  {analysisStep >= 3 ? '✓' : '○'} 3. Cross-referencing student weak areas
                </div>
                <div className={analysisStep >= 4 ? 'font-semibold text-indigo-700' : 'text-slate-400'}>
                  {analysisStep >= 4 ? '✓' : '○'} 4. Generating prioritized topic matrix & roadmap
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
