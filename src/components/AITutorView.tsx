import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  GraduationCap, 
  Award,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyPlan, StudyTopic, TutorMessage } from '../types';
import { sendTutorMessage, generatePracticeQuestion } from '../services/api';
import { GeminiBadge } from './GeminiBadge';

interface AITutorViewProps {
  studyPlan: StudyPlan | null;
  activeTopic: StudyTopic | null;
  onSelectTopic: (topic: StudyTopic) => void;
  onToggleMastery: (topicId: string) => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  studyPlan,
  activeTopic,
  onSelectTopic,
  onToggleMastery,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'Basic' | 'Intermediate' | 'RUET Exam Hard'>('Intermediate');
  const [hintCount, setHintCount] = useState<number>(0);
  const [practiceModalOpen, setPracticeModalOpen] = useState<boolean>(false);
  const [practiceData, setPracticeData] = useState<any>(null);
  const [isGeneratingPractice, setIsGeneratingPractice] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fallback default topic if none selected
  const currentTopic = activeTopic || (studyPlan?.topics && studyPlan.topics[0]) || {
    id: 'default-topic',
    name: "Banker's Algorithm & Deadlock Avoidance",
    category: 'Deadlock & Resource Management',
    priority: 'urgent',
    whyItMatters: 'Carries 14 marks in Section A as a compulsory numerical question in RUET semester finals.',
    studentWeaknessNote: 'Matrix calculations and safety state verification.',
    previousQuestionRelevance: 'RUET 2022 Q3(a) & 2023 Q1(b)',
    estimatedMinutes: 90,
    isMastered: false,
    keyConcepts: ['Need Matrix', 'Work Vector', 'Safe Sequence'],
  };

  // Reset or initialize conversation when topic changes
  useEffect(() => {
    setHintCount(0);
    setMessages([
      {
        id: `welcome-${currentTopic.id}`,
        sender: 'tutor',
        text: `👋 **Welcome to your Socratic AI Tutoring Session for ${currentTopic.name}!**\n\nIn RUET semester finals, this topic carries **~${currentTopic.expectedMarks || 10} marks** (${currentTopic.previousQuestionRelevance}).\n\nI'll guide you step-by-step to build problem-solving intuition and speed.\n\n**Let's start:** What is your understanding of the core rule or purpose behind **${currentTopic.name}**?`,
        timestamp: new Date().toISOString(),
        topic: currentTopic.name,
      },
    ]);
  }, [currentTopic.id]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, modeOverride?: 'socratic' | 'hint' | 'simplify' | 'test' | 'cheatsheet') => {
    const text = textToSend !== undefined ? textToSend : inputMessage;
    if (!text.trim() && !modeOverride) return;

    const userMsg: TutorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text || (modeOverride === 'hint' ? 'Give me a hint' : modeOverride === 'simplify' ? 'Explain simpler' : modeOverride === 'test' ? 'Test my knowledge' : 'Cheat sheet'),
      timestamp: new Date().toISOString(),
      topic: currentTopic.name,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendTutorMessage({
        topicName: currentTopic.name,
        courseName: studyPlan?.courseName || 'Operating Systems',
        userMessage: userMsg.text,
        history: [...messages, userMsg],
        mode: modeOverride || 'socratic',
        currentDifficulty: difficulty,
      });

      const tutorReply: TutorMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.reply,
        timestamp: response.timestamp,
        topic: currentTopic.name,
      };

      setMessages((prev) => [...prev, tutorReply]);

      if (response.reply.toLowerCase().includes('correct') || response.reply.toLowerCase().includes('excellent') || response.reply.toLowerCase().includes('spot on')) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 },
        });
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'system',
          text: `⚠️ Communication error with Gemini Tutor: ${error.message || 'Please try again.'}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHint = () => {
    const nextHintLevel = hintCount + 1;
    setHintCount(nextHintLevel);
    handleSendMessage(`Please give me hint #${nextHintLevel} for solving or understanding this.`, 'hint');
  };

  const handleRequestSimpler = () => {
    handleSendMessage('Can you explain this with an intuitive real-world analogy and diagrammatic intuition?', 'simplify');
  };

  const handleRequestTest = () => {
    handleSendMessage('Please give me a RUET Semester Final exam style challenge question on this topic.', 'test');
  };

  const handleRequestCheatSheet = () => {
    handleSendMessage('Summarize the essential formulas, algorithm rules, and exam traps for this topic into a quick cheat sheet.', 'cheatsheet');
  };

  const handleGeneratePracticeModal = async () => {
    setIsGeneratingPractice(true);
    setPracticeModalOpen(true);
    try {
      const result = await generatePracticeQuestion({
        topicName: currentTopic.name,
        courseName: studyPlan?.courseName || 'Operating Systems',
        difficulty,
      });
      setPracticeData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPractice(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Topic Switcher & Context Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Active Topic Selector */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Topic</span>
              <GeminiBadge variant="subtle" label="Socratic AI Tutor" />
            </div>

            {studyPlan && studyPlan.topics.length > 0 ? (
              <div className="relative inline-block">
                <select
                  id="active-topic-select"
                  value={currentTopic.id}
                  onChange={(e) => {
                    const found = studyPlan.topics.find((t) => t.id === e.target.value);
                    if (found) onSelectTopic(found);
                  }}
                  className="font-bold text-sm sm:text-base text-slate-900 bg-transparent border-b border-indigo-300 pr-6 py-0.5 focus:outline-hidden cursor-pointer"
                >
                  {studyPlan.topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <h2 className="text-base font-bold text-slate-900">{currentTopic.name}</h2>
            )}
          </div>
        </div>

        {/* Right: Difficulty & Mastery Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
            {(['Basic', 'Intermediate', 'RUET Exam Hard'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  difficulty === lvl
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => onToggleMastery(currentTopic.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              currentTopic.isMastered
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-500'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${currentTopic.isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{currentTopic.isMastered ? 'Mastered' : 'Mark Mastered'}</span>
          </button>
        </div>
      </div>

      {/* Main Tutor Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col h-[620px] overflow-hidden">
          {/* Socratic Action Bar */}
          <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={handleRequestHint}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Hint {hintCount > 0 ? `#${hintCount + 1}` : ''}</span>
            </button>
            <button
              onClick={handleRequestSimpler}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Explain Simpler</span>
            </button>
            <button
              onClick={handleRequestTest}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
              <span>Test Me</span>
            </button>
            <button
              onClick={handleRequestCheatSheet}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Cheat Sheet</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 text-center">
                    {msg.text}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-slate-900 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {isUser ? 'You' : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-900 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    <div
                      className={`text-[10px] mt-2 flex items-center justify-end ${
                        isUser ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Reasoning through your response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                id="tutor-chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask a question or explain your solution for ${currentTopic.name}...`}
                disabled={isLoading}
                className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50"
              />
              <button
                type="submit"
                id="tutor-send-btn"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Context & Practice (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exam Context</h3>
            <div className="text-sm font-bold text-slate-900">{currentTopic.name}</div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <div>
                <span className="font-semibold text-slate-800">Past Final Reference:</span>
                <p className="text-indigo-900 font-medium">{currentTopic.previousQuestionRelevance}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-800">Your Target Focus:</span>
                <p>{currentTopic.studentWeaknessNote}</p>
              </div>
            </div>

            {currentTopic.keyConcepts && currentTopic.keyConcepts.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Key Concepts:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {currentTopic.keyConcepts.map((c, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RUET Practice Generator Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-300">
              <Award className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">RUET Exam Practice Generator</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate a realistic semester final question with marking rubric and hints.
            </p>

            <button
              onClick={handleGeneratePracticeModal}
              disabled={isGeneratingPractice}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isGeneratingPractice ? 'animate-spin' : ''}`} />
              <span>{isGeneratingPractice ? 'Generating...' : 'Generate Exam Question'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Practice Question Modal */}
      {practiceModalOpen && practiceData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-md">
                  RUET Final Exam Simulation
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {practiceData.marks} Marks
                </span>
              </div>
              <button
                onClick={() => setPracticeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Question:</h4>
                <div className="mt-1 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
                  {practiceData.question}
                </div>
              </div>

              {/* Hints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="font-bold text-slate-800 block mb-1">💡 Hint 1:</span>
                  <p className="text-slate-600">{practiceData.hint1}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="font-bold text-slate-800 block mb-1">📐 Hint 2:</span>
                  <p className="text-slate-600">{practiceData.hint2}</p>
                </div>
              </div>

              {/* Rubric */}
              {practiceData.keyRubric && (
                <div className="space-y-1 pt-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Examiner Marking Rubric:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {practiceData.keyRubric.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setPracticeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPracticeModalOpen(false);
                  handleSendMessage(`I'm solving this RUET practice question: "${practiceData.question}". Here is my initial attempt: `);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Discuss with Tutor in Chat →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
