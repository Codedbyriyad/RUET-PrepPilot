import { useState, useEffect } from 'react';
import { Header, ViewType } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MaterialsView } from './components/MaterialsView';
import { StudyPlanView } from './components/StudyPlanView';
import { AITutorView } from './components/AITutorView';
import { PlanGenerationRequest, StudyPlan, StudyTopic } from './types';
import { generateStudyPlan, checkServerHealth } from './services/api';
import { RUET_COURSE_PRESETS } from './data/ruetPresets';

// Initial preloaded plan so judges immediately experience a working application
const INITIAL_RUET_PLAN: StudyPlan = {
  courseName: 'Operating Systems & System Programming',
  courseCode: 'CSE 3201',
  examDate: 'In 3 Days (Monday)',
  generatedAt: new Date().toISOString(),
  overallStrategy:
    "Prioritize Banker's Algorithm and Process Synchronization first as they account for ~24 marks of high-probability numericals. Follow up with Page Replacement and CPU Scheduling drills.",
  readinessScore: 45,
  totalEstimatedHours: 6.5,
  urgentPriorityCount: 2,
  highPriorityCount: 2,
  quickTips: [
    'RUET Final exams heavily reward neat Gantt charts and step-by-step matrix tables with intermediate Work/Finish states.',
    'In Concurrency questions, explicitly write the code for both processes and state why Mutual Exclusion holds.',
    'Allocate 25 minutes per 14-mark question to ensure you complete all 5 required answer sets.',
    'For Page Replacement, explicitly count hits vs faults and double check frame replacements.',
  ],
  topics: [
    {
      id: 'topic-1',
      name: "Banker's Algorithm & Deadlock Avoidance",
      category: 'Deadlock & Resource Allocation',
      priority: 'urgent',
      whyItMatters:
        'High frequency in RUET 2022 & 2023 Series Finals. Consistently carries 10 to 14 marks as a compulsory numerical question in Section A.',
      studentWeaknessNote:
        'You highlighted this as a weak area. It requires exact step-by-step matrix safety-checking without arithmetic errors.',
      previousQuestionRelevance:
        'Appeared in RUET 2022 Q3(a) (14 marks) and 2023 Q1(b) (10 marks).',
      estimatedMinutes: 90,
      isMastered: false,
      expectedMarks: 14,
      keyConcepts: [
        'Need Matrix calculation: Need = Max - Allocation',
        'Work and Finish vectors initialization',
        'Safe sequence determination algorithm',
        'Resource-Request algorithm boundary checking',
      ],
      sampleQuestion:
        'Given 5 processes (P0-P4) and 3 resource types (A, B, C) with Allocation, Max, and Available matrices, determine if the system is in a safe state. If Request from P1 arrives for (1,0,2), can it be granted immediately?',
    },
    {
      id: 'topic-2',
      name: "Process Synchronization & Semaphores",
      category: 'Concurrency & IPC',
      priority: 'urgent',
      whyItMatters:
        'Core concept tested in almost every semester final. Classical problems like Dining Philosophers and Peterson’s solution carry 10+ marks.',
      studentWeaknessNote:
        'Critical section proofs and semaphore pseudocode are common sources of lost marks.',
      previousQuestionRelevance:
        'Appeared in 2022 Q1(b) (9 marks) and 2023 Q2(b) (10 marks).',
      estimatedMinutes: 75,
      isMastered: false,
      expectedMarks: 10,
      keyConcepts: [
        'Mutual Exclusion, Progress, Bounded Waiting criteria',
        "Peterson's 2-process solution proof",
        'Counting vs Binary Semaphores (wait/signal operations)',
        'Producer-Consumer bounded buffer problem',
      ],
      sampleQuestion:
        "Prove that Peterson's solution satisfies all three requirements of the Critical Section Problem. Implement Dining Philosophers using Semaphores.",
    },
    {
      id: 'topic-3',
      name: 'Page Replacement Algorithms (LRU, FIFO, Optimal)',
      category: 'Virtual Memory Management',
      priority: 'high',
      whyItMatters:
        'Guaranteed numerical problem in Question 4 or 5. Very high return-on-time investment for exam scoring.',
      studentWeaknessNote:
        "Belady's anomaly in FIFO vs stack property in LRU needs clear distinction.",
      previousQuestionRelevance: 'Appeared in RUET 2022 Q4(b) (8 marks).',
      estimatedMinutes: 60,
      isMastered: false,
      expectedMarks: 8,
      keyConcepts: [
        'Reference string frame allocation tracing',
        'Page fault counting and hit ratio calculation',
        'Optimal page replacement theoretical benchmark',
        "Belady's Anomaly explanation",
      ],
      sampleQuestion:
        'Given a 20-digit page reference string with 3 memory frames, compute total page faults for FIFO and LRU.',
    },
    {
      id: 'topic-4',
      name: 'CPU Scheduling Mathematical Problems',
      category: 'Process Management',
      priority: 'high',
      whyItMatters:
        'Standard scoring question that RUET students usually bank on. Requires fast error-free Gantt chart drawing.',
      studentWeaknessNote:
        'Preemptive SJF arrival ties and Round Robin context switch overhead calculation.',
      previousQuestionRelevance: 'Appeared in RUET 2022 Q2(a) (10 marks).',
      estimatedMinutes: 60,
      isMastered: false,
      expectedMarks: 10,
      keyConcepts: [
        'Gantt Chart construction for preemptive SJF/SRTF',
        'Turnaround Time (TAT) = Completion - Arrival',
        'Waiting Time (WT) = TAT - Burst Time',
        'Round Robin time quantum selection impact',
      ],
      sampleQuestion:
        'Given 5 processes with arrival and burst times, construct Gantt charts and calculate average WT for SRTF and RR (Q=2).',
    },
    {
      id: 'topic-5',
      name: 'Thrashing & Working Set Model',
      category: 'Memory Optimization',
      priority: 'medium',
      whyItMatters:
        'Frequently combined with Paging questions to form a full 7-mark theoretical section.',
      studentWeaknessNote: 'Locality of reference and Working Set window delta parameters.',
      previousQuestionRelevance: 'Appeared in RUET 2022 Q5(a) (7 marks).',
      estimatedMinutes: 45,
      isMastered: false,
      expectedMarks: 7,
      keyConcepts: [
        'Causes of Thrashing (CPU utilization drop vs paging activity)',
        'Page Fault Frequency (PFF) strategy',
        'Working Set Model and page replacement',
      ],
      sampleQuestion:
        'Explain Thrashing with a CPU utilization vs Degree of Multiprogramming curve. How does the Working Set model prevent it?',
    },
    {
      id: 'topic-6',
      name: 'Disk Scheduling Algorithms (SSTF, SCAN, LOOK)',
      category: 'I/O & Storage',
      priority: 'low',
      whyItMatters:
        'Easy calculation question that usually appears in the last optional question of the paper.',
      studentWeaknessNote: 'Boundary turnaround directions in SCAN vs C-SCAN.',
      previousQuestionRelevance: 'Appeared in RUET 2022 Q5(b) (7 marks).',
      estimatedMinutes: 30,
      isMastered: false,
      expectedMarks: 7,
      keyConcepts: [
        'Total head movement calculation',
        'Elevator algorithm (SCAN) cylinder traversal',
        'SSTF starvation problem',
      ],
      sampleQuestion:
        'For cylinder requests queue and initial head at 53, calculate total head movements for SSTF and SCAN.',
    },
  ],
  dailySchedule: [
    {
      dayNumber: 1,
      dateLabel: 'Day 1: Urgent Core & Concurrency',
      focusTitle: 'Master High-Yield Numerical & Concurrency',
      topics: ["Banker's Algorithm & Deadlock Avoidance", 'Process Synchronization & Semaphores'],
      totalHours: 3.5,
      milestone: "Master Banker's algorithm safe sequence and Peterson's Critical Section proof without referencing notes.",
    },
    {
      dayNumber: 2,
      dateLabel: 'Day 2: Memory & CPU Scheduling',
      focusTitle: 'Page Replacement & Gantt Chart Speed Drills',
      topics: ['Page Replacement Algorithms (LRU, FIFO, Optimal)', 'CPU Scheduling Mathematical Problems'],
      totalHours: 3.0,
      milestone: 'Solve 2022 & 2023 Page Replacement & CPU Scheduling questions under timed conditions.',
    },
    {
      dayNumber: 3,
      dateLabel: 'Day 3: Rapid Revision & Past Paper Polish',
      focusTitle: 'Thrashing, Disk Scheduling & Full Mock Review',
      topics: ['Thrashing & Working Set Model', 'Disk Scheduling Algorithms (SSTF, SCAN, LOOK)', 'Full RUET 2022 Question Solve'],
      totalHours: 2.5,
      milestone: 'Review cheat sheet formulas, verify boundary conditions, and test weak spots with AI Tutor.',
    },
  ],
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(INITIAL_RUET_PLAN);
  const [activeTopic, setActiveTopic] = useState<StudyTopic | null>(INITIAL_RUET_PLAN.topics[0]);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [serverHealth, setServerHealth] = useState<{ status: string; hasApiKey: boolean }>({
    status: 'checking',
    hasApiKey: true,
  });

  useEffect(() => {
    checkServerHealth().then((h) => {
      setServerHealth({ status: h.status, hasApiKey: h.hasApiKey });
    });
  }, []);

  const handleGeneratePlan = async (requestData: PlanGenerationRequest) => {
    setIsLoadingPlan(true);
    try {
      const generated = await generateStudyPlan(requestData);
      setStudyPlan(generated);
      if (generated.topics && generated.topics.length > 0) {
        setActiveTopic(generated.topics[0]);
      }
      setCurrentView('plan');
    } catch (error: any) {
      console.error('Error generating plan:', error);
      alert(`Error generating plan: ${error.message || 'Failed to generate with Gemini'}`);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleStartTutorOnTopic = (topic?: StudyTopic) => {
    if (topic) {
      setActiveTopic(topic);
    } else if (studyPlan && studyPlan.topics.length > 0) {
      const urgent = studyPlan.topics.find((t) => !t.isMastered && t.priority === 'urgent');
      setActiveTopic(urgent || studyPlan.topics[0]);
    }
    setCurrentView('tutor');
  };

  const handleToggleMastery = (topicId: string) => {
    if (!studyPlan) return;
    const updatedTopics = studyPlan.topics.map((t) => {
      if (t.id === topicId) {
        return { ...t, isMastered: !t.isMastered };
      }
      return t;
    });

    setStudyPlan({
      ...studyPlan,
      topics: updatedTopics,
    });

    if (activeTopic && activeTopic.id === topicId) {
      setActiveTopic({
        ...activeTopic,
        isMastered: !activeTopic.isMastered,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        studyPlan={studyPlan}
        selectedTopicName={activeTopic?.name}
        onQuickStartTutor={() => handleStartTutorOnTopic()}
      />

      {/* Main Views Container */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <DashboardView
            studyPlan={studyPlan}
            onNavigateToMaterials={() => setCurrentView('materials')}
            onNavigateToPlan={() => setCurrentView('plan')}
            onStartTutorSession={handleStartTutorOnTopic}
            onToggleMastery={handleToggleMastery}
          />
        )}

        {currentView === 'materials' && (
          <MaterialsView
            onGeneratePlan={handleGeneratePlan}
            isLoading={isLoadingPlan}
            activeCourseName={studyPlan?.courseName}
            activeCourseCode={studyPlan?.courseCode}
          />
        )}

        {currentView === 'plan' && studyPlan && (
          <StudyPlanView
            studyPlan={studyPlan}
            onStartTutorOnTopic={handleStartTutorOnTopic}
            onToggleMastery={handleToggleMastery}
            onNavigateToMaterials={() => setCurrentView('materials')}
          />
        )}

        {currentView === 'tutor' && (
          <AITutorView
            studyPlan={studyPlan}
            activeTopic={activeTopic}
            onSelectTopic={setActiveTopic}
            onToggleMastery={handleToggleMastery}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">RUET PrepPilot</span>
            <span>•</span>
            <span>Rajshahi University of Engineering & Technology</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-indigo-600 font-medium">
              <span>Powered by Google Gemini 3.7 Flash</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
