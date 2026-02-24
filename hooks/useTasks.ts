import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getTasks } from "@/lib/api/tasks.api";
import type { ColumnId } from "@/types/task.types";
import { TASKS_PER_PAGE } from "@/features/tasks/columnConfig";

export const taskKeys = {
    all: ["tasks"] as const,
    lists: () => [...taskKeys.all, "list"] as const,
    list: (column: ColumnId, page: number, search: string) =>
        [...taskKeys.lists(), { column, page, search }] as const,
};

export function useTasks(column: ColumnId, page: number, search: string) {
    return useQuery({
        queryKey: taskKeys.list(column, page, search),
        queryFn: () => getTasks({ column, page, limit: TASKS_PER_PAGE, search }),
        placeholderData: keepPreviousData,
    });
}
