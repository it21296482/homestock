import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0071E3", // Apple blue
      light: "#42A5F5",
      dark: "#0056B3",
    },
    secondary: {
      main: "#1D1D1F", // Apple dark gray
      light: "#86868B",
      dark: "#000000",
    },
    background: {
      default: "#F5F5F7", // Apple light gray background
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1D1D1F",
      secondary: "#86868B",
    },
    success: {
      main: "#34C759", // Apple green
    },
    error: {
      main: "#FF3B30", // Apple red
    },
    warning: {
      main: "#FF9500", // Apple orange
    },
    info: {
      main: "#5AC8FA", // Apple light blue
    },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    h1: {
      fontWeight: 600,
      fontSize: "3.5rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2.5rem",
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    subtitle1: {
      fontSize: "1.125rem",
      fontWeight: 400,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "1rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 980, // Pill-shaped buttons like Apple
          padding: "8px 16px",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

export default theme;
