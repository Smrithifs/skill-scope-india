
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
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
