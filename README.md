# Semana de Engenharia Civil — IFPI Campus Floriano (App Oficial PWA)

Aplicativo oficial desenvolvido em **React Native + Expo (PWA)** para a **Semana de Engenharia Civil do IFPI Campus Floriano** (20 a 24 de outubro de 2025).

## 1. Briefing Visceral e Sistema de Design

- **Tokens de Cores Principais:**
  - `#0d1b2a` — *Deep Blueprint Navy* (Fundo principal escuro de engenharia)
  - `#002244` — *Header & Navigation Navy* (Cabeçalho e barra de navegação inferior)
  - `#003366` — *Structural Steel Blue* (Banners de destaque e hero cards)
  - `#00ffcc` — *Cyan Laser Level* (Acento primário de alta visibilidade, indicadores ativos e badges)
  - `#eab308` — *Safety & Trophy Gold* (Destaques de favoritos, troféu das olimpíadas e alertas de vagas)
- **Acessibilidade e Contraste Dinâmico:**
  - Suporte nativo a **3 temas** (`Azul Corporativo`, `Alto Contraste Acessível`, `Claro Institucional`) e **3 escalas tipográficas** (`100%`, `115%`, `130%`), acessíveis tanto na aba **Mais > Configurações** quanto nos botões rápidos `A+` e `Contraste` no topo de todas as telas.

## 2. Arquitetura do Projeto

```text
semana-eng-civil/
├── assets/
│   ├── logo-curso-ifpi.png       # Logo oficial Engenharia Civil IFPI Floriano (Splash e Header)
│   ├── logo-app.png              # Ícone do aplicativo PWA
│   ├── favicon.png               # Favicon Web
│   └── infografico-referencia.jpg# Infográfico oficial de referência
├── src/
│   ├── context/
│   │   └── AppContext.js         # Estado global, Acessibilidade, Favoritos, Vagas e Cache
│   ├── data/
│   │   └── mockData.js           # Cronograma completo (20 a 24/10), Palestrantes, Minicursos, Olimpíadas e Mapa
│   ├── screens/
│   │   ├── HomeScreen.js         # 1. Tela Inicial / Dashboard com logo do curso, destaques e atalhos
│   │   ├── ProgramacaoScreen.js  # 2. Programação diária com filtros por data, categoria e favoritos
│   │   ├── PalestrantesScreen.js # 3. Palestrantes com filtros (Todos, Palestras, Minicursos) e modal de bio
│   │   ├── MinicursosScreen.js   # 4. Minicursos por turno, controle de vagas em tempo real e ementa
│   │   ├── OlimpiadasScreen.js   # 5. Competição de Projetos Estruturais, regulamento, simulador EE e inscrição
│   │   └── MaisScreen.js         # 6. Mapa do Campus, Informações, Contato, Notificações e Acessibilidade
│   ├── services/
│   │   └── storageService.js     # Persistência offline com AsyncStorage (salvarProgramacaoCache / obterProgramacaoCache)
│   └── styles/
│       └── theme.js              # Paletas de cores e escalas tipográficas acessíveis
├── App.js                        # Navegação Bottom Tabs + controles rápidos de acessibilidade
├── app.json                      # Configuração Expo + Manifesto PWA + Splash Screen
└── package.json                  # Dependências e scripts
```

## 3. Como Executar

```bash
cd C:\Users\PC\.gemini\antigravity\scratch\semana-eng-civil
npx expo start --web
```

Para gerar o bundle estático de produção PWA:
```bash
npx expo export -p web
```

