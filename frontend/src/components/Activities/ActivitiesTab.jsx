import React, { useState } from 'react'
import SubTabs from '../Common/SubTabs'
import './ActivitiesTab.css'
import { mockTodayTasks as mockDailyTasks, mockWeeklyTasks } from '../../data/mockTasks'

// Monthly tasks (can be expanded later)
const mockMonthlyTasks = [
  { id: 101, title: 'Q1 Planning', status: 'pending', dueDate: '2026-01-31' },
  { id: 102, title: 'Annual review', status: 'in-progress', dueDate: '2026-01-15' },
  { id: 103, title: 'Budget planning', status: 'pending', dueDate: '2026-01-20' },
]

const mockCompletionData = {
  totalTasks: 45,
  completed: 32,
  pending: 10,
  inProgress: 3,
  completionRate: 71,
  weeklyCompletion: [
    { day: 'Sun', completed: 5 },
    { day: 'Mon', completed: 7 },
    { day: 'Tue', completed: 4 },
    { day: 'Wed', completed: 6 },
    { day: 'Thu', completed: 5 },
    { day: 'Fri', completed: 3 },
    { day: 'Sat', completed: 2 },
  ]
}

function ActivitiesTab() {
  const [activeSubTab, setActiveSubTab] = useState('daily')
  const [showAddForm, setShowAddForm] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [selectedDay, setSelectedDay] = useState('Sunday')
  const [monthlyOption, setMonthlyOption] = useState('end-of-month')

  const subTabs = [
    { id: 'daily', label: 'Daily', icon: '📅' },
    { id: 'weekly', label: 'Weekly', icon: '📆' },
    { id: 'monthly', label: 'Monthly', icon: '🗓️' },
    { id: 'data', label: 'Data', icon: '📊' },
  ]

  const getCurrentTasks = () => {
    switch (activeSubTab) {
      case 'daily':
        return mockDailyTasks
      case 'weekly':
        return mockWeeklyTasks
      case 'monthly':
        return mockMonthlyTasks
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
          <form>
            <div className="form-group">
              <label>Task Title</label>
              <input type="text" className="form-control" placeholder="What needs to be done?" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows="3" placeholder="Task details..."></textarea>
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
                  onChange={() => {}}
                />
              </div>
              <div className="task-content">
                <div className="task-header">
                  <h4 className={task.status === 'completed' ? 'completed' : ''}>{task.title}</h4>
                </div>
                <div className="task-meta">
                  {task.time && <span className="task-time">⏰ {task.time}</span>}
                  {task.dueDate && <span className="task-due">📅 Due: {task.dueDate}</span>}
                  <span className={`task-status status-${task.status}`}>
                    {task.status === 'completed' && '✓ Completed'}
                    {task.status === 'pending' && '○ Pending'}
                    {task.status === 'in-progress' && '⟳ In Progress'}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button className="btn-icon" title="Edit">✏️</button>
                <button className="btn-icon" title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="data-view">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{mockCompletionData.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{mockCompletionData.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{mockCompletionData.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{mockCompletionData.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>

          <div className="completion-rate-card card">
            <h3>Completion Rate</h3>
            <div className="completion-rate-display">
              <div className="rate-circle">
                <span className="rate-value">{mockCompletionData.completionRate}%</span>
              </div>
              <div className="rate-bar">
                <div
                  className="rate-fill"
                  style={{ width: `${mockCompletionData.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="weekly-chart card">
            <h3>Weekly Completion</h3>
            <div className="chart-bars">
              {mockCompletionData.weeklyCompletion.map((day, index) => (
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
