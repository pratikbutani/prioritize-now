import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from "@/components/ui/use-toast"
import { downloadFile } from '@/lib/utils';
import { Header } from './Header';
import { Footer } from './Footer';
import { TaskInput } from './TaskInput';
import { Quadrant } from './Quadrant';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type QuadrantId = 'do' | 'schedule' | 'delegate' | 'delete';

export interface Task {
  id: string;
  description: string;
  quadrant: QuadrantId | 'unprioritized';
  completed: boolean;
}


// Hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial value function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setStoredValueWrapped = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setStoredValueWrapped] as [T, (value: T | ((val: T) => T)) => void];
}


// Usage
function downloadFile(data: string, filename: string, type: string) {
  const file = new Blob([data], { type: type });
  const a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

// Hook
//lifted from https://usehooks.com/useLocalStorage/  modified to handle undefined/null initial values
//to avoid writing "undefined" as a string to localstorage on first load
export function useLocalStorage2<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial value function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setStoredValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  }, [key, setStoredValue, storedValue]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      //initialValue is only used to populate local storage if it's empty
      const item = window.localStorage.getItem(key);
      if (storedValue !== undefined && storedValue !== null) {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        }
      
      // If initialValue itself is undefined or null, and nothing in localStorage,
      // avoid writing undefined/null to localStorage.
      // This check prevents overwriting localStorage with an empty initialValue on first load if nothing exists.
      } else if (initialValue !== undefined && initialValue !== null && !item) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    }
  }, [key, storedValue, initialValue]); // initialValue added to dependency array

  return [storedValue, setStoredValue];
}

export function EisenhowerMatrix() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const { toast } = useToast();
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [pendingImportTasks, setPendingImportTasks] = useState<Task[] | null>(null);

  const addTask = (description: string) => {
    if (description.trim()) {
      const newTask: Task = {
        id: uuidv4(),
        description,
        quadrant: 'unprioritized',
        completed: false,
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]); // Add to the beginning of unprioritized
      toast({
        title: 'Task Added',
        description: `Task "${description}" added to My Tasks List.`,
      });
    }
  };

  const handleDropOnQuadrant = useCallback((droppedTaskId: string, targetQuadrantId: QuadrantId | 'unprioritized') => {
    setTasks(prevTasks => {
      const taskToMoveIndex = prevTasks.findIndex(task => task.id === droppedTaskId);
      if (taskToMoveIndex === -1) return prevTasks;

      const taskToMove = { ...prevTasks[taskToMoveIndex], quadrant: targetQuadrantId };
      
      const remainingTasks = prevTasks.filter(task => task.id !== droppedTaskId);
      
      // Add to the end of the list, effectively end of its new quadrant visually after filtering
      return [...remainingTasks, taskToMove];
    });
    toast({
      title: 'Task Moved',
      description: `Task moved to ${targetQuadrantId === 'unprioritized' ? 'My Tasks List' : targetQuadrantId.charAt(0).toUpperCase() + targetQuadrantId.slice(1)}.`,
    });
  }, [setTasks, toast]);

  const handleDropOnTaskItem = useCallback((droppedTaskId: string, targetTaskId: string) => {
    setTasks(prevTasks => {
      const droppedTask = prevTasks.find(t => t.id === droppedTaskId);
      const targetTask = prevTasks.find(t => t.id === targetTaskId);

      if (!droppedTask || !targetTask) return prevTasks;

      // The dropped task adopts the target task's quadrant
      const updatedDroppedTask = { ...droppedTask, quadrant: targetTask.quadrant };

      // Remove the original dropped task
      let newTasks = prevTasks.filter(t => t.id !== droppedTaskId);

      // Find the index of the target task in the modified list
      const targetTaskIndex = newTasks.findIndex(t => t.id === targetTaskId);

      if (targetTaskIndex === -1) { // Should not happen
        newTasks.push(updatedDroppedTask); // Fallback: add to end
      } else {
        // Insert the updated dropped task before the target task
        newTasks.splice(targetTaskIndex, 0, updatedDroppedTask);
      }
      return newTasks;
    });
    toast({
      title: 'Task Reordered',
      description: 'Task has been reordered.',
    });
  }, [setTasks, toast]);


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
    if (tasks.length === 0) {
      toast({
        title: 'Export Failed',
        description: 'No tasks to export.',
        variant: 'destructive',
      });
      return;
    }
    const dataStr = JSON.stringify(tasks, null, 2);
    downloadFile(dataStr, 'eisenhower-tasks.json', 'application/json');
     toast({
        title: 'Export Successful',
        description: `Tasks exported as JSON.`,
      });
  };

  const downloadSampleJson = () => {
    const sampleTasks: Task[] = [
      { id: "sample-do-1", description: "Submit critical report", quadrant: "do", completed: false },
      { id: "sample-do-2", description: "Fix urgent production bug", quadrant: "do", completed: false },
      { id: "sample-schedule-1", description: "Plan next sprint", quadrant: "schedule", completed: false },
      { id: "sample-schedule-2", description: "Book annual check-up", quadrant: "schedule", completed: true },
      { id: "sample-delegate-1", description: "Schedule team meeting", quadrant: "delegate", completed: false },
      { id: "sample-delegate-2", description: "Order office supplies", quadrant: "delegate", completed: false },
      { id: "sample-delete-1", description: "Read old newsletters", quadrant: "delete", completed: false },
      { id: "sample-delete-2", description: "Sort spam emails", quadrant: "delete", completed: false },
      { id: "sample-unprioritized-1", description: "Brainstorm new project ideas", quadrant: "unprioritized", completed: false },
      { id: "sample-unprioritized-2", description: "Research new productivity tools", quadrant: "unprioritized", completed: false },
    ];
    const dataStr = JSON.stringify(sampleTasks, null, 2);
    downloadFile(dataStr, 'eisenhower-sample-tasks.json', 'application/json');
    toast({
      title: 'Sample JSON Downloaded',
      description: 'A sample task file has been downloaded.',
    });
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target?.result as string) as Task[];
        // Basic validation: check if it's an array
        if (!Array.isArray(importedTasks)) {
          throw new Error("Invalid JSON format: Not an array.");
        }
        // Further validation can be added here (e.g., check task structure)
        importedTasks.forEach(task => {
            if (typeof task.id !== 'string' || typeof task.description !== 'string' || typeof task.quadrant !== 'string' || typeof task.completed !== 'boolean') { // Added more robust type checks
                throw new Error("Invalid task structure in JSON. Each task must have id, description, quadrant, and completed status.");
            }
        });
        setPendingImportTasks(importedTasks);
        setIsImportConfirmOpen(true);
      } catch (error) {
        console.error("Error importing JSON:", error);
        toast({
          title: 'Import Failed',
          description: (error as Error).message || 'Could not parse JSON file or invalid format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (pendingImportTasks) {
      setTasks(pendingImportTasks);
      toast({
        title: 'Import Successful',
        description: 'Tasks imported successfully.',
      });
    }
    setIsImportConfirmOpen(false);
    setPendingImportTasks(null);
  };

  const cancelImport = () => {
    setIsImportConfirmOpen(false);
    setPendingImportTasks(null);
  };


  const getTasksByQuadrant = (quadrantId: QuadrantId | 'unprioritized') => {
    return tasks.filter((task) => task.quadrant === quadrantId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        onExportJson={exportTasksToJson} 
        onImportJson={handleImportJson}
        onDownloadSampleJson={downloadSampleJson}
      />
      <main className="flex flex-col flex-grow p-4 gap-4">
        <TaskInput addTask={addTask} />

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
             <Quadrant
                id="unprioritized"
                title="My Tasks List"
                tasks={getTasksByQuadrant('unprioritized')}
                onDropTask={handleDropOnQuadrant}
                onDropOnTaskItem={handleDropOnTaskItem}
                onToggleComplete={toggleCompleteTask}
                onDeleteTask={deleteTask}
                className="h-full min-h-[300px]" 
              />
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Quadrant
              id="do"
              title="Urgent & Important"
              description="Do it now"
              tasks={getTasksByQuadrant('do')}
              onDropTask={handleDropOnQuadrant}
              onDropOnTaskItem={handleDropOnTaskItem}
              onToggleComplete={toggleCompleteTask}
              onDeleteTask={deleteTask}
            />
            <Quadrant
              id="schedule"
              title="Not Urgent & Important"
              description="Schedule it"
              tasks={getTasksByQuadrant('schedule')}
              onDropTask={handleDropOnQuadrant}
              onDropOnTaskItem={handleDropOnTaskItem}
              onToggleComplete={toggleCompleteTask}
              onDeleteTask={deleteTask}
            />
            <Quadrant
              id="delegate"
              title="Urgent & Not Important"
              description="Delegate it"
              tasks={getTasksByQuadrant('delegate')}
              onDropTask={handleDropOnQuadrant}
              onDropOnTaskItem={handleDropOnTaskItem}
              onToggleComplete={toggleCompleteTask}
              onDeleteTask={deleteTask}
            />
            <Quadrant
              id="delete"
              title="Not Urgent & Not Important"
              description="Delete it"
              tasks={getTasksByQuadrant('delete')}
              onDropTask={handleDropOnQuadrant}
              onDropOnTaskItem={handleDropOnTaskItem}
              onToggleComplete={toggleCompleteTask}
              onDeleteTask={deleteTask}
            />
          </div>
        </div>
      </main>
      <Footer />

      <AlertDialog open={isImportConfirmOpen} onOpenChange={setIsImportConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Import</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all current tasks with the tasks from the selected JSON file. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelImport}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Replace All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    