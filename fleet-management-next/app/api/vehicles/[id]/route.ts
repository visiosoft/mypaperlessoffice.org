import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const vehicle = await Vehicle.findById(params.id).populate('assignedDriver');
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const vehicle = await Vehicle.findByIdAndUpdate(params.id, data, {
      new: true,
    }).populate('assignedDriver');
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const vehicle = await Vehicle.findByIdAndDelete(params.id);
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
} 