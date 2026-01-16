import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const LS_KEY = "pz_support_messages_v1";
const LS_CTX = "pz_support_context_v1";

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  children.forEach((c) => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return node;
}

function loadLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function saveLocal(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

function nowLabel() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function makeMsg({ who, text }) {
  return { id: Math.random().toString(36).slice(2, 10), who, text, at: Date.now(), time: nowLabel() };
}

function safeScroll(container) {
  requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
}

function norm(s) { return (s || "").toLowerCase().trim(); }
function includesAny(t, arr) { return arr.some(k => t.includes(k)); }

function pageKey() {
  const p = (location.pathname || "").toLowerCase();
  if (p.includes("emprego")) return "emprego";
  if (p.includes("cursos")) return "cursos";
  if (p.includes("concurso")) return "concursos";
  if (p.includes("quiz")) return "quiz";
  return "index";
}

const KB = {
  start: {
    title: "Como começar",
    answer:
      "Se você tá perdida(o), começa pequeno:\n" +
      "1) Faz o quiz\n" +
      "2) Escolhe 1 caminho\n" +
      "3) Faz 1 passo por semana\n\n" +
      "Não é sobre decidir tudo. É só sair do zero."
  },
  golpes: {
    title: "Golpes e taxas",
    answer:
      "Sinais de golpe:\n" +
      "• pedem PIX/taxa/equipamento\n" +
      "• urgência exagerada\n" +
      "• link estranho / promessa fácil demais\n\n" +
      "Regra: processo sério não começa com cobrança."
  },
  curriculo: {
    title: "Currículo (1 página)",
    answer:
      "Currículo bom = rápido de ler:\n" +
      "• 1 página\n" +
      "• objetivo curto (primeiro emprego em ____)\n" +
      "• 1 prova (curso/projeto)\n" +
      "• contato + cidade\n\n" +
      "Se você quiser, me diga pra qual área e eu te sugiro um objetivo pronto."
  },
  cursos: {
    title: "Como escolher curso",
    answer:
      "Escolha esperta:\n" +
      "• curto (pra concluir)\n" +
      "• claro (conteúdo + ementa)\n" +
      "• com prova (certificado e/ou projeto)\n\n" +
      "Meta: concluir e mostrar. Não colecionar curso."
  },
  concursos: {
    title: "Concurso (pra leigos)",
    answer:
      "Começa assim:\n" +
      "• escolhe 1 alvo (nível médio é comum)\n" +
      "• baixa o edital\n" +
      "• plano mínimo (português + matemática + informática)\n\n" +
      "Constância pequena ganha."
  },
  ansiedade: {
    title: "Quando você não tá bem",
    answer:
      "Tudo bem. Hoje o objetivo é só um passo pequeno.\n" +
      "Me diz: você quer algo mais rápido (emprego), construir base (cursos) ou estabilidade (concursos)?"
  }
};

const QUICK_BY_PAGE = {
  index: ["start", "ansiedade", "curriculo", "golpes"],
  emprego: ["curriculo", "golpes", "start"],
  cursos: ["cursos", "start", "curriculo"],
  concursos: ["concursos", "start"],
  quiz: ["start", "ansiedade"]
};

function detectIntent(text) {
  const t = norm(text);

  if (includesAny(t, ["golpe", "taxa", "pix", "equipamento", "cobran", "pagamento", "envio"])) return { type: "kb", key: "golpes" };
  if (includesAny(t, ["curriculo", "currículo", "cv", "objetivo", "resume"])) return { type: "kb", key: "curriculo" };
  if (includesAny(t, ["curso", "cursos", "certificado", "unova", "senac", "senai", "fundat", "ifs", "cebrac"])) return { type: "kb", key: "cursos" };
  if (includesAny(t, ["concurso", "edital", "pss", "banca"])) return { type: "kb", key: "concursos" };
  if (includesAny(t, ["ansiosa", "ansioso", "depress", "cansad", "não aguento", "triste", "sem energia", "no limite"])) return { type: "kb", key: "ansiedade" };

  if (includesAny(t, ["começ", "comec", "perdid", "sem rumo", "sem direção", "não sei", "e agora"])) return { type: "kb", key: "start" };

  if (includesAny(t, ["emprego", "trabalh", "vaga", "jovem aprendiz", "aprendiz", "estágio", "estagio"])) return { type: "route", key: "emprego" };
  if (includesAny(t, ["estudar", "formação", "formacao", "certificado"])) return { type: "route", key: "cursos" };
  if (includesAny(t, ["concurso", "estabilidade"])) return { type: "route", key: "concursos" };

  return { type: "fallback" };
}

function stepsForGoal(goal) {
  if (goal === "emprego") {
    return [
      "Escolha 1 fonte confiável e complete seu perfil.",
      "Currículo 1 página com 1 prova (curso/projeto).",
      "2 candidaturas simples por semana pra ganhar ritmo."
    ];
  }
  if (goal === "cursos") {
    return [
      "Escolha 1 curso curto e comece hoje (20 min já vale).",
      "Finalize e gere prova: certificado e/ou mini projeto.",
      "Use isso no currículo/portfólio e avance."
    ];
  }
  if (goal === "concursos") {
    return [
      "Escolha 1 alvo e baixe o edital.",
      "Plano mínimo: português + matemática + informática.",
      "Constância pequena: 30–40 min por dia."
    ];
  }
  return [];
}

function linkForGoal(goal) {
  if (goal === "emprego") return { href: "emprego.html", label: "Abrir Emprego" };
  if (goal === "cursos") return { href: "cursos.html", label: "Abrir Cursos" };
  if (goal === "concursos") return { href: "concursos.html", label: "Abrir Concursos" };
  return { href: "quiz.html", label: "Fazer o Quiz" };
}

function formatBullets(arr) { return arr.map(x => "• " + x).join("\n"); }

export function initSupport() {
  if (document.querySelector(".pz-supportFab")) return;

  const page = pageKey();
  const msgs = loadLocal(LS_KEY, []);
  const ctx = loadLocal(LS_CTX, { goal: null, lastTopic: null });

  // ----- FAB + Dock -----
  const fab = el("button", {
    class: "pz-supportFab",
    type: "button",
    "aria-label": "Abrir suporte",
    title: "Suporte"
  }, [
    el("span", { class: "pz-supportFabDot", "aria-hidden": "true" }),
    el("span", { class: "pz-supportFabIcon", "aria-hidden": "true", html: "?" })
  ]);

  const dock = el("section", {
    class: "pz-supportDock",
    role: "dialog",
    "aria-modal": "false",
    "aria-label": "Suporte Ponto Zero",
    "aria-hidden": "true"
  });

  const top = el("div", { class: "pz-supportTop" }, [
    el("div", { class: "pz-supportTopLeft" }, [
      el("div", { class: "pz-supportTitle" }, ["Suporte"]),
      el("div", { class: "pz-supportSub" }, ["sugestões inteligentes • sem fixo"])
    ]),
    el("div", { class: "pz-supportTopRight" }, [
      el("button", { class: "pz-supportIconBtn", type: "button", "aria-label": "Minimizar", title: "Minimizar" }, ["—"]),
      el("button", { class: "pz-supportIconBtn", type: "button", "aria-label": "Fechar", title: "Fechar" }, ["×"])
    ])
  ]);

  const tabs = el("div", { class: "pz-supportTabs", role: "tablist" }, [
    el("button", { class: "pz-tab active", type: "button", role: "tab", "aria-selected": "true", "data-tab": "chat" }, ["Chat"]),
    el("button", { class: "pz-tab", type: "button", role: "tab", "aria-selected": "false", "data-tab": "faq" }, ["Dúvidas"]),
    el("button", { class: "pz-tab", type: "button", role: "tab", "aria-selected": "false", "data-tab": "humano" }, ["Pessoa real"])
  ]);

  const panelChat = el("div", { class: "pz-supportPanel", "data-panel": "chat" });
  const panelFaq = el("div", { class: "pz-supportPanel", "data-panel": "faq", hidden: "" });
  const panelHuman = el("div", { class: "pz-supportPanel", "data-panel": "humano", hidden: "" });

  const feed = el("div", { class: "pz-supportFeed", "aria-live": "polite" });

  // quick chips por página (esses ficam, mas são utilitários e compactos)
  const quickRow = el("div", { class: "pz-supportQuick" });
  (QUICK_BY_PAGE[page] || QUICK_BY_PAGE.index).forEach(k => {
    quickRow.appendChild(el("button", { class: "pz-chip2", type: "button", "data-kb": k }, [KB[k].title]));
  });

  const inputRow = el("form", { class: "pz-supportInputRow" });
  const input = el("input", { class: "pz-supportInput", type: "text", placeholder: "Escreva sua dúvida…", "aria-label": "Escreva sua dúvida" });
  const send = el("button", { class: "pz-supportSend", type: "submit" }, ["Enviar"]);
  inputRow.appendChild(input);
  inputRow.appendChild(send);

  panelChat.appendChild(quickRow);
  panelChat.appendChild(feed);
  panelChat.appendChild(inputRow);

  // FAQ
  panelFaq.appendChild(el("div", { class: "pz-faq" }, [
    faqItem("Como eu começo sem travar?", KB.start.answer),
    faqItem("Como não cair em golpe?", KB.golpes.answer),
    faqItem("O que eu coloco no currículo?", KB.curriculo.answer),
    faqItem("Como escolher um curso?", KB.cursos.answer),
    faqItem("Concurso: por onde eu começo?", KB.concursos.answer)
  ]));

  // Pessoa real
  const humanCard = el("div", { class: "pz-humanCard" }, [
    el("div", { class: "pz-humanTitle" }, ["Falar com uma pessoa"]),
    el("div", { class: "pz-humanSub" }, ["Descreva sua situação. Eu organizo e registro sua mensagem."]),
    el("textarea", {
      class: "pz-humanText",
      rows: "5",
      placeholder: "Ex: terminei a escola, tô sem direção, preciso de um começo mais rápido…",
      "aria-label": "Mensagem para suporte humano"
    }),
    el("div", { class: "pz-humanRow" }, [
      el("button", { class: "btn primary", type: "button", id: "pzHumanSend" }, ["Enviar mensagem"]),
      el("button", { class: "btn", type: "button", id: "pzHumanClear" }, ["Limpar"])
    ]),
    el("div", { class: "pz-humanHint" }, ["Dica: cidade + idade + quanto tempo por semana você consegue = orientação muito melhor."])
  ]);
  panelHuman.appendChild(humanCard);

  dock.appendChild(top);
  dock.appendChild(tabs);
  dock.appendChild(panelChat);
  dock.appendChild(panelFaq);
  dock.appendChild(panelHuman);

  document.body.appendChild(fab);
  document.body.appendChild(dock);

  function renderMessage(m) {
    const row = el("div", { class: `pz-msg ${m.who}` });
    const bubble = el("div", { class: "pz-msgBubble" }, [
      el("div", { class: "pz-msgText" }, [m.text]),
      el("div", { class: "pz-msgTime" }, [m.time || ""])
    ]);
    row.appendChild(bubble);
    feed.appendChild(row);
    safeScroll(feed);
  }

  function botSay(text) {
    const m = makeMsg({ who: "bot", text });
    msgs.push(m);
    saveLocal(LS_KEY, msgs.slice(-60));
    renderMessage(m);
  }

  function userSay(text) {
    const m = makeMsg({ who: "user", text });
    msgs.push(m);
    saveLocal(LS_KEY, msgs.slice(-60));
    renderMessage(m);
  }

  // remove sugestões antigas (pra não virar “fixo”)
  function clearSuggest() {
    const s = feed.querySelector(".pz-suggestWrap");
    if (s) s.remove();
  }

  // ✅ sugestões como “balão do bot” com chips
  function botSuggest(label, options) {
    clearSuggest();

    const wrap = el("div", { class: "pz-msg bot pz-suggestWrap" });
    const bubble = el("div", { class: "pz-msgBubble pz-suggestBubble" });

    bubble.appendChild(el("div", { class: "pz-msgText" }, [label]));

    const chips = el("div", { class: "pz-suggestChips" });
    options.forEach(opt => {
      const b = el("button", {
        class: `pz-suggestChip${opt.ghost ? " ghost" : ""}`,
        type: "button",
        "data-value": opt.value
      }, [opt.label]);
      chips.appendChild(b);
    });

    bubble.appendChild(chips);
    bubble.appendChild(el("div", { class: "pz-msgTime" }, [nowLabel()]));
    wrap.appendChild(bubble);
    feed.appendChild(wrap);
    safeScroll(feed);

    chips.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-value]");
      if (!b) return;
      const v = b.getAttribute("data-value");
      clearSuggest();

      if (v === "outro") {
        userSay("Outro / não sei");
        botSay("Sem problema. Me diz o que pesa mais agora: dinheiro, direção ou estabilidade?");
        return;
      }

      userSay(b.textContent);
      suggestGoal(v);
    });
  }

  function suggestGoal(goal) {
    ctx.goal = goal;
    ctx.lastTopic = goal;
    saveLocal(LS_CTX, ctx);

    const steps = stepsForGoal(goal);
    const link = linkForGoal(goal);

    botSay(
      `Beleza. Vamos por ${goal}.\n` +
      `Primeiros passos:\n${formatBullets(steps)}`
    );

    botSuggest("Quer ir direto?", [
      { value: "open", label: link.label },
      { value: "quiz", label: "Refazer quiz", ghost: true }
    ]);

    // intercepta click desses botões
    const s = feed.querySelector(".pz-suggestWrap");
    if (s) {
      const chips = s.querySelector(".pz-suggestChips");
      chips.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-value]");
        if (!b) return;
        const v = b.getAttribute("data-value");
        if (v === "open") window.location.href = link.href;
        if (v === "quiz") window.location.href = "quiz.html";
      }, { once: true });
    }
  }

  function askChoice() {
    botSuggest("Por onde você quer começar?", [
      { value: "emprego", label: "Emprego (mais rápido)" },
      { value: "cursos", label: "Cursos (base + prova)" },
      { value: "concursos", label: "Concursos (estabilidade)" },
      { value: "outro", label: "Outro / não sei", ghost: true }
    ]);
  }

  function handleUser(text) {
    const intent = detectIntent(text);

    if (intent.type === "kb") {
      ctx.lastTopic = intent.key;
      saveLocal(LS_CTX, ctx);

      botSay(KB[intent.key].answer);
      // depois do bloco, oferece escolha só se fizer sentido
      if (!ctx.goal) askChoice();
      return;
    }

    if (intent.type === "route") {
      suggestGoal(intent.key);
      return;
    }

    // ✅ fallback: não inventa, só pede escolha
    botSay("Entendi. Pra eu não te orientar errado, escolhe por onde você quer começar:");
    askChoice();
  }

  // ---------- init feed ----------
  feed.innerHTML = "";
  if (msgs.length) {
    msgs.forEach(renderMessage);
  } else {
    const hello =
      page === "emprego" ? "Oi. Quer ajuda com currículo, golpes ou por onde começar?"
      : page === "cursos" ? "Oi. Quer ajuda pra escolher um curso que dê resultado?"
      : page === "concursos" ? "Oi. Quer ajuda pra entender concurso e por onde começar?"
      : page === "quiz" ? "Oi. Quer ajuda pra responder o quiz sem pressão?"
      : "Oi. Quer que eu te ajude a achar um começo possível?";
    botSay(hello);
    askChoice();
  }

  // ---------- open/close ----------
  let open = false;
  function openDock() {
    open = true;
    dock.classList.add("open");
    dock.setAttribute("aria-hidden", "false");
    input.focus({ preventScroll: true });
    safeScroll(feed);
  }
  function closeDock() {
    open = false;
    dock.classList.remove("open");
    dock.setAttribute("aria-hidden", "true");
  }

  fab.addEventListener("click", () => (open ? closeDock() : openDock()));

  const [minBtn, closeBtn] = top.querySelectorAll(".pz-supportIconBtn");
  minBtn.addEventListener("click", closeDock);
  closeBtn.addEventListener("click", closeDock);

  // Tabs
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".pz-tab");
    if (!btn) return;
    const tab = btn.getAttribute("data-tab");

    tabs.querySelectorAll(".pz-tab").forEach(b => {
      const on = b.getAttribute("data-tab") === tab;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    [panelChat, panelFaq, panelHuman].forEach(p => {
      const on = p.getAttribute("data-panel") === tab;
      if (on) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });

    if (tab === "chat") safeScroll(feed);
  });

  // Quick chips
  quickRow.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-kb]");
    if (!b) return;
    const key = b.getAttribute("data-kb");
    userSay(KB[key].title);
    botSay(KB[key].answer);
    if (!ctx.goal) askChoice();
  });

  // Send message
  panelChat.querySelector(".pz-supportInputRow").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    clearSuggest();
    userSay(text);
    handleUser(text);
  });

  // Human send
  const humanText = panelHuman.querySelector(".pz-humanText");
  const humanSend = panelHuman.querySelector("#pzHumanSend");
  const humanClear = panelHuman.querySelector("#pzHumanClear");

  humanClear.addEventListener("click", () => {
    humanText.value = "";
    humanText.focus();
  });

  humanSend.addEventListener("click", async () => {
    const msg = humanText.value.trim();
    if (!msg) {
      botSay("Escreve só um pouquinho do que você precisa. Uma frase já serve.");
      return;
    }

    const localMsg = makeMsg({ who: "user", text: "[Mensagem para pessoa real]\n" + msg });
    msgs.push(localMsg);
    saveLocal(LS_KEY, msgs.slice(-60));
    humanText.value = "";

    tabs.querySelector('[data-tab="chat"]').click();
    renderMessage(localMsg);
    botSay("Fechado. Recebi. Se quiser, diga cidade e o que você consegue fazer por semana.");
    askChoice();

    // tenta Firestore (opcional)
    try {
      await addDoc(collection(db, "suporte"), {
        mensagem: msg,
        createdAt: serverTimestamp(),
        status: "aberto",
        origem: "site",
        page: location.pathname || "index"
      });
    } catch {
      // sem exposição de erro
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) closeDock();
  });
}

function faqItem(title, body) {
  const wrap = document.createElement("div");
  wrap.className = "pz-faqItem";

  const btn = document.createElement("button");
  btn.className = "pz-faqQ";
  btn.type = "button";
  btn.setAttribute("aria-expanded", "false");
  btn.textContent = title;

  const ans = document.createElement("div");
  ans.className = "pz-faqA";
  ans.hidden = true;
  ans.textContent = body;

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", open ? "false" : "true");
    ans.hidden = open;
  });

  wrap.appendChild(btn);
  wrap.appendChild(ans);
  return wrap;
}