import { NextResponse } from 'next/server';
import db from '@/db';
import { documents } from '@/db/schema';
import { generateEmbeddings } from '@/lib/embeddings';

function splitTextIntoChunks(text: string, chunkSize = 1000, overlap = 200): string[] {
  // Guard against empty text
  if (!text || text.length === 0) {
    return [];
  }
  
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    // Ensure start always moves forward by using max
    start = Math.max(end - overlap, start + 1);
    
    // Break the loop if we've reached the end
    if (end === text.length) break;
  }
  
  return chunks;
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid content format' },
        { status: 400 }
      );
    }

    const chunks = splitTextIntoChunks(content);
    
    // Process chunks in parallel
    const insertionPromises = chunks.map(async (chunk) => {
      const embedding = await generateEmbeddings(chunk);
      return db.insert(documents).values({
        content: chunk,
        embedding: embedding
      });
    });

    await Promise.all(insertionPromises);
    
    return NextResponse.json(
      { success: true, chunks: chunks.length },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Ingestion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}