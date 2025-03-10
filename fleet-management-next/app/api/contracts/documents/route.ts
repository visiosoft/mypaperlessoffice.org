import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CompanyContract from '@/models/CompanyContract';

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();
    const contractId = formData.get('contractId') as string;
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const expiryDate = formData.get('expiryDate') as string;

    if (!contractId || !file || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Upload the file to a storage service (e.g., AWS S3, Google Cloud Storage)
    // 2. Get the URL of the uploaded file
    // For now, we'll simulate this with a dummy URL
    const fileUrl = `/uploads/${file.name}`; // Replace with actual upload logic

    const contract = await CompanyContract.findById(contractId);
    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    const document = {
      type,
      fileName: file.name,
      fileUrl,
      uploadDate: new Date(),
      ...(expiryDate && { expiryDate: new Date(expiryDate) }),
    };

    // Add document to contract
    contract.documents.push(document);

    // Add to history
    contract.history.push({
      action: 'DocumentAdded',
      date: new Date(),
      details: `Added ${type} document: ${file.name}`,
    });

    await contract.save();

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const contractId = searchParams.get('contractId');
    const documentId = searchParams.get('documentId');

    if (!contractId || !documentId) {
      return NextResponse.json(
        { error: 'Contract ID and Document ID are required' },
        { status: 400 }
      );
    }

    const contract = await CompanyContract.findById(contractId);
    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Remove document from contract
    contract.documents = contract.documents.filter(
      (doc: any) => doc._id.toString() !== documentId
    );

    // Add to history
    contract.history.push({
      action: 'DocumentUpdated',
      date: new Date(),
      details: 'Removed document',
    });

    await contract.save();

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 