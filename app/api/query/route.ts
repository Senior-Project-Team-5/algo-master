import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { documents } from "@/db/schema";
import { generateEmbeddings } from '@/lib/embeddings';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sql } from 'drizzle-orm';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generationConfig = {
  temperature: 1,
  top_p: 0.90,
  top_k: 40,
  max_output_tokens: 8192,
  response_schema: {
    type: "object",
    properties: {
      question: {
        type: "string",
      },
      code: {
        type: "string",
      },
      choices: {
        type: "array",
        items: {
          type: "object",
          properties: {
            choice: {
              type: "string",
            },
            explanation: {
              type: "string",
            },
          },
          required: ["choice", "explanation"],
        },
      },
      answer: {
        type: "string",
      },
      explanation: {
        type: "string",
      },
      resources: {
        type: "string",
      },
    },
    required: [
      "question",
      "choices",
      "answer",
      "explanation",
      "resources",
    ],
  },
  response_mime_type: "application/json",
};

export async function POST(req: NextRequest) {
  const res = await req.json();
  const { query, language } = res; // Extract query and language from request body
  
  try {
    // 1. Get query embedding
    const queryEmbedding = await generateEmbeddings(query);
    
    // 2. Vector search
    const results = await db
      .select()
      .from(documents)
      .orderBy(sql`${documents.embedding} <=> ${JSON.stringify(queryEmbedding)}`)
      .limit(10);

    // 3. Generate response
    const context = results.map(r => r.content).join('\n\n');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', generationConfig });
    const prompt = `Generate 1 data structures and algorithms multiple choice (4 choices) question in the following style/format:
Programming Language (if question requires to show code): ${language}
Question on the topic: ${query}
Answer: 
Explanation: 
Resources (Link to a resource page):

and based on the following context:
Context:

${context}
`;
    
    const result = await model.generateContent(prompt);
    const answer = result.response.text();
    console.log(result.response);

    return NextResponse.json({ answer });

  } catch (error) {
    return NextResponse.json(
      { error: 'Query processing failed' },
      { status: 500 }
    );
  }
}