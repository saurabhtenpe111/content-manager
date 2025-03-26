
import React, { useState } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  AlignJustify,
  Type,
  Hash,
  Mail,
  Key,
  Calendar,
  List,
  Check,
  RadioIcon,
  File,
  ToggleLeft,
  Sliders,
  Palette,
  Component,
  ChevronLeft,
  Search,
  Filter,
  Star
} from 'lucide-react';
import { FieldType, useCmsStore, Field } from '@/stores/cmsStore';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type FieldCategory = 'text' | 'choice' | 'date' | 'media' | 'relation' | 'custom';

const FieldsLibrary = () => {
  const navigate = useNavigate();
  const { contentTypes, activeContentTypeId } = useCmsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FieldCategory | 'all'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const activeContentType = contentTypes.find(ct => ct.id === activeContentTypeId);
  
  const fieldDefinitions = [
    {
      type: 'text',
      name: 'Short text',
      icon: <Type size={20} />,
      description: 'Small text: titles, names, tags',
      category: 'text' as FieldCategory
    },
    {
      type: 'textarea',
      name: 'Long text',
      icon: <AlignJustify size={20} />,
      description: 'Long text: paragraphs, descriptions',
      category: 'text' as FieldCategory
    },
    {
      type: 'number',
      name: 'Number',
      icon: <Hash size={20} />,
      description: 'Numbers: integers, decimals',
      category: 'text' as FieldCategory
    },
    {
      type: 'email',
      name: 'Email',
      icon: <Mail size={20} />,
      description: 'Email addresses',
      category: 'text' as FieldCategory
    },
    {
      type: 'password',
      name: 'Password',
      icon: <Key size={20} />,
      description: 'Password field with masking',
      category: 'text' as FieldCategory
    },
    {
      type: 'date',
      name: 'Date',
      icon: <Calendar size={20} />,
      description: 'Date picker',
      category: 'date' as FieldCategory
    },
    {
      type: 'dropdown',
      name: 'Dropdown',
      icon: <List size={20} />,
      description: 'Dropdown selection',
      category: 'choice' as FieldCategory
    },
    {
      type: 'checkbox',
      name: 'Checkbox',
      icon: <Check size={20} />,
      description: 'Boolean: true or false',
      category: 'choice' as FieldCategory
    },
    {
      type: 'radio',
      name: 'Radio',
      icon: <RadioIcon size={20} />,
      description: 'Choose one from several options',
      category: 'choice' as FieldCategory
    },
    {
      type: 'file',
      name: 'Media',
      icon: <File size={20} />,
      description: 'Files and images',
      category: 'media' as FieldCategory
    },
    {
      type: 'toggle',
      name: 'Toggle',
      icon: <ToggleLeft size={20} />,
      description: 'On/Off switch',
      category: 'choice' as FieldCategory
    },
    {
      type: 'slider',
      name: 'Slider',
      icon: <Sliders size={20} />,
      description: 'Range selection',
      category: 'choice' as FieldCategory
    },
    {
      type: 'color',
      name: 'Color',
      icon: <Palette size={20} />,
      description: 'Color picker',
      category: 'choice' as FieldCategory
    },
    {
      type: 'component',
      name: 'Component',
      icon: <Component size={20} />,
      description: 'Group of fields',
      category: 'custom' as FieldCategory
    }
  ];
  
  const toggleFavorite = (type: string) => {
    if (favorites.includes(type)) {
      setFavorites(favorites.filter(t => t !== type));
    } else {
      setFavorites([...favorites, type]);
    }
  };
  
  const handleFieldDragStart = (e: React.DragEvent, fieldDef: any) => {
    e.dataTransfer.setData('field-type', fieldDef.type);
    
    const field: Omit<Field, 'id'> = {
      name: fieldDef.type.toLowerCase(),
      label: fieldDef.name,
      type: fieldDef.type as FieldType,
      description: fieldDef.description,
      placeholder: `Enter ${fieldDef.type.toLowerCase()}...`,
      validation: {
        required: false
      }
    };
    
    if (fieldDef.type === 'dropdown' || fieldDef.type === 'radio') {
      field.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ];
    }
    
    e.dataTransfer.setData('field-data', JSON.stringify(field));
    
    // Create and append a custom drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'px-3 py-2 bg-white border rounded shadow text-sm flex items-center';
    dragImage.innerHTML = `
      <span class="mr-2">${fieldDef.icon.type}</span>
      <span>${fieldDef.name}</span>
    `;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);
    
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };
  
  const filteredFields = fieldDefinitions.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          field.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || field.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const recentContentTypes = contentTypes.slice(0, 3);
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ChevronLeft size={18} />
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Field Library</h1>
            <p className="text-gray-600 mt-1">
              Drag and drop fields to your content types
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <Tabs 
                  defaultValue="all" 
                  orientation="vertical" 
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as FieldCategory | 'all')}
                  className="w-full"
                >
                  <TabsList className="flex flex-col items-stretch h-auto">
                    <TabsTrigger value="all" className="justify-start text-left px-4 mb-1">
                      All Fields
                    </TabsTrigger>
                    <TabsTrigger value="text" className="justify-start text-left px-4 mb-1">
                      Text Fields
                    </TabsTrigger>
                    <TabsTrigger value="choice" className="justify-start text-left px-4 mb-1">
                      Choice Fields
                    </TabsTrigger>
                    <TabsTrigger value="date" className="justify-start text-left px-4 mb-1">
                      Date Fields
                    </TabsTrigger>
                    <TabsTrigger value="media" className="justify-start text-left px-4 mb-1">
                      Media Fields
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="justify-start text-left px-4 mb-1">
                      Custom Fields
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Recent Content Types</CardTitle>
              </CardHeader>
              <CardContent>
                {recentContentTypes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No content types yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentContentTypes.map(contentType => (
                      <Button 
                        key={contentType.id}
                        variant="ghost" 
                        className="w-full justify-start text-left" 
                        onClick={() => navigate(`/content-types/${contentType.id}`)}
                      >
                        {contentType.name}
                        <Badge variant="outline" className="ml-2">
                          {contentType.fields.length} fields
                        </Badge>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-9 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search fields..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                    All Fields
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory('text')}>
                    Text Fields
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory('choice')}>
                    Choice Fields
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFields.map((field) => (
                <Card 
                  key={field.type}
                  className="cursor-grab hover:border-primary hover:shadow-sm transition-all"
                  draggable
                  onDragStart={(e) => handleFieldDragStart(e, field)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center mr-2">
                          {field.icon}
                        </div>
                        <CardTitle className="text-base font-medium">{field.name}</CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-50 hover:opacity-100"
                        onClick={() => toggleFavorite(field.type)}
                      >
                        <Star 
                          size={14}
                          className={favorites.includes(field.type) ? "fill-yellow-400 text-yellow-400" : ""}
                        />
                      </Button>
                    </div>
                    <CardDescription>{field.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-2 border rounded bg-gray-50">
                      {field.type === 'text' && (
                        <Input placeholder="Text field" disabled />
                      )}
                      {field.type === 'textarea' && (
                        <Textarea placeholder="Textarea field" disabled rows={2} />
                      )}
                      {field.type === 'number' && (
                        <Input type="number" placeholder="0" disabled />
                      )}
                      {field.type === 'email' && (
                        <Input type="email" placeholder="Email field" disabled />
                      )}
                      {field.type === 'password' && (
                        <Input type="password" placeholder="Password" disabled />
                      )}
                      {field.type === 'date' && (
                        <Input type="date" disabled />
                      )}
                      {field.type === 'dropdown' && (
                        <div className="border rounded p-2 text-sm text-muted-foreground">
                          Dropdown selection
                        </div>
                      )}
                      {field.type === 'checkbox' && (
                        <div className="flex items-center">
                          <input type="checkbox" disabled className="mr-2" />
                          <Label className="text-sm">Checkbox option</Label>
                        </div>
                      )}
                      {field.type === 'radio' && (
                        <div className="flex items-center">
                          <input type="radio" disabled className="mr-2" />
                          <Label className="text-sm">Radio option</Label>
                        </div>
                      )}
                      {field.type === 'file' && (
                        <Input type="file" disabled />
                      )}
                      {field.type === 'toggle' && (
                        <div className="flex justify-between items-center">
                          <Label className="text-sm">Toggle option</Label>
                          <div className="h-5 w-10 bg-gray-300 rounded-full"></div>
                        </div>
                      )}
                      {field.type === 'slider' && (
                        <div className="py-4">
                          <div className="h-1 bg-gray-300 rounded-full"></div>
                        </div>
                      )}
                      {field.type === 'color' && (
                        <div className="flex space-x-2">
                          <div className="h-8 w-8 bg-blue-500 rounded"></div>
                          <Input value="#3b82f6" disabled />
                        </div>
                      )}
                      {field.type === 'component' && (
                        <div className="p-2 border-2 border-dashed border-gray-300 rounded text-center text-sm text-muted-foreground">
                          <Component size={16} className="mx-auto mb-1" />
                          Reusable component
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full text-xs text-muted-foreground">
                      <span className="inline-block bg-gray-100 rounded px-2 py-0.5">{field.type}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default FieldsLibrary;
