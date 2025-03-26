
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid, 
  Database, 
  FormInput, 
  Settings, 
  Users, 
  Key,
  FileText,
  PanelLeft,
  PlusCircle,
  Package
} from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const Sidebar = () => {
  const location = useLocation();
  const { isMobile, isSidebarOpen, toggleSidebar } = useMobile();
  const [contentTypes, setContentTypes] = React.useState<{id: string; name: string}[]>([]);
  
  React.useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('content_types')
          .select('id, name')
          .order('name', { ascending: true });
          
        if (error) throw error;
        setContentTypes(data || []);
      } catch (error) {
        console.error('Error fetching content types:', error);
      }
    };
    
    fetchContentTypes();
  }, []);
  
  const isContentTypeActive = (id: string) => {
    return location.pathname === `/content/${id}` || 
      location.pathname.startsWith(`/content/${id}/`);
  };
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      name: 'Content Types',
      path: '/content-types',
      icon: <Database className="h-5 w-5" />,
    },
    {
      name: 'Form Builder',
      path: '/form-builder',
      icon: <FormInput className="h-5 w-5" />,
    },
    {
      name: 'Fields Library',
      path: '/fields-library',
      icon: <Package className="h-5 w-5" />,
    },
  ];
  
  const managementItems = [
    {
      name: 'Users',
      path: '/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'API Keys',
      path: '/api-keys',
      icon: <Key className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];
  
  if (isMobile && !isSidebarOpen) return null;
  
  return (
    <aside className={cn(
      "bg-gray-900 text-white flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out p-4",
      isMobile ? "absolute inset-y-0 left-0 z-50 w-64" : "w-64",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {isMobile && (
        <div className="flex justify-end -mr-2 -mt-2 mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Navigation
        </h3>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive 
                ? "bg-gray-800 text-white" 
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            )}
            end={item.path === '/'}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
      
      {/* Content Section */}
      {contentTypes.length > 0 && (
        <div className="mt-8 space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Content
            </h3>
            <NavLink to="/content-types/new">
              <PlusCircle className="h-4 w-4 text-gray-400 hover:text-white" />
            </NavLink>
          </div>
          
          {contentTypes.map((contentType) => (
            <NavLink
              key={contentType.id}
              to={`/content/${contentType.id}`}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isContentTypeActive(contentType.id)
                  ? "bg-gray-800 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <FileText className="h-5 w-5" />
              <span className="truncate">{contentType.name}</span>
            </NavLink>
          ))}
        </div>
      )}
      
      <div className="mt-8 space-y-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Management
        </h3>
        
        {managementItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive 
                ? "bg-gray-800 text-white" 
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
