const KEY = "pz_theme";

export function initTheme() {
  const saved = localStorage.getItem(KEY);
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  const theme = saved || (prefersLight ? "light" : "dark");
  setTheme(theme);
}

export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(KEY, theme);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
}