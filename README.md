# Life Dashboard

A personal productivity and health tracking desktop application built with React, Electron, Python Flask, and SQLite.

## Features

- 📊 **Dashboard**: Visual overview of all your activities and metrics
- ✅ **Activity Tracking**: Log and track daily activities with categories
- 🏥 **Medical Records**: Securely track health metrics and medical data
- 🎵 **Music Stats**: Monitor listening habits from YouTube API
- ⚙️ **Settings**: Configure backups, API keys, and preferences

## Tech Stack

**Frontend:**
- React 18
- Electron (Desktop app)
- Vite (Build tool)
- Recharts (Data visualization)
- React Router (Navigation)

**Backend:**
- Python 3.12
- Flask (REST API)
- SQLAlchemy (Database ORM)
- SQLite (Database)

## Prerequisites

- ✅ Python 3.12.6 (already installed)
- ✅ Node.js v24.11.1 (already installed)

## Getting Started

### Phase 1 & 2: COMPLETE ✅

You've completed the initial setup and barebones UI! All tabs are now navigable with mock data.

### How to Run the Application

You need **TWO terminal windows** - one for backend, one for frontend.

#### Terminal 1: Start the Backend

```bash
cd backend
venv\Scripts\activate
python run.py
```

You should see:
```
🚀 Starting Dashboard Backend...
📍 Backend running on http://localhost:5000
✅ CORS enabled for frontend
```

#### Terminal 2: Start the Frontend (Electron App)

```bash
cd frontend
npm run electron-dev
```

This will:
1. Start the Vite dev server on `http://localhost:5173`
2. Launch the Electron desktop app
3. Enable hot-reload (changes appear instantly when you save files)

### Testing Hot-Reload

1. With the app running, open `frontend/src/components/Dashboard/Dashboard.jsx`
2. Change any text (like the title "Dashboard Overview")
3. Save the file (Ctrl+S)
4. Watch the Electron window update automatically in < 1 second!

## Project Structure

```
Dashboard-VS/
├── backend/          # Python Flask backend
│   ├── venv/        # Virtual environment (gitignored)
│   ├── run.py       # Flask entry point
│   └── .env         # Environment variables
│
├── frontend/         # Electron + React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── Activities/
│   │   │   ├── Medical/
│   │   │   ├── Music/
│   │   │   ├── Settings/
│   │   │   └── Layout/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── public/
│   │   └── electron.js
│   └── package.json
│
└── data/            # Database and files (gitignored)
```

## Current Status

### ✅ Completed (Phase 1 & 2)

- [x] Project structure created
- [x] Backend setup (Flask with minimal API)
- [x] Frontend setup (Vite + React + Electron)
- [x] All dependencies installed
- [x] Hot-reload enabled and working
- [x] Navigation sidebar with routing
- [x] Dashboard tab (with mock charts)
- [x] Activities tab (with mock data)
- [x] Medical tab (with mock records)
- [x] Music tab (with mock stats)
- [x] Settings tab (configuration UI)

### 🚧 Next Steps (Phase 3+)

**Phase 3: Backend Foundation**
- Create database models (Activity, Medical, etc.)
- Build REST API endpoints
- Initialize SQLite database

**Phase 4: Connect UI to Backend**
- Wire up forms to save data
- Connect charts to real database queries
- Implement CRUD operations

**Phase 5: Advanced Features**
- Medical data encryption
- YouTube API integration
- Backup system

## Features Overview

### Dashboard Tab
- Overview stats cards
- Activity breakdown chart
- Health trends chart
- Recent activities list

### Activities Tab
- Add/edit/delete activities
- Filter by category
- Date selection
- Duration tracking

### Medical Tab
- Vital signs tracking (heart rate, blood pressure, weight)
- Medical records (medications, symptoms, appointments)
- Health trends visualization
- Encrypted storage (coming in Phase 5)

### Music Tab
- Listening time statistics
- Top songs ranking
- Weekly activity chart
- YouTube API integration (coming in Phase 6)

### Settings Tab
- Database backup controls
- API key configuration
- Theme settings
- Privacy & data information

## Important Notes

### Offline Functionality
- ✅ App runs 100% locally
- ✅ No internet needed for core features
- ⚠️ Internet only needed for YouTube API (later)

### Database Backup
- Database is a single file: `data/database/dashboard.db`
- To backup: copy the file to safe location
- Restore: copy backup file back

### Security
- Database encryption will be added in Phase 5
- Currently using regular SQLite (fine for development)
- `.env` files are gitignored (secrets never committed)

## Development Tips

1. **Hot-reload works for React files** (.jsx, .css)
   - Just save and watch changes appear!

2. **Backend changes need restart**
   - Stop Flask (Ctrl+C) and run `python run.py` again

3. **View React Dev Tools**
   - Electron opens with DevTools enabled in development

4. **Mock Data**
   - All data is currently hard-coded in components
   - Phase 4 will connect to real backend

## Troubleshooting

**Electron won't start:**
- Make sure Vite dev server is running first
- Check for errors in terminal

**Hot-reload not working:**
- Verify you're editing files in `frontend/src/`
- Check that Vite dev server is running

**Backend errors:**
- Activate virtual environment: `venv\Scripts\activate`
- Check all dependencies installed: `pip list`

## Next Session

When ready to continue:

1. Review the barebones UI - navigate through all tabs
2. Identify any UI changes or additional tabs needed
3. Once UI is approved, we'll build the backend (Phase 3)
4. Then connect everything together (Phase 4)

---

**Built with ❤️ using React, Electron, Flask, and SQLite**
