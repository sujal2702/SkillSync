import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import './EmployeesList.css'

export default function EmployeesList() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const data = await api('/api/employees')
      setEmployees(data)
    } catch (err) {
      setError(err.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="page employees-list-page">
      <div className="card employees-list-card">
        <h2 className="title employees-list-title">Team Members</h2>
        
        {/* Stats Cards */}
        <div className="employees-stats">
          <div className="stat-card">
            <div className="stat-number">{employees.length}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{employees.filter(e => e.skills && e.skills.length > 0).length}</div>
            <div className="stat-label">With Skills</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{employees.filter(e => e.availability?.startDate && e.availability?.endDate).length}</div>
            <div className="stat-label">Available</div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        
        {loading && (
          <div className="employees-loading">
            <div className="employees-loading-spinner"></div>
            <div>Loading team members...</div>
          </div>
        )}
        
        <div className="employees-grid">
          {employees.map(e => (
            <div key={e._id} className="employee-card">
              <div className="employee-name">
                {e.name} 
                {e.email && <span className="employee-email">· {e.email}</span>}
              </div>
              
              <div className="employee-skills">
                Skills: 
                {(e.skills || []).length > 0 ? (
                  <div className="skills-list">
                    {e.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>No skills listed</span>
                )}
              </div>
              
              {e.availability?.startDate && e.availability?.endDate && (
                <div className="employee-availability">
                  Available: {new Date(e.availability.startDate).toLocaleDateString()} - {new Date(e.availability.endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
          
          {(!loading && employees.length === 0) && (
            <div className="employees-empty">
              No team members found. Start by adding employee profiles!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
