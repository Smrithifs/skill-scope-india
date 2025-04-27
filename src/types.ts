
export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  category: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  location: Location;
  stipend: number;
  durationMonths: number;
  postedDate: string; // ISO date string
  deadline: string; // ISO date string
  isRemote: boolean;
  skills: string[];
  slots: number;
  applicationsCount: number;
  recruiterId: string;
}

export interface InternshipFilter {
  query?: string;
  category?: string;
  city?: string;
  state?: string;
  duration?: number;
  stipendMin?: number;
  stipendMax?: number;
  isRemote?: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  college?: string;
  degree?: string;
  graduationYear?: number;
  skills: string[];
  resume?: string;
  profilePicture?: string;
  applications: string[]; // IDs of applications
}

export interface Recruiter {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  companyLogo?: string;
  internships: string[]; // IDs of internships
}

export type ApplicationStatus = 'applied' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected';

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  applicationDate: string; // ISO date string
  coverLetter?: string;
  status: ApplicationStatus;
  recruiterId: string;
}
