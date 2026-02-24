export type ColumnId = "backlog" | "in_progress" | "review" | "done";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
  order: number;
  priority: Priority;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  column: ColumnId;
  priority: Priority;
  order?: number;
  createdAt?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  column?: ColumnId;
  priority?: Priority;
  order?: number;
}

export interface TasksResponse {
  data: Task[];
  total: number;
}

export interface GetTasksParams {
  column?: ColumnId;
  page?: number;
  limit?: number;
  search?: string;
}
