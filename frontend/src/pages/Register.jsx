import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { setAuth } from '../lib/auth'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('Employee')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const data = await api('/api/auth/register', {
        method: 'POST',
        body: { name, email, password, role },
      })
      setAuth(data.token, data.user)
      if (data.user?.role === 'Employee') {
        navigate('/employee', { replace: true })
      } else {
        navigate('/projects', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">Create an Account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
          <input
            type="email"
            placeholder="Email Address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password *"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input"
            required
          />
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
          </select>
          <button className="button primary" disabled={loading}>
            {loading ? 'Signing Up...' : 'SIGN UP'}
          </button>
        </form>
        <div className="muted">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  )
}
