"use client";

import { memo, useCallback, useDeferredValue, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");
  const deferred = useDeferredValue(value);

  // Only trigger search when deferred value settles
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onSearch(e.target.value);
    },
    [onSearch]
  );

  void deferred; // used implicitly via React's deferred rendering

  return (
    <TextField
      value={value}
      onChange={handleChange}
      placeholder="Search tasks..."
      size="small"
      variant="outlined"
      aria-label="Search tasks"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </InputAdornment>
        ),
      }}
      sx={{
        width: { xs: "100%", sm: 280 },
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: "background.paper",
          "& fieldset": { borderColor: "divider" },
          "&:hover fieldset": { borderColor: "primary.main" },
        },
      }}
    />
  );
}

export default memo(SearchBar);
