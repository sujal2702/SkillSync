import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Homepage from './pages/Homepage.jsx'
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
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<><NavBar /><Login /></>} />
        <Route path="/register" element={<><NavBar /><Register /></>} />
        <Route path="/employee" element={<><NavBar /><EmployeeForm /></>} />
        <Route path="/employees" element={<><NavBar /><EmployeesList /></>} />
        <Route path="/projects" element={<><NavBar /><ProjectsList /></>} />
        <Route path="/projects/new" element={<><NavBar /><ProjectForm /></>} />
        <Route path="/projects/:id/matches" element={<><NavBar /><Matches /></>} />
        <Route path="*" element={
          <div style={{ padding: 24 }}>
            Not Found. <Link to="/">Go to Homepage</Link>
          </div>
        } />
      </Routes>
    </div>
  )
}
