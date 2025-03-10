import { NextResponse } from 'next/server';
import db from '@/db';
import { documents } from "@/db/schema";
import { generateEmbeddings } from '@/lib/embeddings';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sql } from 'drizzle-orm';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { query } = await req.json();
  
  try {
    // 1. Get query embedding
    const queryEmbedding = await generateEmbeddings(query);
    
    // 2. Vector search
    const results = await db
      .select()
      .from(documents)
      .orderBy(sql`${documents.embedding} <=> ${JSON.stringify(queryEmbedding)}`)
      .limit(5);

    // 3. Generate response
    const context = results.map(r => r.content).join('\n\n');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Generate a data structures and algorithms multiple choice (4 choices) question on the following:\nContext:\n${context}\n\nQuestion: ${query}\nAnswer: \nExplanation:`;
    
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return NextResponse.json({ answer, prompt });

  } catch (error) {
    return NextResponse.json(
      { error: 'Query processing failed' },
      { status: 500 }
    );
  }
}