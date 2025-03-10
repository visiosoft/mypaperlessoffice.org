import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Route from '@/models/Route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const route = await Route.findById(params.id)
      .populate('assignedVehicle')
      .populate('assignedDriver');
    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }
    return NextResponse.json(route);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch route' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const route = await Route.findByIdAndUpdate(params.id, data, {
      new: true,
    }).populate(['assignedVehicle', 'assignedDriver']);
    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }
    return NextResponse.json(route);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const route = await Route.findByIdAndDelete(params.id);
    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Route deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
  }
} 