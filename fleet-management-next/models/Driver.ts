import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  driverId: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  licenseNumber: {
    type: String,
    required: false,
  },
  licenseExpiry: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ['On Duty', 'Off Duty', 'On Leave'],
    default: 'Off Duty',
  },
  assignedVehicle: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
  collection: 'drivers',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for driver's full name
DriverSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});


const Driver = mongoose.models.Driver || mongoose.model('Driver', DriverSchema, 'drivers');

export default Driver; 