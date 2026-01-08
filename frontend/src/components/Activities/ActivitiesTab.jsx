import React, { useState, useEffect } from 'react'
import SubTabs from '../Common/SubTabs'
import './ActivitiesTab.css'

const API_URL = 'http://localhost:5000'

function ActivitiesTab() {
  const [activeSubTab, setActiveSubTab] = useState('daily')
  const [showAddForm, setShowAddForm] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [selectedDay, setSelectedDay] = useState('Sunday')
  const [monthlyOption, setMonthlyOption] = useState('end-of-month')
  const [dailyTasks, setDailyTasks] = useState([])
  const [weeklyTasks, setWeeklyTasks] = useState([])
  const [monthlyTasks, setMonthlyTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [statsData, setStatsData] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    completionRate: 0,
    weeklyCompletion: []
  })

  const subTabs = [
    { id: 'daily', label: 'Daily', icon: '📅' },
    { id: 'weekly', label: 'Weekly', icon: '📆' },
    { id: 'monthly', label: 'Monthly', icon: '🗓️' },
    { id: 'data', label: 'Data', icon: '📊' },
  ]

  // Fetch tasks and stats from API on component mount
  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`)
      const allTasks = await response.json()

      // Separate by category
      setDailyTasks(allTasks.filter(t => t.category === 'Daily'))
      setWeeklyTasks(allTasks.filter(t => t.category === 'Weekly'))
      setMonthlyTasks(allTasks.filter(t => t.category === 'Monthly'))
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/stats`)
      const data = await response.json()
      setStatsData(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      await fetch(`${API_URL}/api/tasks/${taskId}/complete`, {
        method: 'PATCH'
      })
      fetchTasks() // Refresh tasks
      fetchStats() // Refresh stats
    } catch (error) {
      console.error('Failed to complete task:', error)
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()

    if (!newTaskTitle.trim()) return

    try {
      const category = activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)
      const taskData = {
        title: newTaskTitle,
        category: category,
        notes: newTaskDescription || null,
        date: new Date().toISOString().split('T')[0], // Today's date
        priority: 1
      }

      await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })

      // Reset form and refresh tasks
      setNewTaskTitle('')
      setNewTaskDescription('')
      setShowAddForm(false)
      fetchTasks()
      fetchStats() // Refresh stats
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE'
      })
      fetchTasks() // Refresh tasks
      fetchStats() // Refresh stats
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const getCurrentTasks = () => {
    switch (activeSubTab) {
      case 'daily':
        return dailyTasks
      case 'weekly':
        return weeklyTasks
      case 'monthly':
        return monthlyTasks
      default:
        return []
    }
  }

  const currentTasks = getCurrentTasks()

  return (
    <div className="activities-container">
      <div className="activities-header">
        <h1>Task Manager</h1>
        {activeSubTab !== 'data' && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            + Add Task
          </button>
        )}
      </div>

      <SubTabs tabs={subTabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {showAddForm && activeSubTab !== 'data' && (
        <div className="add-activity-form card">
          <h3>New Task</h3>
          <form onSubmit={handleAddTask}>
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Task details..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Recurring task options */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <span>Recurring Task</span>
              </label>
            </div>

            {isRecurring && activeSubTab === 'weekly' && (
              <div className="form-group">
                <label>Day of Week</label>
                <select
                  className="form-control"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  <option>Sunday</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                </select>
              </div>
            )}

            {isRecurring && activeSubTab === 'monthly' && (
              <div className="form-group">
                <label>Monthly Schedule</label>
                <select
                  className="form-control"
                  value={monthlyOption}
                  onChange={(e) => setMonthlyOption(e.target.value)}
                >
                  <option value="end-of-month">Due at end of month</option>
                  <option value="countdown-7">7 days before end of month</option>
                  <option value="countdown-14">14 days before end of month</option>
                  <option value="countdown-21">21 days before end of month</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {activeSubTab !== 'data' ? (
        <div className="tasks-list">
          <h3>{activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)} Tasks ({currentTasks.length})</h3>
          {currentTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => task.status !== 'completed' && handleCompleteTask(task.id)}
                />
              </div>
              <div className="task-content">
                <div className="task-header">
                  <h4 className={task.status === 'completed' ? 'completed' : ''}>{task.title}</h4>
                </div>
                <div className="task-meta">
                  {task.time && <span className="task-time">⏰ {task.time}</span>}
                  {task.date && <span className="task-due">📅 {task.date}</span>}
                  {task.notes && <span className="task-notes">📝 {task.notes}</span>}
                  <span className={`task-status status-${task.status}`}>
                    {task.status === 'completed' && '✓ Completed'}
                    {task.status === 'pending' && '○ Pending'}
                    {task.status === 'in-progress' && '⟳ In Progress'}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button className="btn-icon" title="Edit">✏️</button>
                <button className="btn-icon" title="Delete" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="data-view">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{statsData.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{statsData.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{statsData.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{statsData.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>

          <div className="completion-rate-card card">
            <h3>Completion Rate</h3>
            <div className="completion-rate-display">
              <div className="rate-circle">
                <span className="rate-value">{statsData.completionRate}%</span>
              </div>
              <div className="rate-bar">
                <div
                  className="rate-fill"
                  style={{ width: `${statsData.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="weekly-chart card">
            <h3>Weekly Completion</h3>
            <div className="chart-bars">
              {statsData.weeklyCompletion.map((day, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ height: `${(day.completed / 7) * 100}%` }}
                      title={`${day.completed} tasks`}
                    ></div>
                  </div>
                  <div className="bar-label">{day.day}</div>
                  <div className="bar-value">{day.completed}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivitiesTab
