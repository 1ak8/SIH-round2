import React from 'react';
import { useAuth } from '../context/AuthContext';
import CollegeDashboard from '../components/college/CollegeDashboard';
import RODashboard from '../components/ro/RODashboard';
import EVCDashboard from '../components/evc/EVCDashboard';
import HQDashboard from '../components/hq/HQDashboard';

export const DashboardPage = () => {
  const { activeRole } = useAuth();

  switch (activeRole) {
    case 'college':
      return <CollegeDashboard />;
    case 'ro':
      return <RODashboard />;
    case 'evc':
      return <EVCDashboard />;
    case 'hq':
      return <HQDashboard />;
    default:
      return <CollegeDashboard />;
  }
};

export default DashboardPage;
