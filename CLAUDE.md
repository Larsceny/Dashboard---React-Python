# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal Life Dashboard - A desktop application for tracking productivity, health, education, and personal projects. Built with **Electron + React** frontend and **Python Flask** backend (planned). Currently in **UI-first development phase** with mock data.

**Architecture:** Hybrid approach separating UI development from backend implementation. All UI components are fully functional with mock data to allow rapid iteration before connecting to backend.

## Development Commands

### Running the Application (Requires 2 Terminals)

**Terminal 1 - Backend (Python Flask):**
```bash
cd backend
venv\Scripts\activate
python run.py
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend (Electron + React):**
```bash
cd frontend
npm run electron-dev
```
This starts Vite dev server on `http://localhost:5173` and launches the Electron app with hot-reload enabled.

### Frontend-Only Development
```bash
cd frontend
npm run dev          # Run Vite dev server only (no Electron)
npm run build        # Build production bundle
npm run preview      # Preview production build
```

### Backend Commands
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt  # Install dependencies
python run.py                     # Start Flask dev server
```

## Key Architectural Decisions

### UI-First Development Pattern

**Critical:** This project follows a **UI-first workflow** where complete UI mockups are built with hardcoded data BEFORE implementing backend functionality. This is intentional and should be preserved when adding features.

**Pattern:**
1. Build complete UI component with mock data
2. Get user approval on UI/UX
3. Implement backend API endpoints
4. Connect UI to backend by replacing mock data with API calls

### Health Tab Sub-Tab Architecture

The Medical/Health tab (`MedicalTab.jsx`) uses a unique **fixed header sub-tab system**:

- Header is `position: fixed` at top with CSS variable `--sidebar-width` for responsive positioning
- Sub-tabs: Dashboard, Water, Weight, Exercise, Nutrition, Sleep, Medications, Events, Reports
- Content area has `padding-top: 88px` to account for fixed header
- **CSS coordination:** `MedicalTab.css` sets header position, `Sidebar.jsx` sets `--sidebar-width` CSS variable

**Exercise Tab Complexity:**
- Today's Workout Widget with Morning/Evening sections
- Calendar with month navigation (custom-built, not library)
- Selected day detail view
- Program Manager for loading/creating workout programs
- Mock data structure: Programs → Week Templates → Week Assignments → Daily Workouts

### Weight Tab - 13 Metric Integration

Weight sub-tab displays **all 13 metrics from Etekcity ESF-551 smart scale**:
- Organized into logical groups: Body Composition, Muscle & Bone, Metabolism, Other Metrics
- Multi-line charts combining related metrics (e.g., Body Fat, Visceral Fat, Subcutaneous Fat on one chart)
- **Future integration:** Planned Health Connect API sync (Android) to automatically pull weight data

### Component Communication Patterns

**Sidebar Width Coordination:**
```javascript
// In Sidebar.jsx - Sets CSS variable
useEffect(() => {
  document.documentElement.style.setProperty('--sidebar-width', isMinimized ? '70px' : '250px')
}, [isMinimized])

// In MedicalTab.css - Uses variable
.medical-header {
  left: var(--sidebar-width, 250px);
}
```

**SubTabs Component:**
- Reusable sub-navigation component (`components/Common/SubTabs.jsx`)
- Used in Medical tab for 9 sub-sections
- Props: `tabs` array, `activeTab`, `onTabChange` callback

### Mock Data Structure

All tabs currently use **comprehensive mock data** defined at component top:

```javascript
// Pattern used throughout components
const mockData = [
  { id: 1, name: 'Example', date: '2024-12-23', ... },
  // Realistic sample data
]

function ComponentTab() {
  const [data, setData] = useState(mockData)
  // Component logic
}
```

**Important:** Mock data should remain in components until backend is implemented. Do NOT create separate mock data files.

## Critical UI Patterns

### Stat Cards Layout (Weight Tab Pattern)

Weight tab stat cards follow specific spacing pattern:
```css
.weight-stats .stat-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;  /* Key: distributes title/value/change */
  align-items: center;
  text-align: center;
  padding: 25px 20px;
  min-height: 140px;
}
```

Structure: Title (top) → Large Value (middle) → Change Text (bottom)

### Calendar State Management

Exercise calendar uses controlled state pattern:
- `currentMonth` and `currentYear` for navigation
- `selectedDate` for detail view
- Helper functions: `getDaysInMonth()`, `getFirstDayOfMonth()`, `getWorkoutsForDate()`

**Status classes:** `upcoming`, `today`, `missed`, `has-workout`, `selected`

### Color Coding Standards

- **Primary Color:** Blue (#5B9BD5) - Navigation, primary actions
- **Secondary Color:** Teal (#70C1B3) - Success, positive metrics
- **Accent Color:** Orange (#FFA94D) - Warnings, calories
- **Danger Color:** Red (#FF6B6B) - Errors, missed items

**Chart Colors:** Use distinct, accessible colors for multi-line charts. Avoid similar shades (e.g., don't use light teal + medium teal + dark teal for 3 lines).

## Styling Conventions

### CSS Organization

- Each component has corresponding `.css` file in same directory
- Global styles in `frontend/src/styles/`
- CSS variables defined for theme consistency
- **Class naming:** Component-specific prefixes (e.g., `.medical-header`, `.exercise-calendar`)

### Responsive Sidebar

Sidebar minimizes to 70px showing only icons. Components must accommodate:
```css
/* Fixed headers adjust based on sidebar width */
left: var(--sidebar-width, 250px);
transition: left 0.3s ease;
```

## Backend Integration (Planned)

### Current Status
Backend is **minimal Flask app** with:
- Health check endpoint: `/health`
- Test endpoint: `/api/test`
- CORS enabled for `localhost:5173`, `localhost:5174`

### Database (Not Yet Implemented)
Planned: SQLite with SQLAlchemy ORM, SQLCipher encryption for medical data.

### API Integration Points (TODO List Reference)

**Exercise Tab:**
- Load/Create/Edit workout programs
- Add one-off exercises
- Calculate calories using weight from Weight tab + MET values

**Weight Tab:**
- Health Connect API sync (Android)
- VeSync API for Etekcity scale data
- CSV/JSON import for manual data entry

**Reports Tab:**
- Custom date range picker
- Export formats: HTML, ODS (LibreOffice Calc), ODT (LibreOffice Writer)
- Template save/load functionality
- Saved reports directory (Electron filesystem)

## Important Notes

### Don't Break These Patterns

1. **Fixed Header + CSS Variable:** Medical tab header positioning relies on `--sidebar-width` variable
2. **Mock Data in Components:** Keep mock data arrays at component top until backend is ready
3. **UI-First Approval:** Don't implement backend for features until UI is approved
4. **Multi-line Charts:** Related metrics should share a chart (e.g., Body Composition metrics together)

### Hot-Reload Behavior

- **Works:** React component changes (`.jsx`), CSS changes
- **Doesn't work:** Backend Python changes (must restart Flask server)
- **Electron main process changes:** Requires full app restart

### State Management

Currently **no global state management** (Redux, Context). Each component manages its own state with `useState`. This is intentional for simplicity during UI phase.

## File Locations Reference

### Key Frontend Files
- Main app shell: `frontend/src/App.jsx`
- Sidebar navigation: `frontend/src/components/Layout/Sidebar.jsx`
- Health tab (most complex): `frontend/src/components/Medical/MedicalTab.jsx`
- Reusable sub-tabs: `frontend/src/components/Common/SubTabs.jsx`

### Key Backend Files
- Flask entry point: `backend/run.py`
- Environment config: `backend/.env` (gitignored)
- Dependencies: `backend/requirements.txt`

### Data Storage
- Database location (future): `data/database/`
- Backups (future): `data/backups/`
- **Currently:** No database - all data is mock data in components

## Windows-Specific Notes

- Virtual environment activation: `venv\Scripts\activate` (backslashes)
- File paths use Windows format: `C:\Users\...\Dashboard-VS`
- Python 3.12.6 and Node.js v24.11.1 already installed
