
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface RatingProps {
  id: string;
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  description?: string;
  totalStars?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  cancel?: boolean;
  readOnly?: boolean;
}

export const RatingField: React.FC<RatingProps> = ({
  id,
  label,
  value = 0,
  onChange,
  description,
  totalStars = 5,
  disabled = false,
  required = false,
  error,
  cancel = true,
  readOnly = false,
}) => {
  const [rating, setRating] = useState(value);
  const [hoverRating, setHoverRating] = useState(0);
  
  useEffect(() => {
    setRating(value);
  }, [value]);
  
  const handleRatingChange = (newRating: number) => {
    if (disabled || readOnly) return;
    
    // If clicking the same star and cancel is enabled, clear the rating
    const updatedRating = (cancel && newRating === rating) ? 0 : newRating;
    
    setRating(updatedRating);
    if (onChange) {
      onChange(updatedRating);
    }
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="flex items-center">
        {Array.from({ length: totalStars }, (_, i) => {
          const starValue = i + 1;
          const isFilled = hoverRating ? starValue <= hoverRating : starValue <= rating;
          
          return (
            <Star
              key={i}
              size={24}
              className={cn(
                "cursor-pointer transition-colors",
                isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                disabled || readOnly ? "opacity-50 cursor-not-allowed" : "hover:text-yellow-400"
              )}
              onClick={() => handleRatingChange(starValue)}
              onMouseEnter={() => !disabled && !readOnly && setHoverRating(starValue)}
              onMouseLeave={() => !disabled && !readOnly && setHoverRating(0)}
            />
          );
        })}
        
        <span className="ml-2 text-sm text-gray-500">
          {rating > 0 ? `${rating}/${totalStars}` : ''}
        </span>
      </div>
      
      {description && (
        <FormDescription className="text-xs text-gray-500">
          {description}
        </FormDescription>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
