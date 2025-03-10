import mongoose from 'mongoose';

const fuelSchema = new mongoose.Schema({
  fuelId: {
    type: String,
    required: true,
    unique: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Diesel', 'Petrol', 'CNG', 'Electric'],
  },
  quantity: {
    type: Number,
    required: false,
    min: [0, 'Quantity cannot be negative'],
    max: [1000, 'Quantity seems too high. Please check the value.'],
    validate: {
      validator: function(v: number) {
        if (!v) return true; // Skip validation if value is not provided
        switch(this.fuelType) {
          case 'Diesel':
          case 'Petrol':
            return v <= 200; // Most fuel tanks are under 200L
          case 'CNG':
            return v <= 50; // CNG tanks typically hold less
          case 'Electric':
            return v <= 100; // kWh for electric charging
          default:
            return true;
        }
      },
      message: props => `Quantity ${props.value} is not reasonable for ${this.fuelType}`
    }
  },
  unit: {
    type: String,
    required: true,
    enum: ['Liters', 'Kilowatt-hours'],
    validate: {
      validator: function(v: string) {
        // Validate unit matches fuel type
        if (this.fuelType === 'Electric' && v !== 'Kilowatt-hours') {
          return false;
        }
        if (this.fuelType !== 'Electric' && v !== 'Liters') {
          return false;
        }
        return true;
      },
      message: props => `Unit ${props.value} is not valid for ${this.fuelType}`
    }
  },
  cost: {
    type: Number,
    required: true,
    min: [0, 'Cost cannot be negative'],
    max: [10000, 'Cost seems too high. Please check the value.'], // Reasonable max for most fuel costs
  },
  odometerReading: {
    type: Number,
    required: false,
    min: [0, 'Odometer reading cannot be negative'],
    max: [1000000, 'Odometer reading seems too high. Please check the value.'], // Reasonable max for most vehicles
    validate: {
      validator: async function(v: number) {
        if (!v) return true; // Skip validation if value is not provided
        // Get the previous fuel record for this vehicle
        const prevRecord = await mongoose.model('Fuel').findOne({
          vehicle: this.vehicle,
          date: { $lt: this.date }
        }).sort({ date: -1 });

        if (prevRecord) {
          // Check if the odometer reading is less than the previous reading
          if (v < prevRecord.odometerReading) {
            return false;
          }
          // Check if the mileage increase is reasonable (e.g., not more than 1000km per day)
          const daysDiff = (this.date.getTime() - prevRecord.date.getTime()) / (1000 * 60 * 60 * 24);
          const mileageDiff = v - prevRecord.odometerReading;
          if (mileageDiff > 1000 * daysDiff) {
            return false;
          }
        }
        return true;
      },
      message: props => 'Odometer reading is invalid. It should be greater than the previous reading and have a reasonable increase.'
    }
  },
  location: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
  collection: 'fuels'
});

// Add indexes for better query performance
fuelSchema.index({ fuelId: 1 });
fuelSchema.index({ vehicle: 1 });
fuelSchema.index({ date: 1 });
fuelSchema.index({ fuelType: 1 });

// Delete the existing model if it exists to ensure we're using the new schema
if (mongoose.models.Fuel) {
  delete mongoose.models.Fuel;
}

export default mongoose.model('Fuel', fuelSchema); 