import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Driver from '@/models/Driver';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const driver = await Driver.findById(params.id).populate('assignedVehicle');
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }
    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch driver' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const driver = await Driver.findByIdAndUpdate(params.id, data, {
      new: true,
    }).populate('assignedVehicle');
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }
    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const driver = await Driver.findByIdAndDelete(params.id);
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 });
  }
} 