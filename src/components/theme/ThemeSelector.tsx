
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ThemeSelectorProps {
  onThemeChange?: (theme: "light" | "dark" | "system") => void;
}

const ThemeSelector = ({ onThemeChange }: ThemeSelectorProps) => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 animate-fade-in">
      <Card 
        className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden hover:border-primary transition-all ${theme === 'light' ? 'border-2 border-primary' : 'border border-white/10'}`}
        onClick={() => handleThemeChange("light")}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white">
          <Sun className="h-5 w-5 text-black" />
          <span className="text-sm font-medium text-black">Light</span>
        </div>
      </Card>
      <Card 
        className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden hover:border-primary transition-all ${theme === 'dark' ? 'border-2 border-primary' : 'border border-white/10'}`}
        onClick={() => handleThemeChange("dark")}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black">
          <Moon className="h-5 w-5 text-white" />
          <span className="text-sm font-medium text-white">Dark</span>
        </div>
      </Card>
      <Card 
        className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden hover:border-primary transition-all ${theme === 'system' ? 'border-2 border-primary' : 'border border-white/10'}`}
        onClick={() => handleThemeChange("system")}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-white to-black">
          <Laptop className="h-5 w-5" />
          <span className="text-sm font-medium">System</span>
        </div>
      </Card>
    </div>
  );
};

export default ThemeSelector;
