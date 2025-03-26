
import React, { useState } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiKeyForm } from '@/components/api-keys/ApiKeyForm';
import { ApiKeyList } from '@/components/api-keys/ApiKeyList';
import { Key } from 'lucide-react';

const ApiKeys: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  
  const handleKeyCreated = () => {
    setActiveTab('list');
  };
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-1">
            Create and manage API keys for accessing your content programmatically
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              API Key Management
            </CardTitle>
            <CardDescription>
              API keys allow external applications to securely access your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="list">Your API Keys</TabsTrigger>
                <TabsTrigger value="new">Create New Key</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <ApiKeyList />
              </TabsContent>
              <TabsContent value="new">
                <ApiKeyForm onKeyCreated={handleKeyCreated} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Using Your API Keys</CardTitle>
            <CardDescription>
              How to use your API keys to access your content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Authentication</h3>
              <p className="text-gray-600">
                Include your API key in the Authorization header of your requests:
              </p>
              <pre className="bg-gray-100 p-3 rounded-md mt-2 overflow-x-auto">
                <code>
                  Authorization: Bearer your-api-key
                </code>
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">API Endpoints</h3>
              <p className="text-gray-600 mb-2">
                Our API provides the following endpoints:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li><code>/api/content-types</code> - List all content types</li>
                <li><code>/api/content-types/:id</code> - Get a specific content type</li>
                <li><code>/api/content/:typeId</code> - List content items for a content type</li>
                <li><code>/api/content/:typeId/:id</code> - Get a specific content item</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Example</h3>
              <p className="text-gray-600">
                Fetch content items for a content type:
              </p>
              <pre className="bg-gray-100 p-3 rounded-md mt-2 overflow-x-auto">
                <code>
                  {`fetch('https://your-api-url/api/content/your-content-type-id', {
  headers: {
    'Authorization': 'Bearer your-api-key'
  }
})
  .then(response => response.json())
  .then(data => console.log(data));`}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  );
};

export default ApiKeys;
