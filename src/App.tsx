
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ContentTypes from './pages/ContentTypes';
import ContentTypeBuilder from './pages/ContentTypeBuilder';
import Content from './pages/Content';
import ContentItemEditor from './pages/ContentItemEditor';
import ContentItems from './pages/ContentItems';
import FieldsLibrary from './pages/FieldsLibrary';
import FormBuilder from './pages/FormBuilder';
import FormEditor from './pages/FormEditor';
import Index from './pages/index';

// Import the layouts
import RootLayout from '@/layouts/RootLayout';

// Authentication context
import { AuthProvider } from '@/hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Main routes */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Content routes */}
              <Route path="content-types" element={<ContentTypes />} />
              <Route path="content-types/:contentTypeId" element={<ContentTypeBuilder />} />
              <Route path="content/:contentTypeId" element={<ContentItems />} />
              <Route path="content/:contentTypeId/new" element={<ContentItemEditor />} />
              <Route path="content/:contentTypeId/:contentItemId" element={<ContentItemEditor />} />
              
              {/* Field Library */}
              <Route path="fields-library" element={<FieldsLibrary />} />
              
              {/* Form Builder */}
              <Route path="form-builder" element={<FormBuilder />} />
              <Route path="form-builder/:contentTypeId" element={<FormEditor />} />
            </Route>
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
