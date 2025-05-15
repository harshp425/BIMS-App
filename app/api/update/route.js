import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const toolsFilePath = path.join(process.cwd(), 'tools.json');

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.title !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  if (req.method === 'PUT') {
    try {
      // Parse the request body
      const { name, updates } = await req.json();

      // Validate request
      if (!name || typeof updates !== 'object') {
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
      }

      // Read tools from the file
      const fileData = fs.readFileSync(toolsFilePath, 'utf-8');
      const tools = JSON.parse(fileData);

      // Find the tool to update
      const toolIndex = tools.findIndex(tool => tool.name === name);
      if (toolIndex === -1) {
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
      }

      // Delete the old image if a new image is provided
      if (tools[toolIndex].image_path !== updates.image_path) {
        const fullPath = path.join(process.cwd(), 'public', tools[toolIndex].image_path);
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          console.log(`File deleted: ${fullPath}`);
        } else {
          console.log(`File not found: ${fullPath}`);
        }
      }

      // Update only specified fields
      tools[toolIndex] = { ...tools[toolIndex], ...updates };

      // Save changes back to the file
      fs.writeFileSync(toolsFilePath, JSON.stringify(tools, null, 2));

      return NextResponse.json({ message: 'Tool updated successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error updating tool:', error);
      return NextResponse.json({ message: 'Failed to update tool' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }
}
