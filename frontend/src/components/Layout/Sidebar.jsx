import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MiniPlayer from './MiniPlayer'
import './Sidebar.css'

function Sidebar() {
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Set CSS variable for sidebar width
    document.documentElement.style.setProperty('--sidebar-width', isMinimized ? '70px' : '250px')
  }, [isMinimized])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const mainNavItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/tasks', icon: '✅', label: 'Task Manager' },
    { path: '/calendar', icon: '📅', label: 'Calendar' },
    { path: '/projects', icon: '📂', label: 'Projects' },
    { path: '/education', icon: '📚', label: 'Education' },
    { path: '/health', icon: '🏥', label: 'Health' },
    { path: '/music', icon: '🎵', label: 'Music' },
  ]

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <button className="minimize-btn" onClick={toggleSidebar} title={isMinimized ? 'Expand' : 'Minimize'}>
        {isMinimized ? '▶' : '◀'}
      </button>

      <div className="sidebar-header">
        {!isMinimized && (
          <>
            <div className="time-display">{formatTime(currentTime)}</div>
            <div className="date-display">{formatDate(currentTime)}</div>
          </>
        )}
        {isMinimized && (
          <div className="time-icon">🕐</div>
        )}
      </div>

      <nav className="sidebar-nav">
        {mainNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={isMinimized ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isMinimized && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <MiniPlayer />

      <div className="sidebar-footer">
        {!isMinimized && <p className="version">v1.0.0</p>}
        <Link
          to="/settings"
          className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          title={isMinimized ? 'Settings' : ''}
        >
          <span className="nav-icon">⚙️</span>
          {!isMinimized && <span className="nav-label">Settings</span>}
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
