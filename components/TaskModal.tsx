"use client";

import { memo, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Task, CreateTaskDto, ColumnId, Priority } from "@/types/task.types";
import { COLUMNS } from "@/features/tasks/columnConfig";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto) => void;
  task?: Task | null;
  defaultColumn?: ColumnId;
  isLoading?: boolean;
}

const DEFAULT_FORM: CreateTaskDto = {
  title: "",
  description: "",
  column: "backlog",
  priority: "medium",
};

function TaskModal({
  open,
  onClose,
  onSubmit,
  task,
  defaultColumn,
  isLoading,
}: TaskModalProps) {
  const [form, setForm] = useState<CreateTaskDto>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskDto, string>>>({});

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        column: task.column,
        priority: task.priority,
      });
    } else {
      setForm({ ...DEFAULT_FORM, column: defaultColumn ?? "backlog" });
    }
    setErrors({});
  }, [task, defaultColumn, open]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const handleChange =
    (field: keyof CreateTaskDto) =>
    (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
      aria-labelledby="task-modal-title"
    >
      <DialogTitle
        id="task-modal-title"
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {task ? "Edit Task" : "New Task"}
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close modal">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Title"
            value={form.title}
            onChange={handleChange("title")}
            error={!!errors.title}
            helperText={errors.title}
            size="small"
            required
            autoFocus
            fullWidth
            inputProps={{ maxLength: 80 }}
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange("description")}
            error={!!errors.description}
            helperText={errors.description}
            size="small"
            required
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 400 }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="column-label">Column</InputLabel>
              <Select
                labelId="column-label"
                label="Column"
                value={form.column}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, column: e.target.value as ColumnId }))
                }
              >
                {COLUMNS.map((col) => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                label="Priority"
                value={form.priority}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, priority: e.target.value as Priority }))
                }
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            {isLoading ? "Saving…" : task ? "Save Changes" : "Create Task"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default memo(TaskModal);
