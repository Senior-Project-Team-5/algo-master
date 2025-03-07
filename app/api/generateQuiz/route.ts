import { GoogleGenerativeAI } from "@google/generative-ai";

interface GenerationConfig {
  temperature: number;
  top_p: number;
  top_k: number;
  max_output_tokens: number;
  response_schema: {
    type: string;
    items: {
      type: string;
      required: string[];
      properties: {
        question: { type: string };
        choices: {
          type: string;
          items: {
            type: string;
          };
        };
        answer: { type: string };
        explanation: { type: string };
      };
    };
  };
  response_mime_type: string;
}

interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export async function POST(req: Request) {
  try {
    const apiKey: string | undefined = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        status: 500,
      });
    }
    // Structure of the reponse from GEMINI
    const generationConfig: GenerationConfig = {
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

    const prompt: string = "Generate 5 multiple choice questions about identifying the result of an array function in python.";
    const result = await model.generateContent(prompt);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate quiz" }), {
      status: 500,
    });
  }
}