import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server'; // Use Next.js server utilities
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const toolsFilePath = path.resolve(process.cwd(), 'tools.json');  // Path to your JSON file

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.title !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  if (req.method === 'DELETE') {
    const { searchParams } = new URL(req.url);
    const toolName = searchParams.get('toolName')?.toLowerCase();
    if (!toolName) {
      return NextResponse.json({ message: 'Tool name is required' }, { status: 400 });
    }

    try {
      // Read the existing JSON file
      const fileData = fs.readFileSync(toolsFilePath, 'utf-8');
      const tools = JSON.parse(fileData);

      // Store the tool object 
      const toolToDelete = tools.filter(tool => tool.name.toLowerCase() == toolName);

      // Filter out the tool that matches the toolName
      const updatedTools = tools.filter(tool => tool.name.toLowerCase() !== toolName);

      // If the filtered tools are the same, it means the tool wasn't found
      if (updatedTools.length === tools.length) {
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
      }

      // Write the updated array back to the JSON file
      fs.writeFileSync(toolsFilePath, JSON.stringify(updatedTools, null, 2));


      // Delete the image of the tool
      const toolImagePath = toolToDelete[0]['image_path']
      try {
        const fullPath = path.join(process.cwd(), 'public', toolImagePath);
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          console.log(`File deleted: ${fullPath}`);
        } else {
          console.log(`File not found: ${fullPath}`);
        }
      } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
      }

      return NextResponse.json({ message: 'Tool deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error reading or writing to the JSON file:', error);
      return NextResponse.json({ message: 'Error processing the request' }, { status: 500 });
    }

  } else {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }
}
