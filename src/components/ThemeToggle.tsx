"use client";

import { useEffect, useState } from "react";
import PixelArt from "./PixelArt";
import { THEME_KEY, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  // The inline script has already set data-theme; read it after mount so SSR and hydration match.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") setTheme("dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Dark theme"
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
    >
      {/* CSS shows the right icon from data-theme, so it's correct even before hydration */}
      <PixelArt name="moon" scale={3} className="theme-toggle__moon" />
      <PixelArt name="sun" scale={3} className="theme-toggle__sun" />
    </button>
  );
}
