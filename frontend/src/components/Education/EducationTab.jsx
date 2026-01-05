import React, { useState } from 'react'
import './EducationTab.css'

// Mock education data
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
    weeklyDays: [] // Empty for daily courses
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
    lastVisited: null, // Never visited
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
    lastVisited: null, // Never visited
    dateAdded: '2024-10-20',
    frequency: 'weekly',
    weeklyDays: [2, 4] // Tuesday, Thursday
  }
]

function EducationTab() {
  const [educationItems, setEducationItems] = useState(mockEducation)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formFrequency, setFormFrequency] = useState('daily')
  const [formWeeklyDays, setFormWeeklyDays] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    logo: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const isToday = (dateString) => {
    if (!dateString) return false
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const isScheduledToday = (item) => {
    if (item.frequency === 'daily') return true
    if (item.frequency === 'weekly') {
      const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
      return item.weeklyDays.includes(today)
    }
    return false
  }

  const getScheduleLabel = (weeklyDays) => {
    const dayAbbreviations = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa']
    return weeklyDays.map(day => dayAbbreviations[day]).join('/')
  }

  const visitLink = (id, url) => {
    // Mark as visited today and open URL
    setEducationItems(educationItems.map(item =>
      item.id === id ? { ...item, lastVisited: getTodayString() } : item
    ))
    window.open(url, '_blank')
  }

  const handleDelete = (id) => {
    setEducationItems(educationItems.filter(item => item.id !== id))
  }

  const toggleWeeklyDay = (day) => {
    setFormWeeklyDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Course name is required'
    }

    if (!formData.url.trim()) {
      errors.url = 'URL is required'
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      errors.url = 'Please enter a valid URL (must start with http:// or https://)'
    }

    if (formFrequency === 'weekly' && formWeeklyDays.length === 0) {
      errors.weeklyDays = 'Please select at least one day for weekly schedule'
    }

    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const newCourse = {
      id: educationItems.length + 1,
      name: formData.name,
      description: formData.description,
      url: formData.url,
      logo: formData.logo || null,
      lastVisited: null,
      dateAdded: getTodayString(),
      frequency: formFrequency,
      weeklyDays: formFrequency === 'weekly' ? formWeeklyDays : []
    }

    setEducationItems([...educationItems, newCourse])

    // Reset form
    setFormData({ name: '', description: '', url: '', logo: '' })
    setFormFrequency('daily')
    setFormWeeklyDays([])
    setFormErrors({})
    setShowAddForm(false)
  }

  return (
    <div className="education-container">
      <div className="education-header">
        <h1>Education</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          + Add Course
        </button>
      </div>

      {showAddForm && (
        <div className="add-education-form card">
          <h3>New Course/Resource</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Course or resource name"
                value={formData.name}
                onChange={handleFormChange}
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                placeholder="What will you learn?"
                value={formData.description}
                onChange={handleFormChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>URL *</label>
              <input
                type="url"
                name="url"
                className="form-control"
                placeholder="https://example.com/course"
                value={formData.url}
                onChange={handleFormChange}
              />
              {formErrors.url && <span className="error-text">{formErrors.url}</span>}
            </div>
            <div className="form-group">
              <label>Logo URL (optional)</label>
              <input
                type="text"
                name="logo"
                className="form-control"
                placeholder="URL to logo image"
                value={formData.logo}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Frequency</label>
              <div className="frequency-options">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="frequency"
                    value="daily"
                    checked={formFrequency === 'daily'}
                    onChange={(e) => setFormFrequency(e.target.value)}
                  />
                  <span>Daily</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="frequency"
                    value="weekly"
                    checked={formFrequency === 'weekly'}
                    onChange={(e) => setFormFrequency(e.target.value)}
                  />
                  <span>Weekly</span>
                </label>
              </div>
            </div>

            {formFrequency === 'weekly' && (
              <div className="form-group">
                <label>Days of Week *</label>
                <div className="days-checkboxes">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                    <label key={index} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formWeeklyDays.includes(index)}
                        onChange={() => toggleWeeklyDay(index)}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
                {formErrors.weeklyDays && <span className="error-text">{formErrors.weeklyDays}</span>}
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Course
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Summary */}
      <div className="education-stats">
        <div className="stat-item">
          <span className="stat-value">{educationItems.length}</span>
          <span className="stat-label">Total Courses</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{educationItems.filter(e => isScheduledToday(e)).length}</span>
          <span className="stat-label">Scheduled Today</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{educationItems.filter(e => isToday(e.lastVisited)).length}</span>
          <span className="stat-label">Visited Today</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{educationItems.filter(e => !isToday(e.lastVisited)).length}</span>
          <span className="stat-label">Not Visited Today</span>
        </div>
      </div>

      {/* Education Cards Grid */}
      <div className="education-cards-grid">
        {educationItems.map(item => {
          const visitedToday = isToday(item.lastVisited)
          const scheduledToday = isScheduledToday(item)

          let statusBadge
          let cardClass = 'education-card'

          if (scheduledToday) {
            // Course is scheduled for today
            if (visitedToday) {
              statusBadge = <span className="status-badge visited">✓ Visited Today</span>
              cardClass += ' visited'
            } else {
              statusBadge = <span className="status-badge not-started">○ Not Visited Today</span>
              cardClass += ' not-visited'
            }
          } else {
            // Course is NOT scheduled for today
            if (item.frequency === 'weekly') {
              statusBadge = <span className="status-badge schedule">{getScheduleLabel(item.weeklyDays)}</span>
            } else {
              statusBadge = <span className="status-badge not-scheduled">Not Scheduled Today</span>
            }
            cardClass += ' not-scheduled'
          }

          return (
            <div key={item.id} className={cardClass}>
              <div className="education-card-header">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="education-logo" />
                ) : (
                  <div className="education-logo-placeholder">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="visit-status">
                  {statusBadge}
                </div>
              </div>

              <div className="education-card-content">
                <h3>{item.name}</h3>
                <p className="education-description">{item.description}</p>
              </div>

              <div className="education-card-footer">
                <button
                  className="btn btn-primary visit-btn"
                  onClick={() => visitLink(item.id, item.url)}
                >
                  {visitedToday ? 'Visit Again' : 'Visit'} →
                </button>
                <div className="card-actions">
                  <button className="btn-icon" title="Edit">✏️</button>
                  <button className="btn-icon" title="Delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              </div>
            </div>
          )
        })}

        {/* Add Course Card */}
        <div className="education-card add-card" onClick={() => setShowAddForm(true)}>
          <div className="add-icon">+</div>
          <p>Add New Course</p>
        </div>
      </div>
    </div>
  )
}

export default EducationTab
