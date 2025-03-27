
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export interface MentionItem {
  id: string;
  display: string;
  [key: string]: any;
}

export interface MentionBoxProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  suggestions?: MentionItem[];
  triggers?: string[];
  autoResize?: boolean;
  floatingLabel?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
  error?: string;
  className?: string;
  id?: string;
}

export const MentionBox = React.forwardRef<HTMLTextAreaElement, MentionBoxProps>(({
  label,
  value = '',
  onChange,
  suggestions = [],
  triggers = ['@'],
  autoResize = false,
  floatingLabel = false,
  invalid = false,
  disabled = false,
  required = false,
  placeholder = '',
  description,
  error,
  className,
  id,
  ...props
}, ref) => {
  const [text, setText] = useState(value);
  const [mentionData, setMentionData] = useState({
    active: false,
    trigger: '',
    search: '',
    index: -1,
    startPosition: 0,
  });
  const [filteredSuggestions, setFilteredSuggestions] = useState<MentionItem[]>([]);
  const [focused, setFocused] = useState(false);
  const [height, setHeight] = useState<string | undefined>(undefined);
  
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  // Connect the forwarded ref with our local ref
  useEffect(() => {
    if (typeof ref === 'function') {
      ref(textareaRef.current);
    } else if (ref) {
      ref.current = textareaRef.current;
    }
  }, [ref]);
  
  useEffect(() => {
    setText(value);
  }, [value]);
  
  useEffect(() => {
    if (mentionData.active && mentionData.search) {
      const filtered = suggestions.filter(item => 
        item.display.toLowerCase().includes(mentionData.search.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [mentionData.active, mentionData.search, suggestions]);
  
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setHeight(`${textareaRef.current.scrollHeight}px`);
    }
  }, [text, autoResize]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    
    // Check for mention triggers
    const position = e.target.selectionStart;
    const textBeforeCursor = newValue.substring(0, position);
    
    let mentionActive = false;
    let mentionTrigger = '';
    let mentionSearch = '';
    let triggerIndex = -1;
    
    for (const trigger of triggers) {
      const lastTrigger = textBeforeCursor.lastIndexOf(trigger);
      
      if (lastTrigger !== -1) {
        const textAfterTrigger = textBeforeCursor.substring(lastTrigger + trigger.length);
        const endsWithWhitespace = /\s$/.test(textAfterTrigger);
        
        if (!endsWithWhitespace && (lastTrigger === 0 || /\s/.test(textBeforeCursor[lastTrigger - 1]))) {
          mentionActive = true;
          mentionTrigger = trigger;
          mentionSearch = textAfterTrigger;
          triggerIndex = lastTrigger;
          break;
        }
      }
    }
    
    setMentionData({
      active: mentionActive,
      trigger: mentionTrigger,
      search: mentionSearch,
      index: triggerIndex,
      startPosition: triggerIndex + mentionTrigger.length,
    });
    
    if (onChange) {
      onChange(newValue);
    }
  };
  
  const insertMention = (item: MentionItem) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const { trigger, startPosition } = mentionData;
      
      const textBefore = text.substring(0, startPosition - trigger.length);
      const textAfter = text.substring(cursorPosition);
      
      const newText = `${textBefore}${trigger}${item.display} ${textAfter}`;
      
      setText(newText);
      
      if (onChange) {
        onChange(newText);
      }
      
      // Reset mention data
      setMentionData({
        active: false,
        trigger: '',
        search: '',
        index: -1,
        startPosition: 0,
      });
      
      // Focus back on textarea
      textareaRef.current.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!mentionData.active) return;
    
    if (e.key === 'Escape') {
      setMentionData({
        active: false,
        trigger: '',
        search: '',
        index: -1,
        startPosition: 0,
      });
      return;
    }
    
    if (filteredSuggestions.length > 0 && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
    }
  };
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // Check if the blur is due to clicking on a suggestion
    if (suggestionRef.current && suggestionRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setFocused(false);
    setMentionData({
      active: false,
      trigger: '',
      search: '',
      index: -1,
      startPosition: 0,
    });
  };
  
  const uniqueId = id || `mention-${label?.replace(/\s/g, '-').toLowerCase()}`;
  
  return (
    <div className="space-y-2">
      {label && !floatingLabel && (
        <Label htmlFor={uniqueId} className={cn(invalid && "text-destructive")}>
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className={cn("relative", floatingLabel && "pt-5")}>
        {floatingLabel && (
          <Label 
            htmlFor={uniqueId}
            className={cn(
              "absolute left-3 transition-all duration-150 pointer-events-none z-10",
              (focused || text) ? "text-xs top-0 text-primary" : "top-2.5 text-muted-foreground"
            )}
          >
            {label}{required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <Textarea
          ref={(node) => {
            textareaRef.current = node;
          }}
          id={uniqueId}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={!floatingLabel ? placeholder : ""}
          disabled={disabled}
          className={cn(
            className,
            invalid && "border-destructive focus-visible:ring-destructive",
            "relative",
            height && { height }
          )}
          aria-invalid={invalid}
          aria-required={required}
          {...props}
        />
        
        {mentionData.active && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionRef}
            className="absolute z-50 mt-1 max-h-60 w-[var(--radix-popover-trigger-width)] overflow-auto rounded-md border bg-popover p-1 shadow-md"
          >
            {filteredSuggestions.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => insertMention(item)}
                tabIndex={0}
              >
                {item.display}
              </div>
            ))}
          </div>
        )}
      </div>
      
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

MentionBox.displayName = "MentionBox";
