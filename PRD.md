# SkillSync – Internal Talent Discovery Platform (Product Spec)

## 1. Overview
SkillSync is a minimal internal platform to discover available employees for projects using simple, rule-based skill matching (no AI embeddings). Two roles: Employee and Manager. Employees submit skills and availability; Managers create projects with required skills and optional dates, then find best matches and assign.

## 2. Goals (MVP)
- Employees can log in/register and enter skills and a time window of availability.
- Managers can create projects with required skills and optional dates.
- Managers can view employees and run “Find Matches” for any project.
- Matching ranks employees by overlapping skills; optional availability check.
- Manager assigns a selected employee to a project.

## 3. Non‑Goals (MVP)
- No complex scoring, ML, embeddings, or external AI.
- No multi-tenant or SSO.
- No advanced RBAC beyond simple role flags.
- No notifications or emails.

## 4. Users & Roles
- Employee
  - Create/edit skills and availability.
- Manager
  - Create/list projects; view employees; find matches and assign.

## 5. User Stories
- As an Employee, I can register/login and add my skills and availability so managers can match me to projects.
- As a Manager, I can create a project with required skills and dates, then click “Find Matches” to see ranked employees.
- As a Manager, I can assign a matched employee to my project.

## 6. Flows
- Authentication
  - Register/Login → Store token + user (role) in localStorage → Redirect by role: Employee → `/employee`, Manager → `/projects`.
- Employee profile
  - `/employee` shows a simple form to add/edit skills and availability (email prefilled & locked; name hidden if known). Save shows success message and keeps data for edits.
- Project lifecycle
  - Manager creates project at `/projects/new`, then sees it in `/projects` list.
  - Click “Find Matches” → `/projects/:id/matches` shows ranked employees by overlap. Optional availability filter from Projects list.
  - Click “Assign” to attach employee to the project.

## 7. Data Model (MongoDB)
- User
  - name: string (required)
  - email: string (required, unique)
  - passwordHash: string (required)
  - role: enum [Employee, Manager] (required)
  - employeeProfile: ObjectId (Employee)
- Employee
  - name: string
  - email: string
  - skills: [string]
  - availability: { startDate: Date, endDate: Date }
- Project
  - title: string (required)
  - requiredSkills: [string]
  - startDate?: Date
  - endDate?: Date
  - assignedEmployee?: ObjectId (Employee)

## 8. APIs (current)
- Auth
  - POST `/api/auth/register` { name, email, password, role } → { token, user }
  - POST `/api/auth/login` { email, password } → { token, user }
- Employees
  - POST `/api/employees` { name?, email, skills[], availability? } → upsert by email
  - GET `/api/employees?email=optional` → list employees (filter by email if provided)
- Projects
  - POST `/api/projects` { title, requiredSkills[], startDate?, endDate? }
  - GET `/api/projects` → list projects (with assignedEmployee populated)
  - PATCH `/api/projects/:id/assign` { employeeId }
- Matching
  - GET `/api/match/:projectId?availability=true|false` → { project, matches: [{ employee, score, available }] }

## 9. Matching Logic (MVP)
- Normalize skills to lowercase strings.
- Score = count of overlapping skills between project.requiredSkills and employee.skills.
- Optional availability: employee window must cover project window (employee.startDate <= project.startDate and employee.endDate >= project.endDate). If project has no dates, availability passes.
- Filter out matches with score = 0; sort desc by score.

## 10. Frontend (React, Vite)
- Routes
  - `/login`, `/register`
  - `/employee` (Employee: add/edit skills & availability)
  - `/projects`, `/projects/new` (Manager)
  - `/projects/:id/matches` (Manager)
  - `/employees` (Manager)
- Navbar (role-aware)
  - Logged out: LOGIN, REGISTER
  - Employee: EMPLOYEE, LOGOUT
  - Manager: PROJECTS, EMPLOYEES, LOGOUT
- Styling
  - Blue top navbar, centered card forms (per provided mockups).

## 11. Security & Config
- JWT with secret `JWT_SECRET` from `server/.env`.
- CORS allows `CLIENT_URL` (Vite dev default: http://localhost:5173).
- Mongo connection string from `MONGODB_URI` (default local: mongodb://127.0.0.1:27017/skillsync).

## 12. Success Metrics
- Time-to-setup: < 15 minutes to run locally.
- Create first employee profile: < 2 minutes.
- Create first project and find matches: < 3 minutes.

## 13. Milestones
- M1 (done): Auth, employees, projects, matching, basic UI and flows.
- M2: Small UX polish – toasts, inline validation, minor responsiveness.
- M3: Optional – route guards, pagination, simple search, export matches.

## 14. Out of Scope (for now)
- Advanced scheduling/availability rules.
- Multi-project assignment constraints.
- Organizational hierarchy and approvals.
- Email/SMS notifications.

## 15. Local Setup Summary
- Backend: `server/`
  - `.env` with `PORT`, `MONGODB_URI`, `CLIENT_URL`, `JWT_SECRET`
  - `npm install && npm run dev`
- Frontend: `frontend/`
  - `npm install && npm run dev`
  - Open: http://localhost:5173

## 16. Notes
- Simplicity is the core requirement. All logic is intentionally minimal and easily demoable.
