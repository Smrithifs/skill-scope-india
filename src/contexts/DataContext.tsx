
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Internship, 
  InternshipFilter, 
  Student, 
  Recruiter,
  Application
} from '@/types';
import { mockInternships, mockApplications, mockStudents, mockRecruiters } from '@/data/mockData';

interface DataContextType {
  internships: Internship[];
  applications: Application[];
  students: Student[];
  recruiters: Recruiter[];
  addInternship: (internship: Internship) => void;
  updateInternship: (id: string, updates: Partial<Internship>) => void;
  deleteInternship: (id: string) => void;
  addApplication: (application: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  registerStudent: (student: Student) => void;
  registerRecruiter: (recruiter: Recruiter) => void;
  getFilteredInternships: (filter: InternshipFilter) => Internship[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with mock data
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);

  // Load initial data from localStorage or use mock data
  useEffect(() => {
    const storedInternships = localStorage.getItem('internships');
    const storedApplications = localStorage.getItem('applications');
    const storedStudents = localStorage.getItem('students');
    const storedRecruiters = localStorage.getItem('recruiters');

    setInternships(storedInternships ? JSON.parse(storedInternships) : mockInternships);
    setApplications(storedApplications ? JSON.parse(storedApplications) : mockApplications);
    setStudents(storedStudents ? JSON.parse(storedStudents) : mockStudents);
    setRecruiters(storedRecruiters ? JSON.parse(storedRecruiters) : mockRecruiters);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('internships', JSON.stringify(internships));
    localStorage.setItem('applications', JSON.stringify(applications));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('recruiters', JSON.stringify(recruiters));
  }, [internships, applications, students, recruiters]);

  // CRUD operations for internships
  const addInternship = (internship: Internship) => {
    setInternships([...internships, internship]);
  };

  const updateInternship = (id: string, updates: Partial<Internship>) => {
    setInternships(
      internships.map(internship => 
        internship.id === id ? { ...internship, ...updates } : internship
      )
    );
  };

  const deleteInternship = (id: string) => {
    setInternships(internships.filter(internship => internship.id !== id));
  };

  // CRUD operations for applications
  const addApplication = (application: Application) => {
    setApplications([...applications, application]);
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications(
      applications.map(application => 
        application.id === id ? { ...application, ...updates } : application
      )
    );
  };

  const deleteApplication = (id: string) => {
    setApplications(applications.filter(application => application.id !== id));
  };

  // Registration operations
  const registerStudent = (student: Student) => {
    setStudents([...students, student]);
  };

  const registerRecruiter = (recruiter: Recruiter) => {
    setRecruiters([...recruiters, recruiter]);
  };

  // Filter internships based on criteria
  const getFilteredInternships = (filter: InternshipFilter): Internship[] => {
    return internships.filter(internship => {
      // Always filter for India
      if (internship.location.country !== 'India') {
        return false;
      }

      // Filter by category if specified
      if (filter.category && filter.category !== 'All' && internship.category !== filter.category) {
        return false;
      }

      // Filter by city if specified
      if (filter.city && filter.city !== 'All' && internship.location.city !== filter.city) {
        return false;
      }

      // Filter by duration if specified
      if (filter.duration && internship.durationMonths > filter.duration) {
        return false;
      }

      // Filter by stipend range if specified
      if (filter.stipendMin !== undefined && internship.stipend < filter.stipendMin) {
        return false;
      }
      
      if (filter.stipendMax !== undefined && internship.stipend > filter.stipendMax) {
        return false;
      }

      // Filter by search query if specified (check title, company, description)
      if (filter.query) {
        const query = filter.query.toLowerCase();
        return (
          internship.title.toLowerCase().includes(query) || 
          internship.company.toLowerCase().includes(query) || 
          internship.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  };

  return (
    <DataContext.Provider
      value={{
        internships,
        applications,
        students,
        recruiters,
        addInternship,
        updateInternship,
        deleteInternship,
        addApplication,
        updateApplication,
        deleteApplication,
        registerStudent,
        registerRecruiter,
        getFilteredInternships,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
