"use client";

import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  addTask: (description: string) => void;
}

export function TaskInput({ addTask }: TaskInputProps) {
  const [taskDescription, setTaskDescription] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (taskDescription.trim()) {
      addTask(taskDescription.trim());
      setTaskDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <Input
        type="text"
        placeholder="Enter new task description..."
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        className="flex-grow"
        aria-label="New task description"
      />
      <Button type="submit" variant="default" size="icon" aria-label="Add Task">
         <Plus />
      </Button>
    </form>
  );
}
