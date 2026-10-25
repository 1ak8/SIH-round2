import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('aicte_is_logged_in') === 'true';
  });

  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('aicte_active_role') || 'college';
  });

  const roleProfiles = {
    college: {
      name: 'Dr. Ramesh Chandra (Principal)',
      email: 'college@gmail.com',
      role: 'college',
      institutionName: 'Apex Institute of Technology, Bhopal',
      region: 'Central',
      designation: 'Principal & Head of Institution',
      phone: '+91-98260-11223',
    },
    ro: {
      name: 'Dr. A. K. Sharma',
      email: 'ro@gmail.com',
      role: 'ro',
      institutionName: 'AICTE Western Regional Office, Mumbai',
      region: 'Western',
      designation: 'Regional Officer & Bureau Head',
      phone: '+91-98190-44556',
    },
    evc: {
      name: 'Prof. S. N. Deshmukh',
      email: 'evc@gmail.com',
      role: 'evc',
      institutionName: 'National Institute of Technology (AICTE Nominee)',
      region: 'Central',
      designation: 'Chairman, Expert Visit Committee',
      phone: '+91-94250-77889',
    },
    hq: {
      name: 'Dr. Abhay Jere / Member Secretary',
      email: 'admin@gmail.com',
      role: 'hq',
      institutionName: 'AICTE Headquarters, Nelson Mandela Marg, New Delhi',
      region: 'Pan-India',
      designation: 'Member Secretary & Chief Approving Authority',
      phone: '+91-11-2958-1000',
    },
  };

  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('aicte_active_role') || 'college';
    return roleProfiles[savedRole];
  });

  const [demoAccounts, setDemoAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDemoAccounts();
  }, []);

  const fetchDemoAccounts = async () => {
    try {
      const res = await authAPI.getDemoAccounts();
      if (res.data?.success) {
        setDemoAccounts(res.data.accounts);
      }
    } catch (err) {
      console.warn('Could not fetch demo accounts, using local presets:', err.message);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data?.success) {
        const loggedUser = res.data.user;
        const role = loggedUser.role || 'college';
        
        localStorage.setItem('aicte_token', res.data.token || 'demo_token');
        localStorage.setItem('aicte_active_role', role);
        localStorage.setItem('aicte_is_logged_in', 'true');

        setUser(roleProfiles[role] || loggedUser);
        setActiveRole(role);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err) {
      // Fallback matching for demo resilience
      const matchedProfile = Object.values(roleProfiles).find(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      );
      if (matchedProfile && (password === 'aicte123' || password.length >= 4)) {
        localStorage.setItem('aicte_token', 'demo_jwt_token_pravah');
        localStorage.setItem('aicte_active_role', matchedProfile.role);
        localStorage.setItem('aicte_is_logged_in', 'true');

        setUser(matchedProfile);
        setActiveRole(matchedProfile.role);
        setIsAuthenticated(true);
        return { success: true };
      }

      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    if (!roleProfiles[role]) return;
    localStorage.setItem('aicte_token', `demo_jwt_token_${role}`);
    localStorage.setItem('aicte_active_role', role);
    localStorage.setItem('aicte_is_logged_in', 'true');

    setUser(roleProfiles[role]);
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('aicte_token');
    localStorage.removeItem('aicte_active_role');
    localStorage.removeItem('aicte_is_logged_in');
    setIsAuthenticated(false);
    setUser(roleProfiles.college);
    setActiveRole('college');
  };

  const switchRole = (newRole) => {
    if (!roleProfiles[newRole]) return;
    setActiveRole(newRole);
    localStorage.setItem('aicte_active_role', newRole);
    setUser(roleProfiles[newRole]);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        activeRole,
        login,
        quickLogin,
        logout,
        switchRole,
        demoAccounts,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
