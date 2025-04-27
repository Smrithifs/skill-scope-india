
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import Header from './Header';
import Footer from './Footer';
import { useData } from '@/contexts/DataContext';

const Layout = () => {
  // Use the useEffect hook to update the deadline dates when the component mounts
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Fix deadlines only once when the app starts
    if (!isInitialized) {
      const fixInternshipDeadlines = () => {
        const data = localStorage.getItem('internships');
        if (data) {
          try {
            const internships = JSON.parse(data);
            
            // Update all deadlines to be in the future
            const updatedInternships = internships.map(internship => {
              // Set deadline to 30 days from now
              const deadline = new Date();
              deadline.setDate(deadline.getDate() + 30);
              
              return {
                ...internship,
                deadline: deadline.toISOString().split('T')[0]
              };
            });
            
            // Save back to localStorage
            localStorage.setItem('internships', JSON.stringify(updatedInternships));
          } catch (error) {
            console.error('Error fixing internship deadlines:', error);
          }
        }
      };
      
      fixInternshipDeadlines();
      setIsInitialized(true);
    }
  }, [isInitialized]);
  
  return (
    <DataProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </DataProvider>
  );
};

export default Layout;
