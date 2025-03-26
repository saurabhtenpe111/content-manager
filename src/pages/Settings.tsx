
import React from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-cms-gray-900">Settings</h1>
          <p className="text-cms-gray-600 mt-1">
            Configure your CMS preferences and options
          </p>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your CMS instance and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cms-name">CMS Name</Label>
                  <Input id="cms-name" defaultValue="FormWise CMS" />
                  <p className="text-xs text-cms-gray-500">
                    This name will be displayed in the header and browser tab
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cms-description">CMS Description</Label>
                  <Textarea 
                    id="cms-description" 
                    defaultValue="A headless CMS for managing content types and forms" 
                    rows={3}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto-save</Label>
                      <p className="text-xs text-cms-gray-500">
                        Automatically save changes as you work
                      </p>
                    </div>
                    <Switch id="auto-save" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-xs text-cms-gray-500">
                        Use dark theme for the admin interface
                      </p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSave}>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>
                  Configure API access and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="api-url">API Base URL</Label>
                  <Input id="api-url" defaultValue="https://api.example.com" readOnly />
                  <p className="text-xs text-cms-gray-500">
                    The base URL for your API endpoints
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="api-key" defaultValue="••••••••••••••••" type="password" className="flex-1" />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                  <p className="text-xs text-cms-gray-500">
                    Use this key to authenticate API requests
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">API Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="api-cache">API Caching</Label>
                      <p className="text-xs text-cms-gray-500">
                        Enable caching for API responses
                      </p>
                    </div>
                    <Switch id="api-cache" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="api-cors">CORS Enabled</Label>
                      <p className="text-xs text-cms-gray-500">
                        Allow cross-origin requests to the API
                      </p>
                    </div>
                    <Switch id="api-cors" defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSave}>Save API Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your CMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex space-x-2">
                      <Input id="primary-color" type="color" className="w-12 h-9 p-1" defaultValue="#2E7DF3" />
                      <Input type="text" className="flex-1" defaultValue="#2E7DF3" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex space-x-2">
                      <Input id="accent-color" type="color" className="w-12 h-9 p-1" defaultValue="#10B981" />
                      <Input type="text" className="flex-1" defaultValue="#10B981" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Theme Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="rounded-corners">Rounded Corners</Label>
                      <p className="text-xs text-cms-gray-500">
                        Use rounded corners for UI elements
                      </p>
                    </div>
                    <Switch id="rounded-corners" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animations">Animations</Label>
                      <p className="text-xs text-cms-gray-500">
                        Enable UI animations and transitions
                      </p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSave}>Save Appearance</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced options for your CMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                  <Input id="cache-ttl" type="number" defaultValue="3600" />
                  <p className="text-xs text-cms-gray-500">
                    Time to live for cached content, in seconds
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-upload-size">Max Upload Size (MB)</Label>
                  <Input id="max-upload-size" type="number" defaultValue="10" />
                  <p className="text-xs text-cms-gray-500">
                    Maximum file size for uploads, in megabytes
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <select 
                    id="backup-frequency" 
                    className="w-full p-2 border border-cms-gray-200 rounded-md"
                    defaultValue="daily"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className="text-xs text-cms-gray-500">
                    How frequently to back up content and settings
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="log-level">Log Level</Label>
                  <select 
                    id="log-level" 
                    className="w-full p-2 border border-cms-gray-200 rounded-md"
                    defaultValue="info"
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                  <p className="text-xs text-cms-gray-500">
                    Level of detail for system logs
                  </p>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSave}>Save Advanced Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CMSLayout>
  );
};

export default Settings;
