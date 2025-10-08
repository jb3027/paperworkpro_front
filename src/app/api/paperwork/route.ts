import { NextRequest, NextResponse } from 'next/server';
import { paperworkService } from '@/lib/paperwork-api';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await paperworkService.create(data);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating paperwork:', error);
    return NextResponse.json(
      { error: 'Failed to create paperwork' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const result = await paperworkService.list();
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error listing paperwork:', error);
    return NextResponse.json(
      { error: 'Failed to list paperwork' },
      { status: 500 }
    );
  }
}
