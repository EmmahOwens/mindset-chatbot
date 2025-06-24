
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ThemeToggleProps = {
  isCollapsed?: boolean;
}

export const ThemeToggle = ({ isCollapsed = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const button = (
    <button
      onClick={toggleTheme}
      className="w-full justify-start rounded-md p-2 hover:bg-secondary/50 dark:hover:bg-secondary/50 transition-all flex items-center gap-2"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {!isCollapsed && <span>Theme</span>}
    </button>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
