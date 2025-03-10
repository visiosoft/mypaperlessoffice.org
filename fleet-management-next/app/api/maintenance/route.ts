import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Maintenance from '@/models/Maintenance';

export async function GET() {
  try {
    await connectDB();
    const maintenance = await Maintenance.find()
      .populate('vehicle', 'name id licensePlate')
      .sort({ dueDate: 1 });
    return NextResponse.json(maintenance);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Generate a unique maintenance ID if not provided
    if (!data.maintenanceId) {
      const count = await Maintenance.countDocuments();
      data.maintenanceId = `M${String(count + 1).padStart(3, '0')}`;
    }

    const maintenance = await Maintenance.create(data);
    return NextResponse.json(maintenance, { status: 201 });
  } catch (error: any) {
    console.error('Error creating maintenance record:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Maintenance ID already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create maintenance record' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json(
        { error: 'Maintenance ID is required' },
        { status: 400 }
      );
    }

    const maintenance = await Maintenance.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!maintenance) {
      return NextResponse.json(
        { error: 'Maintenance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(maintenance);
  } catch (error: any) {
    console.error('Error updating maintenance record:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update maintenance record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Maintenance ID is required' },
        { status: 400 }
      );
    }

    const maintenance = await Maintenance.findByIdAndDelete(id);

    if (!maintenance) {
      return NextResponse.json(
        { error: 'Maintenance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Maintenance record deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    return NextResponse.json(
      { error: 'Failed to delete maintenance record' },
      { status: 500 }
    );
  }
} 