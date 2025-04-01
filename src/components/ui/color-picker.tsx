
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#000000',
  onChange,
  label,
}) => {
  const [color, setColor] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-10 p-0 border-2" 
              style={{ backgroundColor: color }}
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <input
              type="color"
              value={color}
              onChange={handleChange}
              className="w-32 h-32 cursor-pointer"
            />
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          value={color}
          onChange={handleChange}
          className="w-28 font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};
