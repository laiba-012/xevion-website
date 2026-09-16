import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Dashboard routes par Navbar/Footer hide karein
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/admin');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {!isDashboard && <Navbar />}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default Layout;