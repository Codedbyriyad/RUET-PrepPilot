import { CoursePreset } from '../types';

export const RUET_COURSE_PRESETS: CoursePreset[] = [
  {
    id: 'ruet-cse-3201',
    courseCode: 'CSE 3201',
    courseName: 'Operating Systems & System Programming',
    department: 'Computer Science & Engineering (CSE)',
    semester: '3rd Year 2nd Semester',
    syllabusSnippet: `Module 1: Process Management & CPU Scheduling (FCFS, SJF, Round Robin, Multilevel Feedback Queue, Priority scheduling).
Module 2: Process Synchronization (Race condition, Critical Section problem, Peterson's algorithm, Semaphores, Mutex, Classical IPC problems: Producer-Consumer, Dining Philosophers, Readers-Writers).
Module 3: Deadlocks (Necessary conditions, Resource-Allocation Graph, Banker's Algorithm for deadlock avoidance, Deadlock detection and recovery).
Module 4: Memory Management (Logical vs Physical address, Contiguous allocation, Paging, Segmentation, Page replacement algorithms: FIFO, LRU, Optimal, Thrashing & Working Set Model).
Module 5: File Systems & I/O Systems (File allocation methods: Contiguous, Linked, Indexed, Disk scheduling algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK).`,
    previousQuestions: `RUET Series 2022 Final Exam:
Q1(a) Explain race conditions with an example. (5 marks)
Q1(b) Solve Dining Philosophers problem using Semaphores with code/pseudocode. (9 marks)
Q2(a) Given 5 processes with arrival and burst times, calculate average waiting time and turnaround time for Preemptive SJF and Round Robin (Quantum=2). (10 marks)
Q3(a) State Banker's algorithm. Given Allocation, Max, and Available matrices for 5 processes and 3 resource types (A, B, C), determine if the system is in a safe state. If Request from P1 arrives for (1,0,2), can it be granted immediately? (14 marks)
Q4(a) Differentiate between Paging and Segmentation with address translation diagrams. (6 marks)
Q4(b) Given page reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1 with 3 frames, find page faults for FIFO and LRU. (8 marks)
Q5(a) Explain Thrashing and its causes. How does Working Set model prevent thrashing? (7 marks)
Q5(b) Disk scheduling: cylinder queue (98, 183, 37, 122, 14, 124, 65, 67), head at 53. Calculate total head movements for SSTF and SCAN. (7 marks)

RUET Series 2023 Final Exam:
Q1(a) What are the 4 conditions for deadlock? How to break circular wait? (6 marks)
Q2(b) Critical section requirements (Mutual Exclusion, Progress, Bounded Waiting). Prove Peterson's solution satisfies all 3. (10 marks)
Q3(b) Inverted Page Table vs Multi-level Paging comparison. Calculate effective memory access time with TLB hit ratio 90% and memory access time 100ns. (8 marks)`,
    commonWeakTopics: [
      'Banker\'s Algorithm & Safety Check',
      'Process Synchronization (Semaphores & Peterson\'s Solution)',
      'Page Replacement (LRU & Belady\'s Anomaly)',
      'CPU Scheduling Mathematical Problems',
      'Thrashing & Working Set Model',
      'Disk Scheduling (LOOK/C-SCAN)'
    ]
  },
  {
    id: 'ruet-cse-2201',
    courseCode: 'CSE 2201',
    courseName: 'Algorithms & Complexity Analysis',
    department: 'Computer Science & Engineering (CSE)',
    semester: '2nd Year 2nd Semester',
    syllabusSnippet: `Module 1: Asymptotic Analysis & Recurrences (Big-O, Omega, Theta, Master Theorem, Substitution, Recursion Tree).
Module 2: Divide and Conquer (MergeSort, QuickSort with Randomized partitioning, Closest Pair of Points, Strassen's Matrix Multiplication).
Module 3: Dynamic Programming (0/1 Knapsack, Longest Common Subsequence, Matrix Chain Multiplication, Optimal BST, Bellman-Ford).
Module 4: Greedy Algorithms (Fractional Knapsack, Huffman Coding, Activity Selection, Prim's and Kruskal's MST, Dijkstra).
Module 5: Graph Algorithms & Flow (DFS, BFS, Topological Sort, Strongly Connected Components, Ford-Fulkerson Maximum Flow).
Module 6: NP-Completeness (P, NP, NP-Complete, NP-Hard, Vertex Cover, 3-SAT, Hamiltonian Cycle).`,
    previousQuestions: `RUET Series 2022 Final Exam:
Q1(a) Solve recurrence T(n) = 2T(n/2) + n log n using Master Theorem or Recursion Tree. (6 marks)
Q2(a) Dynamic programming: Matrix Chain Multiplication with dimensions <5, 10, 3, 12, 5, 50>. Find optimal parenthesization table m[i,j] and s[i,j]. (12 marks)
Q3(a) 0/1 Knapsack vs Fractional Knapsack. Solve 0/1 Knapsack for weights [2, 3, 4, 5] and values [3, 4, 5, 6] with capacity W=8 using DP table. (10 marks)
Q4(a) Prove correctness of Dijkstra's algorithm. Trace Dijkstra on given 6-node weighted graph. (8 marks)
Q5(a) Define NP-Complete. Show that Vertex Cover is NP-Complete by reduction from 3-SAT. (10 marks)`,
    commonWeakTopics: [
      'Matrix Chain Multiplication DP Table',
      'NP-Completeness Reductions',
      '0/1 Knapsack Dynamic Programming',
      'Master Theorem Edge Cases',
      'Ford-Fulkerson Max Flow Residual Graph',
      'Huffman Coding prefix tree'
    ]
  },
  {
    id: 'ruet-eee-2101',
    courseCode: 'EEE 2101',
    courseName: 'Analog Electronics & Semiconductor Devices',
    department: 'Electrical & Electronic Engineering (EEE)',
    semester: '2nd Year 1st Semester',
    syllabusSnippet: `Module 1: PN Junction & Diode Circuits (Diode equation, Rectifiers, Clipper & Clamper circuits, Zener voltage regulator).
Module 2: Bipolar Junction Transistors (BJT) (CE, CB, CC configurations, DC biasing, Q-point stabilization, small-signal re and hybrid-pi models).
Module 3: Field Effect Transistors (FET & MOSFET) (JFET characteristics, MOSFET enhancement/depletion, biasing, Small signal AC analysis).
Module 4: Operational Amplifiers (Inverting, Non-inverting, Differential amplifier, Integrator, Differentiator, Active filters, Schmitt Trigger).
Module 5: Power Amplifiers & Feedback (Class A, B, AB, C efficiency, Negative feedback topologies: voltage-series, current-shunt, Barkhausen criterion for Oscillators).`,
    previousQuestions: `RUET Series 2022 Final Exam:
Q1(a) Design a Zener diode voltage regulator circuit for 10V output with load current varying from 10mA to 50mA and input voltage 15V-20V. (10 marks)
Q2(a) Draw small signal re model of Voltage Divider Biased CE BJT amplifier and derive voltage gain Av, input impedance Zi, and output impedance Zo. (12 marks)
Q3(a) Explain the operation of Schmitt Trigger using Op-Amp with hysteresis curve and derive Upper and Lower Trigger Points (UTP, LTP). (10 marks)
Q4(a) Calculate maximum theoretical efficiency of Class B Push-Pull power amplifier and explain crossover distortion elimination. (8 marks)`,
    commonWeakTopics: [
      'BJT Small Signal re / Hybrid-pi AC Analysis',
      'Op-Amp Schmitt Trigger & Hysteresis Derivation',
      'Zener Regulator Circuit Design & Limits',
      'MOSFET Small-Signal Equivalent Circuit',
      'Barkhausen Criterion & RC Phase Shift Oscillator'
    ]
  }
];
