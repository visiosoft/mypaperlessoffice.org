import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active',
  },
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  startLocation: {
    type: String,
    required: true,
  },
  endLocation: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  estimatedDuration: {
    type: Number,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Route || mongoose.model('Route', routeSchema); 