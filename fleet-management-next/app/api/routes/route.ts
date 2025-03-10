import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Route from '@/models/Route';

export async function GET() {
  try {
    await connectDB();
    const routes = await Route.find()
      .populate('assignedVehicle')
      .populate('assignedDriver')
      .sort({ createdAt: -1 });
    return NextResponse.json(routes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const route = await Route.create(data);
    await route.populate(['assignedVehicle', 'assignedDriver']);
    return NextResponse.json(route, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
  }
} 