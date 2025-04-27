
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface InternshipSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const InternshipSearch = ({ onSearch, initialQuery = '' }: InternshipSearchProps) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for internships, companies, or skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-20 py-6 rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500"
        />
        <Button
          type="submit"
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-brand-500 hover:bg-brand-600"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default InternshipSearch;
