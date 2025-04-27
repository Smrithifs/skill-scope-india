
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import InternshipCard from '@/components/InternshipCard';
import InternshipSearch from '@/components/InternshipSearch';
import InternshipFilter from '@/components/InternshipFilter';
import { InternshipFilter as FilterType } from '@/types';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="text-sm border-none bg-transparent font-medium text-gray-700 focus:outline-none">
                    <option value="recent">Most Recent</option>
                    <option value="stipend">Highest Stipend</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
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
                  Try adjusting your search filters or explore different categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
