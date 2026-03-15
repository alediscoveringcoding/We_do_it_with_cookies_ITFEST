# Dashboard Page Documentation

## Overview

The Dashboard is the central hub after user authentication, displaying personalized career recommendations, assessment results, saved bookmarks, and a community Q&A board. It integrates RIASEC assessment data with university matches and career exploration features.

**Two Implementation Versions:**

- **DashboardPage.jsx** (399 lines) - Primary inline implementation with rich UI components
- **Dashboard.jsx** (232 lines) - Modular component-based alternative using separate components

This document covers both implementations to show different architectural approaches.

---

## Architecture

### Data Flow

```
AuthContext (user session)
         ↓
    DashboardPage
         ↓
    ├── Supabase: assessments
    ├── Supabase: user_university_choices (matches)
    ├── Supabase: questions (Q&A board)
    ├── Local state: savedCareers, careers[], bookmarks[]
    └── Display Components:
        ├── Welcome Banner
        ├── Stats Progress Rings
        ├── Career Matches Grid
        ├── Bookmarks Section
        └── Q&A Board
```

### State Management (DashboardPage)

```javascript
// Assessment & Matching
const [assessment, setAssessment] = useState(null);
const [matches, setMatches] = useState([]); // user_university_choices where choice='yes'
const [matchCount, setMatchCount] = useState(0); // count of matched universities
const [shortlistCount, setShortlistCount] = useState(0); // final_decision='keep' count

// Careers & Bookmarks
const [careers, setCareers] = useState([
  { title, pct, salary }, // Career with match percentage and salary
]);
const [savedCareers, setSavedCareers] = useState(new Set()); // Set of bookmarked career titles
const [bookmarks, setBookmarks] = useState([]); // Flattened list of saved career names

// Q&A Board
const [qaItems, setQAItems] = useState([
  {
    id,
    avatar,
    name,
    question,
    answer,
    upvotes,
    voted,
    tag,
    time,
    isMine,
    loadingAI,
  },
]);
const [qaInput, setQAInput] = useState("");
const [qaFilter, setQAFilter] = useState("All"); // 'All' | 'My Questions' | 'Unanswered'
const [nextId, setNextId] = useState(1); // Counter for new Q&A items
```

---

## Data Fetching

### Implementation Version 1: DashboardPage.jsx

All data fetches happen in a single `useEffect` on component mount:

#### 1. Fetch Latest Assessment

```javascript
const fetchAssessment = async () => {
  const { data } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data;
};
```

- Retrieves most recent assessment by user
- Contains `riasec_scores` and `top_traits` used for career matching
- Returns null if user hasn't completed assessment

#### 2. Fetch University Matches

```javascript
const fetchMatches = async (userId) => {
  const { data } = await supabase
    .from("user_university_choices")
    .select("choice, universities(id, name, riasec_tags)")
    .eq("user_id", userId);
  return data;
};
```

- Queries junction table `user_university_choices` with nested university data
- Shows universities user marked as "yes" during discovery
- Includes RIASEC tags for potential career matching

#### 3. Count Shortlist Items

```javascript
const fetchShortlist = async (userId) => {
  const { count } = await supabase
    .from("user_university_choices")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("final_decision", "keep");
  return count;
};
```

- Counts universities on final shortlist
- Shown in stats as "In Your Shortlist"

#### 4. Load Q&A Items

```javascript
// Hardcoded Q&A sample data
const sampleQA = [
  {
    id: 1,
    avatar: "👨‍💻",
    name: "Jordan Chen",
    question: "What skills matter most for becoming a UX Researcher?",
    answer: null,
    upvotes: 24,
    voted: false,
    tag: "UX Researcher",
    time: "2h ago",
    isMine: false,
    loadingAI: false,
  },
  // ... more items
];
```

- Currently uses hardcoded data (not Supabase)
- Real implementation should query `questions` table
- Each item includes user avatar, question, optional answer, upvotes, filter tags

### Implementation Version 2: Dashboard.jsx

Data fetching uses parallel `Promise.all()` for efficiency:

```javascript
const fetchDashboardData = async () => {
  const [assessmentData, careersData, bookmarksData, statsData] =
    await Promise.all([
      supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1),

      supabase.from("careers").select("*"),

      supabase
        .from("bookmarks")
        .select("*, careers(title), skills(name)")
        .eq("user_id", user?.id),

      supabase.rpc("get_dashboard_stats", { p_user_id: user?.id }),
    ]);

  setAssessment(assessmentData.data?.[0]);
  setCareers(careersData.data);
  setBookmarks(bookmarksData.data);
  setStats(statsData.data);
};
```

**Key Differences:**

- Fetches all bookmarks with relations (careers and skills)
- Calls RPC function `get_dashboard_stats` for aggregated counts
- More scalable for large datasets

---

## Career Matching Algorithm

### How Careers Are Matched to User Profile

The matching system compares user's RIASEC assessment results with career RIASEC codes:

#### Version 1: DashboardPage.jsx

```javascript
// Hardcoded careers with match percentages
const careers = [
  { title: "UX Researcher", pct: 87, salary: "$120K - $160K" },
  { title: "Product Manager", pct: 84, salary: "$130K - $180K" },
  // ...
];
```

- Currently uses hardcoded percentages
- Real algorithm should:
  1. Extract assessment.top_traits (RIASEC codes)
  2. Query careers table for all careers
  3. Compare career.riasec_codes with user's top_traits
  4. Calculate match score as: `(overlap_count / career.riasec_codes.length) * 100`

#### Version 2: Dashboard.jsx

```javascript
const calculateCareerMatches = (assessment, careers) => {
  return careers.map((career) => {
    const careerCodes = career.riasec_tags?.split(",") || [];
    const userTraits = assessment.top_traits || [];

    const overlap = careerCodes.filter((code) =>
      userTraits.includes(code),
    ).length;

    const matchScore = Math.round((overlap / careerCodes.length) * 100);

    return { ...career, matchScore };
  });
};
```

**Scoring Formula:**

- Match Score = (RIASEC codes in common / Total RIASEC codes for career) × 100
- Example:
  - Career has RIASEC codes: [I, E, C, A] (4 total)
  - User's top traits: [I, A, S]
  - Overlap: [I, A] (2 in common)
  - Score: (2/4) × 100 = 50%

---

## UI Components & Sections

### 1. Welcome Banner (Lines 158-165)

```jsx
<div className="welcome-banner">
  <div>
    <h2>Welcome back, Alex 👋</h2>
    <p>
      Your top match: <strong>UX Researcher</strong> · Last assessment: March
      10, 2026
    </p>
  </div>
  <button className="btn-retake" onClick={() => navigate("/assessment")}>
    ↺ Retake Assessment
  </button>
</div>
```

**Purpose:** Greets user and displays top career match with most recent assessment date
**Interaction:** Button navigates to `/assessment` page to retake RIASEC questionnaire
**Data Source:** Assessment with highest match score

### 2. Progress Statistics (Lines 167-213)

Six animated progress rings showing:

1. **Assessments Taken** - Count of completed assessments (hardcoded: 2)
2. **Careers Explored** - Number of careers viewed (hardcoded: 12)
3. **Questions Asked** - Dynamic: `qaItems.filter(q => q.isMine).length`
4. **Careers Saved** - Dynamic: `savedCareers.size`
5. **Universities Matched** - From Supabase: `matchCount`
6. **In Your Shortlist** - From Supabase: `shortlistCount`

**Styling:**

- SVG circles with CSS stroke-dasharray animation
- Teal circular progress indicators
- Responsive grid layout

### 3. Discover Universities CTA (Lines 215-265)

Eye-catching call-to-action card with:

- Gradient background (teal to green)
- Dynamic text showing saved careers count
- Hover effects (lift and shadow expansion)
- Navigation to `/discover` page

### 4. Career Matches Grid (Lines 282-309)

**HTML Structure:**

```jsx
<div className="dash-card">
  <div className="dash-card-title">
    <span>🎯</span> Career Matches
  </div>
  <div className="career-match-list">
    {careers.map((c) => (
      <div className="career-match-item" key={c.title}>
        <div className="match-pct">{c.pct}</div>
        <div className="match-info">
          <div className="match-title">{c.title}</div>
          <div className="match-salary">{c.salary}</div>
        </div>
        <button
          className={`heart-btn ${savedCareers.has(c.title) ? "saved" : ""}`}
          onClick={() => toggleSave(c.title)}
        >
          {savedCareers.has(c.title) ? "❤️" : "🤍"}
        </button>
      </div>
    ))}
  </div>
</div>
```

**Features:**

- Displays top 6-8 career matches
- Shows match percentage, title, and salary range
- Heart icon toggles between empty (🤍) and filled (❤️)
- Saved careers tracked in `savedCareers` Set
- Each item clickable to view details in JobModal

### 5. Bookmarks Section (Lines 311-338)

**Functionality:**

- Shows all saved careers from `savedCareers` Set
- Displays career emoji (🎯) instead of match percentage
- Shows match score from careers array
- Empty state message if no bookmarks
- Allows removing bookmarks via heart icon click

### 6. Q&A Board (Lines 340-410)

**Input Section:**

```jsx
<div className="qa-input-row">
  <input
    className="qa-input"
    placeholder="Ask anything about a career…"
    value={qaInput}
    onChange={(e) => setQAInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && postQuestion()}
  />
  <button className="btn-primary-teal" onClick={postQuestion}>
    Post Question
  </button>
</div>
```

**Filter Buttons:**

```javascript
const filteredQA = qaItems.filter((item) => {
  if (qaFilter === "All") return true;
  if (qaFilter === "My Questions") return item.isMine;
  if (qaFilter === "Unanswered") return !item.answer;
  return true;
});
```

**Q&A Item Structure:**

```jsx
<div className="qa-item">
  <div className="qa-header">
    <div className="qa-avatar">{item.avatar}</div>
    <div>
      <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{item.name}</div>
      <div className="qa-meta">{item.time}</div>
    </div>
    <span className="qa-career-tag">{item.tag}</span>
  </div>
  <div className="qa-question">{item.question}</div>
  {item.answer && (
    <div className="qa-answer">
      <div className="qa-answer-label">🤖 AI Answer</div>
      {item.answer}
    </div>
  )}
  <div className="qa-actions">
    <button className={`upvote-btn ${item.voted ? "voted" : ""}`}>
      ▲ {item.upvotes}
    </button>
    {!item.answer && (
      <button onClick={() => getAIAnswer(item.id)}>✨ Get AI Answer</button>
    )}
  </div>
</div>
```

---

## Key Event Handlers

### 1. Save/Unsave Career

```javascript
const toggleSave = (title) => {
  const newSaved = new Set(savedCareers);
  if (newSaved.has(title)) {
    newSaved.delete(title);
  } else {
    newSaved.add(title);
  }
  setSavedCareers(newSaved);
  setBookmarks(Array.from(newSaved));
};
```

- Uses Set data structure for O(1) lookup
- Syncs bookmarks array with Set
- Updates both saved careers and bookmarks list
- UI changes immediately with ❤️/🤍 toggle

### 2. Post Question

```javascript
const postQuestion = () => {
  if (!qaInput.trim()) return;

  const newQuestion = {
    id: nextId,
    avatar: "👤",
    name: "You",
    question: qaInput,
    answer: null,
    upvotes: 0,
    voted: false,
    tag: "Career",
    time: "now",
    isMine: true,
    loadingAI: false,
  };

  setQAItems([newQuestion, ...qaItems]);
  setQAInput("");
  setNextId(nextId + 1);
};
```

- Validates non-empty input
- Creates new Q&A item with user's avatar/name
- Adds to front of list (most recent first)
- Clears input field
- Increments ID counter

### 3. Upvote Question

```javascript
const upvote = (id) => {
  setQAItems(
    qaItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          voted: !item.voted,
          upvotes: item.voted ? item.upvotes - 1 : item.upvotes + 1,
        };
      }
      return item;
    }),
  );
};
```

- Toggles voted state (true/false)
- Increments upvotes if not already voted
- Decrements if already voted (toggle behavior)

### 4. Get AI Answer

```javascript
const getAIAnswer = async (id) => {
  setQAItems(
    qaItems.map((item) =>
      item.id === id ? { ...item, loadingAI: true } : item,
    ),
  );

  // Simulate API call delay (1.8 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1800));

  setQAItems(
    qaItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          loadingAI: false,
          answer: "This is an AI-generated answer about this topic...",
        };
      }
      return item;
    }),
  );
};
```

- Sets loading state on specific item
- Simulates API delay
- Populates answer field with mock response
- Shows "⏳ Thinking…" while loading

---

## Supabase Tables Referenced

### assessments

```sql
id: UUID
user_id: UUID (FK → auth.users)
riasec_scores: JSONB { R, I, A, S, E, C: number }
top_traits: TEXT[] (e.g., ['I', 'A', 'E'])
created_at: TIMESTAMP
```

### user_university_choices

```sql
id: UUID
user_id: UUID (FK → auth.users)
university_id: UUID (FK → universities)
choice: TEXT ('yes' | 'no' | 'maybe')
final_decision: TEXT ('keep' | 'remove' | null)
created_at: TIMESTAMP
```

### questions (for Q&A board)

```sql
id: UUID
user_id: UUID (FK → auth.users)
question: TEXT
answer: TEXT (nullable)
upvotes: INT (default: 0)
career_tag: TEXT
created_at: TIMESTAMP
```

### bookmarks

```sql
id: UUID
user_id: UUID (FK → auth.users)
item_type: TEXT ('career' | 'skill')
career_id: UUID (nullable, FK → careers)
skill_id: UUID (nullable, FK → skills)
created_at: TIMESTAMP
```

### careers

```sql
id: UUID
title: TEXT (e.g., 'UX Researcher')
description: TEXT
riasec_codes: TEXT[] (e.g., ['I', 'A'])
salary_min: INT
salary_max: INT
created_at: TIMESTAMP
```

---

## Authentication Integration

The Dashboard uses user context from [src/context/AuthContext.jsx](src/context/AuthContext.jsx):

```javascript
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth(); // Get authenticated user

  // Use user.id for all Supabase queries
  useEffect(() => {
    if (!user?.id) return; // Wait for auth

    // Fetch user-specific data
    fetchAssessment(user.id);
    fetchMatches(user.id);
    // ...
  }, [user?.id]);
}
```

**Key Points:**

- All data queries filtered by `user_id`
- User metadata includes `full_name` from signup
- Session automatically restored on page reload
- Unauthenticated users redirected by ProtectedRoute wrapper

---

## Styling & CSS

Dashboard uses custom CSS from [src/pathfinder.css](src/pathfinder.css):

**Key Classes:**

- `.pf-page` - Main page container with padding
- `.dashboard-layout` - Flex grid container
- `.dash-card` - Individual card with shadow, border, padding
- `.dashboard-grid` - Three-column grid for matches/bookmarks/Q&A
- `.progress-row` - Horizontal flex for stat rings
- `.prog-ring` - SVG circle for progress visualization
- `.career-match-item` - Horizontal flex for match list items
- `.qa-item` - Q&A item with header, question, answer, actions
- `.qa-filter` - Filter button group
- `.btn-primary-teal` - Primary action button (teal background)
- `.btn-retake` - Secondary button for assessment retake

**CSS Custom Properties:**

```css
--teal: #0d9488 /* Primary action color */ --green: #059669
  /* Secondary accent */ --card: #ffffff /* Card background */ --border: #e5e7eb
  /* Border color */ --soft: #6b7280 /* Soft text color */ --radius: 12px
  /* Border radius */ --shadow: 0 4px 6px rgba(0, 0, 0, 0.1) /* Card shadow */;
```

---

## Performance Considerations

### Current Bottlenecks

1. **Hardcoded Data** - Careers, Q&A items use sample data instead of Supabase
2. **No Pagination** - Q&A board loads all items in memory
3. **Real-time Updates** - No subscription to Supabase changes
4. **Career Matching** - Match percentages pre-calculated, not dynamic

### Optimization Opportunities

1. Replace hardcoded data with Supabase queries
2. Implement pagination for Q&A feed (limit 20 per page)
3. Add real-time subscriptions for new questions
4. Cache assessment data and career matches for 5 minutes
5. Use `useMemo()` to prevent unnecessary recalculations

---

## Integration with Other Pages

### Connected Routes

- **← Assessment Page** (`/assessment`) - User retakes RIASEC questionnaire
- **→ Discover Page** (`/discover`) - Browse and match universities
- **→ Skills Page** (`/skills`) - Explore skills and related careers
- **AuthPage** - Login/signup before accessing dashboard

### Data Flow Between Pages

```
AuthPage
   ↓ (login)
DashboardPage ← Assessment (update scores)
   ↓ (retake)
AssessmentPage ← Update assessment results
   ↓ (save)
DashboardPage ← Re-calculate career matches
   ↓ (explore)
DiscoverPage ← Show universities matching user profile
   ↓ (select)
DashboardPage ← Update matches & shortlist counts
```

---

## Testing Checklist

### Manual Testing

- [ ] Dashboard loads without errors for authenticated user
- [ ] Assessment data displays correctly with most recent creation date
- [ ] Match counts accurately reflect Supabase data
- [ ] Career matches show correct percentages and salary ranges
- [ ] Heart button toggles saved state visually
- [ ] Bookmarks list updates when careers are saved/unsaved
- [ ] Q&A input accepts text and submits on Enter or button click
- [ ] Filter buttons correctly filter Q&A items by category
- [ ] Upvote button increments/decrements properly
- [ ] "Get AI Answer" button shows loading state and populates answer
- [ ] "Retake Assessment" button navigates to assessment page
- [ ] "Discover Universities" button navigates to discover page
- [ ] Page responsive on mobile (progress rings stack, grid becomes single column)

### Data Validation

- [ ] No SQL injection through Q&A input
- [ ] Assessment data shows most recent (not average)
- [ ] Match counts match actual Supabase queries
- [ ] Bookmarks sync between pages

---

## Future Enhancements

1. **Real Supabase Integration**
   - Move hardcoded careers to database queries
   - Real Q&A board with Supabase storage
   - Actual AI integration for answer generation

2. **Advanced Filtering**
   - Sort careers by match percentage
   - Filter by salary range
   - Filter Q&A by career category

3. **Social Features**
   - See other users' profiles
   - Follow interesting people
   - Share career paths

4. **Analytics**
   - Track most viewed careers
   - Trending questions
   - User engagement metrics

5. **Notifications**
   - Real-time updates when answer posted
   - Career recommendations based on profile changes
   - Friends' activity updates

---

## Debugging Tips

### Common Issues

**Q: Dashboard shows empty assessments**

- Check: Is user authenticated? (`user?.id` not null)
- Check: Does `assessments` table have rows for this user?
- Check: Are RLS policies allowing reads?

**Q: Career matches show 0% or incorrect percentages**

- Verify: Assessment contains `top_traits` array
- Verify: Careers table has `riasec_codes` populated
- Debug: Log assessment.top_traits in console
- Debug: Log career.riasec_codes to verify values

**Q: Q&A board filters not working**

- Check: `qaFilter` state updating correctly
- Verify: `filteredQA` computed correctly based on filter
- Check: Sample Q&A data has `isMine` and `answer` set correctly

**Q: Bookmarks not persisting**

- Note: Current implementation uses local state (not Supabase)
- To persist: Save bookmarks to Supabase `bookmarks` table
- Current: Resets on page reload

### Console Debugging

```javascript
// Check user session
console.log("Current user:", user);

// Check assessment data
console.log("Assessment:", assessment);
console.log("Top traits:", assessment?.top_traits);

// Check career matches
console.log("Careers:", careers);

// Check saved careers
console.log("Saved careers:", savedCareers);

// Check Q&A items
console.log("Q&A items:", qaItems);
console.log("Filtered Q&A:", filteredQA);
```

---

## References

- [AuthContext.jsx](src/context/AuthContext.jsx) - Authentication state management
- [pathfinder.css](src/pathfinder.css) - Dashboard styling
- [Supabase Documentation](https://supabase.com/docs) - Database queries and RLS
- [React Hooks Guide](https://react.dev/reference/react/useState) - State management patterns
- [RIASEC Assessment Guide](https://en.wikipedia.org/wiki/Holland_Codes) - Career matching theory
