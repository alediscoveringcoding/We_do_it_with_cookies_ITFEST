# PathFinder App - Complete Flow & Architecture

## 🎯 App Overview

**PathFinder** is a university career guidance platform that helps students discover their ideal career path and university matches through personality-based assessment and skill exploration.

**Tagline:** "Find Your Perfect University Match"

---

## 📱 Main Pages & Routes

### 1. **HomePage** (`/`)

- **Purpose:** Landing page and entry point
- **Key Features:**
  - Hero section with call-to-action buttons
  - "Find Your Perfect University Match" headline
  - Features showcase (Assessment, Skills Explorer, Dashboard, Q&A)
  - "Three Steps to Clarity" explanation
  - Student testimonials
  - Navigation to Assessment and Skills pages

### 2. **AuthPage / LoginPage** (`/login`)

- **Purpose:** User authentication
- **Features:**
  - Email/password login
  - Sign-up functionality
  - Error handling
  - Redirects to dashboard on successful login

### 3. **AssessmentPage** (`/assessment`)

- **Purpose:** RIASEC personality assessment
- **Flow:**
  1. **Intro Phase:** Explains RIASEC profile discovery
  2. **Quiz Phase:** 20 scenario-based questions
  3. **Results Phase:** Displays RIASEC radar chart and top traits
- **Data Stored:**
  - `assessments` table: riasec_scores, top_traits
  - Automatically creates user's personality profile
- **Next Step:** Navigate to Dashboard

### 4. **SkillsPage** (`/skills`)

- **Purpose:** Explore 40+ skills by category
- **Features:**
  - Filter skills by RIASEC category (Realistic, Investigative, etc.)
  - Display skill cards with:
    - Skill name and description
    - RIASEC tags (color-coded)
    - University count offering the skill
    - "See More" button to open skill modal
  - SkillModal: Shows detailed skill info and related careers
- **Data:** Loads from `skills` table with university relationships

### 5. **DashboardPage** (`/dashboard`)

- **Purpose:** Personalized user hub
- **Key Sections:**

  **A. Welcome Banner**
  - Personalized greeting with user's first name
  - "Find Your Perfect University Match" tagline

  **B. Progress Statistics** (6 animated rings)
  - Assessments completed
  - Careers explored
  - Questions asked
  - Careers saved
  - Universities matched
  - Shortlist created

  **C. Top Career Match**
  - Best RIASEC match from 24-career database
  - Match percentage
  - Career details on click

  **D. My University Matches**
  - Shows matched universities based on assessment
  - Click to explore matches

  **E. Recommended Skills** (Top 6 by RIASEC match)
  - Filtered based on user's top_traits
  - Shows university count for each skill
  - Click to view skill details

  **F. Q&A Board**
  - Community question forum
  - Filter: All / My Questions / Unanswered
  - Post new questions
  - Upvote questions
  - Delete own questions
  - **Reply System:**
    - View replies to questions
    - Post replies to questions
    - Delete own replies
    - Toggle reply visibility

---

## 🔄 Complete User Journey

### **New User Flow:**

1. **Visit Homepage** → Explore features
2. **Click "Start Assessment"** → AssessmentPage
3. **Complete RIASEC Quiz** → Saves to Supabase `assessments` table
4. **View Results** → See personality profile
5. **Navigate to Dashboard** → See personalized recommendations
6. **Explore Skills** → SkillsPage with filtered recommendations
7. **Bookmark Careers/Skills** → Saved to `bookmarks` table
8. **Ask Questions** → Q&A board for community help

### **Returning User Flow:**

1. **Login** → AuthPage
2. **Dashboard** → All previous data loaded
3. **Access assessment results**
4. **View saved bookmarks**
5. **Continue Q&A discussions**

---

## 🗄️ Database Schema

### **Core Tables:**

#### `assessments`

- `id` (UUID) - Primary key
- `user_id` (FK to auth.users)
- `riasec_scores` (JSONB) - E.g., {R: 8, I: 7, A: 6, S: 5, E: 9, C: 4}
- `top_traits` (TEXT[]) - E.g., ['Enterprising', 'Realistic']
- `created_at` (TIMESTAMPTZ)

#### `careers` (Static database)

- `id` (UUID)
- `title` (TEXT)
- `description` (TEXT)
- `riasec_codes` (TEXT[]) - E.g., ['E', 'R']
- `salary_min`, `salary_max` (INT)
- Contains 24 pre-loaded careers

#### `skills`

- `id` (UUID)
- `name` (TEXT)
- `category` (TEXT)
- `description` (TEXT)
- `riasec_tags` (TEXT[]) - E.g., ['I', 'A']
- Linked to universities via `skill_universities`

#### `questions` (RLS enabled)

- `id` (UUID)
- `user_id` (FK to auth.users)
- `question` (TEXT)
- `ai_answer` (TEXT, nullable)
- `upvotes` (INT)
- `career_tag` (TEXT)
- `created_at` (TIMESTAMPTZ)
- Only own questions visible unless public

#### `question_replies` (RLS enabled, CASCADE delete)

- `id` (UUID)
- `question_id` (FK to questions)
- `user_id` (FK to auth.users)
- `reply` (TEXT)
- `created_at` (TIMESTAMPTZ)

#### `bookmarks`

- `id` (UUID)
- `user_id` (FK to auth.users)
- `item_type` (TEXT) - 'career' or 'skill'
- `career_id`, `skill_id` (FK references)

#### `user_university_choices`

- `id` (UUID)
- `user_id` (FK to auth.users)
- `university_id` (FK)
- `choice` (TEXT) - 'yes', 'maybe', 'no'
- `final_decision` (BOOLEAN)

---

## 🧮 Key Algorithms

### **RIASEC Career Matching**

```
Formula: (overlapping_codes_count / total_career_codes) × 100

Example:
- User top_traits: ['Enterprising', 'Realistic']
- Career A riasec_codes: ['E', 'R', 'I'] → Match: 2/3 = 67%
- Career B riasec_codes: ['E', 'C'] → Match: 1/2 = 50%
- Sorted by percentage, top 8 returned
```

### **Skill Recommendation Filter**

```
For each skill:
  overlap = intersection(user.top_traits, skill.riasec_tags)
  score = len(overlap)
Sort by score, return top 6
```

### **Vote Toggle**

```
if user_voted:
  upvotes -= 1
else:
  upvotes += 1
```

---

## 🔐 Security & RLS Policies

### **Row Level Security (RLS)**

**Questions Table:**

- All authenticated users can READ
- Users can only INSERT their own questions
- Users can only DELETE their own questions
- Enforces `user_id` = authenticated user

**Question Replies Table:**

- All authenticated users can READ
- Users can only INSERT replies to any question
- Users can only DELETE their own replies
- Cascades on question deletion

**Bookmarks:**

- Users can only see/manage their own bookmarks

---

## 🎨 UI/UX Components

### **Navigation**

- Sticky navbar with links: Home, Assessment, Skills
- Dashboard link (logged-in users only)
- Logout button

### **Button Styles**

- `.btn-teal` - Primary action buttons (Start Assessment)
- `.btn-ghost` - Secondary buttons (Browse Skills)
- `.btn-sm` - Small secondary buttons (See More, Reply)

### **Color System**

- Teal (`#0d9488`) - Primary actions
- Green (`#2d6a4f`) - Accent elements
- Gray (`#6b7280`) - Secondary text
- White background with subtle shadows

### **Forms**

- Assessment quiz with scenario-based questions
- Question input fields in Q&A board
- Reply input fields for discussions

---

## 📊 Data Flow Summary

```
User Registration
    ↓
Complete Assessment (20 questions)
    ↓ Stores: riasec_scores, top_traits
    ↓
Dashboard Load
    ├─ Fetch assessment data
    ├─ Calculate 24 career matches
    ├─ Filter 6 recommended skills
    ├─ Load Q&A questions
    ├─ Load question replies
    └─ Display all data
    ↓
User Interactions
    ├─ View career details
    ├─ Save bookmarks
    ├─ Explore skills
    ├─ Post/upvote/delete questions
    └─ Post/delete replies
    ↓
All changes persisted in Supabase
```

---

## 🚀 Features Summary

| Feature                | Location       | Status                   |
| ---------------------- | -------------- | ------------------------ |
| RIASEC Assessment      | AssessmentPage | ✅ Complete              |
| Career Matching        | DashboardPage  | ✅ Complete (24 careers) |
| Skills Explorer        | SkillsPage     | ✅ Complete              |
| Personalized Dashboard | DashboardPage  | ✅ Complete              |
| Skill Recommendations  | DashboardPage  | ✅ Complete              |
| Q&A Board              | DashboardPage  | ✅ Complete              |
| Q&A Replies            | DashboardPage  | ✅ Complete              |
| Vote Questions         | DashboardPage  | ✅ Complete              |
| Delete Questions       | DashboardPage  | ✅ Complete              |
| Delete Replies         | DashboardPage  | ✅ Complete              |
| Bookmarks              | DashboardPage  | ✅ In Progress           |
| University Matching    | DashboardPage  | ✅ In Progress           |

---

## 🔧 Tech Stack

- **Frontend:** React 19.2.4, React Router v6
- **Build Tool:** Vite 8.0.0
- **Styling:** Tailwind CSS + Custom CSS
- **Backend:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password)
- **Real-time:** Supabase RLS policies
- **State Management:** React Context (AuthContext)

---

## 📝 Recent Text Changes

### HomePage Updates:

- Hero: "Find Your Perfect University Match"
- Description: "Take a personality-based assessment, explore the universities where your passion becomes your future"
- Section Title: "Everything You Need to Find Your Path"

### AssessmentPage Updates:

- Section tag: "Assessment" (not "Career Assessment")
- Description: "We'll map your personality across 6 dimensions to match you with a path where you'll genuinely thrive"

### Navigation Updates:

- Nav link: "Assessment" (not "Career Assessment")

### Button Updates:

- SkillsPage: "See More" (not "See Careers")

---

## 🎯 User Goals Enabled

1. **Discover Career Path** - Assessment + Career Matching
2. **Explore Skills** - Skills page with university info
3. **Find Universities** - University matching system
4. **Get Support** - Q&A board with community help
5. **Track Progress** - Dashboard with statistics
6. **Save Preferences** - Bookmark system

---

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Grid layouts adapt to screen size
- Touch-friendly buttons and interactions
- Readable on phones, tablets, and desktops

---

This document covers the complete PathFinder application flow. All features are functional and data persists in Supabase across sessions.
