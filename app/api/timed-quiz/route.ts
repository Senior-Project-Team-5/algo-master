// app/api/timed-quiz/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import db from "@/db";
import { userProgressTable, topicsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Question focus types to cycle through (same as your original)
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { language = 'python' } = body;
    
    // Get completed topics for the user
    const completedProgress = await db.query.userProgressTable.findMany({
      where: and(
        eq(userProgressTable.userID, userId),
        eq(userProgressTable.completed, true)
      ),
    });
    
    if (completedProgress.length === 0) {
      return NextResponse.json({ 
        error: "No completed topics found. Please complete topics in the roadmap first." 
      }, { status: 400 });
    }
    
    // Get the topic sections
    const completedSectionIds = completedProgress.map(p => p.topic_section);
    
    // Get random topic from completed sections
    const randomIndex = Math.floor(Math.random() * completedSectionIds.length);
    const randomSectionId = completedSectionIds[randomIndex];
    
    // Get topic details
    const topicDetails = await db.query.topicsTable.findFirst({
      where: eq(topicsTable.section_id, randomSectionId)
    });
    
    if (!topicDetails) {
      return NextResponse.json({ error: "Topic details not found" }, { status: 500 });
    }
    
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
      filter: { category: topicDetails.topic_category },
    });
    
    // Search for relevant documents
    const queryEmbedding = await embeddings.embedQuery(topicDetails.section_name);
    const results = await vectorStore.similaritySearch(topicDetails.section_name, 10);
    
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
    Generate a multiple choice question about "${topicDetails.section_name}" in ${language} programming language.

    ${context.length > 100 ? `CONTEXT INFORMATION:
    The following information from our knowledge base may be helpful:

    ${context}

    Use this context ONLY if it contains information directly relevant to "${topicDetails.section_name}". If the context is not relevant to the specific query, generate a question based on your own knowledge.` : `No specific context is available for this query. Create a question based on your knowledge of ${topicDetails.section_name}.`}
    
    IMPORTANT FORMATTING REQUIREMENTS:
    - The "question" field must contain ONLY the text of the question without code snippets
    - If your question refers to code, place ALL code in the "code" field and refer to it as "the code below" in your question
    - Never embed code blocks (using \`\`\`) within the question text itself

    CONTENT REQUIREMENTS:
    - Focus on ${questionFocus} aspects of "${topicDetails.section_name}"
    - If the ${context} is in a different language, ensure the question is converted to ${language}
    - Create a multiple choice question with EXACTLY 4 answer choices labeled A, B, C, and D
    - CRITICAL: Ensure EXACTLY ONE answer choice is correct
    - Make the question challenging but fair for an intermediate programmer
    - Make answer choices distinct and non-overlapping
    - For each answer choice, provide a detailed explanation of why it is correct or incorrect
    - Include a useful & valid resource or reference to ${language} docs for further learning. Format-> { resources: <url> }

    ANSWER FORMAT REQUIREMENTS:
    - In the "answer" field, make to include the entire correct answer choice, including the letter and text
    - Double-check that your correct answer actually appears in the choices
    - Verify that your explanations for correct/incorrect answers are consistent with your chosen answer

    QUALITY CONTROL:
    - Read through your complete question and answer one more time
    - Verify there is exactly one correct answer that clearly matches your explanation
    - Ensure the question tests understanding of ${topicDetails.section_name} rather than general programming knowledge
    `;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
      const parsedResponse = JSON.parse(responseText);
      
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
      topicName: topicDetails.section_name,
      topicCategory: topicDetails.topic_category,
      sources: results.map(doc => ({
        content: doc.pageContent.substring(0, 150) + "...",
        metadata: doc.metadata
      }))
    });
  } catch (error) {
    console.error("Error in timed quiz API:", error);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}