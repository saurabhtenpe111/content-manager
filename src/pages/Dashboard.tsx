
import React from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCmsStore } from '@/stores/cmsStore';
import { 
  Database, 
  FileType, 
  Users, 
  LayoutTemplate,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { contentTypes } = useCmsStore();
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-cms-gray-900">Dashboard</h1>
          <p className="text-cms-gray-600 mt-1">
            Welcome to FormWise CMS. Manage your content types, forms, and user permissions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Content Types"
            value={contentTypes.length.toString()}
            description="Total content types"
            icon={<Database size={24} />}
            color="bg-blue-50 text-blue-600"
          />
          
          <StatsCard 
            title="Fields"
            value={contentTypes.reduce((acc, ct) => acc + ct.fields.length, 0).toString()}
            description="Total fields"
            icon={<FileType size={24} />}
            color="bg-green-50 text-green-600"
          />
          
          <StatsCard 
            title="Forms"
            value="0"
            description="Active forms"
            icon={<LayoutTemplate size={24} />}
            color="bg-purple-50 text-purple-600"
          />
          
          <StatsCard 
            title="Users"
            value="1"
            description="Active users"
            icon={<Users size={24} />}
            color="bg-orange-50 text-orange-600"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Content Types</CardTitle>
              <CardDescription>
                Recently created or updated content types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contentTypes.length > 0 ? (
                <div className="space-y-2">
                  {contentTypes.slice(0, 5).map((contentType) => (
                    <div 
                      key={contentType.id}
                      className="flex items-center justify-between p-3 border border-cms-gray-200 rounded-md hover:border-cms-blue transition-all duration-200"
                    >
                      <div>
                        <h3 className="font-medium text-cms-gray-800">{contentType.name}</h3>
                        <p className="text-sm text-cms-gray-500">
                          {contentType.fields.length} fields • Updated {new Date(contentType.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link to={`/content-types/${contentType.id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Database size={40} className="text-cms-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-cms-gray-600 mb-1">No content types yet</h3>
                  <p className="text-cms-gray-500 mb-4">Create your first content type to get started</p>
                  <Link to="/content-types/new">
                    <Button>Create Content Type</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <QuickActionCard 
                  title="Create Content Type"
                  description="Define a new content structure"
                  icon={<Database size={20} />}
                  to="/content-types/new"
                />
                
                <QuickActionCard 
                  title="Build a Form"
                  description="Create a new form layout"
                  icon={<LayoutTemplate size={20} />}
                  to="/form-builder"
                />
                
                <QuickActionCard 
                  title="Field Library"
                  description="Browse available field types"
                  icon={<FileType size={20} />}
                  to="/fields-library"
                />
                
                <QuickActionCard 
                  title="Manage Users"
                  description="Add or edit user permissions"
                  icon={<Users size={20} />}
                  to="/users"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CMSLayout>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon, color }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cms-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-cms-gray-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, icon, to }) => {
  return (
    <Link to={to}>
      <div className="flex items-center space-x-3 p-3 border border-cms-gray-200 rounded-md hover:border-cms-blue hover:bg-cms-gray-50 transition-all duration-200">
        <div className="p-2 bg-cms-gray-100 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-cms-gray-800">{title}</h3>
          <p className="text-xs text-cms-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;
