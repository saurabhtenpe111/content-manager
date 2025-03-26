
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Database, 
  LayoutTemplate, 
  FileQuestion, 
  Settings, 
  UserPlus,
  Key,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFieldTypesStore } from '@/stores/fieldTypesStore';

const Index = () => {
  const { user } = useAuth();
  const { fetchFieldTypes } = useFieldTypesStore();
  
  useEffect(() => {
    // Load field types when the app starts
    fetchFieldTypes();
  }, [fetchFieldTypes]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Headless CMS</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Build content types, create forms, and manage your content with ease.
        </p>
        {user && (
          <p className="mt-2 text-md text-blue-600">
            Logged in as {user.user_metadata.full_name || user.email}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <FeatureCard 
          title="Content Types" 
          description="Define the structure of your content"
          icon={<Database size={32} />}
          path="/content-types"
          color="bg-blue-50 text-blue-500"
        />
        
        <FeatureCard 
          title="Form Builder" 
          description="Create interactive forms based on your content types"
          icon={<LayoutTemplate size={32} />}
          path="/form-builder"
          color="bg-purple-50 text-purple-500"
        />
        
        <FeatureCard 
          title="Fields Library" 
          description="Explore available field types for your content"
          icon={<FileQuestion size={32} />}
          path="/fields-library"
          color="bg-green-50 text-green-500"
        />
        
        <FeatureCard 
          title="Users" 
          description="Manage user access and permissions"
          icon={<UserPlus size={32} />}
          path="/users"
          color="bg-orange-50 text-orange-500"
        />
        
        <FeatureCard 
          title="API Keys" 
          description="Generate API keys for programmatic access"
          icon={<Key size={32} />}
          path="/api-keys"
          color="bg-teal-50 text-teal-500"
        />
        
        <FeatureCard 
          title="Settings" 
          description="Configure your CMS preferences"
          icon={<Settings size={32} />}
          path="/settings"
          color="bg-gray-50 text-gray-500"
        />
      </div>
      
      <div className="mt-12 p-6 bg-blue-50 rounded-lg max-w-3xl">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-900">Getting Started</h3>
            <p className="mt-1 text-blue-700">
              This CMS now supports user authentication and API key management. Your content is secured by Supabase authentication and Row Level Security.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/content-types">Create Content Type</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/api-keys">Generate API Key</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, path, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-all duration-200">
      <div className={`p-4 rounded-full ${color} mb-4`}>
        {icon}
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link to={path} className="mt-auto">
        <Button>
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default Index;
