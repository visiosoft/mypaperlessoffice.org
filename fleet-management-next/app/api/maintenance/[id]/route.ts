import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Maintenance from '@/models/Maintenance';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const maintenance = await Maintenance.findById(params.id).populate('vehicle');
    if (!maintenance) {
      return NextResponse.json({ error: 'Maintenance record not found' }, { status: 404 });
    }
    return NextResponse.json(maintenance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch maintenance record' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const maintenance = await Maintenance.findByIdAndUpdate(params.id, data, {
      new: true,
    }).populate('vehicle');
    if (!maintenance) {
      return NextResponse.json({ error: 'Maintenance record not found' }, { status: 404 });
    }
    return NextResponse.json(maintenance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update maintenance record' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const maintenance = await Maintenance.findByIdAndDelete(params.id);
    if (!maintenance) {
      return NextResponse.json({ error: 'Maintenance record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete maintenance record' }, { status: 500 });
  }
} 