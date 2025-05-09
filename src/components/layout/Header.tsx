
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Upload, FileJson, MoreVertical, Info } from 'lucide-react';
import { OnboardingDialog } from '@/components/onboarding/OnboardingDialog';

interface HeaderProps {
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onDownloadSampleJson: () => void;
}

export function Header({ onExportJson, onImportJson, onDownloadSampleJson }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportJson(file);
      // Reset file input to allow importing the same file again if needed
      event.target.value = '';
    }
  };

  return (
    <>
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between">
        <div className="w-[5.5rem] flex-shrink-0"></div> {/* Left spacer for balance, width matches right controls */}
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center flex-grow px-1 whitespace-nowrap overflow-hidden text-ellipsis">
          Prioritize Now
        </h1>
        <div className="w-[5.5rem] flex-shrink-0 flex gap-2 justify-end items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOnboardingOpen(true)}
            aria-label="Show onboarding information"
            className="text-primary-foreground hover:bg-primary/80 focus-visible:ring-primary-foreground"
          >
            <Info className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Task options"
                className="text-primary-foreground hover:bg-primary/80 focus-visible:ring-primary-foreground"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDownloadSampleJson}>
                <FileJson className="mr-2 h-4 w-4" />
                Download Sample JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportJson}>
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </header>
      <OnboardingDialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen} />
    </>
  );
}
