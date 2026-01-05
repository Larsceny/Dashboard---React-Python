import React, { useState } from 'react'
import './ProjectsTab.css'
import { mockProjects as initialProjects } from '../../data/mockProjects'

function ProjectsTab() {
  const [projects, setProjects] = useState(initialProjects)
  const [selectedProject, setSelectedProject] = useState(projects.find(p => p.isMain) || projects[0])
  const [showAddForm, setShowAddForm] = useState(false)

  const setAsMain = (projectId) => {
    setProjects(projects.map(p => ({
      ...p,
      isMain: p.id === projectId
    })))
  }

  const openObsidian = (link) => {
    console.log('Opening Obsidian link:', link)
    // In production, this would use Electron to open the file
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
          <form>
            <div className="form-group">
              <label>Project Name</label>
              <input type="text" className="form-control" placeholder="My awesome project" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows="3" placeholder="What is this project about?"></textarea>
            </div>
            <div className="form-group">
              <label>Next Step</label>
              <input type="text" className="form-control" placeholder="What needs to be done next?" />
            </div>
            <div className="form-group">
              <label>Obsidian Vault Link</label>
              <input type="text" className="form-control" placeholder="C:\Users\...\Obsidian\Projects\project.md" />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" />
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
      <div className="project-detail-view">
        <div className="project-detail-header">
          <div className="project-title-row">
            <h2>{selectedProject.name}</h2>
            {selectedProject.isMain && (
              <span className="main-badge">⭐ Main Project</span>
            )}
          </div>
          <div className="project-actions">
            {!selectedProject.isMain && (
              <button className="btn btn-secondary" onClick={() => setAsMain(selectedProject.id)}>
                Set as Main
              </button>
            )}
            <button className="obsidian-btn" onClick={() => openObsidian(selectedProject.link)} title="Open in Obsidian">
              <img src="/obsidian-logo.png" alt="Obsidian" className="obsidian-icon" />
            </button>
            <button className="btn-icon" title="Edit">✏️</button>
            <button className="btn-icon" title="Delete">🗑️</button>
          </div>
        </div>

        <div className="project-detail-content">
          <div className="detail-section">
            <h3>📋 Description</h3>
            <p>{selectedProject.description}</p>
          </div>

          <div className="detail-section">
            <h3>🎯 Next Step</h3>
            <div className="next-step-box">
              <p>{selectedProject.nextStep}</p>
              <button className="btn btn-primary">Mark as Complete</button>
            </div>
          </div>

          <div className="detail-meta">
            <span>Created: {new Date(selectedProject.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>
      </div>

      {/* Project Cards - Bottom Section */}
      <div className="project-cards-section">
        <h3>All Projects ({projects.length})</h3>
        <div className="project-cards-row">
          {projects.map(project => (
            <div
              key={project.id}
              className={`project-card ${selectedProject.id === project.id ? 'selected' : ''} ${project.isMain ? 'main' : ''}`}
              onClick={() => setSelectedProject(project)}
            >
              {project.isMain && (
                <div className="main-indicator">⭐</div>
              )}
              <h4>{project.name}</h4>
              <p className="card-description">{project.description}</p>
              <div className="card-next-step">
                <span className="next-step-label">Next:</span>
                <span className="next-step-text">{project.nextStep}</span>
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
