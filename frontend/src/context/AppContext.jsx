import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'alert', 'docket', 'rules', 'newApplication'
  const [modalData, setModalData] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'detail', 'radar', 'audit'
  const [selectedAppId, setSelectedAppId] = useState(null);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const openModal = (type, data = null) => {
    setActiveModal(type);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const navigateTo = (view, appId = null) => {
    setCurrentView(view);
    if (appId) setSelectedAppId(appId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        refreshKey,
        triggerRefresh,
        toasts,
        showToast,
        activeModal,
        modalData,
        openModal,
        closeModal,
        currentView,
        selectedAppId,
        navigateTo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
