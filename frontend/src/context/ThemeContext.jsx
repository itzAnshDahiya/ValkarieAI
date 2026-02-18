import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const theme = {
    isDark,
    toggleTheme: () => setIsDark(!isDark),
    
    // Color Palettes
    colors: isDark ? {
      // Dark Mode
      bg: {
        primary: "#0f1419",
        secondary: "#1a1f2e",
        tertiary: "#232333",
        hover: "#2a2a3e",
        input: "#1f2937",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b0b0c0",
        tertiary: "#808090",
      },
      accent: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
      },
      border: "#404050",
    } : {
      // Light Mode
      bg: {
        primary: "#ffffff",
        secondary: "#f5f7fa",
        tertiary: "#eeecf1",
        hover: "#e8e6f0",
        input: "#f3f4f6",
      },
      text: {
        primary: "#1a1a1a",
        secondary: "#4b5563",
        tertiary: "#999999",
      },
      accent: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
      },
      border: "#d1d5db",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
