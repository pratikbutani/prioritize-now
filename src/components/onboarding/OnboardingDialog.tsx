
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Welcome to Prioritize Now!</DialogTitle>
          <DialogDescription>
            Learn how to effectively manage your tasks using the Eisenhower Matrix.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1 pr-4">
        <div className="grid gap-4 py-4 text-sm">
          <section>
            <h3 className="font-semibold text-base mb-1">What is the Eisenhower Matrix?</h3>
            <p>
              The Eisenhower Matrix helps you categorize tasks based on urgency and importance,
              so you can focus on what truly matters. It's divided into four quadrants:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Do (Urgent & Important):</strong> Tasks you should tackle immediately.
              </li>
              <li>
                <strong>Schedule (Not Urgent & Important):</strong> Tasks you should plan to do later.
              </li>
              <li>
                <strong>Delegate (Urgent & Not Important):</strong> Tasks you can assign to someone else.
              </li>
              <li>
                <strong>Delete (Not Urgent & Not Important):</strong> Tasks you can eliminate.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-1">How to Use This App</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Adding Tasks:</strong> Type your task in the input field at the top and press Enter or click the &quot;+&quot; button. New tasks appear in &quot;My Tasks List&quot;.
              </li>
              <li>
                <strong>Prioritizing Tasks:</strong> Drag and drop tasks from &quot;My Tasks List&quot; or between quadrants to categorize them.
              </li>
              <li>
                <strong>Reordering Tasks:</strong> Within any list or quadrant, drag a task and drop it onto another task to place it before that task.
              </li>
              <li>
                <strong>Completing Tasks:</strong> Click the checkbox next to a task to mark it as complete. Completed tasks are visually struck through.
              </li>
              <li>
                <strong>Deleting Tasks:</strong> Hover over a task and click the trash icon to delete it.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-1">Importing & Exporting Tasks</h3>
             <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                    <strong>Access Options:</strong> Click the three-dots icon in the top-right corner.
                </li>
                <li>
                    <strong>Download Sample JSON:</strong> Get a pre-filled JSON file to see the expected format for importing.
                </li>
                <li>
                    <strong>Import JSON:</strong> Upload your task list from a JSON file. You&apos;ll be asked to confirm if you want to replace all existing tasks.
                </li>
                <li>
                    <strong>Export JSON:</strong> Download all your current tasks as a JSON file to back them up or transfer them.
                </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-1">Data Persistence</h3>
            <p>
              Your tasks are automatically saved in your browser&apos;s local storage. This means your tasks will be there even if you close your browser or restart your computer, as long as you don&apos;t clear your browser&apos;s site data.
            </p>
          </section>
           <section>
            <h3 className="font-semibold text-base mb-1">Offline Use (PWA)</h3>
            <p>
              This application is a Progressive Web App (PWA). You can install it on your desktop or mobile device for an app-like experience and offline access. Look for an &quot;Install&quot; button in your browser&apos;s address bar or menu.
            </p>
          </section>
        </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Got it!</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
