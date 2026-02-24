"use client";

import { memo, useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Skeleton,
  Alert,
  Pagination,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import type { Task, ColumnId } from "@/types/task.types";
import type { ColumnConfig } from "@/features/tasks/columnConfig";
import { TASKS_PER_PAGE } from "@/features/tasks/columnConfig";
import { useTasks } from "@/hooks/useTasks";
import { useDeleteTask } from "@/hooks/useMutations";

interface KanbanColumnProps {
  config: ColumnConfig;
  search: string;
  onAddTask: (column: ColumnId) => void;
  onEditTask: (task: Task) => void;
}

function KanbanColumn({ config, search, onAddTask, onEditTask }: KanbanColumnProps) {
  const [page, setPage] = useState(1);

  const { data: tasks = [], isLoading, isError } = useTasks(config.id, page, search);
  const { mutate: deleteTask } = useDeleteTask();

  const { setNodeRef, isOver } = useDroppable({ id: config.id });

  const handleDelete = useCallback(
    (id: string) => deleteTask(id),
    [deleteTask]
  );

  const handleAddTask = useCallback(
    () => onAddTask(config.id),
    [config.id, onAddTask]
  );

  // Estimate total pages (we show pagination only if a full page was returned)
  const showNextPage = tasks.length === TASKS_PER_PAGE;
  const totalPages = showNextPage ? page + 1 : page;

  return (
    <Paper
      elevation={0}
      sx={{
        flex: "0 0 280px",
        minWidth: 280,
        maxWidth: 300,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        backgroundColor: "grey.50",
        border: "1px solid",
        borderColor: isOver ? config.color : "divider",
        transition: "border-color 0.2s",
        overflow: "hidden",
      }}
    >
      {/* Column header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: config.dotColor,
            flexShrink: 0,
          }}
        />
        <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: 0.5 }}>
          {config.label}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            backgroundColor: "grey.200",
            borderRadius: 1,
            px: 0.8,
            py: 0.2,
            fontWeight: 700,
            color: "text.secondary",
          }}
        >
          {tasks.length}
        </Typography>
      </Box>

      {/* Task list (droppable area) */}
      <Box
        ref={setNodeRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1.5,
          minHeight: 80,
          backgroundColor: isOver ? `${config.color}08` : "transparent",
          transition: "background-color 0.15s",
        }}
      >
        {isLoading && (
          <>
            <Skeleton variant="rounded" height={90} sx={{ mb: 1.5, borderRadius: 2 }} />
            <Skeleton variant="rounded" height={90} sx={{ mb: 1.5, borderRadius: 2 }} />
          </>
        )}

        {isError && (
          <Alert severity="error" sx={{ fontSize: "0.75rem", py: 0.5 }}>
            Failed to load tasks
          </Alert>
        )}

        {!isLoading && !isError && (
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.disabled",
                  fontSize: "0.75rem",
                }}
              >
                No tasks
              </Box>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={handleDelete}
                />
              ))
            )}
          </SortableContext>
        )}
      </Box>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_e, val) => setPage(val)}
              size="small"
              shape="rounded"
              siblingCount={0}
            />
          </Box>
        </>
      )}

      {/* Add task button */}
      <Divider />
      <Box sx={{ p: 1 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddTask}
          fullWidth
          size="small"
          sx={{
            color: "text.secondary",
            justifyContent: "flex-start",
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.8rem",
            py: 0.8,
            "&:hover": { backgroundColor: "grey.100", color: "text.primary" },
          }}
        >
          Add task
        </Button>
      </Box>
    </Paper>
  );
}

export default memo(KanbanColumn);
