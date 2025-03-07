// lib/embeddings.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateEmbeddings(
  text: string,
  modelName: string = 'text-embedding-004'
): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;
    
    if (!embedding || embedding.length === 0) {
      throw new Error('No embeddings returned from Gemini');
    }
    
    return embedding;
    
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw new Error('Failed to generate embeddings');
  }
}