
import React, { useState } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { ContentTypeList } from '@/components/content-type/ContentTypeList';
import { Button } from '@/components/ui/button';
import { Plus, Component } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { ContentTypeForm } from '@/components/content-type/ContentTypeForm';

const ContentTypes: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSingleTypeDialogOpen, setIsSingleTypeDialogOpen] = useState(false);
  
  const handleCreateContentType = () => {
    return (
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Content Type</DialogTitle>
          <DialogDescription>
            Define the structure of your content type.
          </DialogDescription>
        </DialogHeader>
        
        <ContentTypeForm 
          onClose={() => setIsCreateDialogOpen(false)}
          initialData={{
            name: '',
            description: '',
            apiId: '',
            apiIdPlural: '',
            isCollection: true
          }}
        />
      </DialogContent>
    );
  };
  
  const handleCreateSingleType = () => {
    return (
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Single Type</DialogTitle>
          <DialogDescription>
            Define a single instance content type like Home Page or About Us.
          </DialogDescription>
        </DialogHeader>
        
        <ContentTypeForm 
          onClose={() => setIsSingleTypeDialogOpen(false)}
          initialData={{
            name: '',
            description: '',
            apiId: '',
            apiIdPlural: '',
            isCollection: false
          }}
        />
      </DialogContent>
    );
  };
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cms-gray-900">Content-Type Builder</h1>
            <p className="text-cms-gray-600 mt-1">
              Build the data architecture of your content
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsComponentDialogOpen(true)}
            >
              <Component size={16} className="mr-2" />
              Create new component
            </Button>
            
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Create new collection type
            </Button>
          </div>
        </div>
        
        <ContentTypeList />
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Content Type</DialogTitle>
            <DialogDescription>
              Define a new content structure for your CMS. Content types will be available
              through the API to create dynamic forms and manage content.
            </DialogDescription>
          </DialogHeader>
          
          <ContentTypeForm 
            onClose={() => setIsDialogOpen(false)} 
            initialData={{
              name: 'New Collection',
              description: 'A new collection type',
              isCollection: true,
              apiId: '',
              apiIdPlural: ''
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isComponentDialogOpen} onOpenChange={setIsComponentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Component</DialogTitle>
            <DialogDescription>
              Components allow you to create reusable field groups that can be used in your content types.
              Once created, components can be added to any content type.
            </DialogDescription>
          </DialogHeader>
          
          <ContentTypeForm 
            onClose={() => setIsComponentDialogOpen(false)} 
            isComponent={true}
            initialData={{
              name: 'New Component',
              description: 'A reusable component for your content types',
              isCollection: false,
              apiId: '',
              apiIdPlural: ''
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        {handleCreateContentType()}
      </Dialog>
      
      <Dialog open={isSingleTypeDialogOpen} onOpenChange={setIsSingleTypeDialogOpen}>
        {handleCreateSingleType()}
      </Dialog>
    </CMSLayout>
  );
};

export default ContentTypes;
