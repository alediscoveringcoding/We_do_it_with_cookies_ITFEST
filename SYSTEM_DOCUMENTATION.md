# System Documentation: Skills Page & RIASEC Matching Algorithm

**Date:** March 15, 2026  
**Project:** We Do It With Cookies - Career Exploration Platform  
**Version:** 1.0

---

## Table of Contents

1. [Skills Page Architecture](#skills-page-architecture)
2. [Database Schema](#database-schema)
3. [Component Hierarchy](#component-hierarchy)
4. [Data Fetching Patterns](#data-fetching-patterns)
5. [RIASEC Matching Algorithm](#riasec-matching-algorithm)
6. [Complete Code Reference](#complete-code-reference)

---

## Skills Page Architecture

### Overview

The Skills page allows users to explore available skills, filtered by category, and discover which careers are associated with each skill. The system uses a Supabase PostgreSQL database with a junction table to maintain many-to-many relationships between skills and careers.

### UI/Visual Design

```
┌─────────────────────────────────────────────┐
│            Navbar Component                 │
├─────────────────────────────────────────────┤
│                                             │
│  Category Filters:                          │
│  [All] [Technical] [Creative] [Social]      │
│  [Analytical] [Leadership] [Trades]         │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Skill Card│  │Skill Card│  │Skill Card│  │
│  │ Category │  │ Category │  │ Category │  │
│  │ 5 Careers│  │ 3 Careers│  │ 8 Careers│  │
│  │[View..]  │  │[View..]  │  │[View..]  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Skill Card│  │Skill Card│  │Skill Card│  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│              [No skills found]              │
│             (Empty state message)           │
│                                             │
├─────────────────────────────────────────────┤
│  SkillModal (when skill selected):          │
│  ┌─────────────────────────────────────┐   │
│  │ Skill Name                          │   │
│  │ Category Badge                      │   │
│  │ Description                         │   │
│  ├─────────────────────────────────────┤   │
│  │ Related Careers:                    │   │
│  │ ┌──────────────┐  ┌──────────────┐ │   │
│  │ │Career Title  │  │Career Title  │ │   │
│  │ │Description   │  │Description   │ │   │
│  │ └──────────────┘  └──────────────┘ │   │
│  │                                     │   │
│  │              [Close]                │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### Key Visual Features

- **3-Column Grid Layout:** Skills displayed in responsive 3-column grid with auto-fill
- **Category Filters:** 7 filter buttons (All + 6 categories) with conditional highlighting
- **Category Badges:** Color-coded badges on cards indicating skill category
- **Career Counter:** Shows number of related careers for each skill
- **View Details Button:** Triggers modal to see full skill description and related careers
- **Empty State:** "No skills found" message when filters return zero results
- **Loading State:** Shows loading indicator while fetching data from Supabase

---

## Database Schema

### Table: `skills`

```sql
CREATE TABLE skills (
  id BIGINT PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

- `id`: Unique identifier (Primary Key)
- `name`: Skill name (e.g., "Python Programming")
- `category`: Skill category (Technical, Creative, Social, Analytical, Leadership, Trades)
- `description`: Long-form skill description
- `created_at`: Record creation timestamp

**Sample Data (24 Total Skills):**

| ID  | Name               | Category   | Description                                |
| --- | ------------------ | ---------- | ------------------------------------------ |
| 1   | Python Programming | Technical  | Master Python with real-world applications |
| 2   | Graphic Design     | Creative   | Create stunning visuals and designs        |
| 3   | Communication      | Social     | Master effective interpersonal skills      |
| 4   | Data Analysis      | Analytical | Interpret complex datasets                 |
| 5   | Team Leadership    | Leadership | Lead and motivate teams                    |
| 6   | Plumbing           | Trades     | Install and repair plumbing systems        |
| ... | ...                | ...        | ...                                        |

### Table: `careers`

```sql
CREATE TABLE careers (
  id BIGINT PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  riasec_codes VARCHAR[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

- `id`: Unique identifier (Primary Key)
- `title`: Career title (e.g., "Software Engineer")
- `description`: Career description
- `riasec_codes`: Array of RIASEC personality codes this career aligns with
- `created_at`: Record creation timestamp

### Table: `skills_careers` (Junction Table)

```sql
CREATE TABLE skills_careers (
  skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
  career_id BIGINT REFERENCES careers(id) ON DELETE CASCADE,
  PRIMARY KEY (skill_id, career_id)
);
```

**Purpose:** Many-to-many relationship between skills and careers. One skill can relate to multiple careers, and one career can require multiple skills.

**Example Relationships:**

```
Skill: "Python Programming" (id=1)
  ↓ relates to ↓
  Career: "Software Engineer" (career_id=10)
  Career: "Data Scientist" (career_id=25)
  Career: "AI Specialist" (career_id=40)

Skill: "Communication" (id=3)
  ↓ relates to ↓
  Career: "Marketing Manager" (career_id=15)
  Career: "HR Specialist" (career_id=30)
  Career: "Sales Executive" (career_id=45)
```

### Data Flow Diagram

```
┌─────────────────────┐
│   Skills Table      │
│ (id, name, cat...)  │
└──────────┬──────────┘
           │ has many (through junction)
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────────────────────────┐
│  skills_careers (junction)  │
│  (skill_id FK, career_id FK)│
└─────────────────────────────┘
    │             │
    └──────┬──────┘
           │ belongs to
           │
┌──────────▼──────────┐
│  Careers Table      │
│ (id, title, desc...)│
└─────────────────────┘
```

---

## Component Hierarchy

### File Structure

```
src/pages/
├── Skills.jsx              (Main component - state management)
├── SkillsPage.jsx          (Alternative implementation with hardcoded data)
└── components/
   ├── SkillCard.jsx        (Individual skill card display)
   └── SkillModal.jsx       (Modal for skill details + related careers)
```

### Component Architecture

```
Skills.jsx (Container Component)
│
├─ State:
│  ├─ skills: Skill[] - all fetched skills
│  ├─ filteredSkills: Skill[] - filtered by selected category
│  ├─ selectedCategory: string - currently selected category filter
│  ├─ selectedSkill: Skill | null - skill for modal display
│  └─ loading: boolean - data fetch status
│
├─ Handlers:
│  ├─ fetchSkills() - Supabase query with join to count careers
│  ├─ filterSkills() - Filter by category, update filteredSkills
│  ├─ getCategoryColor() - Map category name to badge color hex
│  ├─ handleViewDetails() - Set selectedSkill, show modal
│  └─ handleCloseModal() - Clear selectedSkill, hide modal
│
├─ Navbar
│  └─ Displays navigation and branding
│
├─ Category Filter Buttons
│  ├─ [All] - Reset filter, show all skills
│  ├─ [Technical] - Show only Technical category
│  ├─ [Creative] - Show only Creative category
│  └─ ... (5 more category buttons)
│
├─ Skills Grid (3 columns)
│  │
│  └─ SkillCard (rendered for each filteredSkill)
│     ├─ Props:
│     │  ├─ skill: { id, name, category, description, careerCount }
│     │  ├─ categoryColor: "#FF6B6B" (hex color)
│     │  └─ onViewDetails: (skill) => void
│     │
│     └─ Renders:
│        ├─ Category Badge (colored background)
│        ├─ Skill Title
│        ├─ Description (3-line clamp)
│        ├─ Career Count (e.g., "5 Careers")
│        └─ [View Details] Button
│
├─ Empty State
│  └─ "No skills found" message (conditional)
│
└─ SkillModal (conditional render, only shown when selectedSkill exists)
   ├─ Props:
   │  ├─ skill: Skill object
   │  └─ onClose: () => void
   │
   └─ Contents:
      ├─ Skill Name (title)
      ├─ Category Badge
      ├─ Full Description
      ├─ Related Careers Section
      │  └─ 2-Column Grid of Careers
      │     └─ CareerItem
      │        ├─ Career Title
      │        └─ Career Description
      └─ [Close] Button
```

---

## Data Fetching Patterns

### Pattern 1: Fetch with Join to Count Related Records

**Location:** [Skills.jsx](src/pages/Skills.jsx#L40-L65) - `fetchSkills()` function

```javascript
const fetchSkills = async () => {
  const { data, error } = await supabase
    .from("skills")
    .select(
      `
      id,
      name,
      category,
      description,
      skills_careers(career_id)
    `,
    )
    .order("name");

  if (data) {
    const skillsWithCareerCount = data.map((skill) => ({
      ...skill,
      careerCount: skill.skills_careers.length,
    }));
    setSkills(skillsWithCareerCount);
    filterSkills(skillsWithCareerCount, "All");
  }
};
```

**Explanation:**

- Uses Supabase `.select()` with nested junction table reference
- Selects `skills_careers(career_id)` to get array of related career records
- `.length` of array = number of related careers
- `map()` adds computed `careerCount` property to each skill object
- Automatically triggers `filterSkills()` after fetch to initialize filtered list

**Query Result Structure:**

```javascript
{
  id: 1,
  name: "Python Programming",
  category: "Technical",
  description: "Master Python with real-world applications",
  skills_careers: [
    { career_id: 10 },
    { career_id: 25 },
    { career_id: 40 }
  ],
  careerCount: 3  // Added by map function
}
```

### Pattern 2: Filter with Conditional Logic

**Location:** [Skills.jsx](src/pages/Skills.jsx#L67-L78) - `filterSkills()` function

```javascript
const filterSkills = (skillsList, category) => {
  const filtered =
    category === "All"
      ? skillsList
      : skillsList.filter((skill) => skill.category === category);

  setFilteredSkills(filtered);
  setSelectedCategory(category);
};
```

**Logic Flow:**

1. If category is "All", return all skills unchanged
2. Otherwise, filter array by exact category name match
3. Update both `filteredSkills` state and `selectedCategory` state
4. Component re-renders with filtered grid

### Pattern 3: Async Career Fetching in Modal

**Location:** [SkillModal.jsx](src/components/SkillModal.jsx#L15-L40) - `fetchRelatedCareers()` function

```javascript
const fetchRelatedCareers = async () => {
  const { data, error } = await supabase
    .from("skills_careers")
    .select(
      `
      careers(
        id,
        title,
        description
      )
    `,
    )
    .eq("skill_id", skill.id);

  if (data) {
    const careers = data.map((item) => item.careers);
    setRelatedCareers(careers);
  }
};
```

**Explanation:**

- Queries junction table `skills_careers` filtered by `skill_id`
- Uses nested select to fetch full career objects (not just IDs)
- Maps `careers` property from each junction record
- Results in flat array of career objects
- Runs in `useEffect(() => { fetchRelatedCareers() }, [skill.id])`

**Query Result Structure:**

```javascript
// Raw junction table query result
[
  { careers: { id: 10, title: "Software Engineer", description: "..." } },
  { careers: { id: 25, title: "Data Scientist", description: "..." } },
][
  // After map() transformation
  ({ id: 10, title: "Software Engineer", description: "..." },
  { id: 25, title: "Data Scientist", description: "..." })
];
```

---

## RIASEC Matching Algorithm

### Overview

The system uses a RIASEC personality-based matching algorithm to automatically recommend universities and careers that align with user preferences. RIASEC is a career classification framework developed by John Holland:

- **R** = Realistic (practical, hands-on, tools/machines)
- **I** = Investigative (analytical, research, problem-solving)
- **A** = Artistic (creative, expression, aesthetics)
- **S** = Social (helping, teaching, interpersonal)
- **E** = Enterprising (leadership, sales, entrepreneurship)
- **C** = Conventional (organized, detail-oriented, systems)

### Algorithm Components

#### 1. Qualification Filter: `isQualifiedMatch()`

```javascript
function isQualifiedMatch(uniTags, topTraits) {
  // Count how many university tags match user's top 3 traits
  const matchCount = uniTags.filter((tag) => topTraits.includes(tag)).length;

  // Minimum 2 out of 3 traits must overlap
  return matchCount >= 2;
}
```

**Purpose:** Filter out universities that don't have sufficient RIASEC alignment

**Logic:**

- Takes array of university's RIASEC codes (uniTags)
- Takes array of user's top 3 RIASEC codes (topTraits)
- Counts overlaps using `.filter()` and `.includes()`
- Returns `true` only if overlap count ≥ 2 (minimum 2 shared traits)

**Example:**

```javascript
const userTopTraits = ["R", "I", "A"]; // User's personality profile
const uni1Tags = ["R", "I", "S"]; // University's focus areas

isQualifiedMatch(uni1Tags, userTopTraits);
// 1. Filter: ['R', 'I'].length = 2 (both in topTraits)
// 2. Check: 2 >= 2 ? true
// Result: true (QUALIFIED)

const uni2Tags = ["E", "C"]; // Different focus
isQualifiedMatch(uni2Tags, userTopTraits);
// 1. Filter: [].length = 0 (neither in topTraits)
// 2. Check: 0 >= 2 ? false
// Result: false (NOT QUALIFIED)
```

#### 2. Scoring System: `getMatchScore()`

```javascript
function getMatchScore(uniTags, topTraits, dominantTrait) {
  // Count overlap between university tags and user's top traits
  const overlapCount = uniTags.filter((tag) => topTraits.includes(tag)).length;

  // Bonus if university specializes in user's dominant trait
  const dominantBonus = uniTags.includes(dominantTrait) ? 1 : 0;

  // Final score: 0-4 scale
  // overlapCount: 0-3 (how many of top 3 traits match)
  // dominantBonus: 0-1 (does it have the strongest trait)
  return overlapCount + dominantBonus;
}
```

**Score Interpretation:**

| Score | Quality          | Badge | Example                                   |
| ----- | ---------------- | ----- | ----------------------------------------- |
| 4     | ⭐ Perfect Match | ⭐    | All 3 traits + dominant trait present     |
| 3     | ✓ Strong Match   | ✓     | 3 traits OR 2 traits + dominant trait     |
| 2     | ✓ Good Match     | ✓     | 2 traits without dominant                 |
| 0-1   | Filtered Out     | N/A   | Fewer than 2 traits (fails qualification) |

**Scoring Calculation Example:**

```javascript
const userTopTraits = ["R", "I", "A"];
const dominantTrait = "R"; // User's strongest trait

// University 1: Strong R, I, A focus
const uni1Tags = ["R", "I", "A"];
getMatchScore(uni1Tags, userTopTraits, dominantTrait);
// overlapCount: 3 (all three tags match)
// dominantBonus: 1 (has 'R')
// Score: 3 + 1 = 4 ⭐ Perfect Match

// University 2: R and I focus, lacks A
const uni2Tags = ["R", "I", "E"];
getMatchScore(uni2Tags, userTopTraits, dominantTrait);
// overlapCount: 2 (R and I match, E doesn't)
// dominantBonus: 1 (has 'R')
// Score: 2 + 1 = 3 ✓ Strong Match

// University 3: Only A focus
const uni3Tags = ["A", "S", "C"];
getMatchScore(uni3Tags, userTopTraits, dominantTrait);
// overlapCount: 1 (only A matches)
// dominantBonus: 0 (no 'R')
// Score: 1 + 0 = 1 (Filtered out - below threshold of 2)
```

#### 3. Ranking System

**Algorithm:**

1. Apply qualification filter (`isQualifiedMatch()`) - removes all universities with < 2 trait overlap
2. Calculate scores for remaining universities using `getMatchScore()`
3. Sort descending by score (4 → 3 → 2)
4. Display in ranked order with quality badges

**Implementation Across Pages:**

**AssessmentPage.jsx** - Auto-match on assessment completion:

```javascript
const qualifiedMatches = universities.filter((uni) =>
  isQualifiedMatch(uni.top_traits, userTopTraits),
);

const sortedMatches = qualifiedMatches.sort(
  (a, b) =>
    getMatchScore(b.top_traits, userTopTraits, dominantTrait) -
    getMatchScore(a.top_traits, userTopTraits, dominantTrait),
);
```

**DiscoverPage.jsx** - Manual browsing with smart filtering:

```javascript
const matchedUnis = filteredUniversities.filter((uni) =>
  isQualifiedMatch(uni.top_traits, userTopTraits),
);

const rankedUnis = matchedUnis.sort(
  (a, b) =>
    getMatchScore(b.top_traits, userTopTraits, dominantTrait) -
    getMatchScore(a.top_traits, userTopTraits, dominantTrait),
);
```

**MyMatchesPage.jsx** - Review saved matches in ranked order:

```javascript
const fetchSaved = async () => {
  const { data } = await supabase.from("saved_universities").select();

  const sorted = data.sort(
    (a, b) =>
      getMatchScore(b.top_traits, userTopTraits, dominantTrait) -
      getMatchScore(a.top_traits, userTopTraits, dominantTrait),
  );

  setSavedUniversities(sorted); // Best matches appear first in swipe queue
};
```

### Database Tables for Matching

#### Assessment Results Table

```sql
CREATE TABLE assessments (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  riasec_scores JSONB,           -- Full 6-code scores
  top_traits VARCHAR[] DEFAULT '{}',  -- Top 3 codes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Universities Table (Partial)

```sql
CREATE TABLE universities (
  id BIGINT PRIMARY KEY,
  name VARCHAR NOT NULL,
  top_traits VARCHAR[] DEFAULT '{}',  -- RIASEC codes this uni emphasizes
  riasec_scores JSONB,           -- Full code scores
  ...other fields
);
```

#### Saved Matches Table

```sql
CREATE TABLE saved_universities (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  university_id BIGINT REFERENCES universities(id),
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Matching Flow Diagram

```
┌────────────────────────────────────────┐
│  User Completes RIASEC Assessment      │
│  Result: ['R', 'I', 'A'] top 3 traits  │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  Extract Dominant Trait (1st of top 3) │
│  dominantTrait = 'R'                   │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  Fetch All Universities                │
│  For each university: top_traits field  │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  Qualification Filter Step              │
│  Keep only unis with >= 2 trait overlap │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  Calculate Match Score (0-4)           │
│  For each qualified university          │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  Sort Descending by Score              │
│  (4 Perfect → 3 Strong → 2 Good)       │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  Display in Ranked Order               │
│  - AssessmentPage: Auto-save top 10    │
│  - DiscoverPage: Show with badges      │
│  - MyMatchesPage: Swipe queue order    │
└────────────────────────────────────────┘
```

### Badge Display Logic

```javascript
// Determine badge text and color based on score
const getBadgeInfo = (score) => {
  switch (score) {
    case 4:
      return { text: "⭐ Perfect Match", color: "#4ade80" }; // Green
    case 3:
      return { text: "✓ Strong Match", color: "#60a5fa" }; // Blue
    case 2:
      return { text: "✓ Good Match", color: "#fbbf24" }; // Yellow
    default:
      return { text: "No Match", color: "#d1d5db" }; // Gray
  }
};
```

---

## Complete Code Reference

### Skills.jsx - Main Component

[View Full File](src/pages/Skills.jsx)

```javascript
import React, { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";
import SkillCard from "../components/SkillCard";
import SkillModal from "../components/SkillModal";
import Navbar from "../shared/NavBar";

export default function Skills() {
  // State Management
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  // Category color mapping
  const categoryColors = {
    Technical: "#3b82f6", // Blue
    Creative: "#ec4899", // Pink
    Social: "#10b981", // Green
    Analytical: "#f59e0b", // Amber
    Leadership: "#8b5cf6", // Purple
    Trades: "#ef4444", // Red
  };

  // Fetch skills with career count
  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select(
          `
          id,
          name,
          category,
          description,
          skills_careers(career_id)
        `,
        )
        .order("name");

      if (error) throw error;

      if (data) {
        const skillsWithCount = data.map((skill) => ({
          ...skill,
          careerCount: skill.skills_careers.length,
        }));
        setSkills(skillsWithCount);
        filterSkills(skillsWithCount, "All");
      }
    } catch (error) {
      console.error("Error fetching skills:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter skills by category
  const filterSkills = (skillsList, category) => {
    const filtered =
      category === "All"
        ? skillsList
        : skillsList.filter((skill) => skill.category === category);

    setFilteredSkills(filtered);
    setSelectedCategory(category);
  };

  // Get color for category
  const getCategoryColor = (category) => {
    return categoryColors[category] || "#6b7280";
  };

  // Load skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Render category filter buttons
  const categories = [
    "All",
    "Technical",
    "Creative",
    "Social",
    "Analytical",
    "Leadership",
    "Trades",
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Explore Skills
          </h1>
          <p className="text-gray-600 mb-8">
            Discover skills and see which careers require them
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => filterSkills(skills, category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading skills...</p>
            </div>
          )}

          {/* Skills Grid */}
          {!loading && (
            <>
              {filteredSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      categoryColor={getCategoryColor(skill.category)}
                      onViewDetails={(skill) => setSelectedSkill(skill)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500 text-lg">
                    No skills found in this category
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Skill Modal */}
      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </>
  );
}
```

### SkillCard.jsx - Card Component

[View Full File](src/components/SkillCard.jsx)

```javascript
import React from "react";

export default function SkillCard({ skill, categoryColor, onViewDetails }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
      onClick={() => onViewDetails(skill)}
    >
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="px-3 py-1 rounded-full text-white text-sm font-medium"
          style={{ backgroundColor: categoryColor }}
        >
          {skill.category}
        </span>
      </div>

      {/* Skill Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{skill.name}</h3>

      {/* Description (3-line clamp) */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {skill.description}
      </p>

      {/* Career Count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          {skill.careerCount} {skill.careerCount === 1 ? "Career" : "Careers"}
        </span>
      </div>

      {/* View Details Button */}
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
        View Details →
      </button>
    </div>
  );
}
```

### SkillModal.jsx - Detail Modal

[View Full File](src/components/SkillModal.jsx)

```javascript
import React, { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

export default function SkillModal({ skill, onClose }) {
  const [relatedCareers, setRelatedCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch careers related to this skill
  const fetchRelatedCareers = async () => {
    try {
      const { data, error } = await supabase
        .from("skills_careers")
        .select(
          `
          careers(
            id,
            title,
            description
          )
        `,
        )
        .eq("skill_id", skill.id);

      if (error) throw error;

      if (data) {
        const careers = data.map((item) => item.careers);
        setRelatedCareers(careers);
      }
    } catch (error) {
      console.error("Error fetching careers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatedCareers();
  }, [skill.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{skill.name}</h2>
            <span
              className="inline-block mt-2 px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: "#3b82f6" }}
            >
              {skill.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About this skill
            </h3>
            <p className="text-gray-600">{skill.description}</p>
          </div>

          {/* Related Careers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Related Careers ({relatedCareers.length})
            </h3>

            {loading ? (
              <p className="text-gray-500">Loading careers...</p>
            ) : relatedCareers.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {relatedCareers.map((career) => (
                  <div key={career.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {career.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {career.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No careers found</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
```

### RIASEC Matching Helper Functions

Used across AssessmentPage.jsx, DiscoverPage.jsx, and MyMatchesPage.jsx:

```javascript
/**
 * Check if a university qualifies as a match based on RIASEC traits
 * Requirement: At least 2 out of user's top 3 traits must be present
 *
 * @param {string[]} uniTags - University's RIASEC codes
 * @param {string[]} topTraits - User's top 3 RIASEC codes
 * @returns {boolean} - Whether university meets qualification threshold
 */
export function isQualifiedMatch(uniTags, topTraits) {
  const matchCount = uniTags.filter((tag) => topTraits.includes(tag)).length;

  return matchCount >= 2;
}

/**
 * Calculate match quality score for a university
 * Score range: 0-4
 *   4 = Perfect Match (all 3 traits + dominant trait)
 *   3 = Strong Match (2-3 traits, including dominant)
 *   2 = Good Match (2 traits, without dominant)
 *   0-1 = Below qualification threshold
 *
 * @param {string[]} uniTags - University's RIASEC codes
 * @param {string[]} topTraits - User's top 3 RIASEC codes
 * @param {string} dominantTrait - User's strongest RIASEC code
 * @returns {number} - Match score 0-4
 */
export function getMatchScore(uniTags, topTraits, dominantTrait) {
  // Count overlapping traits (0-3)
  const overlapCount = uniTags.filter((tag) => topTraits.includes(tag)).length;

  // Bonus point if dominant trait is present (0-1)
  const dominantBonus = uniTags.includes(dominantTrait) ? 1 : 0;

  // Final score: 0-4
  return overlapCount + dominantBonus;
}
```

---

## Implementation Summary

### Skills Page Features

✅ **Data Fetching:** Supabase queries with junction table joins  
✅ **State Management:** React hooks for skills, filters, modal state  
✅ **UI Components:** Card display, modal detail view, category filters  
✅ **Responsive Design:** 3-column grid that adapts to screen size  
✅ **Career Relationships:** Many-to-many via `skills_careers` junction table  
✅ **Loading States:** Loading indicator and empty state messaging  
✅ **Error Handling:** Try-catch blocks around Supabase calls

### RIASEC Matching Features

✅ **Automatic Matching:** Assessment auto-inserts qualified universities  
✅ **Qualification Filtering:** Minimum 2/3 trait overlap requirement  
✅ **Intelligent Scoring:** 0-4 scale with dominant trait bonus  
✅ **Consistent Ranking:** Identical function used across 3 pages  
✅ **Visual Feedback:** Badges showing match quality (⭐/✓)  
✅ **Responsive Ordering:** Swipe queue ordered by match quality

### Database Architecture

✅ **Normalized Schema:** Separate tables for skills, careers, relationships  
✅ **Junction Tables:** `skills_careers` enables flexible many-to-many  
✅ **Efficient Queries:** Single Supabase query counts related records  
✅ **Scalability:** Easily add more skills/careers without code changes  
✅ **Data Integrity:** Foreign key constraints prevent orphaned records

---

## Performance Considerations

- **Career Counting:** Implemented via junction table length in single query (O(1) lookup)
- **Filtering:** Client-side filtering on fetched skills (fast for typical dataset sizes)
- **Sorting:** O(n log n) sort on matched universities (acceptable for < 1000 records)
- **Modal Loading:** Async career fetch when modal opens (non-blocking)
- **Category Colors:** Computed via object lookup (O(1) access)

---

## Future Enhancement Opportunities

1. **Search Functionality:** Add text search across skill names and descriptions
2. **Skill Difficulty Ratings:** Add beginner/intermediate/advanced levels
3. **Learning Paths:** Show prerequisite skills and recommended learning order
4. **Related Skills:** Suggest "Skills You Might Like" based on current selection
5. **Skill Endorsements:** Allow users to endorse skills they've mastered
6. **Career Salaries:** Include salary data from career records
7. **Skill Progress Tracking:** Let users mark skills they're learning
8. **Export Assessment:** Download assessment results as PDF

---

## Testing Checklist

- [ ] Verify skills load on page mount
- [ ] Confirm category filters work correctly
- [ ] Check career count is accurate for each skill
- [ ] Test modal opens/closes properly
- [ ] Verify related careers display in modal
- [ ] Test empty state when category has no skills
- [ ] Check responsive grid on mobile/tablet/desktop
- [ ] Verify RIASEC matching on assessment completion
- [ ] Confirm universities appear in correct score order
- [ ] Test badge colors match design system

---

**Document Version:** 1.0  
**Last Updated:** March 15, 2026  
**Maintained By:** Development Team
