"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import QueryProvider from "@/providers/QueryProvider";
import theme from "@/lib/theme";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
