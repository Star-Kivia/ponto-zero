const KEYS = {
  QUIZ: "pz_quiz_v1",
  PREFS: "pz_prefs_v1",
  SUPPORT: "pz_support_outbox_v1",
  SAVED: "pz_saved_v1"
};

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getQuiz() {
  return read(KEYS.QUIZ, null);
}

export function setQuiz(payload) {
  write(KEYS.QUIZ, payload);
}

export function getPrefs() {
  return read(KEYS.PREFS, { theme: "light", voice: false, region: "Sergipe" });
}

export function setPrefs(patch) {
  const cur = getPrefs();
  const next = { ...cur, ...patch };
  write(KEYS.PREFS, next);
  return next;
}

export function getSupportOutbox() {
  return read(KEYS.SUPPORT, []);
}

export function pushSupportMessage(msgObj) {
  const list = getSupportOutbox();
  list.push(msgObj);
  write(KEYS.SUPPORT, list);
  return list;
}

export function getSaved() {
  return read(KEYS.SAVED, { empregos: [], cursos: [], concursos: [] });
}

export function toggleSaved(type, id) {
  const s = getSaved();
  const arr = s[type] || [];
  const idx = arr.indexOf(id);
  if (idx >= 0) arr.splice(idx, 1);
  else arr.push(id);
  s[type] = arr;
  write(KEYS.SAVED, s);
  return s;
}