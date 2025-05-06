
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
  onDropOnTaskItem: (draggedTaskId: string, targetTaskId: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDelete, onDropOnTaskItem }: TaskItemProps) {
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); 
    setIsDraggingOver(false);
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId && draggedTaskId !== task.id) { 
      onDropOnTaskItem(draggedTaskId, task.id);
    }
  };

  const handleCheckboxChange = () => {
    onToggleComplete(task.id);
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
  };

  return (
    <Card
      draggable={!task.completed}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave} 
      onDrop={handleDrop}         
      className={cn(
        "mb-2 group task-item-card", // Added 'task-item-card' for specific targeting
        task.completed ? "opacity-70" : "cursor-grab active:cursor-grabbing",
        isDraggingOver ? "border-primary ring-2 ring-primary" : "" // Visual feedback for drop target
      )}
      aria-label={`Task: ${task.description}${task.completed ? ' (Completed)' : ''}`}
    >
      <CardContent className="p-2 flex items-center gap-2">
        <GripVertical
          className={cn(
            "text-muted-foreground size-4 shrink-0",
            task.completed ? "invisible" : ""
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
            "text-sm flex-grow break-words", 
            task.completed ? "line-through text-muted-foreground" : ""
          )}
        >
          {task.description}
        </label>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          onClick={handleDeleteClick}
          aria-label={`Delete task: ${task.description}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

