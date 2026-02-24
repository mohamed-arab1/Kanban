import apiClient from "./client";
import type { Task, CreateTaskDto, UpdateTaskDto, GetTasksParams } from "@/types/task.types";

export async function getTasks(params: GetTasksParams = {}): Promise<Task[]> {
    const { page = 1, limit = 5, search = "", column } = params;

    const queryParams: Record<string, string | number> = {
        _page: page,
        _limit: limit,
    };

    if (search.trim()) {
        queryParams.q = search.trim();
    }

    if (column) {
        queryParams.column = column;
    }

    const response = await apiClient.get<Task[]>("/api/tasks", {
        params: queryParams,
    });

    return response.data;
}

export async function getTasksCount(column?: string, search?: string): Promise<number> {
    const queryParams: Record<string, string | number> = {};

    if (column) queryParams.column = column;
    if (search?.trim()) queryParams.q = search.trim();

    const response = await apiClient.get<Task[]>("/api/tasks", { params: queryParams });
    return response.data.length;
}

export async function createTask(data: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post<Task>("/api/tasks", {
        ...data,
        createdAt: new Date().toISOString(),
        order: Date.now(),
    });
    return response.data;
}

export async function updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await apiClient.patch<Task>(`/api/tasks/${id}`, data);
    return response.data;
}

export async function deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/api/tasks/${id}`);
}
