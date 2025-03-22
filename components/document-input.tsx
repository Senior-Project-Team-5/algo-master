"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { topicCategoryEnum } from "@/db/schema";

const DocumentInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category) return;

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading document:", error);
      setResult({ success: false, error: "Failed to upload document" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />
      </div>
      
      <div>
        <Select 
          value={category || undefined} 
          onValueChange={setCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select topic category" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(topicCategoryEnum.enumValues).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" disabled={!file || !category || isUploading}>
        {isUploading ? "Uploading..." : "Upload Document"}
      </Button>
      
      {result && (
        <div className={`p-4 mt-4 rounded-md ${result.success ? "bg-green-100" : "bg-red-100"}`}>
          {result.success 
            ? `Successfully processed ${result.count} chunks from the document.` 
            : `Error: ${result.error}`}
        </div>
      )}
    </form>
  );
};

export default DocumentInput;