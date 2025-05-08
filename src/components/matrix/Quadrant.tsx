
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
  onDropTask: (taskId: string, targetQuadrantId: QuadrantId | 'unprioritized') => void; // For dropping on quadrant itself
  onDropOnTaskItem: (draggedTaskId: string, targetTaskId: string) => void; // For dropping on a task item
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  className?: string;
  description?: string;
  isClient: boolean; // Added to help with hydration
}

export function Quadrant({
  id,
  title,
  tasks,
  onDropTask,
  onDropOnTaskItem, // New prop
  onToggleComplete,
  onDeleteTask,
  className,
  description,
  isClient,
}: QuadrantProps) {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnQuadrant = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling to parent drop zones if nested
    const taskId = e.dataTransfer.getData('text/plain');
    // Ensure this drop is directly on the quadrant, not on a task item by checking target
    if (taskId && (e.target as HTMLElement).closest('.task-item-card') === null) {
       onDropTask(taskId, id);
    }
  };

  const backgroundClass = {
    do: 'bg-quadrant-do',
    schedule: 'bg-quadrant-schedule',
    delegate: 'bg-quadrant-delegate',
    delete: 'bg-quadrant-delete',
    unprioritized: 'bg-muted' 
  }[id] || 'bg-card'; 

  return (
    <Card
      onDragOver={handleDragOver}
      onDrop={handleDropOnQuadrant} // This handles drops on the quadrant itself
      className={cn("flex flex-col h-full min-h-[200px] shadow-md", backgroundClass, className)}
      aria-labelledby={`quadrant-title-${id}`}
      aria-describedby={description ? `quadrant-desc-${id}` : undefined}
    >
      <CardHeader className="p-3 border-b">
        <CardTitle id={`quadrant-title-${id}`} className="text-lg font-semibold text-center">{title}</CardTitle>
        {description && <p id={`quadrant-desc-${id}`} className="text-xs text-muted-foreground text-center mt-1">{description}</p>}
      </CardHeader>
      <CardContent className="p-3 flex-grow overflow-y-auto">
        {isClient && tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center mt-4">Drop tasks here</p>
        ) : !isClient && tasks.length === 0 ? (
           <p className="text-sm text-muted-foreground text-center mt-4">Loading tasks...</p> // Or a loader
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDeleteTask}
              onDropOnTaskItem={onDropOnTaskItem} // Pass this down
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

