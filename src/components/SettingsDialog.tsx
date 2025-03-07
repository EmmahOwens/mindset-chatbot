
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [responseLength, setResponseLength] = useState(150);
  const [useFriendlyTone, setUseFriendlyTone] = useState(true);
  
  // Load settings from localStorage on initial render
  useEffect(() => {
    const settings = localStorage.getItem('chatSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setResponseLength(parsedSettings.responseLength || 150);
      setUseFriendlyTone(parsedSettings.useFriendlyTone ?? true);
    }
  }, []);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify({
      responseLength,
      useFriendlyTone,
    }));
  }, [responseLength, useFriendlyTone]);
  
  const resetSettings = () => {
    setResponseLength(150);
    setUseFriendlyTone(true);
    localStorage.removeItem('chatSettings');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Chat Settings</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <DialogDescription className="text-base text-muted-foreground">
            Customize your chat experience. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium">AI Response Length</label>
              <span className="text-right">{responseLength}</span>
            </div>
            <Slider
              value={[responseLength]}
              max={300}
              step={10}
              onValueChange={(value) => setResponseLength(value[0])}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-base font-medium">Use Friendly Tone with Emojis</label>
            <Switch
              checked={useFriendlyTone}
              onCheckedChange={setUseFriendlyTone}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetSettings}>
            Reset Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
