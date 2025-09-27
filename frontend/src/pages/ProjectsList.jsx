import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

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
    <div className="page">
      <div className="card" style={{width:'100%', maxWidth:800}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h2 className="title" style={{margin:0}}>Projects</h2>
          <Link to="/projects/new" className="button primary" style={{width:'auto'}}>New Project</Link>
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:'inline-flex', alignItems:'center', gap:8}}>
            <input type="checkbox" checked={availability} onChange={e=>setAvailability(e.target.checked)} />
            Check availability in matching
          </label>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div style={{display:'grid', gap:12}}>
          {projects.map(p => (
            <div key={p._id} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:12}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:600}}>{p.title}</div>
                  <div style={{color:'#6b7280', fontSize:14}}>Skills: {(p.requiredSkills||[]).join(', ') || '—'}</div>
                  <div style={{color:'#6b7280', fontSize:14, marginTop:4}}>
                    Assigned: {p.assignedTo ? (typeof p.assignedTo === 'object' ? p.assignedTo.name : 'Loading...') : '—'}
                  </div>
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button className="button primary" style={{width:'auto'}}
                    onClick={() => navigate(`/projects/${p._id}/matches${availability ? '?availability=true' : ''}`)}
                  >Find Matches</button>
                </div>
              </div>
            </div>
          ))}
          {(!loading && projects.length === 0) && <div style={{color:'#6b7280'}}>No projects yet.</div>}
        </div>
      </div>
    </div>
  )
}
