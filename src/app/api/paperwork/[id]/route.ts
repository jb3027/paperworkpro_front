import { NextRequest, NextResponse } from 'next/server';
import { paperworkService } from '@/lib/paperwork-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await paperworkService.get(params.id);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching paperwork:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paperwork' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const result = await paperworkService.update(params.id, data);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating paperwork:', error);
    return NextResponse.json(
      { error: 'Failed to update paperwork' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await paperworkService.delete(params.id);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error deleting paperwork:', error);
    return NextResponse.json(
      { error: 'Failed to delete paperwork' },
      { status: 500 }
    );
  }
}
