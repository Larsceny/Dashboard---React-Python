import React, { useState } from 'react'
import './CalendarTab.css'
import { mockEvents as sharedMockEvents } from '../../data/mockCalendar'

// Use shared calendar data
const mockEvents = sharedMockEvents

function CalendarTab() {
  const [selectedDate, setSelectedDate] = useState('2026-01-03')
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)) // January 2026
  const [isConnected, setIsConnected] = useState(false) // Google Calendar connection status

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDateKey = (day) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${month}-${dayStr}`
  }

  const getEventTypeColor = (type) => {
    const root = document.documentElement
    const styles = getComputedStyle(root)

    switch (type) {
      case 'work':
        return styles.getPropertyValue('--primary-color').trim()
      case 'meeting':
        return styles.getPropertyValue('--secondary-color').trim()
      case 'personal':
        return styles.getPropertyValue('--accent-color').trim()
      case 'holiday':
        return styles.getPropertyValue('--danger-color').trim()
      default:
        return styles.getPropertyValue('--text-secondary').trim()
    }
  }

  const hasEvents = (day) => {
    if (!day) return false
    const dateKey = formatDateKey(day)
    return mockEvents[dateKey] && mockEvents[dateKey].length > 0
  }

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(formatDateKey(day))
    }
  }

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + offset)
    setCurrentMonth(newMonth)
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const days = getDaysInMonth(currentMonth)
  const selectedEvents = mockEvents[selectedDate] || []
  const selectedDateObj = new Date(selectedDate)

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>Calendar</h1>
        <div className="calendar-connection">
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Connected to Google Calendar' : '○ Not Connected'}
          </span>
        </div>
      </div>

      <div className="calendar-content">
        {/* Calendar View - Left Side */}
        <div className="calendar-view">
          <div className="calendar-controls">
            <button className="month-nav" onClick={() => changeMonth(-1)}>◀</button>
            <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
            <button className="month-nav" onClick={() => changeMonth(1)}>▶</button>
          </div>

          <div className="calendar-grid">
            <div className="day-header">Sun</div>
            <div className="day-header">Mon</div>
            <div className="day-header">Tue</div>
            <div className="day-header">Wed</div>
            <div className="day-header">Thu</div>
            <div className="day-header">Fri</div>
            <div className="day-header">Sat</div>

            {days.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${!day ? 'empty' : ''} ${
                  day && formatDateKey(day) === selectedDate ? 'selected' : ''
                } ${hasEvents(day) ? 'has-events' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                {day && (
                  <>
                    <span className="day-number">{day}</span>
                    {hasEvents(day) && <span className="event-indicator">●</span>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Event Details - Right Side */}
        <div className="event-details">
          <div className="event-details-header">
            <h2>
              {selectedDateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h2>
            <button className="btn btn-primary">+ Add Event</button>
          </div>

          <div className="events-list">
            {selectedEvents.length > 0 ? (
              selectedEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div
                    className="event-type-indicator"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  ></div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <div className="event-time">
                      <span className="icon">🕐</span>
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="event-location">
                        <span className="icon">📍</span>
                        {event.location}
                      </div>
                    )}
                    <div className="event-type-badge" style={{ backgroundColor: getEventTypeColor(event.type) }}>
                      {event.type}
                    </div>
                  </div>
                  <div className="event-actions">
                    <button className="btn-icon" title="Edit">✏️</button>
                    <button className="btn-icon" title="Delete">🗑️</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events">
                <span className="no-events-icon">📅</span>
                <p>No events scheduled for this day</p>
                <button className="btn btn-primary">+ Add Event</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarTab
