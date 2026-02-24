import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask, deleteTask } from "@/lib/api/tasks.api";
import type { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task.types";
import { taskKeys } from "./useTasks";

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaskDto) => createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
            updateTask(id, data),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

            const previousQueries = queryClient.getQueriesData<Task[]>({
                queryKey: taskKeys.lists(),
            });

            let oldTask: Task | undefined;
            for (const [, tasks] of previousQueries) {
                if (tasks) {
                    oldTask = tasks.find((t) => t.id === id);
                    if (oldTask) break;
                }
            }

            if (oldTask) {
                const newTask = { ...oldTask, ...data };
                let addedToTarget = false;

                previousQueries.forEach(([queryKey, oldData]) => {
                    if (!oldData) return;
                    const queryMeta = queryKey[2] as { column?: string };
                    let newData = oldData.filter((t) => t.id !== id);

                    if (data.column !== undefined) {
                        if (queryMeta.column === data.column && !addedToTarget) {
                            newData = [...newData, newTask];
                            addedToTarget = true;
                        }
                    } else {
                        if (queryMeta.column === oldTask?.column) {
                            newData = oldData.map((t) => (t.id === id ? newTask : t));
                        }
                    }
                    queryClient.setQueryData(queryKey, newData);
                });
            }

            return { previousQueries };
        },

        onError: (_err, _vars, context) => {
            context?.previousQueries?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

            const previousQueries = queryClient.getQueriesData<Task[]>({
                queryKey: taskKeys.lists(),
            });

            queryClient.setQueriesData<Task[]>(
                { queryKey: taskKeys.lists() },
                (old) => (old ? old.filter((t) => t.id !== id) : old)
            );

            return { previousQueries };
        },
        onError: (_err, _vars, context) => {
            context?.previousQueries?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    });
}
