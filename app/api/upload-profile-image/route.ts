import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { imageData, fileName } = await request.json();
    if (!imageData) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    // Clean up base64 string
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid base64 image data' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(matches[2], 'base64');
    
    // Generate clean safe name
    const timestamp = Date.now();
    const cleanFileName = fileName ? fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_') : 'image.png';
    const finalFileName = `uploaded_${timestamp}_${cleanFileName}`;
    
    // Write image file
    const publicImagesDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }
    
    const filePath = path.join(publicImagesDir, finalFileName);
    fs.writeFileSync(filePath, fileBuffer);

    // Update JSON list of uploaded profile images
    const jsonPath = path.join(process.cwd(), 'public', 'uploaded-profile-images.json');
    let uploadedList: string[] = [];
    if (fs.existsSync(jsonPath)) {
      try {
        uploadedList = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch (e) {
        uploadedList = [];
      }
    }
    
    // Add path to list
    const relativePath = `/images/${finalFileName}`;
    uploadedList.unshift(relativePath); // newest first
    fs.writeFileSync(jsonPath, JSON.stringify(uploadedList, null, 2));

    return NextResponse.json({ success: true, path: relativePath });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
