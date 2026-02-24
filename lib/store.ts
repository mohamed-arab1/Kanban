import type { Task } from "@/types/task.types";
import seedData from "../db.json";

/**
 * In-memory task store attached to `globalThis`.
 *
 * Why globalThis?
 * - In Next.js dev mode, modules are re-evaluated on every HMR/request,
 *   which wipes out plain module-level variables.
 * - On Vercel, serverless function instances can also re-import modules.
 * - `globalThis` survives module re-evaluations within the same process,
 *   so data persists across requests as long as the process is alive.
 */

interface TaskStore {
    tasks: Task[];
    nextId: number;
}

const STORE_KEY = "__kanban_task_store__" as const;

function getStore(): TaskStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = globalThis as any;
    if (!g[STORE_KEY]) {
        g[STORE_KEY] = {
            tasks: [...(seedData.tasks as Task[])],
            nextId: seedData.tasks.length + 100,
        };
    }
    return g[STORE_KEY];
}

export function getAllTasks(): Task[] {
    return getStore().tasks;
}

export function getTaskById(id: string): Task | undefined {
    return getStore().tasks.find((t) => t.id === id);
}

export function createTask(data: Omit<Task, "id">): Task {
    const store = getStore();
    const newTask: Task = { ...data, id: String(store.nextId++) };
    store.tasks.push(newTask);
    return newTask;
}

export function updateTask(id: string, data: Partial<Task>): Task | null {
    const store = getStore();
    const index = store.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    store.tasks[index] = { ...store.tasks[index], ...data };
    return store.tasks[index];
}

export function deleteTask(id: string): boolean {
    const store = getStore();
    const index = store.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    store.tasks.splice(index, 1);
    return true;
}
