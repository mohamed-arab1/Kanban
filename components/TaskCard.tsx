"use client";

import { memo, useCallback } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, Priority } from "@/types/task.types";

const PRIORITY_COLOR: Record<Priority, "error" | "warning" | "default"> = {
  high: "error",
  medium: "warning",
  low: "default",
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    // Remove transition while dragging so the card tracks the cursor instantly (no lag).
    // Transition only kicks in when the card is settling back (non-drag state).
    transition: isDragging ? undefined : transition,
  };

  const handleEdit = useCallback(() => onEdit(task), [onEdit, task]);
  const handleDelete = useCallback(() => onDelete(task.id), [onDelete, task.id]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 0 : 1}
      sx={{
        mb: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: isDragging ? "primary.light" : "divider",
        opacity: isDragging ? 0.35 : 1,
        backgroundColor: isDragging ? "grey.100" : "background.paper",
        transition: "opacity 0.15s, border-color 0.15s, box-shadow 0.15s",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: 2,
        },
      }}
      {...attributes}
    >
      <CardContent sx={{ p: "12px !important" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
          {/* Drag handle — touch-action: none is REQUIRED for dnd-kit */}
          <Box
            ref={setActivatorNodeRef}
            {...listeners}
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
              cursor: isDragging ? "grabbing" : "grab",
              flex: "0 0 auto",
              mt: 0.25,
              touchAction: "none", // critical: prevents browser scroll hijacking
              "&:hover": { color: "text.secondary" },
            }}
            aria-label="Drag to move task"
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              noWrap
              sx={{ mb: 0.5, fontSize: "0.85rem" }}
              title={task.title}
            >
              {task.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                mb: 1,
              }}
            >
              {task.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Chip
                label={task.priority.toUpperCase()}
                color={PRIORITY_COLOR[task.priority]}
                size="small"
                sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }}
              />

              <Box sx={{ display: "flex", gap: 0.25 }}>
                <Tooltip title="Edit task">
                  <IconButton
                    size="small"
                    onClick={handleEdit}
                    aria-label={`Edit ${task.title}`}
                    sx={{
                      p: 0.25,
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete task">
                  <IconButton
                    size="small"
                    onClick={handleDelete}
                    aria-label={`Delete ${task.title}`}
                    sx={{
                      p: 0.25,
                      color: "text.secondary",
                      "&:hover": { color: "error.main" },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default memo(TaskCard);
