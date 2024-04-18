import { NextResponse } from 'next/server';
 
export async function GET() {
  return NextResponse.json({ message: 'Hello - GET' });
}

export async function POST() {
  return NextResponse.json({ message: 'Hello - POST' });
}

export async function PUT() {
  return NextResponse.json({ message: 'Hello - PUT' });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Hello - DELETE' });
}