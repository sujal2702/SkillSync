import { useState } from 'react'
import { api } from '../lib/api'
import './ProjectForm.css'

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
        requiredSkills: requiredSkills.split(/[\n,]/).map(s => s.trim()).filter(Boolean),
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
    <div className="page project-form-page">
      <div className="card project-form-card">
        <div className="floating-project-icons">
          <div className="floating-project-icon">🚀</div>
          <div className="floating-project-icon">💡</div>
          <div className="floating-project-icon">⚡</div>
        </div>
        <h2 className="title project-form-title">New Project</h2>
        {msg && <div className="project-form-success">{msg}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="project-title-input-container">
            <input
              className="input project-title-input"
              placeholder="Project Title *"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="skills-input-container">
            <input
              className="input project-skills-input"
              placeholder="Required Skills (comma-separated)"
              value={requiredSkills}
              onChange={e => setRequiredSkills(e.target.value)}
            />
          </div>
          <div className="project-date-grid">
            <div className="project-date-input">
              <input
                className="input"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
            </div>
            <div className="project-date-input">
              <input
                className="input"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                placeholder="End Date"
              />
            </div>
          </div>
          <button className="project-save-button" type="submit">Create Project</button>
        </form>
      </div>
    </div>
  )
}
