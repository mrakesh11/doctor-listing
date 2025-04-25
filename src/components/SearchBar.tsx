
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Doctor, SearchSuggestion } from "@/types/doctor";

interface SearchBarProps {
  doctors: Doctor[];
  onSearch: (query: string) => void;
  initialQuery: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ doctors, onSearch, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Generate suggestions based on input
    if (value.trim().length > 0) {
      // Convert the doctor objects to SearchSuggestion objects with string IDs
      const filteredSuggestions = doctors
        .filter(doctor => 
          doctor.name.toLowerCase().includes(value.toLowerCase())
        )
        .map(doctor => ({ id: doctor.id, name: doctor.name }))
        .slice(0, 3);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          data-testid="autocomplete-input"
          ref={inputRef}
          type="text"
          placeholder="Search for doctors by name"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim().length > 0 && setShowSuggestions(true)}
          className="pl-10 py-2 w-full rounded-md border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionRef}
          className="absolute w-full bg-white mt-1 shadow-lg rounded-md z-10 border border-gray-200"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              data-testid="suggestion-item"
              className="px-4 py-2 hover:bg-secondary cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
