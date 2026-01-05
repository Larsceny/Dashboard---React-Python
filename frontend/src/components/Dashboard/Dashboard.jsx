import React, { useState, useEffect } from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import './Dashboard.css'
import { mockTodayTasks, mockWeeklyTasks } from '../../data/mockTasks'
import { mockEvents, getTodayEvents } from '../../data/mockCalendar'
import { mockProjects, getActiveProjects } from '../../data/mockProjects'

// Alias imports for backward compatibility
const mockDailyTasks = mockTodayTasks
const mockMonthlyTasks = [] // Can be added later if needed

// Get main project (first active project)
const mockMainProject = getActiveProjects()[0] || {
  id: 1,
  name: 'Dashboard App',
  description: 'Building a comprehensive personal life dashboard',
  nextStep: 'Connect widgets to shared data',
}

// Widget Components
function TasksWidget() {
  const [tasks, setTasks] = useState(mockDailyTasks)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [quickTaskTitle, setQuickTaskTitle] = useState('')

  const incompleteTasks = [...mockWeeklyTasks, ...mockMonthlyTasks].filter(t => t.status !== 'completed')
  const pendingDailyTasks = tasks.filter(t => t.status === 'pending')

  // Helper function to check if a task is overdue
  const isOverdue = (task) => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today && task.status !== 'completed'
  }

  const overdueTasks = incompleteTasks.filter(isOverdue)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (quickTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: quickTaskTitle,
        status: 'pending',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0]
      }
      setTasks([...tasks, newTask])
      setQuickTaskTitle('')
      setShowQuickAdd(false)
    }
  }

  return (
    <div className="widget-card">
      <h3 className="widget-title">📋 Tasks</h3>
      <div className="widget-content">
        <div className="tasks-summary">
          <div className="task-count">
            <span className="count-number">{pendingDailyTasks.length}</span>
            <span className="count-label">Daily Tasks Remaining</span>
          </div>
          {overdueTasks.length > 0 && (
            <div className="task-count pulse-animation" style={{
              background: 'rgba(255, 77, 79, 0.15)',
              border: '1px solid var(--danger-color)'
            }}>
              <span className="count-number" style={{ color: 'var(--danger-color)' }}>
                {overdueTasks.length}
              </span>
              <span className="count-label" style={{ color: 'var(--danger-color)' }}>
                Overdue
              </span>
            </div>
          )}
        </div>

        {!showQuickAdd ? (
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '15px', padding: '8px' }}
            onClick={() => setShowQuickAdd(true)}
          >
            + Add Quick Task
          </button>
        ) : (
          <form onSubmit={handleQuickAdd} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Task title..."
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                autoFocus
                style={{ flex: 1, padding: '8px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>Add</button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '8px 12px' }}
                onClick={() => {
                  setShowQuickAdd(false)
                  setQuickTaskTitle('')
                }}
              >
                ✕
              </button>
            </div>
          </form>
        )}

        <div className="tasks-section">
          <h4>Today's Tasks</h4>
          {pendingDailyTasks.slice(0, 3).map(task => (
            <div key={task.id} className="task-item">
              <span className="task-checkbox">○</span>
              <span className="task-title">{task.title}</span>
              <span className="task-time">{task.time}</span>
            </div>
          ))}
        </div>

        {incompleteTasks.length > 0 && (
          <div className="tasks-section">
            <h4>Upcoming ({incompleteTasks.length})</h4>
            {incompleteTasks.slice(0, 2).map(task => {
              const overdue = isOverdue(task)
              return (
                <div key={task.id} className="task-item" style={{
                  borderLeft: overdue ? '3px solid var(--danger-color)' : 'none',
                  paddingLeft: overdue ? '8px' : '0'
                }}>
                  <span className="task-checkbox" style={{ color: overdue ? 'var(--danger-color)' : 'var(--primary-color)' }}>
                    {overdue ? '⚠' : '○'}
                  </span>
                  <span className="task-title" style={{ color: overdue ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                    {task.title}
                  </span>
                  <span className="task-date" style={{
                    color: overdue ? 'var(--danger-color)' : 'var(--text-secondary)',
                    fontWeight: overdue ? '600' : 'normal'
                  }}>
                    {task.dueDate}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function CalendarWidget() {
  const todayEvents = getTodayEvents()

  const formatDate = () => {
    const date = new Date()
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  return (
    <div className="widget-card">
      <h3 className="widget-title calendar-widget-title">📅 Calendar</h3>
      <div className="widget-content calendar-widget-content">
        <div className="calendar-date">{formatDate()}</div>

        {todayEvents.length > 0 ? (
          <>
            <div className="events-count">
              {todayEvents.length} {todayEvents.length === 1 ? 'event' : 'events'} today
            </div>
            <div className="events-list">
              {todayEvents.map(event => (
                <div key={event.id} className="event-item">
                  <span className="event-time">{event.time}</span>
                  <span className="event-title">{event.title}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-events">
            <span className="no-events-icon">🎉</span>
            <p>No events scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectsWidget() {
  return (
    <div className="widget-card">
      <h3 className="widget-title">🎯 Main Project</h3>
      <div className="widget-content">
        <div className="project-name">{mockMainProject.name}</div>
        <div className="next-step-section">
          <h4>Next Step:</h4>
          <div className="next-step-text">{mockMainProject.nextStep}</div>
        </div>
      </div>
    </div>
  )
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const ZIP_CODE = '80905'
  const COUNTRY_CODE = 'US'

  // Weather icon mapping
  const getWeatherEmoji = (weatherCode, isDay = true) => {
    if (weatherCode >= 200 && weatherCode < 300) return '⛈️' // Thunderstorm
    if (weatherCode >= 300 && weatherCode < 400) return '🌦️' // Drizzle
    if (weatherCode >= 500 && weatherCode < 600) return '🌧️' // Rain
    if (weatherCode >= 600 && weatherCode < 700) return '❄️' // Snow
    if (weatherCode >= 700 && weatherCode < 800) return '🌫️' // Atmosphere (fog, mist, etc)
    if (weatherCode === 800) return isDay ? '☀️' : '🌙' // Clear
    if (weatherCode === 801) return isDay ? '🌤️' : '☁️' // Few clouds
    if (weatherCode === 802) return '⛅' // Scattered clouds
    if (weatherCode >= 803) return '☁️' // Overcast
    return '🌡️'
  }

  const getDayName = (timestamp) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const date = new Date(timestamp * 1000)
    return days[date.getDay()]
  }

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using OpenWeatherMap API (free tier)
        // Note: User will need to add their API key to .env file
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo' // Demo key for testing

        // Fetch current weather and forecast
        const [currentResponse, forecastResponse] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${ZIP_CODE},${COUNTRY_CODE}&units=imperial&appid=${API_KEY}`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${ZIP_CODE},${COUNTRY_CODE}&units=imperial&appid=${API_KEY}`)
        ])

        if (!currentResponse.ok || !forecastResponse.ok) {
          throw new Error('Weather API unavailable - using mock data')
        }

        const currentData = await currentResponse.json()
        const forecastData = await forecastResponse.json()

        // Process current weather
        setWeather({
          temp: Math.round(currentData.main.temp),
          condition: currentData.weather[0].main,
          icon: getWeatherEmoji(currentData.weather[0].id, true),
          high: Math.round(currentData.main.temp_max),
          low: Math.round(currentData.main.temp_min),
        })

        // Process 7-day forecast (OpenWeatherMap free tier gives 5-day forecast in 3-hour intervals)
        // We'll take one reading per day (noon-ish)
        const dailyForecasts = []
        const seenDays = new Set()

        forecastData.list.forEach(item => {
          const date = new Date(item.dt * 1000)
          const dayKey = date.toDateString()

          // Take the forecast closest to noon for each day
          if (!seenDays.has(dayKey) && dailyForecasts.length < 7) {
            const hour = date.getHours()
            if (hour >= 11 && hour <= 14) {
              seenDays.add(dayKey)
              dailyForecasts.push({
                day: getDayName(item.dt),
                high: Math.round(item.main.temp_max),
                low: Math.round(item.main.temp_min),
                icon: getWeatherEmoji(item.weather[0].id, true)
              })
            }
          }
        })

        setForecast(dailyForecasts)
        setLoading(false)
      } catch (err) {
        console.warn('Weather API error:', err.message)
        // Fall back to mock data
        setWeather({
          temp: 45,
          condition: 'Partly Cloudy',
          icon: '⛅',
          high: 52,
          low: 38,
        })
        setForecast([
          { day: 'Thu', high: 52, low: 38, icon: '⛅' },
          { day: 'Fri', high: 48, low: 35, icon: '🌤️' },
          { day: 'Sat', high: 55, low: 40, icon: '☀️' },
          { day: 'Sun', high: 50, low: 37, icon: '⛅' },
          { day: 'Mon', high: 46, low: 34, icon: '🌧️' },
          { day: 'Tue', high: 51, low: 36, icon: '🌤️' },
          { day: 'Wed', high: 54, low: 39, icon: '☀️' },
        ])
        setError('Using cached weather data')
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="widget-card">
        <h3 className="widget-title">🌤️ Weather</h3>
        <div className="widget-content">
          <div className="loading">Loading weather...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="widget-card">
        <h3 className="widget-title">🌤️ Weather</h3>
        <div className="widget-content">
          <div className="error">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="widget-card">
      <h3 className="widget-title">🌤️ Weather - Colorado Springs</h3>
      <div className="widget-content">
        <div className="current-weather">
          <div className="weather-icon">{weather.icon}</div>
          <div className="weather-temp">{weather.temp}°F</div>
          <div className="weather-condition">{weather.condition}</div>
          <div className="weather-range">H: {weather.high}° L: {weather.low}°</div>
        </div>

        <div className="forecast-section">
          <h4>7-Day Forecast</h4>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-day">{day.day}</div>
                <div className="forecast-icon">{day.icon}</div>
                <div className="forecast-temps">
                  <span className="forecast-high">{day.high}°</span>
                  <span className="forecast-low">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HealthWidget() {
  // Mock data matching Health tab structure
  const mockWeightData = [
    { date: '01/02' }, // This week (week starts Sunday 12/29)
  ]

  const mockLoggedMeals = [
    { date: '2026-01-03', mealType: 'breakfast' },
    { date: '2026-01-03', mealType: 'lunch' },
  ]

  const mockSleepEntries = [
    { date: '2026-01-03' }, // Today
  ]

  // Streak tracking - Mock completion history (in real app, this would come from backend)
  const mockCompletionHistory = [
    { date: '2026-01-03', tasksCompleted: 6, totalTasks: 6 }, // Today - perfect
    { date: '2026-01-02', tasksCompleted: 5, totalTasks: 6 }, // Yesterday - good
    { date: '2026-01-01', tasksCompleted: 6, totalTasks: 6 }, // 2 days ago - perfect
    { date: '2025-12-31', tasksCompleted: 6, totalTasks: 6 }, // 3 days ago - perfect
    { date: '2025-12-30', tasksCompleted: 5, totalTasks: 6 }, // 4 days ago - good
    // Missed 2025-12-29 - broke previous streak
    { date: '2025-12-28', tasksCompleted: 6, totalTasks: 6 },
  ]

  // Calculate current streak (at least 80% completion counts as a streak day)
  const calculateStreak = () => {
    let streak = 0
    const today = new Date()

    for (let i = 0; i < mockCompletionHistory.length; i++) {
      const entry = mockCompletionHistory[i]
      const entryDate = new Date(entry.date)
      const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24))

      // Check if this is consecutive (no gaps)
      if (daysDiff !== i) break

      // Check if at least 80% of tasks were completed
      const completionRate = entry.tasksCompleted / entry.totalTasks
      if (completionRate >= 0.8) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const currentStreak = calculateStreak()
  const longestStreak = 12 // Mock data - would be calculated from full history

  // Today's water: State for water tracking
  const [todayWaterGlasses, setTodayWaterGlasses] = useState(5)
  const dailyWaterGoal = 8

  const handleLogWater = () => {
    if (todayWaterGlasses < dailyWaterGoal) {
      setTodayWaterGlasses(todayWaterGlasses + 1)
    }
  }

  // Today's exercise: All completed
  const todayExercises = {
    morning: { exercises: [{ completed: true }, { completed: true }] },
    evening: { exercises: [{ completed: true }] }
  }

  // Today's medications: All taken
  const todayMeds = {
    morning: [{ taken: true }, { taken: true }],
    evening: [{ taken: true }]
  }

  // Tracking logic (matches Health tab getHealthTasksCompleted)
  const getWeekStart = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - dayOfWeek)
    weekStart.setHours(0, 0, 0, 0)
    return weekStart
  }

  const isTodayDate = (dateStr) => {
    if (!dateStr) return false
    const date = new Date(dateStr)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isThisWeek = (dateStr) => {
    if (!dateStr) return false
    const weekStart = getWeekStart()
    const date = new Date(dateStr)

    if (dateStr.includes('/')) {
      const [month, day] = dateStr.split('/')
      const currentYear = new Date().getFullYear()
      date.setFullYear(currentYear)
      date.setMonth(parseInt(month) - 1)
      date.setDate(parseInt(day))
    }

    date.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    return date >= weekStart && date < weekEnd
  }

  // Calculate task completion
  const waterComplete = todayWaterGlasses >= dailyWaterGoal
  const weightComplete = mockWeightData.some(entry => isThisWeek(entry.date))
  const exerciseComplete = todayExercises?.morning?.exercises?.every(ex => ex.completed) &&
                            todayExercises?.evening?.exercises?.every(ex => ex.completed)
  const sleepComplete = mockSleepEntries.some(entry => isTodayDate(entry.date))
  const medicationsComplete = todayMeds && Object.values(todayMeds).every(slot =>
    Array.isArray(slot) && slot.every(med => med.taken)
  )
  const todayMeals = mockLoggedMeals.filter(meal => isTodayDate(meal.date))
  const uniqueMealTypes = new Set(todayMeals.map(meal => meal.mealType.toLowerCase()))
  const nutritionComplete = uniqueMealTypes.size >= 2

  const tasks = [
    { name: 'Water intake', done: waterComplete },
    { name: 'Weight log', done: weightComplete },
    { name: 'Exercise', done: exerciseComplete },
    { name: 'Sleep tracking', done: sleepComplete },
    { name: 'Medications', done: medicationsComplete },
    { name: 'Nutrition log', done: nutritionComplete },
  ]

  const completed = tasks.filter(t => t.done).length
  const total = tasks.length

  // Get streak emoji based on length
  const getStreakEmoji = (streak) => {
    if (streak === 0) return '⭕'
    if (streak < 3) return '🔥'
    if (streak < 7) return '🔥🔥'
    if (streak < 14) return '🔥🔥🔥'
    return '🔥🔥🔥💎'
  }

  return (
    <div className="widget-card">
      <h3 className="widget-title">💊 Health</h3>
      <div className="widget-content">
        <div className="counter-display">
          <span className="counter-number">{completed}/{total}</span>
          <span className="counter-label">Tasks Completed</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completed/total)*100}%` }}></div>
        </div>

        {/* Streak Tracker */}
        <div style={{
          padding: '12px',
          background: currentStreak >= 7 ? 'linear-gradient(135deg, var(--accent-bg) 0%, var(--secondary-bg) 100%)' : 'var(--secondary-bg)',
          borderRadius: '6px',
          marginBottom: '12px',
          border: currentStreak >= 7 ? '1px solid var(--accent-color)' : 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: currentStreak >= 7 ? 'var(--accent-color)' : 'var(--secondary-color)' }}>
                {getStreakEmoji(currentStreak)} {currentStreak}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                day streak
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Best</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {longestStreak} days
              </div>
            </div>
          </div>
          {currentStreak >= 7 && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--accent-color)',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              🎉 Week streak! Keep it up!
            </div>
          )}
        </div>

        {/* Quick Water Log */}
        <div style={{
          padding: '12px',
          background: 'var(--primary-bg)',
          borderRadius: '6px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>💧 {todayWaterGlasses}/{dailyWaterGoal}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>glasses</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleLogWater}
            disabled={todayWaterGlasses >= dailyWaterGoal}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            {todayWaterGlasses >= dailyWaterGoal ? '✓ Goal Met' : '+ Log Water'}
          </button>
        </div>

        <div className="task-checklist">
          {tasks.map((task, index) => (
            <div key={index} className="checklist-item">
              <span className={`check-icon ${task.done ? 'done' : ''}`}>
                {task.done ? '✓' : '○'}
              </span>
              <span className={task.done ? 'done-text' : ''}>{task.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EducationWidget() {
  // Mock education data - MUST match EducationTab.jsx exactly
  const mockEducation = [
    {
      id: 1,
      name: 'Brilliant.org - Data Structures',
      description: 'Interactive lessons on data structures and algorithms. Covering trees, graphs, sorting, and complexity analysis.',
      logo: null,
      url: 'https://brilliant.org/courses/computer-science-essentials/',
      lastVisited: '2026-01-03', // Today's date (Friday)
      dateAdded: '2024-11-15',
      frequency: 'daily',
      weeklyDays: []
    },
    {
      id: 2,
      name: 'Stanford ML Course',
      description: 'Machine Learning specialization covering supervised learning, neural networks, and deep learning fundamentals.',
      logo: null,
      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
      lastVisited: '2026-01-02', // Yesterday (Thursday)
      dateAdded: '2024-09-12',
      frequency: 'weekly',
      weeklyDays: [1, 3, 5] // Monday, Wednesday, Friday (Today is Friday, so scheduled!)
    },
    {
      id: 3,
      name: 'React Documentation',
      description: 'Official React documentation and tutorials. Learning hooks, state management, and modern React patterns.',
      logo: null,
      url: 'https://react.dev/learn',
      lastVisited: null,
      dateAdded: '2024-12-01',
      frequency: 'daily',
      weeklyDays: []
    },
    {
      id: 4,
      name: 'Python Deep Dive',
      description: 'Advanced Python programming course covering decorators, metaclasses, async programming, and performance optimization.',
      logo: null,
      url: 'https://www.udemy.com/course/python-deep-dive/',
      lastVisited: null,
      dateAdded: '2024-10-20',
      frequency: 'weekly',
      weeklyDays: [2, 4] // Tuesday, Thursday
    }
  ]

  // Streak tracking for education - Mock completion history
  const mockEducationHistory = [
    { date: '2026-01-03', scheduledCount: 3, visitedCount: 2 }, // Today - 2/3 visited
    { date: '2026-01-02', scheduledCount: 2, visitedCount: 2 }, // Yesterday - perfect
    { date: '2026-01-01', scheduledCount: 2, visitedCount: 2 }, // 2 days ago - perfect
    { date: '2025-12-31', scheduledCount: 2, visitedCount: 2 }, // 3 days ago - perfect
    { date: '2025-12-30', scheduledCount: 3, visitedCount: 2 }, // 4 days ago - 2/3
    { date: '2025-12-29', scheduledCount: 2, visitedCount: 2 }, // 5 days ago - perfect
    // Missed 2025-12-28 - broke previous streak
  ]

  const calculateEducationStreak = () => {
    let streak = 0
    const today = new Date()

    for (let i = 0; i < mockEducationHistory.length; i++) {
      const entry = mockEducationHistory[i]
      const entryDate = new Date(entry.date)
      const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24))

      // Check if this is consecutive (no gaps)
      if (daysDiff !== i) break

      // Check if at least 80% of scheduled courses were visited
      const completionRate = entry.visitedCount / entry.scheduledCount
      if (completionRate >= 0.8) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const educationStreak = calculateEducationStreak()
  const longestEducationStreak = 18 // Mock data - would be calculated from full history

  const isToday = (dateString) => {
    if (!dateString) return false
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isScheduledToday = (item) => {
    if (item.frequency === 'daily') return true
    if (item.frequency === 'weekly') {
      const today = new Date().getDay()
      return item.weeklyDays.includes(today)
    }
    return false
  }

  const getStreakEmoji = (streak) => {
    if (streak === 0) return '⭕'
    if (streak < 3) return '📚'
    if (streak < 7) return '📚📚'
    if (streak < 14) return '📚📚📚'
    return '📚📚📚🏆'
  }

  const scheduledToday = mockEducation.filter(item => isScheduledToday(item))
  const visitedToday = scheduledToday.filter(item => isToday(item.lastVisited))

  return (
    <div className="widget-card">
      <h3 className="widget-title">📚 Education</h3>
      <div className="widget-content">
        <div className="counter-display">
          <span className="counter-number">{visitedToday.length}/{scheduledToday.length}</span>
          <span className="counter-label">Sites Visited Today</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: scheduledToday.length > 0 ? `${(visitedToday.length/scheduledToday.length)*100}%` : '0%' }}></div>
        </div>

        {/* Streak Tracker */}
        <div style={{
          padding: '12px',
          background: educationStreak >= 7 ? 'linear-gradient(135deg, var(--primary-bg) 0%, var(--secondary-bg) 100%)' : 'var(--secondary-bg)',
          borderRadius: '6px',
          marginBottom: '12px',
          border: educationStreak >= 7 ? '1px solid var(--primary-color)' : 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: educationStreak >= 7 ? 'var(--primary-color)' : 'var(--secondary-color)' }}>
                {getStreakEmoji(educationStreak)} {educationStreak}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                day streak
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Best</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {longestEducationStreak} days
              </div>
            </div>
          </div>
          {educationStreak >= 7 && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--primary-color)',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              🎉 Week streak! Learning strong!
            </div>
          )}
        </div>

        <div className="task-checklist">
          {scheduledToday.map((item, index) => {
            const visited = isToday(item.lastVisited)
            return (
              <div key={index} className="checklist-item">
                <span className={`check-icon ${visited ? 'done' : ''}`}>
                  {visited ? '✓' : '○'}
                </span>
                <span className={visited ? 'done-text' : ''}>{item.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
function Dashboard() {
  const defaultLayout = [
    { i: 'tasks', x: 0, y: 0, w: 4, h: 4, minW: 2, maxW: 8 },
    { i: 'calendar', x: 4, y: 0, w: 4, h: 4, minW: 2, maxW: 8 },
    { i: 'projects', x: 8, y: 0, w: 4, h: 4, minW: 2, maxW: 8 },
    { i: 'weather', x: 0, y: 4, w: 6, h: 4, minW: 3, maxW: 12 },
    { i: 'health', x: 6, y: 4, w: 3, h: 4, minW: 2, maxW: 6 },
    { i: 'education', x: 9, y: 4, w: 3, h: 4, minW: 2, maxW: 6 },
  ]

  const defaultVisibility = {
    tasks: true,
    calendar: true,
    projects: true,
    weather: true,
    health: true,
    education: true,
  }

  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem('dashboardLayout')
    return saved ? JSON.parse(saved) : defaultLayout
  })

  const [widgetVisibility, setWidgetVisibility] = useState(() => {
    const saved = localStorage.getItem('widgetVisibility')
    return saved ? JSON.parse(saved) : defaultVisibility
  })

  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)

  const onLayoutChange = (newLayout) => {
    setLayout(newLayout)
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout))
  }

  const resetLayout = () => {
    setLayout(defaultLayout)
    localStorage.setItem('dashboardLayout', JSON.stringify(defaultLayout))
  }

  const toggleWidgetVisibility = (widgetKey) => {
    const newVisibility = {
      ...widgetVisibility,
      [widgetKey]: !widgetVisibility[widgetKey]
    }
    setWidgetVisibility(newVisibility)
    localStorage.setItem('widgetVisibility', JSON.stringify(newVisibility))
  }

  const visibleWidgets = Object.keys(widgetVisibility).filter(key => widgetVisibility[key])
  const filteredLayout = layout.filter(item => widgetVisibility[item.i])

  const widgetNames = {
    tasks: '📋 Tasks',
    calendar: '📅 Calendar',
    projects: '🎯 Projects',
    weather: '🌤️ Weather',
    health: '💊 Health',
    education: '📚 Education',
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Home</h1>
        <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
          >
            👁️ Widgets ({visibleWidgets.length}/{Object.keys(widgetVisibility).length})
          </button>
          <button className="btn btn-secondary" onClick={resetLayout}>
            Reset Layout
          </button>

          {/* Widget Visibility Menu */}
          {showVisibilityMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              zIndex: 1000,
              minWidth: '200px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Show/Hide Widgets
              </h4>
              {Object.keys(widgetVisibility).map(key => (
                <label key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  marginBottom: '4px',
                  background: widgetVisibility[key] ? 'rgba(255,255,255,0.05)' : 'transparent'
                }}>
                  <input
                    type="checkbox"
                    checked={widgetVisibility[key]}
                    onChange={() => toggleWidgetVisibility(key)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {widgetNames[key]}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <GridLayout
        className="dashboard-grid"
        layout={filteredLayout}
        cols={12}
        rowHeight={80}
        width={1400}
        onLayoutChange={onLayoutChange}
        draggableHandle=".widget-title"
        compactType="vertical"
        isResizable={true}
        isDraggable={true}
        resizeHandles={['se', 'sw', 'ne', 'nw']}
        preventCollision={false}
      >
        {widgetVisibility.tasks && (
          <div key="tasks">
            <TasksWidget />
          </div>
        )}
        {widgetVisibility.calendar && (
          <div key="calendar">
            <CalendarWidget />
          </div>
        )}
        {widgetVisibility.projects && (
          <div key="projects">
            <ProjectsWidget />
          </div>
        )}
        {widgetVisibility.weather && (
          <div key="weather">
            <WeatherWidget />
          </div>
        )}
        {widgetVisibility.health && (
          <div key="health">
            <HealthWidget />
          </div>
        )}
        {widgetVisibility.education && (
          <div key="education">
            <EducationWidget />
          </div>
        )}
      </GridLayout>
    </div>
  )
}

export default Dashboard
