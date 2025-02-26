import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        status: 500,
      });
    }
    // Structure of the reponse from GEMINI
    const generationConfig = {
        temperature: 1,
        top_p: 0.95,
        top_k: 40,
        max_output_tokens: 8192,
        response_schema: {
          type: "array",
          items: {
            type: "object",
            required: ["question", "choices", "answer", "explanation"],
            properties: {
              "question": { type: "string" },
              choices: {
                type: "array",
                items: {
                  type: "string"
                },
              },
              answer: { type: "string" },
              explanation: { type: "string" },
            },
          },
        },
        response_mime_type: "application/json",
      };
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig  });

    //Prompt is currently hard coded and will reference the prompts from the database after retrieval
    const prompt = "Generate 5 multiple choice questions about identifying the result of an array function in python.";
    const result = await model.generateContent(prompt);



    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate quiz" }), {
      status: 500,
    });
  }
}