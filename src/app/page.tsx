"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { TaskInput } from '@/components/tasks/TaskInput';
import { Quadrant } from '@/components/matrix/Quadrant';
import type { Task, QuadrantId } from '@/types';

// Define quadrant details
const QUADRANTS: { id: QuadrantId; title: string; description: string }[] = [
  { id: 'do', title: 'Urgent & Important', description: 'Do it now' },
  { id: 'schedule', title: 'Important, Not Urgent', description: 'Schedule a time' },
  { id: 'delegate', title: 'Urgent, Not Important', description: 'Delegate if possible' },
  { id: 'delete', title: 'Not Urgent & Not Important', description: 'Eliminate or postpone' },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false); // State to track component mount

  // Load tasks from local storage on mount
  useEffect(() => {
    setIsMounted(true); // Component has mounted
    const storedTasks = localStorage.getItem('prioritizeNowTasks');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Failed to parse tasks from localStorage", error);
        // Optionally clear corrupted storage
        // localStorage.removeItem('prioritizeNowTasks');
      }
    }
  }, []);

  // Save tasks to local storage whenever tasks change, but only after mount
  useEffect(() => {
    if (isMounted) { // Only save after initial mount/load
      localStorage.setItem('prioritizeNowTasks', JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = useCallback((description: string) => {
    const newTask: Task = {
      id: Date.now().toString(), // Simple unique ID generation
      description,
      quadrant: 'unprioritized', // Start in the input area
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  const moveTask = useCallback((taskId: string, targetQuadrantId: QuadrantId | 'unprioritized') => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, quadrant: targetQuadrantId } : task
      )
    );
  }, []);

   // Filter tasks for each quadrant
   const unprioritizedTasks = tasks.filter(task => task.quadrant === 'unprioritized');
   const quadrantTasks = QUADRANTS.reduce((acc, quadrant) => {
     acc[quadrant.id] = tasks.filter(task => task.quadrant === quadrant.id);
     return acc;
   }, {} as Record<QuadrantId, Task[]>);


  // Prevent rendering on server or before hydration
  if (!isMounted) {
    // Optional: Render a loading state or null
     return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4 flex flex-col">
            <div className="flex justify-center items-center h-full">
             <p>Loading tasks...</p>
            </div>
        </main>
       </div>
     )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-4 flex flex-col lg:flex-row gap-4">
        {/* Task Input & Unprioritized Tasks Area */}
        <div className="lg:w-1/4 flex flex-col gap-4">
          <TaskInput addTask={addTask} />
          <Quadrant
            id="unprioritized"
            title="New Tasks"
            description="Drag tasks from here"
            tasks={unprioritizedTasks}
            onDropTask={moveTask}
            className="flex-grow"
          />
        </div>

        {/* Eisenhower Matrix Area */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUADRANTS.map((q) => (
            <Quadrant
              key={q.id}
              id={q.id}
              title={q.title}
              description={q.description}
              tasks={quadrantTasks[q.id]}
              onDropTask={moveTask}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
