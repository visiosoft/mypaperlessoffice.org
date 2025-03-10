import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

// GET all vehicles
export async function GET() {
  try {
    await connectDB();
    const vehicles = await Vehicle.find({})
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

// POST new vehicle
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.type || !data.model || !data.licensePlate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique vehicle ID if not provided
    if (!data.id) {
      const count = await Vehicle.countDocuments();
      data.id = `V${String(count + 1).padStart(3, '0')}`;
    }

    const vehicle = await Vehicle.create(data);
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'Vehicle with this ID or license plate already exists' },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}

// PUT update vehicle
export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { _id, ...updateData } = data;
    
    if (!_id) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(updatedVehicle);
  } catch (error: any) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

// DELETE vehicle
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.findOneAndDelete({ id });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Vehicle deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
} 