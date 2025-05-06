'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Quadrant } from '@/components/matrix/Quadrant';
import { TaskInput } from '@/components/tasks/TaskInput';
import type { Task, QuadrantId } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { downloadFile } from '@/lib/download';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

// Custom hook for managing state in localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error('Error reading localStorage key “' + key + '”:', error);
      return initialValue;
    }
  });

  // useEffect to update local storage when the state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          typeof storedValue === 'function'
            ? storedValue(storedValue)
            : storedValue;
        // Save state
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.error('Error writing to localStorage key “' + key + '”:', error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}


export function EisenhowerMatrix() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const { toast } = useToast();

  const addTask = (description: string) => {
    if (description.trim()) {
      const newTask: Task = {
        id: uuidv4(), // Generate unique ID
        description,
        quadrant: 'unprioritized', // Start in unprioritized
        completed: false,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      toast({
        title: 'Task Added',
        description: `Task "${description}" added to My Tasks List.`,
      });
    }
  };

  const moveTask = (taskId: string, targetQuadrantId: QuadrantId | 'unprioritized') => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, quadrant: targetQuadrantId } : task
      )
    );
     toast({
      title: 'Task Moved',
      description: `Task moved to ${targetQuadrantId === 'unprioritized' ? 'My Tasks List' : targetQuadrantId.charAt(0).toUpperCase() + targetQuadrantId.slice(1)}.`,
    });
  };

  const toggleCompleteTask = (taskId: string) => {
     setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
     toast({
        title: 'Task Status Updated',
        description: `Task completion status changed.`,
      });
  };

 const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast({
      title: 'Task Deleted',
      description: `Task removed successfully.`,
      variant: 'destructive',
    });
  };

  const exportTasksToJson = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    downloadFile(dataStr, 'eisenhower-tasks.json', 'application/json');
     toast({
        title: 'Export Successful',
        description: `Tasks exported as JSON.`,
      });
  };

  const exportTasksToCsv = () => {
    if (tasks.length === 0) {
       toast({
          title: 'Export Failed',
          description: 'No tasks to export.',
          variant: 'destructive',
        });
      return;
    }
    const header = ['id', 'description', 'quadrant', 'completed'];
    const rows = tasks.map(task =>
        [
            task.id,
            `"${task.description.replace(/"/g, '""')}"`, // Escape quotes
            task.quadrant,
            task.completed
        ].join(',')
    );
    const csvContent = [header.join(','), ...rows].join('\n');
    downloadFile(csvContent, 'eisenhower-tasks.csv', 'text/csv');
    toast({
        title: 'Export Successful',
        description: `Tasks exported as CSV.`,
      });
  };


  const getTasksByQuadrant = (quadrantId: QuadrantId | 'unprioritized') => {
    return tasks.filter((task) => task.quadrant === quadrantId);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onExportJson={exportTasksToJson} onExportCsv={exportTasksToCsv} />
      <main className="flex flex-col flex-grow p-4 gap-4">
        {/* Input area at the top */}
        <TaskInput addTask={addTask} />

        {/* Main layout: Unprioritized on left, Quadrants grid on right */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Unprioritized tasks area on the left */}
          <div className="lg:col-span-1">
             <Quadrant
                id="unprioritized"
                title="My Tasks List" // Updated title
                tasks={getTasksByQuadrant('unprioritized')}
                onDropTask={moveTask}
                onToggleComplete={toggleCompleteTask}
                onDeleteTask={deleteTask}
                className="h-full min-h-[300px]" // Ensure it takes full height in its column
              />
          </div>

          {/* Quadrants grid on the right */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Quadrant
              id="do"
              title="Urgent & Important"
              description="Do it now"
              tasks={getTasksByQuadrant('do')}
              onDropTask={moveTask}
              onToggleComplete={toggleCompleteTask}
              onDeleteTask={deleteTask}
            />
            <Quadrant
              id="schedule"
              title="Not Urgent & Important"
              description="Schedule it"
              tasks={getTasksByQuadrant('schedule')}
              onDropTask={moveTask}
              onToggleComplete={toggleCompleteTask}
              onDeleteTask={deleteTask}
            />
            <Quadrant
              id="delegate"
              title="Urgent & Not Important"
              description="Delegate it"
              tasks={getTasksByQuadrant('delegate')}
              onDropTask={moveTask}
              onToggleComplete={toggleCompleteTask}
              onDeleteTask={deleteTask}
            />
            <Quadrant
              id="delete"
              title="Not Urgent & Not Important"
              description="Delete it"
              tasks={getTasksByQuadrant('delete')}
              onDropTask={moveTask}
              onToggleComplete={toggleCompleteTask}
              onDeleteTask={deleteTask}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
