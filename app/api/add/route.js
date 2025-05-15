import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server'; // Use Next.js server utilities
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const toolsFilePath = path.join(process.cwd(), 'tools.json');

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.title !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  if (req.method === 'POST') {
    try {
      const newTool = await req.json();

      // Check if required fields exist
      if (!newTool.name || !newTool.uses || !newTool.location || !newTool.image_path || !newTool.specs || !newTool.special_comments
        || !newTool.required_ppe || !newTool.required_training) {
        return NextResponse.json({ message: 'Missing required feilds' }, { status: 400 });
      }

      // Read the existing JSON file
      const fileData = fs.readFileSync(toolsFilePath, 'utf-8');
      const tools = JSON.parse(fileData);

      // Add the new tool to the list
      tools.push(newTool);

      // Write the updated tools back to the file
      fs.writeFileSync(toolsFilePath, JSON.stringify(tools, null, 2));

      return NextResponse.json(newTool, { status: 200 });
    } catch (error) {
      console.error('Error adding tool:', error);
      return NextResponse.json({ message: 'Failed to add tool' }, { status: 500 });

    }
  } else {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }
}
