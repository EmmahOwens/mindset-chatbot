
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

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [responseLength, setResponseLength] = useState(150);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [useFriendlyTone, setUseFriendlyTone] = useState(true);
  
  // Load settings from localStorage on initial render
  useEffect(() => {
    const settings = localStorage.getItem('chatSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setResponseLength(parsedSettings.responseLength || 150);
      setShowTimestamps(parsedSettings.showTimestamps ?? true);
      setUseFriendlyTone(parsedSettings.useFriendlyTone ?? true);
    }
  }, []);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify({
      responseLength,
      showTimestamps,
      useFriendlyTone,
    }));
  }, [responseLength, showTimestamps, useFriendlyTone]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
              defaultValue={[responseLength]}
              max={300}
              step={10}
              onValueChange={(value) => setResponseLength(value[0])}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-base font-medium">Show Message Timestamps</label>
            <Switch
              checked={showTimestamps}
              onCheckedChange={setShowTimestamps}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-base font-medium">Use Friendly Tone</label>
            <Switch
              checked={useFriendlyTone}
              onCheckedChange={setUseFriendlyTone}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
