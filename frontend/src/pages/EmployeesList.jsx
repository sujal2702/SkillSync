import { useEffect, useState } from 'react'
import { api } from '../lib/api'

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
    <div className="page">
      <div className="card" style={{ width: '100%', maxWidth: 800 }}>
        <h2 className="title">Employees</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {loading && <div>Loading...</div>}
        <div style={{ display: 'grid', gap: 12 }}>
          {employees.map(e => (
            <div key={e._id} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{e.name} {e.email ? <span style={{color:'#6b7280', fontSize:14}}>· {e.email}</span> : null}</div>
              <div style={{ color: '#6b7280', fontSize: 14 }}>Skills: {(e.skills || []).join(', ') || '—'}</div>
              {e.availability?.startDate && e.availability?.endDate && (
                <div style={{ color: '#6b7280', fontSize: 14 }}>Availability: {new Date(e.availability.startDate).toLocaleDateString()} - {new Date(e.availability.endDate).toLocaleDateString()}</div>
              )}
            </div>
          ))}
          {(!loading && employees.length === 0) && <div style={{ color: '#6b7280' }}>No employees yet.</div>}
        </div>
      </div>
    </div>
  )
}
