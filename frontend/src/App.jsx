import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import EmployeeForm from './pages/EmployeeForm.jsx'
import ProjectForm from './pages/ProjectForm.jsx'
import ProjectsList from './pages/ProjectsList.jsx'
import Matches from './pages/Matches.jsx'
import EmployeesList from './pages/EmployeesList.jsx'
import NavBar from './components/NavBar.jsx'

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employee" element={<EmployeeForm />} />
        <Route path="/employees" element={<EmployeesList />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id/matches" element={<Matches />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div style={{ padding: 24 }}>Not Found. <Link to="/login">Go to Login</Link></div>} />
      </Routes>
    </div>
  )
}
