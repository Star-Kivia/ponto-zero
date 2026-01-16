export const ROUTES = {
  home: "home.html",
  opening: "index.html",
  login: "login.html",
  quiz: "quiz.html",
  emprego: "emprego.html",
  cursos: "cursos.html",
  concursos: "concursos.html",
};

export const SEARCH_INDEX = [
  { label: "Seu Primeiro Emprego", url: ROUTES.emprego, tags: ["trabalho", "vagas", "currículo", "primeiro emprego"] },
  { label: "Cursos e Formação", url: ROUTES.cursos, tags: ["curso", "formação", "certificado", "senac", "senai"] },
  { label: "Concursos Públicos", url: ROUTES.concursos, tags: ["concurso", "edital", "governo", "estabilidade"] },
  { label: "Como usar", url: ROUTES.comoUsar, tags: ["ajuda", "passo a passo", "guia"] },
  { label: "Sobre o Ponto Zero", url: ROUTES.sobre, tags: ["sobre", "projeto", "objetivo"] },
  { label: "Refazer quiz", url: ROUTES.quiz, tags: ["quiz", "orientação", "caminho"] }
];

export const HOME_FEATURES = [
  {
    title: "Você não precisa decidir sua vida em 1 dia",
    text: "Aqui você transforma confusão em próximos passos. Sem cobrança. Sem julgamento.",
    badges: ["acolhimento", "clareza", "passo a passo"]
  },
  {
    title: "Trabalho, cursos ou concurso?",
    text: "O Ponto Zero te ajuda a entender o que combina com seu momento agora, não com a pressão dos outros.",
    badges: ["orientação", "realidade", "ritmo"]
  },
  {
    title: "Ferramentas simples (e úteis de verdade)",
    text: "Modelos, dicas, links e caminhos acessíveis. Tudo pronto pra virar algo maior com back-end depois.",
    badges: ["pronto pra evoluir", "organizado", "foco em você"]
  }
];

export const EMPREGO_CARDS = [
  {
    name: "InfoJobs",
    desc: "Plataforma com vagas em várias áreas e níveis. Boa pra começar sentindo o mercado.",
    audience: "Primeiro emprego, estágio, vagas operacionais",
    url: "https://www.infojobs.com.br/",
    tags: ["vagas", "cadastro", "popular"]
  },
  {
    name: "GO Sergipe",
    desc: "Portal do Governo de Sergipe com serviços e iniciativas. Pode ter programas e oportunidades regionais.",
    audience: "Quem quer acompanhar oportunidades em Sergipe",
    url: "https://www.se.gov.br/",
    tags: ["regional", "governo", "serviços"]
  },
  {
    name: "Programa Primeiro Emprego (PPE)",
    desc: "Iniciativas desse tipo costumam focar em inserir jovens no mercado. Vale acompanhar atualizações oficiais.",
    audience: "Jovens em busca da primeira chance formal",
    url: "https://www.gov.br/",
    tags: ["programa", "jovem", "oportunidade"]
  }
];

export const CURSOS_CARDS = [
  { name: "FUNDATE", price: "Geralmente acessível", cert: "Depende do curso", area: "Cursos variados", audience: "Quem quer capacitação rápida", url: "https://www.fundatec.org.br/" },
  { name: "SENAC", price: "Pago (com bolsas às vezes)", cert: "Sim", area: "Serviços, tecnologia, gestão", audience: "Quem quer formação profissional", url: "https://www.senac.br/" },
  { name: "SENAI", price: "Pago (com bolsas às vezes)", cert: "Sim", area: "Indústria, técnica, tecnologia", audience: "Quem busca área técnica/industrial", url: "https://www.senai.br/" },
  { name: "UNOVA", price: "Varia", cert: "Depende do curso", area: "Capacitações", audience: "Quem quer cursos curtos", url: "#" },
  { name: "PENSA CURSOS", price: "Pago (normalmente barato)", cert: "Sim (geralmente)", area: "Cursos rápidos", audience: "Quem quer começar logo", url: "#" },
  { name: "IFS", price: "Gratuito", cert: "Sim", area: "Técnico e superior", audience: "Quem quer formação pública", url: "https://www.ifs.edu.br/" },
  { name: "CEBRAC", price: "Pago", cert: "Sim", area: "Profissionalizantes", audience: "Quem quer entrar no mercado", url: "https://cebrac.com.br/" }
];

export const CONCURSOS_CARDS = [
  {
    name: "Estratégia Concursos",
    desc: "Plataforma com cursos e trilhas de estudo. Útil pra entender como estudar e se organizar.",
    url: "https://www.estrategiaconcursos.com.br/",
    tags: ["estudo", "plano", "conteúdo"]
  },
  {
    name: "Sites oficiais do Governo de Sergipe",
    desc: "Onde você confere comunicados, portais e links que podem levar a editais e concursos.",
    url: "https://www.se.gov.br/",
    tags: ["oficial", "regional", "seguro"]
  }
];

export const QUIZ = {
  intro: [
    "Respira. Você não está atrasada.",
    "Vamos conversar um pouco e achar um próximo passo que faça sentido pra você agora."
  ],
  questions: [
    {
      q: "Como você se sente em relação ao seu futuro agora?",
      options: [
        { text: "Tô ansiosa e quero uma direção prática logo.", score: { trabalho: 2, cursos: 1, concurso: 0 } },
        { text: "Tô confusa, mas curiosa pra aprender algo novo.", score: { trabalho: 0, cursos: 2, concurso: 0 } },
        { text: "Quero estabilidade e um caminho mais previsível.", score: { trabalho: 0, cursos: 0, concurso: 2 } },
        { text: "Um pouco de tudo. Só queria não me sentir perdida.", score: { trabalho: 1, cursos: 1, concurso: 1 } }
      ]
    },
    {
      q: "O que mais pesa na sua realidade hoje?",
      options: [
        { text: "Preciso de renda o quanto antes.", score: { trabalho: 2, cursos: 0, concurso: 0 } },
        { text: "Preciso de um plano pra me qualificar.", score: { trabalho: 0, cursos: 2, concurso: 1 } },
        { text: "Quero um caminho de longo prazo com estabilidade.", score: { trabalho: 0, cursos: 1, concurso: 2 } },
        { text: "Quero opções. Só não quero ficar parada.", score: { trabalho: 1, cursos: 1, concurso: 1 } }
      ]
    },
    {
      q: "Você já teve contato com trabalho, cursos ou concursos?",
      options: [
        { text: "Já trabalhei/ajudei em algo e quero avançar.", score: { trabalho: 2, cursos: 1, concurso: 0 } },
        { text: "Já fiz cursos e quero me organizar melhor.", score: { trabalho: 0, cursos: 2, concurso: 1 } },
        { text: "Já pensei em concurso, mas parece grande demais.", score: { trabalho: 0, cursos: 1, concurso: 2 } },
        { text: "Ainda não. Tô começando do zero mesmo.", score: { trabalho: 1, cursos: 1, concurso: 1 } }
      ]
    },
    {
      q: "O que você sente mais falta agora?",
      options: [
        { text: "Oportunidade real: onde começar e onde procurar.", score: { trabalho: 2, cursos: 0, concurso: 0 } },
        { text: "Orientação: alguém pra me guiar com calma.", score: { trabalho: 1, cursos: 1, concurso: 1 } },
        { text: "Estabilidade: um plano firme e previsível.", score: { trabalho: 0, cursos: 0, concurso: 2 } },
        { text: "Base: aprender algo que abra portas.", score: { trabalho: 0, cursos: 2, concurso: 0 } }
      ]
    }
  ],
  resultText: {
    trabalho: {
      title: "Talvez começar pelo primeiro emprego faça mais sentido agora",
      body:
        "Pelo que você respondeu, o seu momento pede movimento prático: procurar oportunidades, entender como se apresentar e ganhar experiência. Isso não te prende pra sempre. Só te dá chão."
    },
    cursos: {
      title: "Cursos e formação parecem encaixar bem com seu agora",
      body:
        "Você mostrou vontade de construir base e aumentar suas opções. Um curso certo pode virar porta, atalho e até coragem. O importante é escolher algo possível pra sua realidade."
    },
    concurso: {
      title: "Concursos podem ser um caminho interessante pra você",
      body:
        "Você parece buscar estabilidade e previsibilidade. Concurso não precisa ser ‘tudo ou nada’. Dá pra começar pequeno, aprender o jogo e crescer com consistência."
    }
  }
};