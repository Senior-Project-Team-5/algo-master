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
    Generate a multiple choice question about "${query}" in ${language} programming language.

    ${context.length > 100 ? `CONTEXT INFORMATION:
    The following information from our knowledge base may be helpful:

    ${context}

    Use this context ONLY if it contains information directly relevant to "${query}". If the context is not relevant to the specific query, generate a question based on your own knowledge.` : `No specific context is available for this query. Create a question based on your knowledge of ${query}.`}
    IMPORTANT FORMATTING REQUIREMENTS:
    - The "question" field must contain ONLY the text of the question without code snippets
    - If your question refers to code, place ALL code in the "code" field and refer to it as "the code below" in your question
    - Never embed code blocks (using \`\`\`) within the question text itself

    CONTENT REQUIREMENTS:
    - Focus on ${questionFocus} aspects of "${query}"
    - If the ${context} is in a different language, ensure the question is converted to ${language}
    - Create a multiple choice question with EXACTLY 4 answer choices labeled A, B, C, and D
    - CRITICAL: Ensure EXACTLY ONE answer choice is correct
    - Make the question challenging but fair for an intermediate programmer
    - Make answer choices distinct and non-overlapping
    - For each answer choice, provide a detailed explanation of why it is correct or incorrect
    - Include 1-2 useful resources or references for further learning

    ANSWER FORMAT REQUIREMENTS:
    - In the "answer" field, make to include the entire correct answer choice, including the letter and text
    - Double-check that your correct answer actually appears in the choices
    - Verify that your explanations for correct/incorrect answers are consistent with your chosen answer

    QUALITY CONTROL:
    - Read through your complete question and answer one more time
    - Verify there is exactly one correct answer that clearly matches your explanation
    - Ensure the question tests understanding of ${query} rather than general programming knowledge
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