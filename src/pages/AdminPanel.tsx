
import { useState } from "react";
import { useData } from '@/contexts/DataContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { internships, students, recruiters, applications } = useData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("internships");

  const handleExportData = (dataType: string) => {
    let dataToExport;
    
    switch (dataType) {
      case 'internships':
        dataToExport = internships;
        break;
      case 'students':
        dataToExport = students;
        break;
      case 'recruiters':
        dataToExport = recruiters;
        break;
      case 'applications':
        dataToExport = applications;
        break;
      default:
        dataToExport = [];
    }
    
    // Create a JSON blob and download it
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data has been exported.`,
    });
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

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Manage and view all data for SkillScopeIndia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Internships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{internships.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Recruiters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recruiters.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="internships" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="internships">Internships</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="recruiters">Recruiters</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            
            <Button onClick={() => handleExportData(activeTab)}>
              Export {activeTab} Data
            </Button>
          </div>
          
          <TabsContent value="internships">
            <Card>
              <CardHeader>
                <CardTitle>All Internships</CardTitle>
                <CardDescription>
                  View and manage all internship listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Stipend</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {internships.map((internship) => (
                        <TableRow key={internship.id}>
                          <TableCell className="font-medium">{internship.id}</TableCell>
                          <TableCell>{internship.title}</TableCell>
                          <TableCell>{internship.company}</TableCell>
                          <TableCell>{internship.location.city}</TableCell>
                          <TableCell>₹{internship.stipend}</TableCell>
                          <TableCell>{formatDate(internship.postedDate)}</TableCell>
                          <TableCell>{formatDate(internship.deadline)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              new Date(internship.deadline) < new Date() ? "secondary" : "default"
                            }>
                              {new Date(internship.deadline) < new Date() ? "Closed" : "Active"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>All Students</CardTitle>
                <CardDescription>
                  View and manage all student accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Skills</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.phone}</TableCell>
                          <TableCell>{student.college}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {student.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recruiters">
            <Card>
              <CardHeader>
                <CardTitle>All Recruiters</CardTitle>
                <CardDescription>
                  View and manage all recruiter accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Position</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recruiters.map((recruiter) => (
                        <TableRow key={recruiter.id}>
                          <TableCell className="font-medium">{recruiter.id}</TableCell>
                          <TableCell>{recruiter.name}</TableCell>
                          <TableCell>{recruiter.email}</TableCell>
                          <TableCell>{recruiter.phone}</TableCell>
                          <TableCell>{recruiter.company}</TableCell>
                          <TableCell>{recruiter.position}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>
                  View and manage all internship applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Internship ID</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Date Applied</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.id}</TableCell>
                          <TableCell>{application.internshipId}</TableCell>
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
                        </TableRow>
                      ))}
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

export default AdminPanel;
