
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import InternshipCard from '@/components/InternshipCard';
import InternshipSearch from '@/components/InternshipSearch';
import InternshipFilter from '@/components/InternshipFilter';
import { InternshipFilter as FilterType } from '@/types';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { getFilteredInternships } = useData();

  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';
  const initialCategory = queryParams.get('category') || undefined;

  // Initialize filter state from query parameters
  const [filter, setFilter] = useState<FilterType>({
    query: initialQuery,
    category: initialCategory,
  });

  // Get filtered internships
  const internships = getFilteredInternships(filter);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setFilter({ ...filter, query });
    updateQueryParams({ ...filter, query });
  };

  // Handle filter changes
  const handleFilterChange = async (newFilter: FilterType) => {
    setFilter(newFilter);
    updateQueryParams(newFilter);
  };

  // Update URL query parameters
  const updateQueryParams = (newFilter: FilterType) => {
    const params = new URLSearchParams();
    if (newFilter.query) params.append('query', newFilter.query);
    if (newFilter.category && newFilter.category !== 'All') params.append('category', newFilter.category);
    if (newFilter.city && newFilter.city !== 'All') params.append('city', newFilter.city);
    if (newFilter.duration) params.append('duration', newFilter.duration.toString());
    if (newFilter.stipendMin) params.append('stipendMin', newFilter.stipendMin.toString());
    if (newFilter.stipendMax) params.append('stipendMax', newFilter.stipendMax.toString());
    if (newFilter.isRemote) params.append('isRemote', newFilter.isRemote.toString());
    
    navigate(`/student?${params.toString()}`);
  };

  // Function to fetch more internships from LinkedIn
  const fetchMoreInternships = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('linkedin-scraper', {
        body: { category: filter.category || '' }
      });

      if (error) throw error;

      toast({
        title: "New internships loaded!",
        description: `Found ${data.count} new internships.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Internships</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and interests</p>
        </div>
        
        {/* Search */}
        <div className="mb-8">
          <InternshipSearch onSearch={handleSearch} initialQuery={filter.query} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <div className="lg:w-1/4">
            <InternshipFilter onFilterChange={handleFilterChange} currentFilter={filter} />
          </div>
          
          {/* Internship listings */}
          <div className="lg:w-3/4">
            {/* Results summary */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Found <span className="font-semibold">{internships.length}</span> internships
                  {filter.query && ` matching "${filter.query}"`}
                  {filter.category && filter.category !== 'All' && ` in ${filter.category}`}
                </p>
                <Button
                  onClick={fetchMoreInternships}
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
            
            {/* Internship cards */}
            {internships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {internships.map(internship => (
                  <InternshipCard key={internship.id} internship={internship} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No internships found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters or click "Search for More" to find more opportunities.
                </p>
                <Button onClick={fetchMoreInternships} disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Search for More Internships'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
