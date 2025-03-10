import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Fuel from '@/models/Fuel';

export async function GET() {
  try {
    await connectDB();
    const fuel = await Fuel.find()
      .populate('vehicle', 'name licensePlate')
      .sort({ date: -1 })
      .lean({ virtuals: true });
    return NextResponse.json(fuel);
  } catch (error) {
    console.error('Error fetching fuel records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fuel records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Generate a unique fuel ID if not provided
    if (!data.fuelId) {
      const lastFuel = await Fuel.findOne().sort({ fuelId: -1 });
      const lastNumber = lastFuel ? parseInt(lastFuel.fuelId.split('-')[1]) : 0;
      data.fuelId = `FUEL-${String(lastNumber + 1).padStart(4, '0')}`;
    }

    const fuel = await Fuel.create(data);
    return NextResponse.json(fuel, { status: 201 });
  } catch (error: any) {
    console.error('Error creating fuel record:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Fuel ID already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create fuel record' },
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
        { error: 'Fuel ID is required' },
        { status: 400 }
      );
    }

    const fuel = await Fuel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!fuel) {
      return NextResponse.json(
        { error: 'Fuel record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(fuel);
  } catch (error: any) {
    console.error('Error updating fuel record:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update fuel record' },
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
        { error: 'Fuel ID is required' },
        { status: 400 }
      );
    }

    const fuel = await Fuel.findByIdAndDelete(id);

    if (!fuel) {
      return NextResponse.json(
        { error: 'Fuel record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Fuel record deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting fuel record:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete fuel record' },
      { status: 500 }
    );
  }
} 