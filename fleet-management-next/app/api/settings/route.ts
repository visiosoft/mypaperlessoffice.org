import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.find().sort({ category: 1, key: 1 });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Check if setting with same key exists
    const existingSetting = await Settings.findOne({ key: data.key });
    if (existingSetting) {
      return NextResponse.json(
        { error: 'Setting with this key already exists' },
        { status: 400 }
      );
    }

    const setting = await Settings.create(data);
    return NextResponse.json(setting, { status: 201 });
  } catch (error: any) {
    console.error('Error creating setting:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create setting' },
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
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    // Check if setting exists and is not system
    const existingSetting = await Settings.findById(_id);
    if (!existingSetting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    if (existingSetting.isSystem) {
      return NextResponse.json(
        { error: 'Cannot modify system settings' },
        { status: 403 }
      );
    }

    const setting = await Settings.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(setting);
  } catch (error: any) {
    console.error('Error updating setting:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update setting' },
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
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    // Check if setting exists and is not system
    const setting = await Settings.findById(id);
    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    if (setting.isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system settings' },
        { status: 403 }
      );
    }

    await Settings.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Setting deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting setting:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete setting' },
      { status: 500 }
    );
  }
} 