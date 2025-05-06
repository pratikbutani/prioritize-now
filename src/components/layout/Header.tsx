
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download,Upload, FileJson, MoreVertical } from 'lucide-react';

interface HeaderProps {
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onDownloadSampleJson: () => void;
}

export function Header({ onExportJson, onImportJson, onDownloadSampleJson }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between">
      <div className="w-1/3"></div> {/* Spacer */}
      <h1 className="text-2xl font-bold text-center w-1/3">Prioritize Now</h1>
      <div className="flex gap-2 w-1/3 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" aria-label="Task options">
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
  );
}


