"use client";

import { useState, useCallback } from "react";
import { Box, Typography, AppBar, Toolbar, Container } from "@mui/material";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import KanbanBoard from "@/components/KanbanBoard";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 64 } }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <GridViewRoundedIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} lineHeight={1} fontSize="0.9rem">
                KANBAN BOARD
              </Typography>
              <Typography variant="caption" color="text.secondary" lineHeight={1}>
                Task Management
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Search */}
          <SearchBar onSearch={handleSearch} />
        </Toolbar>
      </AppBar>

      {/* Main board area */}
      <Container
        maxWidth={false}
        sx={{
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          py: 3,
          overflow: "hidden",
        }}
      >
        <KanbanBoard search={search} />
      </Container>
    </Box>
  );
}
