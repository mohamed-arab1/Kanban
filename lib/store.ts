import type { Task } from "@/types/task.types";
import seedData from "../db.json";

/**
 * In-memory task store.
 *
 * On Vercel serverless, module-level variables persist as long as the
 * function instance is warm (typically ~5-15 minutes of inactivity).
 * This is the standard approach for mock/demo APIs on serverless platforms.
 *
 * Locally we still use json-server via `npm run api`, so this file
 * is only used in production (Vercel).
 */

let tasks: Task[] = [...(seedData.tasks as Task[])];
let nextId = tasks.length + 100; // avoid collisions with seed IDs

export function getAllTasks(): Task[] {
    return tasks;
}

export function getTaskById(id: string): Task | undefined {
    return tasks.find((t) => t.id === id);
}

export function createTask(data: Omit<Task, "id">): Task {
    const newTask: Task = { ...data, id: String(nextId++) };
    tasks.push(newTask);
    return newTask;
}

export function updateTask(id: string, data: Partial<Task>): Task | null {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...data };
    return tasks[index];
}

export function deleteTask(id: string): boolean {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}
