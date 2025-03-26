
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/Card";
import { Grid3X3, Search, Settings } from "lucide-react";
import { Badge } from "@/components/common/Badge";

interface FieldTypeCardProps {
  name: string;
  description: string;
  category: string;
  icon: string;
}

const FieldTypeCard: React.FC<FieldTypeCardProps> = ({ name, description, category, icon }) => {
  return (
    <Card glassEffect hover className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 flex items-center justify-center rounded-md bg-primary/10 text-primary">
            <span className="text-lg">{icon}</span>
          </div>
          <CardTitle className="font-medium">{name}</CardTitle>
        </div>
        <Badge variant="outline">{category}</Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm">
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FieldTypes = () => {
  const fieldTypes = [
    {
      name: "Text Field",
      description: "Short text like titles or names with validation options",
      category: "Basic",
      icon: "T",
    },
    {
      name: "Text Area",
      description: "Long text with formatting capabilities and validation",
      category: "Basic",
      icon: "¶",
    },
    {
      name: "Number",
      description: "Numbers with min/max validation and formatting options",
      category: "Basic",
      icon: "1",
    },
    {
      name: "Email",
      description: "Email input with format validation and suggestions",
      category: "Basic",
      icon: "@",
    },
    {
      name: "Password",
      description: "Secure password input with masking and strength indicator",
      category: "Basic",
      icon: "***",
    },
    {
      name: "Date & Time",
      description: "Date and time picker with format and range options",
      category: "Basic",
      icon: "📅",
    },
    {
      name: "Dropdown",
      description: "Select from predefined options with search capability",
      category: "Choice",
      icon: "▼",
    },
    {
      name: "Multi-Select",
      description: "Select multiple items from a predefined list",
      category: "Choice",
      icon: "☑☑",
    },
    {
      name: "Checkbox",
      description: "Boolean values with custom labels and grouping",
      category: "Choice",
      icon: "☑",
    },
    {
      name: "Radio Button",
      description: "Mutually exclusive selection from options",
      category: "Choice",
      icon: "◉",
    },
    {
      name: "File Upload",
      description: "Upload files and images with preview and validation",
      category: "Media",
      icon: "📁",
    },
    {
      name: "Rich Text Editor",
      description: "WYSIWYG editor with formatting controls",
      category: "Advanced",
      icon: "📝",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Field Types</h1>
            <p className="text-muted-foreground mt-1">
              Configure and manage available field types
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="search"
              className="glass-input w-full py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/25"
              placeholder="Search field types..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              All
            </Button>
            <Button variant="outline" size="sm">
              Basic
            </Button>
            <Button variant="outline" size="sm">
              Choice
            </Button>
            <Button variant="outline" size="sm">
              Advanced
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fieldTypes.map((type) => (
            <FieldTypeCard
              key={type.name}
              name={type.name}
              description={type.description}
              category={type.category}
              icon={type.icon}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FieldTypes;
