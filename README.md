# 🎓 RUET PrepPilot

### Your AI-powered exam preparation co-pilot for RUET students.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-RUET%20PrepPilot-blue)](https://ruet-preppilot.ai.studio)
[![Built with Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange)](https://ai.google.dev/)

**RUET PrepPilot** is an AI-powered exam preparation assistant that helps RUET students decide **what to study first, why it matters, and what to study next**.

## 🚀 Live Demo

👉 https://ruet-preppilot.ai.studio

## 💡 The Problem

RUET students often prepare for semester exams using lecture materials, notes, course resources, and previous exam questions from different sources.

The problem is not simply finding resources.

The real question is:

> **"I have so much to study. What should I study first?"**

Students need to understand which topics are most important based on their weaknesses, previous exam patterns, marks, and the limited time remaining before an exam.

## 💡 Our Solution

RUET PrepPilot turns scattered academic resources into a personalized, exam-focused preparation strategy.

The core workflow is:

**Student Weaknesses → Exam Evidence → AI Prioritization → Daily Roadmap → AI Tutoring**

Students provide their course and exam context. The Gemini API analyzes that context and helps prioritize topics based on exam relevance, previous RUET questions, estimated marks, and student weaknesses.

The result is an actionable study plan instead of a generic list of topics.

## ⭐ What Makes RUET PrepPilot Different?

RUET PrepPilot is **not just another AI chatbot or generic study planner**.

Our key differentiator is **exam-aware personalization**.

Instead of simply saying:

> "This topic is important."

PrepPilot can show:

* 🔥 Priority level
* 📊 Estimated marks
* 📝 RUET past-exam references
* 🎯 Student weakness relevance
* 📅 Recommended study roadmap

For example, a topic can become an **Urgent** priority because it has appeared in RUET past exams and carries significant marks.

This allows students to understand not only:

> **What should I study?**

but also:

> **Why should I study it first?**

## ✨ Features

### 📊 Personalized Dashboard

A central workspace for the student's exam preparation.

### 📚 Academic Materials

Students can provide course information, exam context, weak topics, and relevant resources.

### 🤖 Gemini-Powered Study Plan

The Gemini API analyzes the academic context and generates personalized topic priorities.

### 🔥 Exam-Aware Prioritization

Topics are categorized into:

* 🚨 Urgent
* 🔴 High
* 🟡 Medium
* 🟢 Low

Priorities can include estimated marks and RUET past-exam references.

### 📅 Daily Roadmap

The prioritized topics are converted into an actionable daily study roadmap based on the student's preparation timeline.

### 🧑‍🏫 Socratic AI Tutor

Students can move directly from planning to learning.

The AI Tutor uses a Socratic approach by asking questions, checking understanding, providing explanations, and guiding students step-by-step instead of simply giving the final answer.

### 📝 Exam Practice

The platform also supports exam-focused practice to help students prepare using the prioritized topics.

## 🧠 How Gemini Is Used

The **Gemini API** is the core intelligence behind RUET PrepPilot.

Gemini is used to:

* Analyze student weaknesses
* Understand course and exam context
* Analyze RUET past-exam information
* Prioritize important topics
* Generate personalized study recommendations
* Generate daily study roadmaps
* Power the Socratic AI Tutor
* Support exam-focused learning

Gemini is not used only as a chatbot. It connects the student's academic context and exam evidence to the decision of **what they should study next**.

## 🏗️ Tech Stack

### Frontend

* React
* TypeScript
* Vite

### Backend

* Express
* Node.js

### AI

* Google Gemini API
* Google AI Studio

### Development

* Antigravity
* GitHub

## 🔄 User Flow

```text
                    ┌──────────────────┐
                    │  Student Context │
                    │  Weak Topics     │
                    │  Exam Timeline   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Gemini API     │
                    │    Analysis      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Topic Priority   │
                    │ Marks + Exams    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Daily Roadmap    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Socratic Tutor  │
                    └──────────────────┘
```

## 🏆 Hack Day Focus

RUET PrepPilot was built during the Hack Day with a focus on creating a working AI-powered solution to a real student problem.

Rather than building a large LMS, we focused on one specific problem:

> **Helping students decide what to study next.**

## 📸 Screenshots

### Dashboard

*Add screenshot here.*

### Materials

*Add screenshot here.*

### Personalized Study Plan

*Add screenshot here.*

### Socratic AI Tutor

*Add screenshot here.*

## 🎥 Demo

A short demo video demonstrates the complete workflow:

**Problem → Dashboard → Materials → Study Plan → AI Prioritization → Daily Roadmap → Socratic AI Tutor**

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm
* Gemini API key

### Clone the repository

```bash
git clone https://github.com/Codedbyriyad/RUET-PrepPilot.git
cd RUET-PrepPilot
```

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file and add your Gemini API key according to the project's environment configuration.

**Never commit your API key to GitHub.**

### Run the project

```bash
npm run dev
```

## 🔮 What's Next?

Future versions of RUET PrepPilot could include:

* More advanced course-material ingestion
* Automated historical exam analysis
* Student performance tracking
* Adaptive revision schedules
* Personalized progress analytics
* Improved exam prediction and topic prioritization
* Deeper integration with RUET course structures

## 🎯 Our Vision

We don't want students to simply ask:

> **"What should I study?"**

We want RUET PrepPilot to help them understand:

> **"What should I study next — and why?"**

---

## 👨‍💻 Project

**RUET PrepPilot**

Built with ❤️ using **Google Gemini API, React, TypeScript, Express, Google AI Studio, and Antigravity**.

**Live Demo:**
https://ruet-preppilot.ai.studio

**GitHub:**
https://github.com/Codedbyriyad/RUET-PrepPilot
