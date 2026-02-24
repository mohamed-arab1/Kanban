import type { ColumnId } from "@/types/task.types";

export interface ColumnConfig {
    id: ColumnId;
    label: string;
    color: string;
    dotColor: string;
}

export const COLUMNS: ColumnConfig[] = [
    {
        id: "backlog",
        label: "Backlog",
        color: "#7C3AED",
        dotColor: "#7C3AED",
    },
    {
        id: "in_progress",
        label: "In Progress",
        color: "#F59E0B",
        dotColor: "#F59E0B",
    },
    {
        id: "review",
        label: "In Review",
        color: "#3B82F6",
        dotColor: "#3B82F6",
    },
    {
        id: "done",
        label: "Done",
        color: "#10B981",
        dotColor: "#10B981",
    },
];

export const COLUMN_MAP: Record<ColumnId, ColumnConfig> = COLUMNS.reduce(
    (acc, col) => ({ ...acc, [col.id]: col }),
    {} as Record<ColumnId, ColumnConfig>
);

export const TASKS_PER_PAGE = 5;
