"use client";

import { useCallback, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Box, Card, CardContent, Typography } from "@mui/material";
import KanbanColumn from "./KanbanColumn";
import TaskModal from "./TaskModal";
import type { Task, ColumnId, CreateTaskDto } from "@/types/task.types";
import { COLUMNS } from "@/features/tasks/columnConfig";
import { useCreateTask, useUpdateTask } from "@/hooks/useMutations";
import { useQueryClient } from "@tanstack/react-query";
import { taskKeys } from "@/hooks/useTasks";

interface KanbanBoardProps {
  search: string;
}

export default function KanbanBoard({ search }: KanbanBoardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultColumn, setDefaultColumn] = useState<ColumnId>("backlog");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const queryClient = useQueryClient();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();

  // Use MouseSensor + TouchSensor for reliable cross-browser DnD
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTask = useCallback((column: ColumnId) => {
    setEditingTask(null);
    setDefaultColumn(column);
    setModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleModalSubmit = useCallback(
    (data: CreateTaskDto) => {
      if (editingTask) {
        updateTask({ id: editingTask.id, data }, { onSuccess: () => setModalOpen(false) });
      } else {
        createTask(data, { onSuccess: () => setModalOpen(false) });
      }
    },
    [editingTask, createTask, updateTask]
  );

  /** Search all cached query pages for a task by id */
  const findTaskById = useCallback(
    (id: string): Task | undefined => {
      const allQueries = queryClient.getQueriesData<Task[]>({
        queryKey: taskKeys.lists(),
      });
      for (const [, data] of allQueries) {
        if (!data) continue;
        const found = data.find((t) => t.id === id);
        if (found) return found;
      }
    },
    [queryClient]
  );

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const task = findTaskById(String(active.id));
      if (task) setActiveTask(task);
    },
    [findTaskById]
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveTask(null);
      if (!over || active.id === over.id) return;

      const draggedTask = findTaskById(String(active.id));
      if (!draggedTask) return;

      // Determine the target column:
      // `over.id` is either a column id (when hovering the empty droppable zone)
      // or a task id (when hovering over another task card).
      const isColumnTarget = COLUMNS.some((c) => c.id === String(over.id));

      let targetColumn: ColumnId;
      if (isColumnTarget) {
        targetColumn = over.id as ColumnId;
      } else {
        const overTask = findTaskById(String(over.id));
        if (!overTask) return;
        targetColumn = overTask.column;
      }

      if (draggedTask.column === targetColumn) return;

      // Optimistically update cache and fire PATCH request
      updateTask({ id: draggedTask.id, data: { column: targetColumn } });
    },
    [findTaskById, updateTask]
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
            alignItems: "flex-start",
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-track": { backgroundColor: "grey.100", borderRadius: 3 },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "grey.400", borderRadius: 3 },
          }}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              config={col}
              search={search}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
            />
          ))}
        </Box>

        {/* Ghost card shown while dragging */}
        <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
          {activeTask && (
            <Card
              elevation={8}
              sx={{
                borderRadius: 2,
                width: 260,
                cursor: "grabbing",
                border: "2px solid",
                borderColor: "primary.light",
                rotate: "2deg",
              }}
            >
              <CardContent sx={{ p: "12px !important" }}>
                <Typography variant="subtitle2" fontWeight={600} fontSize="0.85rem" noWrap>
                  {activeTask.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize="0.75rem"
                  sx={{
                    mt: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {activeTask.description}
                </Typography>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        task={editingTask}
        defaultColumn={defaultColumn}
        isLoading={isCreating}
      />
    </>
  );
}
