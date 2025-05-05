"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

const languages = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "C#",
]

const LanguageSelector = () =>{
    const [selectedLanguage, setSelectedLanguage] = useState("Python");
    const [isInitialized, setIsInitialized] = useState(false);
      
    // Initial load from localStorage - only runs once
    useEffect(() => {
      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
      }
      setIsInitialized(true);
    }, []);
    
    // Update localStorage when language changes, but only after initialization
    useEffect(() => {
      if (isInitialized) {
        localStorage.setItem("language", selectedLanguage);
      }
    }, [selectedLanguage, isInitialized]);

    return(
        <div className="mb-8">
            <div className="max-w-xs mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Programming Language
                </label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                                {lang}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default LanguageSelector;