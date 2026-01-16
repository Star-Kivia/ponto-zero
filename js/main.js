import { initSupport } from "./support.js";

export function boot() {
  if (!document.querySelector(".blob.a")) {
    const a = document.createElement("div"); a.className = "blob a";
    const b = document.createElement("div"); b.className = "blob b";
    const c = document.createElement("div"); c.className = "blob c";
    document.body.appendChild(a); document.body.appendChild(b); document.body.appendChild(c);
  }

  initSupport();
}