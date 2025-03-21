import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Question focus types to cycle through
const questionFocusTypes = [
  "implementation details and code structure",
  "time and space complexity analysis",
  "edge cases and error handling",
  "algorithm comparison and tradeoffs",
  "theoretical foundations",
  "practical applications"
];

const generationConfig = {
  temperature: 0.9,
  top_p: 0.95,
  top_k: 40,
  max_output_tokens: 8192,
  response_schema: {
    type: "object",
    properties: {
      question: { type: "string" },
      code: { type: "string" },
      choices: {
        type: "array",
        items: {
          type: "object",
          properties: {
            choice: { type: "string" },
            explanation: { type: "string" },
          },
          required: ["choice", "explanation"],
        },
      },
      answer: { type: "string" },
      explanation: { type: "string" },
      resources: { type: "string" },
    },
    required: ["question", "choices", "answer", "explanation", "resources"],
  },
  response_mime_type: "application/json",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, language = 'python', category } = body;
    
    // Select a random focus type
    const focusIndex = Math.floor(Math.random() * questionFocusTypes.length);
    const questionFocus = questionFocusTypes[focusIndex];
    
    // Create embeddings for the query
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
      modelName: "embedding-001",
    });
    
    // Create a Supabase vector store
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
      filter: category ? { category } : undefined,
    });
    
    // Search for relevant documents
    const queryEmbedding = await embeddings.embedQuery(query);
    const results = await vectorStore.similaritySearch(query, 10);
    
    // Construct context from the selected documents
    const context = results.map(doc => doc.pageContent).join("\n\n");
    
    // Generate the quiz question with RAG
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        ...generationConfig,
        temperature: 0.85 + (Math.random() * 0.15)
      },
    });
    
    const prompt = `
    Generate a data structures and algorithms multiple choice question about "${query}" in ${language} programming language.
    
    Use the following relevant information from our knowledge base to create a high-quality question, only if it is relevant to ${query}:
    
    ${context}
    
    IMPORTANT FORMATTING INSTRUCTIONS:
    - The "question" field should contain ONLY the text of the question, without any code snippets embedded in it
    - If your question refers to code, use phrases like "in the code above" or "in the provided code"
    - Put ALL code examples in the "code" field ONLY, not in the question text
    
    CONTENT INSTRUCTIONS:
    - Focus specifically on ${questionFocus} for this question
    - The question should test understanding of core concepts related to "${query}"
    - Provide 4 possible answers with one correct answer
    - Make each answer choice clear and distinct
    - Provide detailed explanations for why each answer is correct or incorrect
    - Include useful resources or references for further learning
    `;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
      const parsedResponse = JSON.parse(responseText);
      
      // Log for debugging
      console.log('QUESTION FOCUS:', questionFocus);
      console.log('QUESTION:', parsedResponse.question);
      console.log('CODE:', parsedResponse.code);
      console.log('CHOICES:', parsedResponse.choices.map(c => c.choice.substring(0, 30) + '...').join(' | '));
      console.log('ANSWER:', parsedResponse.answer);
      
      // Validate that the question doesn't contain code blocks
      if (parsedResponse.question.includes('```') && parsedResponse.code) {
        console.warn('Question still contains code blocks despite instructions');
      }
      
    } catch (parseError) {
      console.error('Error parsing response from Gemini:', parseError);
      console.log('Raw response:', responseText);
    }
    
    return NextResponse.json({
      answer: responseText,
      sources: results.map(doc => ({
        content: doc.pageContent.substring(0, 150) + "...",
        metadata: doc.metadata
      }))
    });
  } catch (error) {
    console.error("Error in query API:", error);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}