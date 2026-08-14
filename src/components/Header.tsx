import React from 'react';
import { LayoutDashboard, FileText, Target, GraduationCap, Clock, BookOpen } from 'lucide-react';
import { GeminiBadge } from './GeminiBadge';
import { StudyPlan } from '../types';

export type ViewType = 'dashboard' | 'materials' | 'plan' | 'tutor';

interface HeaderProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  studyPlan: StudyPlan | null;
  selectedTopicName?: string;
  onQuickStartTutor: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  studyPlan,
}) => {
  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'materials',
      label: 'Materials',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'plan',
      label: 'Study Plan',
      icon: <Target className="w-4 h-4" />,
      badge: studyPlan ? `${studyPlan.topics.length} topics` : undefined,
    },
    {
      id: 'tutor',
      label: 'AI Tutor',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: 'Socratic',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and RUET Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectView('dashboard')}
              className="flex items-center gap-3 text-left focus:outline-hidden"
              id="app-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center text-white font-bold shadow-xs">
                <span className="text-sm font-mono tracking-tighter font-extrabold text-amber-300">R</span>
                <span className="text-sm font-mono tracking-tighter font-extrabold text-white">P</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 tracking-tight">RUET PrepPilot</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 rounded">
                    RUET Finals
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden md:block">
                  AI Exam Accelerator for Engineering Students
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => onSelectView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                        isActive
                          ? 'bg-indigo-200/80 text-indigo-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Active Course & Gemini Status */}
          <div className="flex items-center gap-3">
            {studyPlan && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold text-slate-800">{studyPlan.courseCode}</span>
                <span className="text-slate-400">|</span>
                <div className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>{studyPlan.examDate}</span>
                </div>
              </div>
            )}

            <GeminiBadge variant="gradient" label="Gemini AI" />
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden border-t border-slate-100 py-2 space-x-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-btn-${item.id}`}
                onClick={() => onSelectView(item.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
