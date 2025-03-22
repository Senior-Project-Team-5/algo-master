import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function processPDF(fileBuffer: Buffer, filename: string, category: string) {
  try {
    // Create a Blob from the buffer
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    
    // Load the PDF
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    
    // Split the documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);
    
    // Add metadata about the document source and category
    const processedDocs = splitDocs.map(doc => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        source: filename,
        category: category, // e.g., "ARRAYS_AND_STRINGS"
      }
    }));
    
    // Generate embeddings and store in Supabase
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
      modelName: "embedding-001", // Use the current Gemini embedding model
    });
    
    await SupabaseVectorStore.fromDocuments(
      processedDocs,
      embeddings,
      {
        client: supabaseClient,
        tableName: "documents",
        queryName: "match_documents",
      }
    );
    
    return { success: true, count: processedDocs.length };
  } catch (error) {
    console.error("Error processing PDF:", error);
    return { success: false, error };
  }
}