import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { ApplicationForm } from '@/components/ApplicationForm';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Building,
  MapPin, 
  Calendar, 
  Briefcase, 
  Users, 
  Clock,
  ArrowLeft
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const InternshipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { internships } = useData();
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  
  // Find the internship by ID
  const internship = internships.find(intern => intern.id === id);
  
  if (!internship) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Internship Not Found</h1>
        <p className="text-gray-600 mb-8">The internship you are looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/student">Browse Internships</Link>
        </Button>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  // Format stipend for display
  const formatStipend = (stipend: number): string => {
    if (stipend >= 1000) {
      return `₹${(stipend / 1000).toFixed(1)}K/month`;
    }
    return `₹${stipend}/month`;
  };
  
  // Calculate days left until deadline
  const getDaysLeft = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const differenceInTime = deadlineDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };
  
  const daysLeft = getDaysLeft(internship.deadline);
  
  // Handle dialog open/close
  const openApplicationModal = () => {
    setIsApplicationModalOpen(true);
  };
  
  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false);
  };
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="pl-0">
            <Link to="/student" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" /> Back to Internships
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {internship.companyLogo ? (
                      <img
                        src={internship.companyLogo}
                        alt={`${internship.company} logo`}
                        className="w-16 h-16 rounded-md object-contain border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
                        {internship.company.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{internship.title}</h1>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building className="h-4 w-4" />
                        {internship.company}
                      </div>
                    </div>
                  </div>
                  <Badge variant={internship.isRemote ? "outline" : "secondary"} className="self-start md:self-auto">
                    {internship.isRemote ? "Remote" : "In Office"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{internship.location.city}, {internship.location.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Posted on {formatDate(internship.postedDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>{internship.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About the Internship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{internship.description}</p>
                <div className="mt-6 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Key Responsibilities:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {internship.responsibilities.map((responsibility, index) => (
                      <li key={index} className="text-gray-700">{responsibility}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {internship.requirements.map((requirement, index) => (
                      <li key={index} className="text-gray-700">{requirement}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-brand-50 text-brand-700 hover:bg-brand-100">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply card */}
            <Card>
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
                <CardDescription>
                  Application deadline: {formatDate(internship.deadline)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-brand-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-700">Stipend</h4>
                    <span className="font-bold text-brand-700">{formatStipend(internship.stipend)}</span>
                  </div>
                  <Separator className="my-3 bg-brand-200" />
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-700">Duration</h4>
                    <span className="text-gray-700">{internship.durationMonths} months</span>
                  </div>
                  <Separator className="my-3 bg-brand-200" />
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-700">Slots</h4>
                    <span className="text-gray-700">{internship.slots} positions</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{internship.applicationsCount} applicants</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className={daysLeft <= 3 ? "text-red-500 font-medium" : ""}>
                      {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={daysLeft <= 0}
                  onClick={openApplicationModal}
                >
                  {daysLeft > 0 ? "Apply Now" : "Applications Closed"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Company card */}
            <Card>
              <CardHeader>
                <CardTitle>{internship.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {internship.companyLogo ? (
                    <img
                      src={internship.companyLogo}
                      alt={`${internship.company} logo`}
                      className="w-16 h-16 rounded-md object-contain border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
                      {internship.company.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{internship.company}</h4>
                    <p className="text-sm text-gray-600">{internship.category}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View Company Profile</Button>
              </CardContent>
            </Card>
            
            {/* Similar internships card */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Internships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {internships
                  .filter(i => i.id !== internship.id && i.category === internship.category)
                  .slice(0, 3)
                  .map(i => (
                    <Link to={`/internship/${i.id}`} key={i.id}>
                      <div className="p-3 hover:bg-gray-50 rounded-md -mx-3 transition-colors">
                        <h4 className="font-medium text-gray-900 mb-1">{i.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{i.company}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-brand-600 font-medium">{formatStipend(i.stipend)}</span>
                          <span className="text-gray-500">{i.location.city}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                {internships.filter(i => i.id !== internship.id && i.category === internship.category).length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                    <Link to={`/student?category=${internship.category}`}>
                      View More {internship.category} Internships
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Form */}
      {id && (
        <ApplicationForm 
          internshipId={id} 
          isOpen={isApplicationModalOpen} 
          onClose={closeApplicationModal} 
        />
      )}
    </div>
  );
};

export default InternshipDetails;
