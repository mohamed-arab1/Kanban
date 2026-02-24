import { Redis } from "@upstash/redis";
import type { Task } from "@/types/task.types";
import seedData from "../db.json";

const TASKS_KEY = "kanban:tasks";

const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
});

async function ensureSeeded(): Promise<void> {
    const exists = await redis.exists(TASKS_KEY);
    if (!exists) {
        await redis.set(TASKS_KEY, JSON.stringify(seedData.tasks));
    }
}

async function readTasks(): Promise<Task[]> {
    await ensureSeeded();
    const raw = await redis.get<string>(TASKS_KEY);
    if (!raw) return [];
    return typeof raw === "string" ? JSON.parse(raw) : (raw as Task[]);
}

async function writeTasks(tasks: Task[]): Promise<void> {
    await redis.set(TASKS_KEY, JSON.stringify(tasks));
}

export async function getAllTasks(): Promise<Task[]> {
    return readTasks();
}

export async function getTaskById(id: string): Promise<Task | undefined> {
    const tasks = await readTasks();
    return tasks.find((t) => t.id === id);
}

export async function createTask(data: Omit<Task, "id">): Promise<Task> {
    const tasks = await readTasks();
    const newId = String(Date.now());
    const newTask: Task = { ...data, id: newId };
    tasks.push(newTask);
    await writeTasks(tasks);
    return newTask;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task | null> {
    const tasks = await readTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...data };
    await writeTasks(tasks);
    return tasks[index];
}

export async function deleteTask(id: string): Promise<boolean> {
    const tasks = await readTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    await writeTasks(tasks);
    return true;
}
