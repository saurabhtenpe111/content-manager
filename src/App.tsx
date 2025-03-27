
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { Toaster } from 'sonner';

import IndexPage from './pages/index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Content from './pages/Content';
import ContentTypes from './pages/ContentTypes';
import ContentTypeBuilder from './pages/ContentTypeBuilder';
import ContentItems from './pages/ContentItems';
import ContentItemEditor from './pages/ContentItemEditor';
import ApiKeys from './pages/ApiKeys';
import FieldsLibrary from './pages/FieldsLibrary';
import FormBuilder from './pages/FormBuilder';
import FormEditor from './pages/FormEditor';
import Users from './pages/Users';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import FieldsDemo from './pages/FieldsDemo';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content"
          element={
            <ProtectedRoute>
              <Content />
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
          path="/content-types/:id"
          element={
            <ProtectedRoute>
              <ContentTypeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-types/new"
          element={
            <ProtectedRoute>
              <ContentTypeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-items/:contentTypeId"
          element={
            <ProtectedRoute>
              <ContentItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-items/:contentTypeId/new"
          element={
            <ProtectedRoute>
              <ContentItemEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-items/:contentTypeId/:itemId"
          element={
            <ProtectedRoute>
              <ContentItemEditor />
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
          path="/fields-library"
          element={
            <ProtectedRoute>
              <FieldsLibrary />
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
          path="/form-editor/:id"
          element={
            <ProtectedRoute>
              <FormEditor />
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
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fields-demo"
          element={
            <ProtectedRoute>
              <FieldsDemo />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
