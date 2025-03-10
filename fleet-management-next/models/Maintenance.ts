import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  maintenanceId: {
    type: String,
    required: true,
    unique: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Oil Change', 'Brake Check', 'Tire Rotation', 'General Service', 'Repair'],
  },
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  completedDate: {
    type: Date,
  },
}, {
  timestamps: true,
  collection: 'maintenance'
});

// Add indexes for better query performance
maintenanceSchema.index({ maintenanceId: 1 });
maintenanceSchema.index({ vehicle: 1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ dueDate: 1 });

export default mongoose.models.Maintenance || mongoose.model('Maintenance', maintenanceSchema); 