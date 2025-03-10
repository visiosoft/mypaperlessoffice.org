import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Driver from '@/models/Driver';

// GET all drivers
export async function GET() {
  try {
    await connectDB();
    const drivers = await Driver.find({})
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });
    console.log('Fetched drivers:', drivers);
    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

// POST new driver
export async function POST(request: Request) {
  try {
    console.log('Starting POST request...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');

    // Parse and validate request data
    const data = await request.json();
    console.log('Received data:', data);

    // Basic validation
    if (!data.firstName || !data.lastName) {
      console.error('Missing required fields:', data);
      return NextResponse.json(
        { error: 'Missing required fields (firstName, lastName)' },
        { status: 400 }
      );
    }

    // Generate a unique driver ID if not provided
    if (!data.id) {
      const count = await Driver.countDocuments();
      data.id = `D${String(count + 1).padStart(3, '0')}`;
      console.log('Generated new ID:', data.id);
    }

    // If driverId is not provided, generate it from firstName and lastName
    if (!data.driverId) {
      data.driverId = `${data.firstName.charAt(0)}${data.lastName.charAt(0)}${String(Date.now()).slice(-4)}`;
      console.log('Generated driver ID:', data.driverId);
    }

    // Create new driver document
    const driverDoc = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      driverId: data.driverId,
      phone: data.phone || '',
      email: data.email || '',
      licenseNumber: data.licenseNumber || '',
      licenseExpiry: data.licenseExpiry || null,
      status: data.status || 'Off Duty',
      assignedVehicle: data.assignedVehicle || '',
      notes: data.notes || ''
    };

    console.log('Attempting to save driver:', driverDoc);

    // Create and save the driver
    const driver = new Driver(driverDoc);
    const savedDriver = await driver.save();
    
    console.log('Driver saved successfully:', savedDriver);

    // Verify the save by fetching the driver
    const verifiedDriver = await Driver.findOne({ id: savedDriver.id })
      .lean({ virtuals: true });
    console.log('Verified saved driver:', verifiedDriver);

    if (!verifiedDriver) {
      throw new Error('Driver was not saved properly');
    }

    return NextResponse.json(savedDriver, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'Driver with this ID, driver ID, or email already exists' },
          { status: 400 }
        );
      } else if (error.message.includes('validation failed')) {
        return NextResponse.json(
          { error: 'Invalid driver data' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    );
  }
}

// PUT update driver
export async function PUT(request: Request) {
  try {
    const conn = await connectDB();
    if (!conn) {
      throw new Error('Database connection failed');
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    const driver = await Driver.findOneAndUpdate(
      { id },
      updateData,
      { 
        new: true, 
        runValidators: true
      }
    ).lean({ virtuals: true });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(driver);
  } catch (error) {
    console.error('Database Error:', error);
    if (error instanceof Error && error.message.includes('validation failed')) {
      return NextResponse.json(
        { error: 'Invalid driver data' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update driver' },
      { status: 500 }
    );
  }
}

// DELETE driver
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      );
    }

    const driver = await Driver.findOneAndDelete({ id });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Driver deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete driver' },
      { status: 500 }
    );
  }
} 