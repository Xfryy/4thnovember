// app/api/assets/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Baca semua file dari folder public
    const publicDir = path.join(process.cwd(), 'public');
    const assets: string[] = [];
    
    function walkDir(dir: string, baseDir: string = '') {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        const relativePath = path.join(baseDir, file).replace(/\\/g, '/');
        
        if (stat.isDirectory()) {
          walkDir(fullPath, relativePath);
        } else {
          // Hanya include file gambar dan audio
          const ext = path.extname(file).toLowerCase();
          const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
          const audioExts = ['.mp3', '.wav', '.ogg', '.m4a'];
          
          if (imageExts.includes(ext) || audioExts.includes(ext)) {
            assets.push(`/${relativePath}`);
          }
        }
      }
    }
    
    walkDir(publicDir);
    
    return NextResponse.json({ 
      assets,
      count: assets.length 
    });
  } catch (error) {
    console.error('Failed to scan assets:', error);
    return NextResponse.json(
      { error: 'Failed to scan assets' },
      { status: 500 }
    );
  }
}