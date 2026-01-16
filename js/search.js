import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "./firebase.js";

function norm(s) {
  return (s || "").toLowerCase().trim();
}

async function prefix(colName, field, term) {
  const t = norm(term);
  if (!t) return [];
  const q = query(
    collection(db, colName),
    orderBy(field),
    startAt(t),
    endAt(t + "\uf8ff"),
    limit(12)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, _col: colName, ...d.data() }));
}

export async function searchAll(term) {
  const t = norm(term);
  if (t.length < 2) return [];

  const [emp, conc, cursosNome, cursosArea, cursosTipo] = await Promise.all([
    prefix("empregos", "nomeLower", t),
    prefix("concursos", "nomeLower", t),
    prefix("cursos", "nomeLower", t),
    prefix("cursos", "areaLower", t),
    prefix("cursos", "tipoLower", t),
  ]);

  const map = new Map();
  [...emp, ...conc, ...cursosNome, ...cursosArea, ...cursosTipo].forEach(x => {
    map.set(`${x._col}:${x.id}`, x);
  });

  return Array.from(map.values());
}