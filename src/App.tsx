
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

import Index from '@/pages/Index';
import ContentTypes from '@/pages/ContentTypes';
import ContentTypeBuilder from '@/pages/ContentTypeBuilder';
import FormBuilder from '@/pages/FormBuilder';
import FormEditor from '@/pages/FormEditor';
import FieldsLibrary from '@/pages/FieldsLibrary';
import Settings from '@/pages/Settings';
import Users from '@/pages/Users';
import ApiKeys from '@/pages/ApiKeys';
import Content from '@/pages/Content';
import ContentItems from '@/pages/ContentItems';
import ContentItemEditor from '@/pages/ContentItemEditor';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';

import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!session) {
    console.log('No session found, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/content-types" 
            element={
              <ProtectedRoute>
                <ContentTypes />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/content-types/:contentTypeId" 
            element={
              <ProtectedRoute>
                <ContentTypeBuilder />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/form-builder" 
            element={
              <ProtectedRoute>
                <FormBuilder />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/form-builder/:contentTypeId" 
            element={
              <ProtectedRoute>
                <FormEditor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/fields-library" 
            element={
              <ProtectedRoute>
                <FieldsLibrary />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/api-keys" 
            element={
              <ProtectedRoute>
                <ApiKeys />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          
          {/* Content Routes */}
          <Route 
            path="/content" 
            element={
              <ProtectedRoute>
                <Content />
              </ProtectedRoute>
            } 
          />
          
          {/* Content Item Routes */}
          <Route 
            path="/content/:contentTypeId" 
            element={
              <ProtectedRoute>
                <ContentItems />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/content/:contentTypeId/new" 
            element={
              <ProtectedRoute>
                <ContentItemEditor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/content/:contentTypeId/:contentItemId" 
            element={
              <ProtectedRoute>
                <ContentItemEditor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/content/:contentTypeId/:contentItemId/edit" 
            element={
              <ProtectedRoute>
                <ContentItemEditor />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/content/:contentTypeId/:contentItemId/view" 
            element={
              <ProtectedRoute>
                <ContentItemEditor />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
