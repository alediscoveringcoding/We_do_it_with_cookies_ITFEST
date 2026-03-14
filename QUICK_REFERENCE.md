# University Discovery - Quick Reference

## 🚀 Quick Start (5 minutes)

1. **Create tables** (copy-paste SQL into Supabase)
   - See `UNIVERSITY_DISCOVERY_SETUP.md` Section "Database Setup"

2. **Add to .env**

   ```
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

3. **Seed database**

   ```bash
   node seed.js
   ```

4. **Test**
   - npm run dev
   - Click "Discover" in navbar
   - Swipe through universities

---

## 📱 User Guide

### Discover Page

- **See:** One university at a time
- **Do:** Click ✕ (No) or ✓ (Yes)
- **Shortcut:** Use ← → arrow keys
- **Result:** Choice saved instantly

### My Matches Page

- **See:** All universities you said yes to
- **Do:** Remove any from shortlist
- **Link:** Click "My Matches" in navbar

### Dashboard

- **New:** "Discover Universities" banner
- **Shows:** Count of universities in shortlist
- **Action:** One-click to Discover page

---

## 🛠️ Components

### DiscoverPage.jsx

```
Fetches:
  - All universities (unreviewed)
  - User's previous choices

Renders:
  - Progress bar
  - University card
  - Swipe buttons
  - Completion screen
```

### MyMatchesPage.jsx

```
Fetches:
  - All user's "yes" choices

Renders:
  - Grid of matches
  - Remove buttons
  - Empty state
```

### UniversityCard.jsx

```
Props:
  - university (object)
  - isVisible (boolean)

Displays:
  - Name, city, type
  - RIASEC badges (6 colors)
  - Description
```

### SwipeButtons.jsx

```
Props:
  - onNo (function)
  - onYes (function)
  - disabled (boolean)
```

---

## 🗄️ Database

### Data Seed

- 100 Romanian universities
- Pre-populated with: name, city, type, RIASEC tags, description

### Tracking

- Each yes/no choice stored with user_id + timestamp
- Can see user's history anytime
- RLS ensures privacy

---

## 🎨 Colors

### RIASEC Badges

```
R = Blue     (Realistic)
I = Purple   (Investigative)
A = Pink     (Artistic)
S = Green    (Social)
E = Orange   (Enterprising)
C = Gray     (Conventional)
```

### Theme

```
Primary:  --teal (#0d9488)
Light:    --teal-light (#14b8a6)
Pale:     --teal-pale (#ccfbf1)
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action         |
| --- | -------------- |
| ←   | Not Interested |
| →   | Interested     |

---

## 🔧 Debugging

**Universities not showing?**

- Check seed.js ran: `node seed.js`
- Check Supabase → Table Editor → universities (see 100 rows?)

**Choices not saving?**

- Open DevTools → Network tab
- Look for `user_university_choices` request
- Check response status

**Layout issues?**

- Clear browser cache
- Check pathfinder.css loads
- Verify Tailwind in index.css

---

## 📊 Data Flow

```
User Auth ✓
    ↓
Browse Universities
    ├─ Fetch all (100)
    ├─ Fetch previous choices
    └─ Show undecided only
        ↓
    Swipe (Yes/No)
    ├─ Save to user_university_choices
    └─ Move to next
        ↓
    View Matches
    ├─ Fetch all "yes" choices
    └─ Grid display
```

---

## 🚀 Next Phase

**When RIASEC assessment is integrated:**

```javascript
// Filter to relevant universities
const { data } = await supabase
  .from("universities")
  .select("*")
  .overlaps("riasec_tags", userTopTraits);
```

This will show only universities matching user's personality profile.

---

## 📞 Support Files

- `UNIVERSITY_DISCOVERY_SETUP.md` - Complete setup guide
- `IMPLEMENTATION_COMPLETE.md` - Summary + checklists
- Code comments in DiscoverPage.jsx, MyMatchesPage.jsx
- Inline JSDoc in component files

---

**Last Updated:** March 2026
**Status:** ✅ Production Ready
