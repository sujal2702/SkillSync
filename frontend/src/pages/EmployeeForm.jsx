import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { getUser } from '../lib/auth'

export default function EmployeeForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [skills, setSkills] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const u = getUser()
    if (u?.email) {
      setEmail(u.email)
      api(`/api/employees?email=${encodeURIComponent(u.email)}`)
        .then(list => {
          if (Array.isArray(list) && list.length > 0) {
            const e = list[0]
            setName(e.name || u.name || '')
            setSkills((e.skills || []).join(', '))
            setStartDate(e?.availability?.startDate ? new Date(e.availability.startDate).toISOString().slice(0,10) : '')
            setEndDate(e?.availability?.endDate ? new Date(e.availability.endDate).toISOString().slice(0,10) : '')
          } else {
            setName(u.name || '')
          }
        })
        .catch(() => { setName(u.name || '') })
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      const payload = {
        name: name || getUser()?.name,
        email,
        skills: skills.split(/[\,\n]/).map(s => s.trim()).filter(Boolean),
        availability: (startDate && endDate) ? { startDate, endDate } : undefined,
      }
      await api('/api/employees', { method: 'POST', body: payload })
      setMsg('Saved! You can edit and save again anytime.')
      // Keep fields as-is to allow immediate edits
    } catch (err) {
      setError(err.message || 'Failed to save employee')
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">Skills & Availability</h2>
        {msg && (
          <div
            className="alert"
            style={{ borderColor: '#bbf7d0', background: '#f0fdf4', color: '#166534' }}
          >
            {msg}
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          {/* Hide name field if already known from auth */}
          {!name && (
            <input
              className="input"
              placeholder="Full Name *"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!!email}
          />
          <input
            className="input"
            placeholder="Skills (comma-separated)"
            value={skills}
            onChange={e => setSkills(e.target.value)}
          />
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
            <input
              className="input"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <input
              className="input"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <button className="button primary">Save</button>
        </form>
        <div className="muted">Edit fields above and click Save to update anytime.</div>
      </div>
    </div>
  )
}
