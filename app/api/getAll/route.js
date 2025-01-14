import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const jsonFilePath = path.join(process.cwd(), 'tools.json');

// Helper function to read the JSON file
const readJsonFile = () => {
  try {
    const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return [];
  }
};

// API Route Handler for GET requests
export async function GET(req) {

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const tools = readJsonFile();

  const results = tools;

  return NextResponse.json(results, { status: 200 });
}

// Handle unsupported HTTP methods
export async function POST() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
