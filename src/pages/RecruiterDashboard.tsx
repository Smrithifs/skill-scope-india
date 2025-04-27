
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, ArrowUp, ArrowDown } from "lucide-react";

// Mock data for dashboard (would come from actual data in real implementation)
const mockRecruiter = {
  id: '1',
  name: 'Vikram Mehta',
  company: 'TechSolutions India',
};

const RecruiterDashboard = () => {
  const { internships, applications } = useData();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Filter data for this recruiter
  const recruiterInternships = internships.filter(internship => internship.recruiterId === mockRecruiter.id);
  const recruiterApplications = applications.filter(application => application.recruiterId === mockRecruiter.id);
  
  // Get statistics
  const totalInternships = recruiterInternships.length;
  const totalApplications = recruiterApplications.length;
  const openInternships = recruiterInternships.filter(internship => 
    new Date(internship.deadline) >= new Date()
  ).length;
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Welcome header */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {mockRecruiter.name}</h1>
              <p className="text-gray-600">{mockRecruiter.company}</p>
            </div>
            <Button asChild>
              <Link to="/post-internship">Post New Internship</Link>
            </Button>
          </div>
        </div>
        
        {/* Dashboard stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Internships</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInternships}</div>
              <p className="text-xs text-gray-500 mt-1">
                {openInternships} currently open
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-gray-500 mt-1">
                {recruiterApplications.filter(app => app.status === 'applied').length} new applications
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Application Rate</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalInternships > 0 ? (totalApplications / totalInternships).toFixed(1) : 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Applications per internship
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main dashboard content */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent internships */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Internships</CardTitle>
                  <CardDescription>Your recently posted internship opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recruiterInternships.slice(0, 3).map(internship => (
                      <div key={internship.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{internship.title}</h4>
                          <p className="text-sm text-gray-500">Posted: {formatDate(internship.postedDate)}</p>
                        </div>
                        <Badge variant={
                          new Date(internship.deadline) < new Date() ? "destructive" : "outline"
                        }>
                          {new Date(internship.deadline) < new Date() ? "Closed" : "Active"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("internships")}>
                    View All Internships
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Recent applications */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest candidate applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recruiterApplications.slice(0, 3).map(application => {
                      const internship = internships.find(i => i.id === application.internshipId);
                      return (
                        <div key={application.id} className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {internship ? internship.title : "Unknown Internship"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Applied: {formatDate(application.applicationDate)}
                            </p>
                          </div>
                          <Badge variant={
                            application.status === 'applied' ? "secondary" :
                            application.status === 'shortlisted' ? "outline" :
                            application.status === 'selected' ? "default" : "destructive"
                          }>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("applications")}>
                    View All Applications
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild>
                  <Link to="/post-internship">Post New Internship</Link>
                </Button>
                <Button variant="outline">Review Applications</Button>
                <Button variant="outline">Update Company Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="internships">
            <Card>
              <CardHeader>
                <CardTitle>My Internships</CardTitle>
                <CardDescription>Manage all your posted internship opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Posted Date</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recruiterInternships.map(internship => (
                        <TableRow key={internship.id}>
                          <TableCell className="font-medium">{internship.title}</TableCell>
                          <TableCell>{formatDate(internship.postedDate)}</TableCell>
                          <TableCell>{formatDate(internship.deadline)}</TableCell>
                          <TableCell>{internship.applicationsCount}</TableCell>
                          <TableCell>
                            <Badge variant={
                              new Date(internship.deadline) < new Date() ? "destructive" : "outline"
                            }>
                              {new Date(internship.deadline) < new Date() ? "Closed" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/internship/${internship.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <Link to="/post-internship">Post New Internship</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Internship Applications</CardTitle>
                <CardDescription>Manage candidate applications for your internships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Internship</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recruiterApplications.map(application => {
                        const internship = internships.find(i => i.id === application.internshipId);
                        return (
                          <TableRow key={application.id}>
                            <TableCell className="font-medium">
                              {internship ? internship.title : "Unknown Internship"}
                            </TableCell>
                            <TableCell>{application.studentId}</TableCell>
                            <TableCell>{formatDate(application.applicationDate)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                application.status === 'applied' ? "secondary" :
                                application.status === 'shortlisted' ? "outline" :
                                application.status === 'selected' ? "default" : "destructive"
                              }>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Review</Button>
                                <Button variant="ghost" size="sm">Update Status</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
