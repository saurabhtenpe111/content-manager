
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Plus, Layers, Move, Edit, Trash2, Save, X } from "lucide-react";
import FieldTypeSelector from "./FieldTypeSelector";
import { Badge } from "@/components/common/Badge";

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

const ContentTypeBuilder: React.FC = () => {
  const [fields, setFields] = React.useState<Field[]>([
    { id: "1", name: "Title", type: "Text Field", required: true },
    { id: "2", name: "Content", type: "Text Area", required: true },
    { id: "3", name: "PublishDate", type: "Date & Time", required: false },
    { id: "4", name: "Status", type: "Dropdown", required: true },
    { id: "5", name: "Author", type: "Relation", required: false },
  ]);
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  const [editingField, setEditingField] = React.useState<string | null>(null);

  const handleAddField = (type: string) => {
    const newField = {
      id: Date.now().toString(),
      name: `New ${type}`,
      type,
      required: false,
    };
    setFields([...fields, newField]);
    setShowFieldSelector(false);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleToggleRequired = (id: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, required: !field.required } : field
      )
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card glassEffect>
        <CardHeader>
          <CardTitle>Blog Post</CardTitle>
          <CardDescription>
            Define the structure for your Blog Post content type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Fields</span>
              <Badge variant="outline">{fields.length}</Badge>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowFieldSelector(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3 bg-background rounded-md border hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-muted cursor-move">
                    <Move className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{field.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      {field.type}
                      {field.required && (
                        <Badge variant="primary" className="ml-2">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleRequired(field.id)}
                    className="h-8 w-8"
                  >
                    {field.required ? (
                      <span className="text-xs font-medium">Optional</span>
                    ) : (
                      <span className="text-xs font-medium">Required</span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingField(field.id === editingField ? null : field.id)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveField(field.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {fields.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md">
                <Layers className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No fields added yet. Click "Add Field" to start building your
                  content type.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowFieldSelector(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Field
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">Cancel</Button>
            <Button variant="primary">
              <Save className="mr-2 h-4 w-4" />
              Save Content Type
            </Button>
          </div>
        </CardContent>
      </Card>

      {showFieldSelector && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-scale-in">
          <div className="w-full max-w-2xl">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Add New Field</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFieldSelector(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <FieldTypeSelector onSelect={handleAddField} onClose={() => setShowFieldSelector(false)} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTypeBuilder;
