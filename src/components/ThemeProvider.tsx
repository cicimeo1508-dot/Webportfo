"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
  isAdminIp: boolean;
  detectedIp: string;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  isAdminIp: false,
  detectedIp: "",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAdminIp, setIsAdminIp] = useState(false);
  const [detectedIp, setDetectedIp] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("apple-os26-theme") as "light" | "dark" | null;
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    }

    fetch("/api/auth-ip")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isAdmin === "boolean") {
          setIsAdminIp(data.isAdmin);
          setDetectedIp(data.detectedIp || "");
        }
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("apple-os26-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isAdminIp, detectedIp }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
