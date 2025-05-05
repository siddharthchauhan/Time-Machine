
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  options: { id: string; name: string }[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options..."
}) => {
  const handleSelect = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(value => value !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="border rounded-md p-2 space-y-2">
      <div className="flex flex-wrap gap-1">
        {selectedValues.map(value => (
          <Badge 
            key={value} 
            variant="secondary" 
            className="flex items-center gap-1"
          >
            {value}
            <button 
              className="ml-1 text-xs rounded-full hover:bg-primary/20 h-4 w-4 inline-flex items-center justify-center"
              onClick={() => handleSelect(value)}
            >
              ×
            </button>
          </Badge>
        ))}
        {selectedValues.length === 0 && (
          <div className="text-xs text-muted-foreground">{placeholder}</div>
        )}
      </div>
      
      <div className="mt-1 max-h-40 overflow-y-auto">
        {options.map(option => (
          <div 
            key={option.id}
            className={`px-2 py-1 text-sm rounded cursor-pointer hover:bg-secondary/50 ${
              selectedValues.includes(option.name) ? 'bg-secondary/30' : ''
            }`}
            onClick={() => handleSelect(option.name)}
          >
            {option.name}
          </div>
        ))}
      </div>
    </div>
  );
};
