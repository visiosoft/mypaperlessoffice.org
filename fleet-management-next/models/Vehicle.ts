import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Truck', 'Van', 'Car'],
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  driver: {
    type: String,
    default: '',
    ref: 'Driver'
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Maintenance', 'Inactive'],
    default: 'Active',
  },
  lastLocation: {
    type: String,
    default: '',
  },
  capacity: {
    type: String,
    default: '',
  },
  currentMileage: {
    type: String,
    default: '0',
  },
  lastMaintenance: {
    type: String,
    default: '',
  },
  nextMaintenance: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
  collection: 'vehicles'
});

// Add indexes for better query performance
VehicleSchema.index({ id: 1, licensePlate: 1 });
VehicleSchema.index({ status: 1 });
VehicleSchema.index({ type: 1 });
VehicleSchema.index({ driver: 1 });

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema, 'vehicles');

export default Vehicle; 