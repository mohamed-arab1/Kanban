import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#7C3AED",
            light: "#A78BFA",
            dark: "#5B21B6",
        },
        background: {
            default: "#F3F4F6",
            paper: "#FFFFFF",
        },
        grey: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            400: "#9CA3AF",
        },
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                },
            },
        },
    },
});

export default theme;
