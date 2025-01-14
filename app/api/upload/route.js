import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.title !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Create a safe filename
    const timestamp = Date.now();
    const originalName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
    const fileName = `${timestamp}-${originalName}`;

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Define the upload path
    const uploadDir = path.join(process.cwd(), 'public/images');
    const filePath = path.join(uploadDir, fileName);

    // Write the file
    await writeFile(filePath, buffer);

    // Return the public URL
    const fileUrl = `/images/${fileName}`;

    return NextResponse.json({
      success: true,
      fileUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};