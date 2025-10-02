import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import './ProjectsList.css'

export default function ProjectsList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [availability, setAvailability] = useState(false)
  const navigate = useNavigate()

  async function load() {
    setError('')
    setLoading(true)
    try {
      const data = await api('/api/projects')
      setProjects(data)
    } catch (err) {
      setError(err.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="page projects-list-page">
      <div className="card projects-list-card">
        <div className="projects-header">
          <h2 className="title projects-list-title">Active Projects</h2>
          <Link to="/projects/new" className="new-project-button">New Project</Link>
        </div>

        {/* Stats Cards */}
        <div className="projects-stats">
          <div className="project-stat-card">
            <div className="project-stat-number">{projects.length}</div>
            <div className="project-stat-label">Total Projects</div>
          </div>
          <div className="project-stat-card">
            <div className="project-stat-number">{projects.filter(p => p.assignedTo).length}</div>
            <div className="project-stat-label">Assigned</div>
          </div>
          <div className="project-stat-card">
            <div className="project-stat-number">{projects.filter(p => !p.assignedTo).length}</div>
            <div className="project-stat-label">Available</div>
          </div>
        </div>

        <div className="availability-checkbox">
          <input 
            type="checkbox" 
            checked={availability} 
            onChange={e=>setAvailability(e.target.checked)} 
            id="availability-check"
          />
          <label htmlFor="availability-check">Check availability in matching</label>
        </div>

        {loading && (
          <div className="projects-loading">
            <div className="projects-loading-spinner"></div>
            <div>Loading projects...</div>
          </div>
        )}
        
        {error && <div className="alert alert-error">{error}</div>}

        <div className="projects-grid">
          {projects.map(p => (
            <div key={p._id} className="project-card">
              <div className="project-card-content">
                <div className="project-info">
                  <div className="project-title">{p.title}</div>
                  
                  <div className="project-skills">
                    Required Skills:
                    {(p.requiredSkills || []).length > 0 ? (
                      <div className="project-skills-list">
                        {p.requiredSkills.map((skill, index) => (
                          <span key={index} className="project-skill-tag">{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>No specific skills required</span>
                    )}
                  </div>
                  
                  <div className={`project-assigned ${!p.assignedTo ? 'unassigned' : ''}`}>
                    Assigned to: {p.assignedTo ? (typeof p.assignedTo === 'object' ? p.assignedTo.name : 'Loading...') : 'Unassigned'}
                  </div>
                </div>
                
                <div className="project-actions">
                  <button 
                    className="find-matches-button"
                    onClick={() => navigate(`/projects/${p._id}/matches${availability ? '?availability=true' : ''}`)}
                  >
                    Find Matches
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {(!loading && projects.length === 0) && (
            <div className="projects-empty">
              No projects found. Create your first project to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
