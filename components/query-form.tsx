"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { topicCategoryEnum } from "@/db/schema";

const QueryForm = () => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("python");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, language, category }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error querying:", error);
      setResult({ error: "Failed to generate question" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Enter a topic query (e.g., 'binary search algorithm')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="c++">C++</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category (Optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_CATEGORIES">All Categories</SelectItem>
              {Object.values(topicCategoryEnum.enumValues).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" disabled={!query || isLoading}>
          {isLoading ? "Generating..." : "Generate Question"}
        </Button>
      </form>
      
      {result && !result.error && (
        <div className="mt-6 p-4 border rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-2">Generated Question:</h3>
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded text-sm">
            {result.answer}
          </pre>
          
          {result.sources && result.sources.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Sources:</h4>
              <ul className="space-y-2 text-sm">
                {result.sources.map((source: any, index: number) => (
                  <li key={index} className="p-2 bg-gray-50 rounded">
                    <p>{source.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      From: {source.metadata.source}, Category: {source.metadata.category}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {result && result.error && (
        <div className="p-4 mt-4 bg-red-100 rounded-md">
          Error: {result.error}
        </div>
      )}
    </div>
  );
};

export default QueryForm;