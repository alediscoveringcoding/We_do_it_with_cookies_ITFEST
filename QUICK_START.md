# Quick Start Guide - PathFinder UI

## Running the Application

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Navigating the UI

### 1. **Home Page**

- **Entry point** of the application
- Shows hero banner with main CTA
- Features section with 4 main offerings
- How it works breakdown
- Student testimonials
- Call-to-action banner

**Actions:**

- Click "Start Assessment" → Go to assessment
- Click "Browse Skills" → Go to skills page
- Click feature cards → Navigate to related pages

### 2. **Career Assessment**

- **3-phase process**: Intro → Quiz → Results

**Phase 1: Introduction**

- Explains RIASEC assessment
- Shows what you'll learn
- Click "Start Quiz" to begin

**Phase 2: Quiz**

- 20 questions about your preferences
- 5-point scale (Strongly Disagree → Strongly Agree)
- Progress bar shows completion
- Use Back/Next buttons to navigate
- Must answer each question before proceeding

**Phase 3: Results**

- Your RIASEC score breakdown
- Visual score bars for each trait
- Top 3 traits highlighted
- Click "See My Career Matches" → Dashboard
- Click "Retake Assessment" to start over

### 3. **Skills Page**

- **Left sidebar:** Category filter
- **Main area:** Skills grid (3 columns)

**Features:**

- Filter by: All Skills, Technical, Creative, Social, Analytical, Leadership, Trades
- Each skill shows:
  - Category badge (color-coded)
  - Skill name
  - Description
  - Number of careers using it
  - "See Careers" button

**Click "See Careers":**

- Modal opens with skill details
- Shows testimonials from professionals
- Click X or outside modal to close

### 4. **Dashboard**

- **Welcome banner:** Personalized greeting + retake button
- **Stats section:** Progress rings showing:
  - Assessments taken
  - Careers explored
  - Questions asked
  - Careers saved

**Career Matches:**

- Shows 6 careers ranked by compatibility
- Percentage match displayed prominently
- Salary range shown
- Heart button to save/bookmark careers

**Bookmarks:**

- Shows up to 4 saved careers
- Click heart to remove from bookmarks

**Q&A Board:**

- **Input row:** Type question + Post button
- **Filter buttons:** All / My Questions / Unanswered

**For each question:**

- Avatar + name + timestamp
- Career tag
- Question text
- Answer (if AI has answered)
- Upvote button
- "Get AI Answer" button (if no answer yet)

### 5. **Login Page**

- **Two tabs:** Login & Register

**Login Tab:**

- Email input
- Password input
- Forgot password link
- Submit button
- Google sign-in option

**Register Tab:**

- Full name input
- Email input
- Password input
- Confirm password input
- Submit button
- Google sign-up option

**Form Features:**

- Validates required fields
- Checks password match on register
- Shows success/error messages
- Demo mode (no actual authentication)

## Navigation Bar

**Logo:** Click to go home

**Links:**

- Home
- Career Assessment
- Skills
- Dashboard

**Buttons:**

- Login (outlined teal button)
- Start Assessment (solid teal button)

## Keyboard Shortcuts

- **Assessment Quiz:** Use keyboard arrows or click options
- **Forms:** Tab to move between fields, Enter to submit
- **Modal:** Esc to close (or click X)

## Design Features

**Colors:**

- Teal (#0d9488) - Primary actions
- Green (#2d6a4f) - Secondary elements
- Light backgrounds (#f9fafb)
- Professional grays for text

**Responsive:**

- Mobile: Single column, larger touch targets
- Tablet: 2-column grids
- Desktop: 3-4 column grids, full layout

**Animations:**

- Smooth hover effects on cards
- Fade-in modals
- Progress bar animations
- Button transitions

## Common Actions

### Save a Career

1. Go to Dashboard
2. Find career in matches
3. Click heart button (❤️ = saved, 🤍 = not saved)

### Ask a Question

1. Go to Dashboard
2. Type in Q&A input field
3. Click "Post Question"
4. Wait for AI to answer or check back later

### Filter Skills

1. Go to Skills page
2. Click category in sidebar
3. Grid updates automatically

### Retake Assessment

1. Go to Dashboard
2. Click "Retake Assessment" button
   OR
3. Complete assessment
4. Click "Retake Assessment" in results

## Troubleshooting

**Page not loading?**

- Refresh the browser (Ctrl+R or Cmd+R)
- Clear browser cache

**Navigation not working?**

- Make sure you clicked on the navigation button
- Check the browser console (F12) for errors

**Form submission failing?**

- Ensure all required fields are filled
- Passwords must match on register
- Check browser console for details

## Development Notes

- Application uses **state-based routing** (no React Router)
- All styling in `src/pathfinder.css`
- Components are pure functional components with hooks
- No external UI library (fully custom CSS)
- Responsive using CSS Grid and Flexbox

## File Locations

- **Navigation:** `src/pages/Nav.jsx`
- **Home:** `src/pages/HomePage.jsx`
- **Assessment:** `src/pages/AssessmentPage.jsx`
- **Skills:** `src/pages/SkillsPage.jsx`
- **Dashboard:** `src/pages/DashboardPage.jsx`
- **Login:** `src/pages/LoginPage.jsx`
- **Main App:** `src/App.jsx`
- **Styles:** `src/pathfinder.css` + `src/index.css`

## Next Steps

1. Connect to backend/Supabase for real authentication
2. Add API calls for career data
3. Implement actual assessment scoring logic
4. Add user data persistence
5. Deploy to production

---

Happy exploring! 🎯
