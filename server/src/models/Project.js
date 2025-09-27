import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    startDate: { type: Date },
    endDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  },
  { timestamps: true }
);

ProjectSchema.index({ title: 1 });

export default mongoose.model('Project', ProjectSchema);
