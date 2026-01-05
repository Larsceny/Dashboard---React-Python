import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { MusicProvider } from './contexts/MusicContext'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './components/Dashboard/Dashboard'
import ActivitiesTab from './components/Activities/ActivitiesTab'
import CalendarTab from './components/Calendar/CalendarTab'
import ProjectsTab from './components/Projects/ProjectsTab'
import EducationTab from './components/Education/EducationTab'
import MedicalTab from './components/Medical/MedicalTab'
import MusicTab from './components/Music/MusicTab'
import SettingsTab from './components/Settings/SettingsTab'

function AppContent() {
  const location = useLocation()

  // Load theme colors on app startup
  useEffect(() => {
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    const savedTheme = localStorage.getItem('themeColors')
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme)
        // Apply saved colors globally
        document.documentElement.style.setProperty('--primary-color', themeData.primary)
        document.documentElement.style.setProperty('--secondary-color', themeData.secondary)
        document.documentElement.style.setProperty('--accent-color', themeData.accent)
        document.documentElement.style.setProperty('--primary-bg', hexToRgba(themeData.primary, 0.1))
        document.documentElement.style.setProperty('--secondary-bg', hexToRgba(themeData.secondary, 0.1))
        document.documentElement.style.setProperty('--accent-bg', hexToRgba(themeData.accent, 0.1))
        console.log('Theme loaded:', themeData.presetName || 'Custom')
      } catch (e) {
        console.error('Failed to load theme colors:', e)
      }
    }
  }, [])

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {/* Keep MusicTab always mounted for persistent playback */}
        <div style={{ display: location.pathname === '/music' ? 'block' : 'none' }}>
          <MusicTab />
        </div>

        {/* Other tabs render normally */}
        {location.pathname !== '/music' && (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<ActivitiesTab />} />
            <Route path="/calendar" element={<CalendarTab />} />
            <Route path="/projects" element={<ProjectsTab />} />
            <Route path="/education" element={<EducationTab />} />
            <Route path="/health" element={<MedicalTab />} />
            <Route path="/settings" element={<SettingsTab />} />
          </Routes>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </Router>
  )
}

export default App
