
import React from "react";
import { Button } from "@/components/common/Button";
import { Search } from "lucide-react";

interface FieldTypeProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  onClick: () => void;
}

const FieldType: React.FC<FieldTypeProps> = ({ icon, name, description, onClick }) => {
  return (
    <div
      className="flex gap-4 p-4 rounded-lg border hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all"
      onClick={onClick}
    >
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

interface FieldTypeSelectorProps {
  onSelect: (type: string) => void;
  onClose: () => void;
}

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const fieldTypes = [
    {
      icon: <span className="text-lg">T</span>,
      name: "Text Field",
      description: "Short text like titles or names",
      category: "basic",
    },
    {
      icon: <span className="text-lg">¶</span>,
      name: "Text Area",
      description: "Long text with formatting",
      category: "basic",
    },
    {
      icon: <span className="text-lg">1</span>,
      name: "Number",
      description: "Numbers (integer, float, decimal)",
      category: "basic",
    },
    {
      icon: <span className="text-lg">@</span>,
      name: "Email",
      description: "Email address with validation",
      category: "basic",
    },
    {
      icon: <span className="text-lg">***</span>,
      name: "Password",
      description: "Password field with masking",
      category: "basic",
    },
    {
      icon: <span className="text-lg">📅</span>,
      name: "Date & Time",
      description: "Date and/or time picker",
      category: "basic",
    },
    {
      icon: <span className="text-lg">▼</span>,
      name: "Dropdown",
      description: "Select from a list of options",
      category: "choice",
    },
    {
      icon: <span className="text-lg">☑</span>,
      name: "Checkbox",
      description: "Multiple checkboxes",
      category: "choice",
    },
    {
      icon: <span className="text-lg">◉</span>,
      name: "Radio Button",
      description: "Single selection radio buttons",
      category: "choice",
    },
    {
      icon: <span className="text-lg">📁</span>,
      name: "File Upload",
      description: "File/image upload and management",
      category: "media",
    },
    {
      icon: <span className="text-lg">🔄</span>,
      name: "Relation",
      description: "Reference other content types",
      category: "advanced",
    },
    {
      icon: <span className="text-lg">⚙️</span>,
      name: "JSON",
      description: "Structured data in JSON format",
      category: "advanced",
    },
  ];

  const filteredFieldTypes = fieldTypes.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="search"
          className="glass-input w-full py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/25"
          placeholder="Search field types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {filteredFieldTypes.map((type) => (
          <FieldType
            key={type.name}
            icon={type.icon}
            name={type.name}
            description={type.description}
            onClick={() => onSelect(type.name)}
          />
        ))}
      </div>

      {filteredFieldTypes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No field types match your search.</p>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default FieldTypeSelector;
