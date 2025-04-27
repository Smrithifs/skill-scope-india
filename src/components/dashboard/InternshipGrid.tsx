
import React from 'react';
import InternshipCard from '@/components/InternshipCard';
import { Button } from '@/components/ui/button';
import { Internship } from '@/types';

interface InternshipGridProps {
  internships: Internship[];
  isLoading: boolean;
  onFetchMore: () => void;
}

const InternshipGrid = ({ internships, isLoading, onFetchMore }: InternshipGridProps) => {
  if (internships.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No internships found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your search filters or click "Search for More" to find more opportunities.
        </p>
        <Button onClick={onFetchMore} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search for More Internships'}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {internships.map(internship => (
        <InternshipCard key={internship.id} internship={internship} />
      ))}
    </div>
  );
};

export default InternshipGrid;
