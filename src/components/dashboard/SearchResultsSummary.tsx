
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SearchResultsSummaryProps {
  count: number;
  query?: string;
  category?: string;
  isLoading: boolean;
  onFetchMore: () => void;
}

const SearchResultsSummary = ({ 
  count, 
  query, 
  category,
  isLoading,
  onFetchMore 
}: SearchResultsSummaryProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Found <span className="font-semibold">{count}</span> internships
          {query && ` matching "${query}"`}
          {category && category !== 'All' && ` in ${category}`}
        </p>
        <Button
          onClick={onFetchMore}
          disabled={isLoading}
          className="ml-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Search for More'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchResultsSummary;
