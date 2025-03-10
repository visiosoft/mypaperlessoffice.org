import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Fuel from '@/models/Fuel';

export async function POST() {
  try {
    await connectDB();
    
    // Drop the existing collection
    await Fuel.collection.drop();
    
    // Recreate the collection with the correct schema
    await Fuel.createCollection();
    
    return NextResponse.json({ 
      message: 'Fuel collection reset successfully',
      schema: {
        fuelId: 'String (required, unique)',
        vehicle: 'ObjectId (required, ref: Vehicle)',
        date: 'Date (required)',
        fuelType: 'String (required, enum: Diesel, Petrol, CNG, Electric)',
        quantity: 'Number (required)',
        unit: 'String (required, enum: Liters, Kilowatt-hours)',
        cost: 'Number (required)',
        odometerReading: 'Number (required)',
        location: 'String (required)',
        notes: 'String (optional)'
      }
    });
  } catch (error: any) {
    console.error('Error resetting fuel collection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reset fuel collection' },
      { status: 500 }
    );
  }
} 