"use client";

import React from 'react';
import type { DragEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    // Don't allow dragging completed tasks? Or maybe allow? For now, allow.
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCheckboxChange = () => {
    onToggleComplete(task.id);
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
  };

  return (
    <Card
      draggable={!task.completed} // Optionally disable dragging completed tasks
      onDragStart={handleDragStart}
      className={cn(
        "mb-2 group", // Add group for hover effects
        task.completed ? "opacity-70" : "cursor-grab active:cursor-grabbing"
      )}
      aria-label={`Task: ${task.description}${task.completed ? ' (Completed)' : ''}`}
    >
      <CardContent className="p-2 flex items-center gap-2">
        <GripVertical
          className={cn(
            "text-muted-foreground size-4 shrink-0",
            task.completed ? "invisible" : "" // Hide grip handle when completed
          )}
          aria-hidden="true"
        />
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleCheckboxChange}
          aria-labelledby={`task-desc-${task.id}`}
          className="shrink-0"
        />
        <label
          id={`task-desc-${task.id}`}
          htmlFor={`task-${task.id}`}
          className={cn(
            "text-sm flex-grow break-words cursor-pointer",
            task.completed ? "line-through text-muted-foreground" : ""
          )}
        >
          {task.description}
        </label>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" // Show on hover/focus
          onClick={handleDeleteClick}
          aria-label={`Delete task: ${task.description}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
