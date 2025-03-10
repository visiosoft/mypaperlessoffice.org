import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CompanyContract from '@/models/CompanyContract';

// GET all contracts
export async function GET() {
  try {
    await connectDB();
    const contracts = await CompanyContract.find()
      .sort({ createdAt: -1 });
    return NextResponse.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

// POST new contract
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    console.log('Received contract data:', data);

    // Validate required fields
    const requiredFields = ['companyName', 'licenseNumber', 'contractStartDate', 'contractEndDate', 'allowedStates'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate a unique contract ID if not provided
    if (!data.contractId) {
      const count = await CompanyContract.countDocuments();
      data.contractId = `CNT${String(count + 1).padStart(5, '0')}`;
    }

    // Set initial status
    data.status = 'Active';

    // Add to history
    data.history = [{
      action: 'Created',
      date: new Date(),
      details: 'Contract created',
    }];

    console.log('Creating contract with data:', data);
    const contract = await CompanyContract.create(data);
    console.log('Contract created successfully:', contract);

    return NextResponse.json(contract);
  } catch (error: any) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create contract',
        details: error.code === 11000 ? 'Duplicate contract ID' : error.message
      },
      { status: error.code === 11000 ? 409 : 500 }
    );
  }
}

// PUT update contract
export async function PUT(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    console.log('Received update data:', data);

    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json(
        { error: 'Contract ID is required' },
        { status: 400 }
      );
    }

    // Check if contract exists
    const existingContract = await CompanyContract.findById(_id);
    if (!existingContract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Handle contract extension
    if (updateData.contractEndDate && updateData.contractEndDate !== existingContract.contractEndDate) {
      updateData.isExtended = true;
      updateData.status = 'Extended';
      
      // Add to history
      const historyEntry = {
        action: 'Extended',
        date: new Date(),
        details: 'Contract extended',
        previousEndDate: existingContract.contractEndDate,
        newEndDate: new Date(updateData.contractEndDate),
      };
      
      updateData.history = [...existingContract.history, historyEntry];
    }

    console.log('Updating contract with data:', updateData);
    const updatedContract = await CompanyContract.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    console.log('Contract updated successfully:', updatedContract);
    return NextResponse.json(updatedContract);
  } catch (error: any) {
    console.error('Error updating contract:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update contract' },
      { status: 500 }
    );
  }
}

// DELETE contract
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Contract ID is required' },
        { status: 400 }
      );
    }

    const contract = await CompanyContract.findByIdAndDelete(id);
    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    console.log('Contract deleted successfully:', id);
    return NextResponse.json({ message: 'Contract deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete contract' },
      { status: 500 }
    );
  }
} 