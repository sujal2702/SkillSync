import { Link, useLocation } from 'react-router-dom'
import { getUser, clearAuth } from '../lib/auth'

export default function NavBar() {
  const location = useLocation()
  const user = getUser()

  function logout() {
    clearAuth()
    // simple reload to reset state
    window.location.href = '/login'
  }
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="brand">SkillSync</div>
        <nav className="nav-links">
          {!user && (
            <>
              <Link className={location.pathname === '/login' ? 'active' : ''} to="/login">LOGIN</Link>
              <Link className={location.pathname === '/register' ? 'active' : ''} to="/register">REGISTER</Link>
            </>
          )}
          {user?.role === 'Employee' && (
            <Link className={location.pathname.startsWith('/employee') ? 'active' : ''} to="/employee">EMPLOYEE</Link>
          )}
          {user?.role === 'Manager' && (
            <>
              <Link className={location.pathname.startsWith('/projects') ? 'active' : ''} to="/projects">PROJECTS</Link>
              <Link className={location.pathname.startsWith('/employees') ? 'active' : ''} to="/employees">EMPLOYEES</Link>
            </>
          )}
          {user && (
            <a href="#" onClick={e => { e.preventDefault(); logout() }}>LOGOUT</a>
          )}
        </nav>
      </div>
    </header>
  )
}
