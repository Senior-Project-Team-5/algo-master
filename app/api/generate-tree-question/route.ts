import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
    Generate a binary search tree question for a data structures quiz.
    
    Return ONLY a valid JSON object with this exact structure:
    {
      "question": "A clear question about the tree structure",
      "nodes": [
        {"id": "node1", "value": 50, "left": "node2", "right": "node3"},
        {"id": "node2", "value": 25, "left": "node4", "right": "node5"},
        ...more nodes...
      ],
      "choices": [
        {"choice": "Option A", "explanation": "Why A might be correct or incorrect"},
        {"choice": "Option B", "explanation": "Why B might be correct or incorrect"},
        {"choice": "Option C", "explanation": "Why C might be correct or incorrect"},
        {"choice": "Option D", "explanation": "Why D might be correct or incorrect"}
      ],
      "answer": "The exact text of the correct choice",
      "explanation": "Detailed explanation of the correct answer"
    }

    Make sure:
    1. The tree has 7-10 nodes
    2. Each node has a numeric value
    3. Child references use the node id or null if no child
    4. The question tests understanding of tree traversal, searching, or tree properties
    5. Include exactly 4 answer choices
    6. All fields are present and properly formatted
    `;

    const result = await model.generateContent(prompt);
    
    if (!result.response) {
      console.error("No response from Gemini API");
      return NextResponse.json({ error: "No response from Gemini API" }, { status: 500 });
    }

    // Check Gemini API response format
    console.log("Raw Gemini API response:", JSON.stringify(result, null, 2));

    const jsonResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsedResponse;
    try {
    // Remove the triple backticks and parse the JSON string
    const cleanedJson = jsonResponse.replace(/^```json\n/, "").replace(/\n```$/, "");
    parsedResponse = JSON.parse(cleanedJson);
    } catch (parseError) {
    console.error("Error parsing Gemini response:", jsonResponse);
    return NextResponse.json({ error: "Failed to parse question data from API" }, { status: 500 });
    }


    // Validate required fields
    if (
      !parsedResponse.question || !parsedResponse.nodes || 
      !parsedResponse.choices || !parsedResponse.answer || !parsedResponse.explanation
    ) {
      return NextResponse.json({ error: "Response missing required fields" }, { status: 500 });
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate tree question: " + (error as Error).message },
      { status: 500 }
    );
  }
}