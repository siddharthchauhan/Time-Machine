
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Keyboard } from "lucide-react";

export const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-end">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0">
            <Keyboard className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs text-muted-foreground">
              {isOpen ? "Hide shortcuts" : "Keyboard shortcuts"}
            </span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <div className="rounded-md border p-4">
          <div className="text-sm font-medium mb-2">Available shortcuts:</div>
          <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Start/Stop timer</span>
              <kbd className="bg-secondary px-2 py-0.5 rounded text-xs">Alt + S</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Pause/Resume timer</span>
              <kbd className="bg-secondary px-2 py-0.5 rounded text-xs">Alt + P</kbd>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
