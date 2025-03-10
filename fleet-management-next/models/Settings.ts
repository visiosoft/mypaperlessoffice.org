import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['General', 'Currency', 'Notifications', 'System'],
  },
  isSystem: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'settings'
});

// Add indexes for better query performance
settingsSchema.index({ key: 1 });
settingsSchema.index({ category: 1 });

// Delete the existing model if it exists to ensure we're using the new schema
if (mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.model('Settings', settingsSchema); 