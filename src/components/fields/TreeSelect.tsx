
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface TreeNode {
  id: string;
  label: string;
  value: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeSelectProps {
  label?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  treeData: TreeNode[];
  multiple?: boolean;
  checkboxSelection?: boolean;
  filterable?: boolean;
  showClear?: boolean;
  controlled?: boolean;
  floatingLabel?: boolean;
  filled?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
  error?: string;
  className?: string;
  id?: string;
}

export const TreeSelect = React.forwardRef<HTMLDivElement, TreeSelectProps>(({
  label,
  value,
  onChange,
  treeData = [],
  multiple = false,
  checkboxSelection = false,
  filterable = false,
  showClear = false,
  controlled = false,
  floatingLabel = false,
  filled = false,
  invalid = false,
  disabled = false,
  required = false,
  placeholder = "Select...",
  description,
  error,
  className,
  id,
  ...props
}, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : []) : (value ? [value as string] : [])
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [filterText, setFilterText] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(
        multiple ? (Array.isArray(value) ? value : []) : (value ? [value as string] : [])
      );
    }
  }, [value, multiple]);
  
  useEffect(() => {
    if (open && filterable && searchRef.current) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 0);
    }
  }, [open, filterable]);
  
  const getNodeById = (id: string, nodes: TreeNode[]): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = getNodeById(id, node.children);
        if (found) return found;
      }
    }
    return null;
  };
  
  const getNodePath = (id: string, nodes: TreeNode[], path: TreeNode[] = []): TreeNode[] | null => {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node.id === id) return newPath;
      if (node.children) {
        const found = getNodePath(id, node.children, newPath);
        if (found) return found;
      }
    }
    return null;
  };
  
  const getVisibleNodes = (nodes: TreeNode[], filter: string): TreeNode[] => {
    if (!filter) return nodes;
    
    return nodes.reduce<TreeNode[]>((acc, node) => {
      const nodeMatches = node.label.toLowerCase().includes(filter.toLowerCase());
      let childMatches: TreeNode[] = [];
      
      if (node.children) {
        childMatches = getVisibleNodes(node.children, filter);
      }
      
      if (nodeMatches || childMatches.length > 0) {
        return [...acc, {
          ...node,
          children: childMatches.length > 0 ? childMatches : node.children
        }];
      }
      
      return acc;
    }, []);
  };
  
  const handleNodeToggle = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  const handleNodeSelect = (id: string, checked?: boolean) => {
    if (disabled) return;
    
    setSelectedValues(prev => {
      let next: string[];
      
      if (checkboxSelection) {
        if (checked === undefined) return prev;
        
        if (multiple) {
          next = checked 
            ? [...prev, id] 
            : prev.filter(v => v !== id);
        } else {
          next = checked ? [id] : [];
        }
      } else {
        if (multiple) {
          next = prev.includes(id) 
            ? prev.filter(v => v !== id) 
            : [...prev, id];
        } else {
          next = prev.includes(id) ? [] : [id];
          setOpen(false);
        }
      }
      
      if (onChange) {
        onChange(multiple ? next : next[0] || '');
      }
      
      return next;
    });
  };
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    if (onChange) {
      onChange(multiple ? [] : '');
    }
  };
  
  const renderNode = (node: TreeNode, level: number = 0) => {
    const isSelected = selectedValues.includes(node.value);
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="select-none">
        <div 
          className={cn(
            "flex items-center py-1 px-2 hover:bg-accent rounded-sm",
            isSelected && !checkboxSelection && "bg-accent text-accent-foreground",
            level > 0 && "ml-4",
            node.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {hasChildren && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 text-muted-foreground"
              onClick={() => handleNodeToggle(node.id)}
              tabIndex={-1}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          {!hasChildren && (
            <div className="w-5" />
          )}
          
          {checkboxSelection && (
            <Checkbox
              className="mr-2"
              checked={isSelected}
              onCheckedChange={(checked) => 
                handleNodeSelect(node.value, checked as boolean)
              }
              disabled={disabled || node.disabled}
            />
          )}
          
          <div 
            className={cn(
              "flex-1 cursor-pointer truncate",
              node.disabled && "cursor-not-allowed"
            )}
            onClick={() => !checkboxSelection && !node.disabled && handleNodeSelect(node.value)}
          >
            {node.label}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  const displayValue = () => {
    if (selectedValues.length === 0) return "";
    
    if (selectedValues.length === 1) {
      const node = getNodeById(selectedValues[0], treeData);
      return node?.label || selectedValues[0];
    }
    
    return `${selectedValues.length} items selected`;
  };
  
  const visibleNodes = getVisibleNodes(treeData, filterText);
  const uniqueId = id || `tree-select-${label?.replace(/\s/g, '-').toLowerCase()}`;
  
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {label && !floatingLabel && (
        <Label htmlFor={uniqueId} className={cn(invalid && "text-destructive")}>
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <div className={cn("relative", floatingLabel && "pt-5")}>
          {floatingLabel && (
            <Label 
              htmlFor={uniqueId}
              className={cn(
                "absolute left-3 transition-all duration-150 pointer-events-none",
                (open || selectedValues.length > 0) ? "text-xs top-0 text-primary" : "top-2.5 text-muted-foreground"
              )}
            >
              {label}{required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          
          <PopoverTrigger asChild>
            <Button
              id={uniqueId}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-owns={open ? `${uniqueId}-popup` : undefined}
              className={cn(
                "w-full justify-between",
                filled && "bg-secondary",
                invalid && "border-destructive",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
            >
              <span className="truncate">{displayValue() || placeholder}</span>
              <div className="flex items-center gap-1">
                {showClear && selectedValues.length > 0 && (
                  <X 
                    className="h-4 w-4 text-muted-foreground cursor-pointer" 
                    onClick={handleClear}
                  />
                )}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            className="p-0 w-[var(--radix-popover-trigger-width)]" 
            align="start"
            id={`${uniqueId}-popup`}
          >
            <div className="max-h-[300px] overflow-auto">
              {filterable && (
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={searchRef}
                      placeholder="Search..."
                      className="pl-8"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {visibleNodes.length > 0 ? (
                <div className="p-1">
                  {visibleNodes.map(node => renderNode(node))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          </PopoverContent>
        </div>
      </Popover>
      
      {description && !error && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});

TreeSelect.displayName = "TreeSelect";
