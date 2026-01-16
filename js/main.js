import { initSupport } from "./support.js";

export function boot() {
  if (!document.querySelector(".blob.a")) {
    const a = document.createElement("div"); a.className = "blob a";
    const b = document.createElement("div"); b.className = "blob b";
    const c = document.createElement("div"); c.className = "blob c";
    document.body.appendChild(a); document.body.appendChild(b); document.body.appendChild(c);

    // marca aba ativa no nav mobile
(() => {
  const p = (location.pathname || "").toLowerCase();
  let key = "index";
  if (p.includes("emprego")) key = "emprego";
  else if (p.includes("cursos")) key = "cursos";
  else if (p.includes("concurso")) key = "concursos";
  else if (p.includes("quiz")) key = "index";

  document.querySelectorAll(".pz-mobileNav a").forEach(a => {
    a.classList.toggle("active", a.dataset.nav === key);
  });
})();

  }

  initSupport();

}
