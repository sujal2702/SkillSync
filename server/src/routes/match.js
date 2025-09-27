import { Router } from 'express';
import Employee from '../models/Employee.js';
import Project from '../models/Project.js';

const router = Router();

function overlapCount(a = [], b = []) {
  const setB = new Set(b.map((s) => s.toLowerCase()));
  let count = 0;
  for (const s of a) {
    const norm = String(s).toLowerCase();
    if (setB.has(norm)) count += 1;
  }
  return count;
}

function isAvailable(emp, project) {
  if (!project?.startDate || !project?.endDate) return true; // optional check
  if (!emp?.availability?.startDate || !emp?.availability?.endDate) return true; // treat as available
  const ps = new Date(project.startDate).getTime();
  const pe = new Date(project.endDate).getTime();
  const es = new Date(emp.availability.startDate).getTime();
  const ee = new Date(emp.availability.endDate).getTime();
  // Available if employee window fully covers project window or overlaps depending on policy
  return es <= ps && ee >= pe; // simple inclusion policy
}

// GET /api/match/:projectId?availability=true|false
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const checkAvailability = String(req.query.availability || 'false') === 'true';

    const project = await Project.findById(projectId).populate('assignedTo');
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const employees = await Employee.find();
    
    // First, process all employees and calculate scores
    const allMatches = employees.map((e) => {
      const score = overlapCount(project.requiredSkills, e.skills);
      const available = checkAvailability ? isAvailable(e, project) : true;
      return { employee: e, score, available };
    });
    
    // Remove duplicates by keeping the entry with the highest score for each email
    const uniqueMatches = [];
    const emailMap = new Map();
    
    allMatches
      .filter((m) => m.score > 0 && m.available)
      .sort((a, b) => b.score - a.score)
      .forEach((match) => {
        const email = match.employee.email.toLowerCase();
        if (!emailMap.has(email)) {
          emailMap.set(email, true);
          uniqueMatches.push(match);
        }
      });
      
    const matches = uniqueMatches;

    res.json({ project, matches });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to find matches', details: err.message });
  }
});

export default router;
