
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { InternshipFilter as FilterType } from '@/types';
import InternshipSearch from '@/components/InternshipSearch';
import InternshipFilter from '@/components/InternshipFilter';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SearchResultsSummary from '@/components/dashboard/SearchResultsSummary';
import InternshipGrid from '@/components/dashboard/InternshipGrid';

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
  const handleFilterChange = (newFilter: FilterType) => {
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
        <DashboardHeader />
        
        <div className="mb-8">
          <InternshipSearch onSearch={handleSearch} initialQuery={filter.query} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <InternshipFilter onFilterChange={handleFilterChange} currentFilter={filter} />
          </div>
          
          <div className="lg:w-3/4">
            <SearchResultsSummary 
              count={internships.length}
              query={filter.query}
              category={filter.category}
              isLoading={isLoading}
              onFetchMore={fetchMoreInternships}
            />
            
            <InternshipGrid 
              internships={internships}
              isLoading={isLoading}
              onFetchMore={fetchMoreInternships}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
