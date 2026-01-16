export const QUIZ_QUESTIONS = [
  {
    text: "Como você se sente em relação ao seu futuro agora?",
    options: [
      { text: "Ansiosa(o) e sem direção", hint: "quero um começo rápido", score: { emprego: 2, cursos: 1, concursos: 0 } },
      { text: "Quero me preparar com calma", hint: "topo construir base", score: { emprego: 0, cursos: 2, concursos: 1 } },
      { text: "Quero estabilidade e um plano claro", hint: "posso ter constância", score: { emprego: 0, cursos: 1, concursos: 2 } }
    ]
  },
  {
    text: "O que mais pesa na sua realidade hoje?",
    options: [
      { text: "Preciso de dinheiro mais rápido", hint: "mesmo que comece simples", score: { emprego: 2, cursos: 0, concursos: 0 } },
      { text: "Não tenho base/rumo e isso me trava", hint: "quero algo possível", score: { emprego: 1, cursos: 2, concursos: 0 } },
      { text: "Quero algo estável no longo prazo", hint: "sem pular etapas", score: { emprego: 0, cursos: 0, concursos: 2 } }
    ]
  },
  {
    text: "Você consegue manter uma rotina (mesmo pequena)?",
    options: [
      { text: "Pouco. Eu estou no limite", hint: "preciso do menor passo", score: { emprego: 2, cursos: 0, concursos: 0 } },
      { text: "Consigo 20–40 min por dia", hint: "dá pra construir", score: { emprego: 0, cursos: 2, concursos: 1 } },
      { text: "Consigo 1h+ alguns dias", hint: "topo consistência", score: { emprego: 0, cursos: 1, concursos: 2 } }
    ]
  },
  {
    text: "O que você sente mais falta agora?",
    options: [
      { text: "Oportunidade", hint: "um lugar pra começar", score: { emprego: 2, cursos: 0, concursos: 0 } },
      { text: "Orientação", hint: "um mapa", score: { emprego: 1, cursos: 2, concursos: 1 } },
      { text: "Estabilidade", hint: "algo claro", score: { emprego: 0, cursos: 0, concursos: 2 } }
    ]
  }
];

export function scoreQuiz(answers) {
  const total = { emprego: 0, cursos: 0, concursos: 0 };

  for (const a of answers) {
    total.emprego += a.emprego || 0;
    total.cursos += a.cursos || 0;
    total.concursos += a.concursos || 0;
  }

  const caminhoRecomendado =
    total.emprego >= total.cursos && total.emprego >= total.concursos
      ? "emprego"
      : total.cursos >= total.concursos
        ? "cursos"
        : "concursos";

  return {
    totals: total,
    caminhoRecomendado,
    data: new Date().toISOString()
  };
}

export function saveQuizLocal(result) {
  const payload = {
    caminho: result.caminhoRecomendado,
    totals: result.totals,
    updatedAt: result.data
  };
  localStorage.setItem("pz_quiz_v1", JSON.stringify(payload));
  return payload;
}