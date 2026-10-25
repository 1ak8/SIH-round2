import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DocumentsWatchdogPage from './pages/DocumentsWatchdogPage';
import AuditLogsPage from './pages/AuditLogsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import AlertDispatcherModal from './components/common/AlertDispatcherModal';
import ApprovalDocketModal from './components/common/ApprovalDocketModal';
import AICopilotModal from './components/common/AICopilotModal';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

const ToastContainer = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
            case 'error':
              return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
            default:
              return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
          }
        };

        const getBg = () => {
          switch (toast.type) {
            case 'success':
              return 'bg-emerald-50 border-emerald-300 text-emerald-900';
            case 'warning':
              return 'bg-amber-50 border-amber-300 text-amber-900';
            case 'error':
              return 'bg-rose-50 border-rose-300 text-rose-900';
            default:
              return 'bg-blue-50 border-blue-300 text-blue-900';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl border shadow-lg text-xs font-semibold animate-in slide-in-from-bottom-2 ${getBg()}`}
          >
            {getIcon()}
            <p className="leading-snug">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
};

const MainContent = () => {
  const { isAuthenticated } = useAuth();
  const { currentView, selectedAppId, navigateTo, activeModal, modalData, closeModal } = useApp();

  // If user is not logged in, render the official AICTE Pravah Login screen first!
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-modern-canvas text-slate-800 antialiased selection:bg-slate-200 selection:text-slate-900">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {currentView === 'dashboard' && <DashboardPage />}
        {currentView === 'radar' && <DocumentsWatchdogPage />}
        {currentView === 'audit' && <AuditLogsPage />}
        {currentView === 'detail' && (
          <ApplicationDetailPage
            applicationId={selectedAppId}
            onBack={() => navigateTo('dashboard')}
          />
        )}
      </main>

      {/* Modern Minimalist Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/70 mt-12 py-5 text-xs text-slate-500">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-700">
              AICTE Pravah • Problem Statement ID 26262 (Smart India Hackathon Round 2)
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrated Approval Workflow Automation, Compliance Monitoring and Alert Management System
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Govt. of India e-Governance Standard v3.1 | APH 2024–27
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      {activeModal === 'alert' && (
        <AlertDispatcherModal
          documentData={modalData}
          onClose={closeModal}
        />
      )}

      {activeModal === 'docket' && (
        <ApprovalDocketModal
          application={modalData}
          onClose={closeModal}
        />
      )}

      {/* Autonomous AI Statutory Copilot (Google Gemini & APH 2024-27 Engine) */}
      <AICopilotModal />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
