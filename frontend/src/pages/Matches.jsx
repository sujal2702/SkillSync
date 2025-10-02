import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import './Matches.css'

export default function Matches() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const availability = params.get('availability') === 'true'

  const [project, setProject] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true); setError(''); setMsg('')
    try {
      const data = await api(`/api/match/${id}${availability ? '?availability=true' : ''}`)
      setProject(data.project)
      setMatches(data.matches)
    } catch (err) {
      setError(err.message || 'Failed to load matches')
    } finally {
      setLoading(false)
    }
  }

  async function toggleAssignment(employeeId, isAssigned) {
    try {
      setError('');
      setMsg('');
      
      const endpoint = isAssigned 
        ? `/api/projects/${id}/unassign` 
        : `/api/projects/${id}/assign`;
      
      // Save the current state for potential rollback
      const previousProject = { ...project };
      const previousMatches = [...matches];
      
      // Optimistically update the UI
      const updatedProject = {
        ...project,
        assignedTo: isAssigned ? null : employeeId
      };
      
      setProject(updatedProject);
      
      // Update the matches to reflect the new assignment
      const updatedMatches = matches.map(match => ({
        ...match,
        employee: {
          ...match.employee,
          _id: match.employee._id === employeeId ? employeeId : match.employee._id
        }
      }));
      
      setMatches(updatedMatches);
      
      try {
        // Make the API call
        const response = await api(endpoint, { 
          method: 'PATCH', 
          body: isAssigned ? {} : { employeeId } 
        });
        
        // Update the UI with the server response
        if (response.assignedTo) {
          setProject(prev => ({
            ...prev,
            assignedTo: response.assignedTo
          }));
        } else {
          setProject(prev => ({
            ...prev,
            assignedTo: null
          }));
        }
        
        setMsg(isAssigned ? 'Employee removed from project' : 'Employee assigned to project');
        
        // Refresh the data after a short delay
        setTimeout(() => {
          load().catch(err => {
            console.error('Error refreshing data:', err);
          });
        }, 300);
        
      } catch (err) {
        // Revert to previous state on error
        setProject(previousProject);
        setMatches(previousMatches);
        console.error('Assignment error:', err);
        setError(err.message || (isAssigned ? 'Failed to remove' : 'Failed to assign'));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    }
  }

  useEffect(() => { load() }, [id, availability])

  return (
    <div className="page matches-page">
      <div className="card matches-card">
        <div className="matches-header">
          <h2 className="title matches-title">Talent Matches</h2>
          <Link to="/projects" className="back-button">Back to Projects</Link>
        </div>

        {project && (
          <div className="project-info-banner">
            Project: <strong>{project.title}</strong> · Required Skills: {(project.requiredSkills||[]).join(', ') || 'No specific requirements'}
          </div>
        )}

        {msg && <div className="matches-success">{msg}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        
        {loading && (
          <div className="matches-loading">
            <div className="matches-loading-spinner"></div>
            <div>Finding the best matches...</div>
          </div>
        )}

        <div className="matches-grid">
          {matches.map(match => {
            const isAssigned = project?.assignedTo && 
              (typeof project.assignedTo === 'object' 
                ? project.assignedTo._id === match.employee._id 
                : project.assignedTo === match.employee._id);
            
            return (
              <div key={match.employee._id} className={`match-card ${isAssigned ? 'assigned' : ''}`}>
                <div className="match-card-content">
                  <div className="match-employee-info">
                    <div className="match-employee-name">
                      {match.employee.name}
                      {isAssigned && (
                        <span className="assigned-badge">Assigned</span>
                      )}
                    </div>
                    
                    <div className="match-employee-skills">
                      Skills:
                      {(match.employee.skills || []).length > 0 ? (
                        <div className="match-skills-list">
                          {match.employee.skills.map((skill, index) => (
                            <span key={index} className="match-skill-tag">{skill}</span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>No skills listed</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="match-actions">
                    <div className="match-score">
                      <div className="match-score-label">Match Score</div>
                      <div className="match-score-value">{match.score}</div>
                    </div>
                    
                    {isAssigned ? (
                      <button 
                        className="remove-button"
                        onClick={() => toggleAssignment(match.employee._id, true)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        className="assign-button"
                        onClick={() => toggleAssignment(match.employee._id, false)}
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {(!loading && matches.length === 0) && (
            <div className="matches-empty">
              No suitable matches found for this project.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
