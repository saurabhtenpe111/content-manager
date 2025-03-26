
import React, { useState } from 'react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCmsStore } from '@/stores/cmsStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface ContentTypeFormProps {
  onClose: () => void;
  initialData?: {
    name: string;
    description?: string;
    apiId?: string;
    apiIdPlural?: string;
    isCollection?: boolean;
  };
  isComponent?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  apiId: z.string().min(2, {
    message: "API ID must be at least 2 characters.",
  }).optional(),
  apiIdPlural: z.string().min(2, {
    message: "API ID (Plural) must be at least 2 characters.",
  }).optional(),
  isCollection: z.boolean().optional(),
});

export const ContentTypeForm: React.FC<ContentTypeFormProps> = ({ 
  onClose,
  initialData,
  isComponent = false
}) => {
  const { addContentType } = useCmsStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      apiId: initialData?.apiId || '',
      apiIdPlural: initialData?.apiIdPlural || '',
      isCollection: initialData?.isCollection || true,
    },
  });
  
  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-')   // Replace multiple - with single -
      .trim();                  // Trim - from start and end of text
  }
  
  function pluralize(text: string) {
    if (!text) return '';
    if (text.endsWith('y')) return text.slice(0, -1) + 'ies';
    if (text.endsWith('s')) return text + 'es';
    return text + 's';
  }
  
  const handleGenerateApiIds = () => {
    const name = form.getValues('name');
    if (!name) return;
    
    const apiId = slugify(name);
    const apiIdPlural = pluralize(apiId);
    
    form.setValue('apiId', apiId);
    form.setValue('apiIdPlural', apiIdPlural);
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const contentType = {
        name: values.name,
        description: values.description,
        apiId: values.apiId,
        apiIdPlural: values.apiIdPlural,
        isCollection: values.isCollection !== false,
        fields: [],
      };
      
      await addContentType(contentType);
      
      toast.success(`${values.name} created successfully!`);
      onClose();
      
      // Navigate to the content type builder for this new type
      const createdContentType = useCmsStore.getState().contentTypes.find(ct => ct.name === values.name);
      if (createdContentType) {
        navigate(`/content-types/${createdContentType.id}`);
      }
    } catch (error) {
      console.error('Failed to create content type:', error);
      toast.error('Failed to create content type');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Product, Article, FAQ" {...field} />
                  </FormControl>
                  <FormDescription>
                    A human-readable name for your content type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe this content type..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A helpful description for your content type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <FormField
              control={form.control}
              name="isCollection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={value => field.onChange(value === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50">
                        <RadioGroupItem value="true" id="collection" />
                        <FormLabel htmlFor="collection" className="font-normal flex-1">
                          <div className="font-semibold">Collection Type</div>
                          <div className="text-sm text-muted-foreground">
                            Best for multiple instances like articles, products, etc.
                          </div>
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50">
                        <RadioGroupItem value="false" id="single" />
                        <FormLabel htmlFor="single" className="font-normal flex-1">
                          <div className="font-semibold">Single Type</div>
                          <div className="text-sm text-muted-foreground">
                            Best for single instance like about us, homepage, etc.
                          </div>
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <FormLabel>API Settings</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateApiIds}
                >
                  Generate from name
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name="apiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API ID (Singular)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. product, article" {...field} />
                    </FormControl>
                    <FormDescription>
                      The UID is used to generate the API routes and database tables/collections
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="apiIdPlural"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API ID (Plural)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. products, articles" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pluralized API ID
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          {activeTab === "basic" ? (
            <Button type="button" onClick={() => setActiveTab("advanced")}>Next</Button>
          ) : (
            <Button type="submit">Create</Button>
          )}
        </div>
      </form>
    </Form>
  );
};
