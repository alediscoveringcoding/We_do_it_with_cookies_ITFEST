# University Discovery System - Setup Guide

## ✅ What's Been Built

A complete Tinder-style university discovery and matching system integrated into your PathFinder app.

### New Files Created

1. **seed.js** - Database seeder script (100 Romanian universities)
2. **src/pages/DiscoverPage.jsx** - Main swipe interface
3. **src/pages/MyMatchesPage.jsx** - Saved matches grid
4. **src/components/UniversityCard.jsx** - Reusable university card component
5. **src/components/SwipeButtons.jsx** - Yes/No button pair component

### Files Updated

1. **src/App.jsx** - Added routes for Discover and MyMatches pages
2. **src/pages/Nav.jsx** - Added "Discover" and "My Matches" navigation links
3. **src/pages/DashboardPage.jsx** - Added university discovery CTA banner and match stat

---

## 🛠️ Database Setup Instructions

### Step 1: Create Universities Table

Open Supabase SQL Editor and run:

```sql
CREATE TABLE universities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  type TEXT,
  riasec_tags TEXT[],
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_universities_riasec_tags ON universities USING GIN (riasec_tags);
```

### Step 2: Create User Choices Table

```sql
CREATE TABLE user_university_choices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  university_id INT REFERENCES universities(id) ON DELETE CASCADE,
  choice TEXT CHECK (choice IN ('yes', 'no')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, university_id)
);

-- Enable Row Level Security
ALTER TABLE user_university_choices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own choices" ON user_university_choices
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read universities" ON universities
  FOR SELECT USING (true);
```

### Step 3: Seed the Database

Run this command from your project root:

```bash
node seed.js
```

**Important:** Set your environment variables first. Create a `.env` file in the root:

```
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
```

You can find these in Supabase → Settings → API.

---

## 🎮 How It Works

### User Flow

1. **Student completes RIASEC assessment** → Top 3 traits stored
2. **Click "Discover" in navigation** → Taken to swipe interface
3. **Swipe left (✕) or right (✓)** on university cards
4. **Arrow keys work too** → ← = No, → = Yes
5. **Choices saved in real-time** to Supabase
6. **After swiping all** → Completion screen → "See My Matches"
7. **View all saved universities** in My Matches grid
8. **Remove any from shortlist** anytime

### DiscoverPage Features

- **Progress bar** showing X of Y universities reviewed
- **One card at a time** with smooth animations
- **Large action buttons** (✕ Not Interested, ✓ Interested)
- **Keyboard support** (Arrow keys for quick swiping)
- **Real-time saving** to database
- **Skip already-decided** universities (fetches previous choices)
- **Completion screen** with link to matches
- **Completion check** prevents duplicate swipes

### MyMatchesPage Features

- **Grid layout** (3 columns desktop, 2 tablet, 1 mobile)
- **All "yes" universities** displayed as cards
- **Card shows:** Name, City, Type, RIASEC traits, Description
- **Remove button** changes choice to "no" and removes from grid
- **Empty state** with link to Discover page
- **Match count** in header

### Dashboard Integration

- **New gradient CTA card** linking to Discover page
- **Stat showing** universities in shortlist (tracked in real-time)
- **Retake Assessment button** still works

---

## 📱 Component Architecture

### UniversityCard.jsx

Props:

- `university` (object): { name, city, type, riasec_tags, description, id }
- `isVisible` (boolean): Controls opacity/scale animations

Features:

- Playfair Display font for name
- Color-coded RIASEC badges (R=blue, I=purple, A=pink, S=green, E=orange, C=gray)
- Responsive sizing
- Hover effects

### SwipeButtons.jsx

Props:

- `onNo` (function): Called when user clicks Not Interested
- `onYes` (function): Called when user clicks Interested
- `disabled` (boolean): Disables buttons when no card present

Features:

- Large touch-friendly buttons
- Hover color transitions
- Icons (✕ and ✓)
- Keyboard shortcut hints in title attributes

### DiscoverPage.jsx

State:

- `universities` - Array of undecided universities
- `currentIndex` - Currently displayed card index
- `choices` - Map of { universityId: 'yes' | 'no' }
- `loading` - Fetch state
- `completed` - All universities reviewed flag

Key Functions:

- `fetchUniversities()` - Gets unreviewed universities + user's previous choices
- `saveChoice(universityId, choice)` - Upserts to Supabase and moves to next card
- `handleNo()` and `handleYes()` - Button click handlers
- Keyboard event listener for arrow keys

### MyMatchesPage.jsx

State:

- `matches` - Array of user's "yes" universities
- `loading` - Fetch state

Key Function:

- `removeMatch(universityId)` - Updates choice to "no" and removes from grid

---

## 🎨 Styling Details

### Color System (Using CSS Variables)

```css
--teal: #0d9488 /* Primary brand, action buttons */ --teal-light: #14b8a6
  /* Hover states */ --teal-pale: #ccfbf1 /* Background accents */
  --green: #2d6a4f /* Secondary brand */ --dark: #1a1a2e /* Text */
  --bg: #f9fafb /* Page background */ --border: #e5e7eb /* Dividers, borders */
  --radius: 16px /* Card border-radius */ --shadow: 0 4px 24px
  rgba(0, 0, 0, 0.07) /* Card shadow */;
```

### RIASEC Badge Colors

| Trait | Background    | Text            | Meaning                  |
| ----- | ------------- | --------------- | ------------------------ |
| R     | bg-blue-100   | text-blue-700   | Realistic (hands-on)     |
| I     | bg-purple-100 | text-purple-700 | Investigative (research) |
| A     | bg-pink-100   | text-pink-700   | Artistic (creative)      |
| S     | bg-green-100  | text-green-700  | Social (people)          |
| E     | bg-orange-100 | text-orange-700 | Enterprising (business)  |
| C     | bg-gray-100   | text-gray-700   | Conventional (detail)    |

### Fonts

- **Headings:** 'Playfair Display', serif (sizes: 2.5rem for cards, 3rem for headers)
- **Body:** 'DM Sans', sans-serif (weights: 400, 500, 600)

---

## 🔌 API Integration Points

### Supabase Client

All pages use `supabase` imported from `src/api/supabaseClient.js`

**Queries Used:**

1. **Fetch all universities (unfiltered for MVP)**

   ```javascript
   const { data } = await supabase.from("universities").select("*").order("id");
   ```

2. **Fetch user's previous choices**

   ```javascript
   const { data } = await supabase
     .from("user_university_choices")
     .select("university_id, choice")
     .eq("user_id", user.id);
   ```

3. **Save/update a choice**

   ```javascript
   await supabase.from("user_university_choices").upsert(
     {
       user_id: user.id,
       university_id: universityId,
       choice: choice,
     },
     { onConflict: "user_id,university_id" },
   );
   ```

4. **Fetch user's YES matches**
   ```javascript
   const { data } = await supabase
     .from("user_university_choices")
     .select("university_id, universities(*)")
     .eq("user_id", user.id)
     .eq("choice", "yes");
   ```

---

## 🚀 Future Enhancements

### Phase 2: RIASEC Filtering

Once you're storing RIASEC assessment results:

```javascript
// Fetch user's top 3 traits from assessments table
const userTopTraits = userAssessment.topThreeTraits; // e.g. ["I", "A", "E"]

// Filter universities by RIASEC overlap
const { data } = await supabase
  .from("universities")
  .select("*")
  .overlaps("riasec_tags", userTopTraits);
```

### Phase 3: Advanced Features

- Add university photos/logos
- Integrate university APIs for real data
- Add "favorites" vs "maybe" distinction
- Notification when new universities added
- Share shortlist with friends
- Compare multiple universities side-by-side
- Add university reviews/ratings
- Filter by location, tuition, selectivity
- Email matches to student's inbox

---

## 🐛 Troubleshooting

### No universities loading

1. Check Supabase connection in `src/api/supabaseClient.js`
2. Verify seed.js was run successfully (`node seed.js`)
3. Check browser console for errors (F12 → Console tab)
4. Verify `.env` file has correct Supabase URL and key

### Choices not saving

1. Check Supabase Row Level Security policies
2. Verify `user_id` matches authenticated user
3. Check browser DevTools Network tab for failed requests

### AuthContext not available

1. Ensure Discover/MyMatches pages are wrapped properly in App.jsx
2. Verify AuthContext is properly imported and provided

### Styling looks off

1. Verify `pathfinder.css` is imported in `index.css`
2. Check Tailwind CSS is loaded (should be in index.css via @import)
3. Clear browser cache (Ctrl+Shift+Delete)

---

## 📊 Database Schema Reference

### universities table

- `id` (SERIAL PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `city` (TEXT)
- `type` (TEXT) - Public, Private, Technical, Medicine, Arts, Military, etc.
- `riasec_tags` (TEXT[]) - Array of traits (R, I, A, S, E, C)
- `description` (TEXT)
- `created_at` (TIMESTAMPTZ)

### user_university_choices table

- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → auth.users)
- `university_id` (INT FOREIGN KEY → universities)
- `choice` (TEXT) - 'yes' or 'no'
- `created_at` (TIMESTAMPTZ)
- **UNIQUE constraint** on (user_id, university_id)

---

## ✨ Design System Consistency

The university discovery feature maintains consistency with PathFinder's design:

- **Color palette** uses existing CSS variables
- **Fonts** match (Playfair + DM Sans)
- **Button styles** follow `.btn-teal`, `.btn-ghost` patterns
- **Card styling** matches dashboard cards (rounded-2xl, border, shadow)
- **Spacing** uses consistent padding/margins
- **Animations** are subtle and performant
- **Responsive design** works on mobile, tablet, desktop

---

## 🎓 Learning Resources

- [RIASEC Career Theory](https://www.mynextmove.org/) - Understanding the assessment traits
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security) - Security policies
- [React Hooks Guide](https://react.dev/reference/react) - useState, useEffect, useContext

---

**Setup Status: ✅ Ready to Use**

All files are in place. Just:

1. Set up the database (run SQL above)
2. Run `node seed.js`
3. Update `.env` with Supabase credentials
4. Start the dev server: `npm run dev`
5. Navigate to Discover page to test!
