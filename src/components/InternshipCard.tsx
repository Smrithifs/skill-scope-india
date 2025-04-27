
import { Link } from 'react-router-dom';
import { Internship } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

interface InternshipCardProps {
  internship: Internship;
}

const InternshipCard = ({ internship }: InternshipCardProps) => {
  // Format stipend for display
  const formatStipend = (stipend: number): string => {
    if (stipend >= 1000) {
      return `₹${(stipend / 1000).toFixed(1)}K/month`;
    }
    return `₹${stipend}/month`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate days left until deadline
  const getDaysLeft = (deadline: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const differenceInTime = deadlineDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const daysLeft = getDaysLeft(internship.deadline);

  return (
    <Link to={`/internship/${internship.id}`} className="block">
      <div className="internship-card bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {internship.companyLogo ? (
                <img
                  src={internship.companyLogo}
                  alt={`${internship.company} logo`}
                  className="w-10 h-10 rounded-md object-contain border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                  {internship.company.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{internship.title}</h3>
                <p className="text-sm text-gray-600">{internship.company}</p>
              </div>
            </div>
            <Badge variant={internship.isRemote ? "outline" : "secondary"}>
              {internship.isRemote ? "Remote" : "In Office"}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {internship.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-brand-50 text-brand-700 hover:bg-brand-100">
                {skill}
              </Badge>
            ))}
            {internship.skills.length > 3 && (
              <Badge variant="secondary" className="bg-brand-50 text-brand-700 hover:bg-brand-100">
                +{internship.skills.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              {`${internship.location.city}, ${internship.location.state}`}
            </div>
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              {`${internship.durationMonths} ${internship.durationMonths > 1 ? 'months' : 'month'}`}
            </div>
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              {`Apply by ${formatDate(internship.deadline)}`}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="text-brand-600 font-medium">
              {formatStipend(internship.stipend)}
            </div>
            <div className="text-sm">
              {daysLeft > 0 ? (
                <span className={`${daysLeft <= 3 ? 'text-red-500' : 'text-gray-600'}`}>
                  {daysLeft} days left
                </span>
              ) : (
                <span className="text-red-500">Deadline passed</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InternshipCard;
