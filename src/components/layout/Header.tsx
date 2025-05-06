
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface HeaderProps {
  onExportJson: () => void;
  onExportCsv: () => void;
}

export function Header({ onExportJson, onExportCsv }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between">
      <div className="w-1/3"></div> {/* Spacer */}
      <h1 className="text-2xl font-bold text-center w-1/3">Prioritize Now</h1>
      <div className="flex gap-2 w-1/3 justify-end">
        <Button variant="secondary" size="sm" onClick={onExportJson} aria-label="Export tasks as JSON">
          <Download className="mr-2 h-4 w-4" /> JSON
        </Button>
        <Button variant="secondary" size="sm" onClick={onExportCsv} aria-label="Export tasks as CSV">
           <Download className="mr-2 h-4 w-4" /> CSV
        </Button>
      </div>
    </header>
  );
}
