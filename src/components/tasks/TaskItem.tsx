"use client";

import React from 'react';
import type { DragEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Task } from '@/types';
import { GripVertical } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card
      draggable="true"
      onDragStart={handleDragStart}
      className="mb-2 cursor-grab active:cursor-grabbing"
      aria-label={`Task: ${task.description}`}
    >
      <CardContent className="p-2 flex items-center">
        <GripVertical className="mr-2 text-muted-foreground size-4 shrink-0" aria-hidden="true" />
        <span className="text-sm flex-grow break-words">{task.description}</span>
      </CardContent>
    </Card>
  );
}
