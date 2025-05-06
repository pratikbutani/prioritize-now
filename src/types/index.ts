export type QuadrantId = 'do' | 'schedule' | 'delegate' | 'delete';

export interface Task {
  id: string;
  description: string;
  quadrant: QuadrantId | 'unprioritized'; // Use 'unprioritized' for new tasks
}
