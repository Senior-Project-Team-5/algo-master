// app/api/generate-graph-question/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }
    
    // Structure of the response from GEMINI for graph questions
    const generationConfig = {
      temperature: 1,
      top_p: 0.95,
      top_k: 40,
      max_output_tokens: 8192,
      response_schema: {
        type: "object",
        properties: {
          question: { type: "string", description: "The question about the graph structure" },
          nodes: {
            type: "array",
            items: {
              type: "object",
              properties: { id: { type: "string" }, label: { type: "string" } },
              required: ["id", "label"],
            },
          },
          edges: {
            type: "array",
            items: {
              type: "object",
              properties: { source: { type: "string" }, target: { type: "string" }, weight: { type: "number" } },
              required: ["source", "target"],
            },
          },
          choices: {
            type: "array",
            items: {
              type: "object",
              properties: { choice: { type: "string" }, explanation: { type: "string" } },
              required: ["choice", "explanation"],
            },
          },
          answer: { type: "string" },
          explanation: { type: "string" },
          resources: { type: "string" },
        },
        required: ["question", "nodes", "edges", "choices", "answer", "explanation", "resources"],
      },
      response_mime_type: "application/json",
    };
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
    });

    // Prompt for graph diagram questions
    const prompt = `Generate a graph theory question. The question should be about traversing, searching, or analyzing the graph structure. Include the graph structure as nodes and edges. The graph should have 5-8 nodes with meaningful labels. The question should be related to concepts like shortest path, graph traversal, or minimum spanning tree.`;
    
    const result = await model.generateContent(prompt);
    
    // Extract the response content
    const jsonResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsedResponse;
    try {
      // Remove the triple backticks and parse the JSON string
      const cleanedJson = jsonResponse.replace(/^```json\n/, "").replace(/\n```$/, "");
      parsedResponse = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", jsonResponse);
      return NextResponse.json({ error: "Failed to parse question data from API" }, { status: 500 });
    }
    
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate graph question" }, { status: 500 });
  }
}
