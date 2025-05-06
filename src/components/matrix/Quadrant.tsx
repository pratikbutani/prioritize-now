"use client";

import React from 'react';
import type { DragEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TaskItem } from '@/components/tasks/TaskItem';
import type { Task, QuadrantId } from '@/types';
import { cn } from '@/lib/utils';

interface QuadrantProps {
  id: QuadrantId | 'unprioritized';
  title: string;
  tasks: Task[];
  onDropTask: (taskId: string, targetQuadrantId: QuadrantId | 'unprioritized') => void;
  className?: string;
  description?: string; // Add description prop
}

export function Quadrant({ id, title, tasks, onDropTask, className, description }: QuadrantProps) {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTask(taskId, id);
    }
  };

  const backgroundClass = {
    do: 'bg-quadrant-do',
    schedule: 'bg-quadrant-schedule',
    delegate: 'bg-quadrant-delegate',
    delete: 'bg-quadrant-delete',
    unprioritized: 'bg-muted' // Use muted background for unprioritized
  }[id] || 'bg-card'; // Default to card background

  return (
    <Card
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn("flex flex-col h-full min-h-[200px] shadow-md", backgroundClass, className)} // Ensure consistent height
      aria-labelledby={`quadrant-title-${id}`}
      aria-describedby={description ? `quadrant-desc-${id}` : undefined}
    >
      <CardHeader className="p-3 border-b">
        <CardTitle id={`quadrant-title-${id}`} className="text-lg font-semibold text-center">{title}</CardTitle>
        {description && <p id={`quadrant-desc-${id}`} className="text-xs text-muted-foreground text-center mt-1">{description}</p>}
      </CardHeader>
      <CardContent className="p-3 flex-grow overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center mt-4">Drop tasks here</p>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
