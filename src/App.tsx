
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import ContentTypes from './pages/ContentTypes';
import ContentTypeBuilder from './pages/ContentTypeBuilder';
import Content from './pages/Content';
import ContentEntry from './pages/ContentEntry';
import FieldsLibrary from './pages/FieldsLibrary';

// Authentication context
import { AuthProvider } from './contexts/AuthContext';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          
          {/* Main routes */}
          <Route path="/" element={<RootLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Content routes */}
            <Route path="content-types" element={<ContentTypes />} />
            <Route path="content-types/:contentTypeId" element={<ContentTypeBuilder />} />
            <Route path="content/:contentTypeId" element={<Content />} />
            <Route path="content/:contentTypeId/new" element={<ContentEntry />} />
            <Route path="content/:contentTypeId/:contentItemId" element={<ContentEntry />} />
            
            {/* Field Library */}
            <Route path="fields-library" element={<FieldsLibrary />} />
            
            {/* Legal routes */}
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
          </Route>
          
          {/* Not found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
