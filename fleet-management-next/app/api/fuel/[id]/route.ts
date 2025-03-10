import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Fuel from '@/models/Fuel';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const fuelRecord = await Fuel.findById(params.id)
      .populate('vehicle')
      .populate('driver');
    if (!fuelRecord) {
      return NextResponse.json({ error: 'Fuel record not found' }, { status: 404 });
    }
    return NextResponse.json(fuelRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fuel record' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const fuelRecord = await Fuel.findByIdAndUpdate(params.id, data, {
      new: true,
    }).populate(['vehicle', 'driver']);
    if (!fuelRecord) {
      return NextResponse.json({ error: 'Fuel record not found' }, { status: 404 });
    }
    return NextResponse.json(fuelRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update fuel record' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const fuelRecord = await Fuel.findByIdAndDelete(params.id);
    if (!fuelRecord) {
      return NextResponse.json({ error: 'Fuel record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Fuel record deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete fuel record' }, { status: 500 });
  }
} 