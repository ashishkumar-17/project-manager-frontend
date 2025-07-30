import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLoading } from './hooks/useLoading';
import { PageLoader } from './components/ui/PageLoader';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Messages } from './pages/Messages';
import { TimeTracking } from './pages/TimeTracking';
import { Files } from './pages/Files';
import { Automations } from './pages/Automations';
import { Settings } from './pages/Settings';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isLoading, loadingMessage } = useLoading();

  return (
      <PageLoader isLoading={isLoading} loadingMessage={loadingMessage}>
          <div className="min-h-screen bg-white dark:bg-neutral-900">
              <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                      path="/dashboard"
                      element={
                          <ProtectedRoute>
                              <Layout>
                                  <Dashboard />
                              </Layout>
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/projects"
                      element={
                          <ProtectedRoute>
                              <Layout>
                                  <Projects />
                              </Layout>
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/tasks"
                      element={
                          <ProtectedRoute>
                              <Layout>
                                  <Tasks />
                              </Layout>
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/messages"
                      element={
                          <ProtectedRoute>
                              <Layout>
                                  <Messages />
                              </Layout>
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/time"
                      element={
                          <ProtectedRoute>
                              <Layout>
                                  <TimeTracking />
                              </Layout>
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/files"
                      element={
                          <ProtectedRoute>
                              <Layout>
                                  <Files />
                              </Layout>
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/automations"
                      element={
                          <ProtectedRoute>
                              <Layout>
                                  <Automations />
                              </Layout>
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/settings"
                      element={
                          <ProtectedRoute>
                              <Layout>
                                  <Settings />
                              </Layout>
                          </ProtectedRoute>
                      }
                  />
                  <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
              </Routes>

              <Toaster
                  position="bottom-right"
                  toastOptions={{
                      duration: 4000,
                      style: {
                          background: 'var(--toast-bg)',
                          color: 'var(--toast-color)',
                      },
                  }}
              />
          </div>
      </PageLoader>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;