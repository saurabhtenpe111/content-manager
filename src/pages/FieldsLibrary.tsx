
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
  Star,
  SquareStack,
  TextCursorInput,
  AlignLeft,
  LucideIcon,
  Hash as HashIcon,
  TriangleAlert,
  SlidersHorizontal,
  Lock,
  Cpu
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

type FieldCategory = 'text' | 'choice' | 'date' | 'media' | 'relation' | 'input' | 'advanced' | 'custom';

const FieldsLibrary = () => {
  const navigate = useNavigate();
  const { contentTypes, activeContentTypeId } = useCmsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FieldCategory | 'all'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const activeContentType = contentTypes.find(ct => ct.id === activeContentTypeId);
  
  interface FieldDefinition {
    type: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    category: FieldCategory;
    preview?: React.ReactNode;
  }
  
  const fieldDefinitions: FieldDefinition[] = [
    // Text fields
    {
      type: 'text',
      name: 'Short text',
      icon: <Type size={20} />,
      description: 'Small text: titles, names, tags',
      category: 'text'
    },
    {
      type: 'textarea',
      name: 'Long text',
      icon: <AlignJustify size={20} />,
      description: 'Long text: paragraphs, descriptions',
      category: 'text'
    },
    {
      type: 'number',
      name: 'Number',
      icon: <Hash size={20} />,
      description: 'Numbers: integers, decimals',
      category: 'text'
    },
    {
      type: 'email',
      name: 'Email',
      icon: <Mail size={20} />,
      description: 'Email addresses',
      category: 'text'
    },
    {
      type: 'password',
      name: 'Password',
      icon: <Key size={20} />,
      description: 'Password field with masking',
      category: 'text'
    },
    {
      type: 'mentionbox',
      name: 'Mention Box',
      icon: <TextCursorInput size={20} />,
      description: 'Text area with @mentions support',
      category: 'text'
    },
    
    // Date fields
    {
      type: 'date',
      name: 'Date',
      icon: <Calendar size={20} />,
      description: 'Date picker',
      category: 'date'
    },
    {
      type: 'calendar',
      name: 'Calendar',
      icon: <Calendar size={20} />,
      description: 'Advanced calendar with date ranges',
      category: 'date'
    },
    
    // Choice fields
    {
      type: 'dropdown',
      name: 'Dropdown',
      icon: <List size={20} />,
      description: 'Dropdown selection',
      category: 'choice'
    },
    {
      type: 'checkbox',
      name: 'Checkbox',
      icon: <Check size={20} />,
      description: 'Boolean: true or false',
      category: 'choice'
    },
    {
      type: 'radio',
      name: 'Radio',
      icon: <RadioIcon size={20} />,
      description: 'Choose one from several options',
      category: 'choice'
    },
    {
      type: 'toggle',
      name: 'Toggle',
      icon: <ToggleLeft size={20} />,
      description: 'On/Off switch',
      category: 'choice'
    },
    {
      type: 'selectbutton',
      name: 'Select Button',
      icon: <SquareStack size={20} />,
      description: 'Button-based selection',
      category: 'choice'
    },
    {
      type: 'tristatecheckbox',
      name: 'Tri-State Checkbox',
      icon: <TriangleAlert size={20} />,
      description: 'Checkbox with three states',
      category: 'choice'
    },
    {
      type: 'multistatecheckbox',
      name: 'Multi-State Checkbox',
      icon: <Cpu size={20} />,
      description: 'Checkbox with multiple states',
      category: 'choice'
    },
    
    // Advanced input fields
    {
      type: 'inputgroup',
      name: 'Input Group',
      icon: <AlignLeft size={20} />,
      description: 'Input with prefixes and suffixes',
      category: 'input'
    },
    {
      type: 'inputmask',
      name: 'Input Mask',
      icon: <Lock size={20} />,
      description: 'Masked input for formatted data',
      category: 'input'
    },
    {
      type: 'inputswitch',
      name: 'Input Switch',
      icon: <ToggleLeft size={20} />,
      description: 'Form-integrated toggle switch',
      category: 'input'
    },
    {
      type: 'inputotp',
      name: 'OTP Input',
      icon: <Hash size={20} />,
      description: 'One-time password input',
      category: 'input'
    },
    
    // Advanced fields
    {
      type: 'slider',
      name: 'Slider',
      icon: <Sliders size={20} />,
      description: 'Range selection',
      category: 'advanced'
    },
    {
      type: 'rating',
      name: 'Rating',
      icon: <Star size={20} />,
      description: 'Star rating input',
      category: 'advanced'
    },
    {
      type: 'treeselect',
      name: 'Tree Select',
      icon: <List size={20} />,
      description: 'Hierarchical selection dropdown',
      category: 'advanced'
    },
    {
      type: 'color',
      name: 'Color',
      icon: <Palette size={20} />,
      description: 'Color picker',
      category: 'advanced'
    },
    
    // Media fields
    {
      type: 'file',
      name: 'Media',
      icon: <File size={20} />,
      description: 'Files and images',
      category: 'media'
    },
    
    // Custom fields
    {
      type: 'component',
      name: 'Component',
      icon: <Component size={20} />,
      description: 'Group of fields',
      category: 'custom'
    }
  ];
  
  const toggleFavorite = (type: string) => {
    if (favorites.includes(type)) {
      setFavorites(favorites.filter(t => t !== type));
    } else {
      setFavorites([...favorites, type]);
    }
  };
  
  const handleFieldDragStart = (e: React.DragEvent, fieldDef: FieldDefinition) => {
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
    
    if (['dropdown', 'radio', 'selectbutton'].includes(fieldDef.type)) {
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
                    <TabsTrigger value="input" className="justify-start text-left px-4 mb-1">
                      Input Fields
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="justify-start text-left px-4 mb-1">
                      Advanced Fields
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
                  <DropdownMenuItem onClick={() => setSelectedCategory('date')}>
                    Date Fields
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory('input')}>
                    Input Fields
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory('advanced')}>
                    Advanced Fields
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
                      {/* Text fields */}
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
                      {field.type === 'mentionbox' && (
                        <Textarea placeholder="Type @ to mention..." disabled rows={2} />
                      )}
                      
                      {/* Date fields */}
                      {(field.type === 'date' || field.type === 'calendar') && (
                        <Input type="date" disabled />
                      )}
                      
                      {/* Choice fields */}
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
                      {field.type === 'toggle' && (
                        <div className="flex justify-between items-center">
                          <Label className="text-sm">Toggle option</Label>
                          <div className="h-5 w-10 bg-gray-300 rounded-full"></div>
                        </div>
                      )}
                      {field.type === 'selectbutton' && (
                        <div className="flex gap-2">
                          <div className="bg-primary text-white text-xs py-1 px-2 rounded">Option 1</div>
                          <div className="border text-xs py-1 px-2 rounded">Option 2</div>
                        </div>
                      )}
                      {field.type === 'tristatecheckbox' && (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border bg-gray-200 mr-2"></div>
                          <Label className="text-sm">Tri-state option</Label>
                        </div>
                      )}
                      {field.type === 'multistatecheckbox' && (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border bg-primary text-white flex items-center justify-center rounded-sm mr-2">A</div>
                          <Label className="text-sm">Multi-state option</Label>
                        </div>
                      )}
                      
                      {/* Input fields */}
                      {field.type === 'inputgroup' && (
                        <div className="flex border rounded">
                          <div className="px-2 bg-gray-100 flex items-center border-r text-gray-500">@</div>
                          <Input className="border-0" placeholder="username" disabled />
                        </div>
                      )}
                      {field.type === 'inputmask' && (
                        <Input placeholder="(___) ___-____" disabled />
                      )}
                      {field.type === 'inputswitch' && (
                        <div className="flex justify-between items-center">
                          <Label className="text-sm">Enable feature</Label>
                          <div className="h-5 w-10 bg-primary rounded-full"></div>
                        </div>
                      )}
                      {field.type === 'inputotp' && (
                        <div className="flex gap-2 justify-center">
                          <div className="w-8 h-8 border rounded flex items-center justify-center">1</div>
                          <div className="w-8 h-8 border rounded flex items-center justify-center">2</div>
                          <div className="w-8 h-8 border rounded flex items-center justify-center">3</div>
                          <div className="w-8 h-8 border rounded flex items-center justify-center">4</div>
                        </div>
                      )}
                      
                      {/* Advanced fields */}
                      {field.type === 'slider' && (
                        <div className="py-4">
                          <div className="h-1 bg-gray-300 rounded-full relative">
                            <div className="absolute h-4 w-4 bg-primary rounded-full -top-1.5"></div>
                          </div>
                        </div>
                      )}
                      {field.type === 'rating' && (
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < 3 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                            />
                          ))}
                        </div>
                      )}
                      {field.type === 'treeselect' && (
                        <div className="border rounded p-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <span className="mr-1">▶</span> Hierarchical options
                          </div>
                        </div>
                      )}
                      {field.type === 'color' && (
                        <div className="flex space-x-2">
                          <div className="h-8 w-8 bg-blue-500 rounded"></div>
                          <Input value="#3b82f6" disabled />
                        </div>
                      )}
                      
                      {/* Media fields */}
                      {field.type === 'file' && (
                        <Input type="file" disabled />
                      )}
                      
                      {/* Custom fields */}
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
