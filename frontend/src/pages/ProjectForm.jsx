import { useState } from 'react'
import { api } from '../lib/api'

export default function ProjectForm() {
  const [title, setTitle] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      const payload = {
        title,
        requiredSkills: requiredSkills.split(/[\n,]/).map(s=>s.trim()).filter(Boolean),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }
      await api('/api/projects', { method: 'POST', body: payload })
      setMsg('Project saved')
      setTitle(''); setRequiredSkills(''); setStartDate(''); setEndDate('')
    } catch (err) {
      setError(err.message || 'Failed to save project')
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">New Project</h2>
        {msg && <div className="alert" style={{borderColor:'#bbf7d0', background:'#f0fdf4', color:'#166534'}}>{msg}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <input className="input" placeholder="Title *" value={title} onChange={e=>setTitle(e.target.value)} required />
          <input className="input" placeholder="Required Skills (comma-separated)" value={requiredSkills} onChange={e=>setRequiredSkills(e.target.value)} />
          <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
            <input className="input" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
            <input className="input" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
          </div>
          <button className="button primary">Save</button>
        </form>
      </div>
    </div>
  )
}
