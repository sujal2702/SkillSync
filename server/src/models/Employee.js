import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema(
  {
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false }
);

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    skills: { type: [String], default: [] },
    availability: AvailabilitySchema,
  },
  { timestamps: true }
);

EmployeeSchema.index({ name: 1 });

export default mongoose.model('Employee', EmployeeSchema);
