import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Driver from '@/models/Driver';

export async function GET() {
  try {
    await connectDB();
    const drivers = await Driver.find({})
      .select('id firstName lastName driverId')
      .sort({ firstName: 1, lastName: 1 })
      .lean();

    // Format the drivers for the dropdown
    const formattedDrivers = drivers.map(driver => ({
      id: driver.id,
      driverId: driver.driverId,
      label: `${driver.firstName} ${driver.lastName} (${driver.driverId})`
    }));

    return NextResponse.json(formattedDrivers);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers list' },
      { status: 500 }
    );
  }
} 