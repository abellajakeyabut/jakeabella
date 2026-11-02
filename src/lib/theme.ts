export type Theme = "light" | "dark";

export const THEME_KEY = "theme";

/**
 * Inlined in <head> (see layout.tsx) so it runs before first paint: applies the saved theme,
 * or the OS preference when nothing is saved, so there's no flash of the wrong theme.
 * Kept out of the "use client" module so the server layout gets the string itself.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
