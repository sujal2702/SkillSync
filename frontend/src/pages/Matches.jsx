import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

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
    <div className="page">
      <div className="card" style={{ width: '100%', maxWidth: 800 }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h2 className="title" style={{margin:0}}>Matches</h2>
          <Link to="/projects" className="button" style={{width:'auto'}}>Back</Link>
        </div>

        {project && (
          <div style={{marginBottom:12, color:'#6b7280'}}>
            Project: <strong>{project.title}</strong> · Skills: {(project.requiredSkills||[]).join(', ') || '—'}
          </div>
        )}

        {msg && <div className="alert" style={{borderColor:'#bbf7d0', background:'#f0fdf4', color:'#166534'}}>{msg}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        {loading && <div>Loading...</div>}

        <div style={{marginBottom: 16}}>
          <div style={{display:'grid', gap:12}}>
            {matches.map(match => {
              const isAssigned = project?.assignedTo && 
                (typeof project.assignedTo === 'object' 
                  ? project.assignedTo._id === match.employee._id 
                  : project.assignedTo === match.employee._id);
              
              return (
                <div key={match.employee._id} style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: 6, 
                  padding: 12,
                  opacity: isAssigned ? 1 : 1
                }}>
                  <div>
                    <div style={{fontWeight:600, display: 'flex', alignItems: 'center', gap: 8}}>
                      {match.employee.name}
                      {isAssigned && (
                        <span style={{
                          fontSize: 12,
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '2px 8px',
                          borderRadius: 12
                        }}>
                          Assigned
                        </span>
                      )}
                    </div>
                    <div style={{color:'#6b7280', fontSize:14, marginTop: 4}}>
                      Skills: {(match.employee.skills||[]).join(', ') || '—'}
                    </div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <div style={{fontWeight:600}}>Score: {match.score}</div>
                    {isAssigned ? (
                      <button 
                        className="button"
                        style={{
                          width: 'auto', 
                          minWidth: '100px', 
                          background: '#fef2f2', 
                          color: '#dc2626', 
                          borderColor: '#fecaca'
                        }} 
                        onClick={() => toggleAssignment(match.employee._id, true)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        className="button primary"
                        style={{
                          width: 'auto', 
                          minWidth: '100px',
                        }} 
                        onClick={() => toggleAssignment(match.employee._id, false)}
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {(!loading && matches.length === 0) && <div style={{color:'#6b7280'}}>No matches found.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
