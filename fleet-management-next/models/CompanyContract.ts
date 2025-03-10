import mongoose from 'mongoose';

const companyContractSchema = new mongoose.Schema({
  contractId: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  contractStartDate: {
    type: Date,
    required: true,
  },
  contractEndDate: {
    type: Date,
    required: true,
  },
  isExtended: {
    type: Boolean,
    default: false,
  },
  allowedStates: [{
    type: String,
    required: true,
  }],
  documents: [{
    type: {
      type: String,
      required: true,
      enum: ['License', 'Insurance', 'Registration', 'Other'],
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
  }],
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Terminated', 'Extended'],
    default: 'Active',
  },
  history: [{
    action: {
      type: String,
      required: true,
      enum: ['Created', 'Extended', 'Terminated', 'DocumentAdded', 'DocumentUpdated'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: String,
      required: true,
    },
    previousEndDate: Date,
    newEndDate: Date,
  }],
  notes: String,
}, {
  timestamps: true,
});

// Indexes
companyContractSchema.index({ contractId: 1 });
companyContractSchema.index({ companyName: 1 });
companyContractSchema.index({ licenseNumber: 1 });
companyContractSchema.index({ status: 1 });
companyContractSchema.index({ contractEndDate: 1 });

const CompanyContract = mongoose.models.CompanyContract || mongoose.model('CompanyContract', companyContractSchema);

export default CompanyContract; 