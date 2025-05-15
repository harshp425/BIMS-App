import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server'; // Use Next.js server utilities
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


const usersFilePath = path.join(process.cwd(), 'users.json');

export async function POST(req) {

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  if (req.method === 'POST') {
    try {
      const newUser = await req.json();

      // Check if required fields exist
      if (!newUser.email) {
        return NextResponse.json({ message: 'Missing Email' }, { status: 400 });
      }

      // Read the existing JSON file
      const fileData = fs.readFileSync(usersFilePath, 'utf-8');
      const users = JSON.parse(fileData);

      const user_exists = users.some((obj) => obj.email === newUser.email);

      if (!user_exists) {
        // Add the new tool to the list
        users.push(newUser);
      } else {
        return NextResponse.json({ message: 'User Already Exists' });
      }

      // Write the updated tools back to the file
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

      return NextResponse.json(newUser, { status: 200 });
    } catch (error) {
      console.error('Error adding user:', error);
      return NextResponse.json({ message: 'Failed to add user' }, { status: 500 });

    }
  } else {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }
}
