import React, { useState, useEffect } from 'react'
import './ProjectsTab.css'

const API_URL = 'http://localhost:5000'

function ProjectsTab() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    next_step: '',
    obsidian_link: '',
    is_main: false
  })

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects()
  }, [])

  // Update selected project when projects change
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects.find(p => p.is_main) || projects[0])
    }
  }, [projects, selectedProject])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`)
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()

    if (!newProjectData.name.trim()) return

    try {
      await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProjectData)
      })

      // Reset form and refresh projects
      setNewProjectData({
        name: '',
        description: '',
        next_step: '',
        obsidian_link: '',
        is_main: false
      })
      setShowAddForm(false)
      fetchProjects()
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleUpdateProject = async (projectId, updates) => {
    try {
      await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      fetchProjects()
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  const setAsMain = async (projectId) => {
    try {
      // First, unset all other projects as main
      for (const project of projects) {
        if (project.is_main && project.id !== projectId) {
          await handleUpdateProject(project.id, { is_main: false })
        }
      }
      // Then set the selected project as main
      await handleUpdateProject(projectId, { is_main: true })
    } catch (error) {
      console.error('Failed to set main project:', error)
    }
  }

  const handleAddTask = async (projectId, taskTitle) => {
    if (!taskTitle.trim()) return

    try {
      await fetch(`${API_URL}/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle, order: selectedProject.tasks.length })
      })
      fetchProjects()
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const handleToggleTask = async (projectId, taskId) => {
    try {
      await fetch(`${API_URL}/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH'
      })
      fetchProjects()
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const openObsidian = (link) => {
    if (link) {
      console.log('Opening Obsidian link:', link)
      // In production, this would use Electron to open the file
      window.open(link, '_blank')
    }
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          + Add Project
        </button>
      </div>

      {showAddForm && (
        <div className="add-project-form card">
          <h3>New Project</h3>
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="My awesome project"
                value={newProjectData.name}
                onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="What is this project about?"
                value={newProjectData.description}
                onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Next Step</label>
              <input
                type="text"
                className="form-control"
                placeholder="What needs to be done next?"
                value={newProjectData.next_step}
                onChange={(e) => setNewProjectData({ ...newProjectData, next_step: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Obsidian Vault Link</label>
              <input
                type="text"
                className="form-control"
                placeholder="obsidian://vault/Projects/project"
                value={newProjectData.obsidian_link}
                onChange={(e) => setNewProjectData({ ...newProjectData, obsidian_link: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newProjectData.is_main}
                  onChange={(e) => setNewProjectData({ ...newProjectData, is_main: e.target.checked })}
                />
                <span>Set as Main Project</span>
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project Detail View - Top Section */}
      {selectedProject && (
        <div className="project-detail-view">
          <div className="project-detail-header">
            <div className="project-title-row">
              <h2>{selectedProject.name}</h2>
              {selectedProject.is_main && (
                <span className="main-badge">⭐ Main Project</span>
              )}
            </div>
            <div className="project-actions">
              {!selectedProject.is_main && (
                <button className="btn btn-secondary" onClick={() => setAsMain(selectedProject.id)}>
                  Set as Main
                </button>
            )}
            <button className="obsidian-btn" onClick={() => openObsidian(selectedProject.obsidian_link)} title="Open in Obsidian">
              <img src="/obsidian-logo.png" alt="Obsidian" className="obsidian-icon" />
            </button>
            <button className="btn-icon" title="Edit">✏️</button>
            <button className="btn-icon" title="Delete">🗑️</button>
          </div>
        </div>

        <div className="project-detail-content">
          <div className="detail-section">
            <h3>📋 Description</h3>
            <p>{selectedProject.description || 'No description provided.'}</p>
          </div>

          <div className="detail-section">
            <h3>🎯 Next Step</h3>
            <div className="next-step-box">
              <p>{selectedProject.next_step || 'No next step defined.'}</p>
              <button className="btn btn-primary">Mark as Complete</button>
            </div>
          </div>

          <div className="detail-meta">
            <span>Created: {new Date(selectedProject.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>
        </div>
      )}

      {/* Project Cards - Bottom Section */}
      <div className="project-cards-section">
        <h3>All Projects ({projects.length})</h3>
        <div className="project-cards-row">
          {projects.map(project => (
            <div
              key={project.id}
              className={`project-card ${selectedProject && selectedProject.id === project.id ? 'selected' : ''} ${project.is_main ? 'main' : ''}`}
              onClick={() => setSelectedProject(project)}
            >
              {project.is_main && (
                <div className="main-indicator">⭐</div>
              )}
              <h4>{project.name}</h4>
              <p className="card-description">{project.description}</p>
              <div className="card-next-step">
                <span className="next-step-label">Next:</span>
                <span className="next-step-text">{project.next_step}</span>
              </div>
            </div>
          ))}

          {/* Add Project Card */}
          <div className="project-card add-card" onClick={() => setShowAddForm(true)}>
            <div className="add-icon">+</div>
            <p>Add New Project</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsTab
