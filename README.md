# SkillSync – Internal Talent Discovery Platform

A minimal MERN app to match employees to projects by simple skill overlap and optional availability.

## Stack
- React (Vite) frontend
- Node.js + Express backend
- MongoDB via Mongoose

## Features
- Employee profile: name, skills (comma/space-separated), optional availability window
- Manager project posting: title, required skills, optional dates
- Matching: counts overlapping skills, optional availability inclusion (project window within employee window)
- Assign an employee to a project

---

## Quickstart

### 1) Backend

1. Create env file

```bash
cp server/.env.example server/.env
```

2. Install dependencies and run

```bash
cd server
npm install
npm run dev
```

API runs at: `http://localhost:4000`

### API Endpoints
- `GET /` health
- `POST /api/employees` create employee `{ name, email?, skills: string[] | string, availability?: { startDate, endDate } }`
- `GET /api/employees` list employees
- `POST /api/projects` create project `{ title, requiredSkills: string[] | string, startDate?, endDate? }`
- `GET /api/projects` list projects
- `PATCH /api/projects/:id/assign` `{ employeeId }`
- `GET /api/match/:projectId?availability=true|false` find matches

Note: Skills are normalized to lowercase; availability check is optional.

### 2) Frontend

Create a Vite React app:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

Then add the following simple pages/components that call the API at `http://localhost:4000`:
- `EmployeeForm` to create employees
- `ProjectForm` to create projects and a list page with a "Find Matches" button
- On match view: show ranked employees (score) and an "Assign" button

I included CORS to allow `CLIENT_URL` from `.env`.

---

## Data shape examples

Employee payload:
```json
{
  "name": "Alice",
  "email": "alice@acme.com",
  "skills": ["react", "node", "mongodb"],
  "availability": {"startDate": "2025-09-01", "endDate": "2025-12-31"}
}
```

Project payload:
```json
{
  "title": "Website Revamp",
  "requiredSkills": ["react", "ui", "node"],
  "startDate": "2025-10-01",
  "endDate": "2025-11-15"
}
```

---

## Dev Notes
- Matching logic is in `server/src/routes/match.js` using a simple overlap count.
- Availability policy: employee availability window must cover the entire project window when `availability=true`.
- You can tweak policies easily.

## Next Steps (optional)
- Simple auth roles (Employee, Manager) via JWT
- UI polish: dashboard, tabs
- Pagination and search
- Export match lists
