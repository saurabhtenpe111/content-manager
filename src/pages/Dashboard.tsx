
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { useCmsStore } from '@/stores/cmsStore';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Database, FileText, FormInput, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { contentTypes, fetchContentTypes } = useCmsStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    contentTypes: 0,
    fields: 0,
    forms: 0,
    users: 1 // Default to 1 (current user)
  });
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchContentTypes();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchContentTypes]);
  
  useEffect(() => {
    if (contentTypes) {
      const fieldCount = contentTypes.reduce((acc, ct) => acc + ct.fields.length, 0);
      
      setStats({
        contentTypes: contentTypes.length,
        fields: fieldCount,
        forms: contentTypes.length, // Assuming one form per content type
        users: user ? 1 : 0
      });
    }
  }, [contentTypes, user]);
  
  if (loading) {
    return (
      <CMSLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </CMSLayout>
    );
  }
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome to FormWise CMS. Manage your content types, forms, and user permissions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Content Types</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.contentTypes}</h3>
                  <p className="text-xs text-gray-500 mt-1">Total content types</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fields</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.fields}</h3>
                  <p className="text-xs text-gray-500 mt-1">Total fields</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Forms</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.forms}</h3>
                  <p className="text-xs text-gray-500 mt-1">Active forms</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FormInput className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Users</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.users}</h3>
                  <p className="text-xs text-gray-500 mt-1">Active users</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Recent Content Types</h3>
              {contentTypes.length === 0 ? (
                <p className="text-sm text-gray-500">No content types created yet.</p>
              ) : (
                <div className="space-y-3">
                  {contentTypes.slice(0, 3).map((contentType) => (
                    <Link 
                      key={contentType.id} 
                      to={`/content-types/${contentType.id}`}
                      className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Database className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">{contentType.name}</p>
                        <p className="text-xs text-gray-500">
                          {contentType.fields.length} fields • Updated recently
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link 
                  to="/content-types/new" 
                  className="p-4 border rounded-md hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Database className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Create Content Type</p>
                    <p className="text-xs text-gray-500">Define a new collection</p>
                  </div>
                </Link>
                
                <Link 
                  to="/form-builder" 
                  className="p-4 border rounded-md hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FormInput className="h-5 w-5 mr-3 text-purple-600" />
                  <div>
                    <p className="font-medium">Build a Form</p>
                    <p className="text-xs text-gray-500">Create a new form</p>
                  </div>
                </Link>
                
                <Link 
                  to="/fields-library" 
                  className="p-4 border rounded-md hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FileText className="h-5 w-5 mr-3 text-green-600" />
                  <div>
                    <p className="font-medium">Field Library</p>
                    <p className="text-xs text-gray-500">Browse available fields</p>
                  </div>
                </Link>
                
                <Link 
                  to="/settings" 
                  className="p-4 border rounded-md hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Users className="h-5 w-5 mr-3 text-orange-600" />
                  <div>
                    <p className="font-medium">Manage Users</p>
                    <p className="text-xs text-gray-500">Add or edit users</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CMSLayout>
  );
};

export default Dashboard;
