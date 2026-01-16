import { updateUser } from "./auth.js";

export function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  window.speechSynthesis.speak(u);
}

export function wireSpeakButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-speak]");
    if (!btn) return;
    const id = btn.getAttribute("data-speak");
    const el = document.getElementById(id);
    if (el) speak(el.textContent.trim());
  });
}

export async function setVoicePreference(uid, enabled) {
  localStorage.setItem("pz_voice", JSON.stringify({ enabled: !!enabled }));
  if (uid) await updateUser(uid, { "preferencias.voiceEnabled": !!enabled });
}