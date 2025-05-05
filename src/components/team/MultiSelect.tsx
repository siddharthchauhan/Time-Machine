
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface MultiSelectProps {
  options: { id: string; name: string }[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  className = ""
}) => {
  const handleSelect = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(value => value !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className={`border rounded-md p-2 space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-1 min-h-9">
        {selectedValues.map(value => (
          <Badge 
            key={value} 
            variant="secondary" 
            className="flex items-center gap-1"
          >
            {value}
            <button 
              type="button"
              className="ml-1 text-xs rounded-full hover:bg-primary/20 h-4 w-4 inline-flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                handleSelect(value);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {selectedValues.length === 0 && (
          <div className="text-xs text-muted-foreground p-1.5">{placeholder}</div>
        )}
      </div>
      
      <div className="mt-1 max-h-40 overflow-y-auto">
        {options.map(option => (
          <div 
            key={option.id}
            className={`px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-secondary/50 ${
              selectedValues.includes(option.name) ? 'bg-secondary/30' : ''
            }`}
            onClick={() => handleSelect(option.name)}
          >
            {option.name}
          </div>
        ))}
        {options.length === 0 && (
          <div className="text-xs text-muted-foreground p-2">No options available</div>
        )}
      </div>
    </div>
  );
};
