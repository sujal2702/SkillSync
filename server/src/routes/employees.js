import { Router } from 'express';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

const router = Router();

// Create or update employee (upsert by email)
router.post('/', async (req, res) => {
  try {
    const { name, email, skills = [], availability } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const normalizedSkills = (skills || []).map((s) => String(s).trim().toLowerCase()).filter(Boolean);
    const employee = await Employee.findOneAndUpdate(
      { email },
      { $set: { name, email, skills: normalizedSkills, availability } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // If a user exists with this email, link the employee profile (best-effort, optional)
    if (email) {
      await User.findOneAndUpdate(
        { email },
        { $set: { employeeProfile: employee._id } },
        { new: true }
      ).catch(() => {});
    }
    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create employee', details: err.message });
  }
});

// List employees (deduplicated by email, keeping most recent)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { email } : {};
    
    // Get all employees, sorted by email and then by creation date (newest first)
    const employees = await Employee.aggregate([
      { $match: query },
      { $sort: { email: 1, createdAt: -1 } },
      {
        $group: {
          _id: '$email',
          doc: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sort: { name: 1 } }  // Final sort by name
    ]);
    
    res.json(employees);
  } catch (err) {
    console.error('Error listing employees:', err);
    res.status(500).json({ error: 'Failed to list employees' });
  }
});

export default router;
