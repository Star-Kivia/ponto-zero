import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "./firebase.js";

export async function listEmpregos({ regiao = "Sergipe" } = {}) {

  try {
    const q1 = query(
      collection(db, "empregos"),
      where("regiao", "==", regiao),
      orderBy("nome"),
      limit(80)
    );
    const s1 = await getDocs(q1);
    const r1 = s1.docs.map(d => ({ id: d.id, ...d.data() }));
    if (r1.length) return r1;
  } catch (e) {
    // se deu erro de índice ou campo ausente, cai pro fallback
  }

  const q2 = query(collection(db, "empregos"), orderBy("nome"), limit(80));
  const s2 = await getDocs(q2);
  return s2.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function listConcursos({ regiao = "Sergipe" } = {}) {

  try {
    const q1 = query(
      collection(db, "concursos"),
      where("regiao", "==", regiao),
      orderBy("nome"),
      limit(80)
    );
    const s1 = await getDocs(q1);
    const r1 = s1.docs.map(d => ({ id: d.id, ...d.data() }));
    if (r1.length) return r1;
  } catch (e) {

  }

  const q2 = query(collection(db, "concursos"), orderBy("nome"), limit(80));
  const s2 = await getDocs(q2);
  return s2.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function listCursos() {
  const q = query(collection(db, "cursos"), orderBy("nome"), limit(120));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}