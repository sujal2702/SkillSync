import { Router } from 'express';
import Project from '../models/Project.js';

const router = Router();

// Create project
router.post('/', async (req, res) => {
  try {
    const { title, requiredSkills = [], startDate, endDate } = req.body;
    const normalizedSkills = (requiredSkills || []).map((s) => String(s).trim().toLowerCase()).filter(Boolean);
    const project = await Project.create({ title, requiredSkills: normalizedSkills, startDate, endDate });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create project', details: err.message });
  }
});

// List projects
router.get('/', async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).populate('assignedTo');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// Assign employee to project
router.patch('/:id/assign', async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { assignedTo: employeeId } },
      { new: true, runValidators: true }
    ).populate('assignedTo');

    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // Return the updated project with the populated assignedTo field
    const updatedProject = await Project.findById(project._id).populate('assignedTo');
    res.json(updatedProject);
  } catch (err) {
    console.error('Error assigning employee:', err);
    res.status(400).json({ error: 'Failed to assign employee', details: err.message });
  }
});

// Unassign employee from project
router.patch('/:id/unassign', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $unset: { assignedTo: '' } },
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // Return the updated project with null assignedTo
    const updatedProject = await Project.findById(project._id).populate('assignedTo');
    res.json({ ...updatedProject.toObject(), assignedTo: null });
  } catch (err) {
    console.error('Error unassigning employee:', err);
    res.status(400).json({ error: 'Failed to unassign employee', details: err.message });
  }
});

export default router;
