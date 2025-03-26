
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Pencil, 
  Trash2, 
  Loader2, 
  Plus, 
  Settings, 
  ChevronDown,
  ChevronRight,
  Component,
  FileText,
  FolderClosed,
} from 'lucide-react';
import { useCmsStore, ContentType } from '@/stores/cmsStore';
import { useNavigate } from 'react-router-dom';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const ContentTypeList: React.FC = () => {
  const { contentTypes, deleteContentType, setActiveContentType } = useCmsStore();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'collection-types': true,
    'components': false
  });
  
  useEffect(() => {
    const fetchContentTypes = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('content_types')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          if (error.code === '42P01') {
            console.warn('Content types table does not exist yet. Using local state only.');
          } else {
            throw error;
          }
        } else {
          console.log('Fetched content types:', data);
          // TODO: Update local store with fetched content types
        }
      } catch (error: any) {
        console.error('Error fetching content types:', error);
        if (error.code !== '42P01') {
          toast.error(`Failed to load content types: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentTypes();
  }, [user]);
  
  const handleDelete = async (id: string) => {
    try {
      try {
        const { error } = await supabase
          .from('content_types')
          .delete()
          .eq('id', id);
        
        if (error && error.code !== '42P01') {
          throw error;
        }
      } catch (error: any) {
        console.warn('Supabase delete failed, continuing with local state update:', error);
      }
      
      deleteContentType(id);
      toast.success('Content type deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting content type:', error);
      toast.error(`Failed to delete content type: ${error.message}`);
    }
  };

  const handleEditContentType = (contentTypeId: string) => {
    console.log('Edit content type clicked, ID:', contentTypeId);
    setActiveContentType(contentTypeId);
    navigate(`/content-types/${contentTypeId}`);
  };

  const handleCreateContentType = () => {
    navigate('/content-types/new');
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading content types...</span>
      </div>
    );
  }

  const groupContentTypes = () => {
    // Group content types by their "category" - in a real app this would be more sophisticated
    // For now, we'll just create mock categories based on naming patterns
    const groups: Record<string, ContentType[]> = {};
    
    contentTypes.forEach(contentType => {
      const nameParts = contentType.name.split('_');
      let group = nameParts[0];
      
      if (!groups[group]) {
        groups[group] = [];
      }
      
      groups[group].push(contentType);
    });
    
    return groups;
  };

  const contentTypeGroups = groupContentTypes();

  if (contentTypes.length === 0) {
    return (
      <Card className="border-dashed border-2 border-cms-gray-300 bg-cms-gray-50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Database size={48} className="text-cms-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-cms-gray-700 mb-2">No Content Types</h3>
          <p className="text-cms-gray-500 text-center mb-6 max-w-md">
            You haven't created any content types yet. Create your first content type to start building your CMS.
          </p>
          <Button onClick={() => navigate('/content-types/new')}>
            Create Content Type
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Collection Types</TabsTrigger>
            <TabsTrigger value="create">Create Collection Type</TabsTrigger>
            <TabsTrigger value="settings">API Settings</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex items-center space-x-2">
                <FolderClosed size={18} className="text-blue-600" />
                <span 
                  className="font-medium text-blue-600 cursor-pointer flex items-center"
                  onClick={() => toggleGroup('collection-types')}
                >
                  COLLECTION TYPES
                  {expandedGroups['collection-types'] ? 
                    <ChevronDown size={16} className="ml-1" /> : 
                    <ChevronRight size={16} className="ml-1" />
                  }
                </span>
              </div>
            </CardHeader>
            
            {expandedGroups['collection-types'] && (
              <CardContent className="p-0">
                <div className="divide-y">
                  {Object.entries(contentTypeGroups).map(([group, types]) => (
                    <div key={group} className="py-0">
                      {types.map((contentType) => (
                        <div 
                          key={contentType.id} 
                          className={cn(
                            "py-3 px-6 border-l-4 border-transparent hover:bg-slate-50 cursor-pointer flex items-center justify-between",
                            "hover:border-l-4 hover:border-blue-600"
                          )}
                          onClick={() => handleEditContentType(contentType.id)}
                        >
                          <div className="flex items-center">
                            <FileText size={16} className="text-gray-500 mr-3" />
                            <span>{contentType.name}</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              className="text-gray-500 hover:text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation(); 
                                handleEditContentType(contentType.id);
                              }}
                            >
                              <Pencil size={16} />
                            </button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button 
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the "{contentType.name}" content type and all of its fields.
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(contentType.id)} 
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
          
          <Card className="border-gray-200 mt-4">
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex items-center space-x-2">
                <Component size={18} className="text-purple-600" />
                <span 
                  className="font-medium text-purple-600 cursor-pointer flex items-center"
                  onClick={() => toggleGroup('components')}
                >
                  COMPONENTS
                  {expandedGroups['components'] ? 
                    <ChevronDown size={16} className="ml-1" /> : 
                    <ChevronRight size={16} className="ml-1" />
                  }
                </span>
              </div>
            </CardHeader>
            
            {expandedGroups['components'] && (
              <CardContent className="p-4">
                <p className="text-gray-500 text-sm">
                  Components allow you to create reusable field groups that can be used in your content types.
                </p>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={handleCreateContentType}
                >
                  <Plus size={14} className="mr-1" />
                  Create new component
                </Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Create a New Collection Type</h3>
              <p className="text-gray-500">Create a structured collection type with API endpoints for CRUD operations.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer" onClick={handleCreateContentType}>
                    <h3 className="font-medium mb-2">Standard Collection Type</h3>
                    <p className="text-sm text-gray-600">Create a basic collection with customizable fields and automatic API generation.</p>
                  </div>
                  <div className="p-4 border rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer" onClick={handleCreateContentType}>
                    <h3 className="font-medium mb-2">Advanced Collection Type</h3>
                    <p className="text-sm text-gray-600">Create a collection with relationships, components, and advanced field types.</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">API Access</h3>
                  <p className="text-sm text-gray-600 mb-4">All collection types automatically generate RESTful API endpoints:</p>
                  
                  <div className="bg-gray-100 p-3 rounded-md text-sm font-mono">
                    <div className="mb-1"><span className="text-green-600">GET</span> /api/[collection-name]</div>
                    <div className="mb-1"><span className="text-green-600">GET</span> /api/[collection-name]/:id</div>
                    <div className="mb-1"><span className="text-blue-600">POST</span> /api/[collection-name]</div>
                    <div className="mb-1"><span className="text-amber-600">PUT</span> /api/[collection-name]/:id</div>
                    <div><span className="text-red-600">DELETE</span> /api/[collection-name]/:id</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">API Settings</h3>
              <p className="text-gray-500">Configure settings for your content APIs</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Access Control</h3>
                  <p className="text-sm text-gray-600 mb-4">Configure role-based access for API endpoints:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded bg-white">
                      <h4 className="font-medium mb-1">Admin Role</h4>
                      <p className="text-xs text-gray-600">Full access to create, read, update, and delete records</p>
                    </div>
                    <div className="p-3 border rounded bg-white">
                      <h4 className="font-medium mb-1">Editor Role</h4>
                      <p className="text-xs text-gray-600">Can modify but not delete content</p>
                    </div>
                    <div className="p-3 border rounded bg-white">
                      <h4 className="font-medium mb-1">Viewer Role</h4>
                      <p className="text-xs text-gray-600">Read-only access to fetch data</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">API Documentation</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Access auto-generated API documentation for your collection types.
                  </p>
                  <Button variant="outline">
                    <Settings size={16} className="mr-2" />
                    View API Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
