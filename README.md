# CYBERPUNK RED (Edição 2077) // FICHA DE PERSONAGEM AUTOMATIZADA

Uma Single Page Application (SPA) futurista de alta fidelidade para o RPG de mesa **Cyberpunk RED (Edição 2077)**, construída com **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, **Lucide React** e estilizada com a estética visual de **Cyberpunk 2077**.

---

## ⚡ Principais Funcionalidades

### 🎮 PÁGINA 1: Principal (Identidade, Status e Combate)
- **Cabeçalho Tático**:
  - Handle (Nome de Rua), Role com dropdown oficial (*Solo, Netrunner, Tech, Medtech, Rockerboy, Media, Exec, Lawman, Fixer, Nomad*).
  - Preenchimento automatizado da **Habilidade da Função** (*Combat Awareness, Interface, Maker, etc.*) e controle de Rank (1 a 10).
  - Gestão de **Eurobucks (eb)** e Reputação.
- **Matriz dos 10 Atributos (STATS)**:
  - `INT`, `REF`, `DEX`, `TECH`, `COOL`, `WILL`, `LUCK`, `MOVE`, `BODY`, `EMP`.
  - Exibição de valores base e **valores efetivos calculados em tempo real** (com penalidades de armadura ou bônus de cromo como *Grafted Muscle and Bone Lace*).
- **Atributos Derivados e Saúde**:
  - **HP Máximo**: Fórmula oficial automatizada: `10 + (5 * Math.ceil((BODY + WILL) / 2))`.
  - **Barra de Vida Interativa**: Controles rápidos de dano (-1, -5, -10) e cura (+1, +5, restauração total).
  - **Seriously Wounded (Ferimento Grave)**: Ativação automática ao atingir $\le 50\%$ do HP máximo, com banner vermelho de alerta informando **"-2 em todas as ações"**.
  - **Death Save (Salvaguarda contra Morte)**: Baseado em `BODY` efetivo, contador de penalidades acumulativas a cada turno em 0 HP e rolagens automáticas de salvaguarda.
  - **Ferimentos Críticos & Vícios**: Gestão dinâmica com catálogo rápido do livro (Fratura Exposta, Concussão, Curto-circuito em Cromo, Vício em Black Lace, etc.).
- **Armaduras e Blindagem (SP)**:
  - Cabeça, Corpo e Escudo com Stopping Power (SP) Máximo e Atual.
  - Botão de **Ablatar (-1 SP)** por impacto balístico e reparo.
  - Seletor de Penalidade de Armadura (0, -2, -4) que reduz dinamicamente `REF`, `DEX` e `MOVE`.
- **Arsenal de Armas**:
  - Armas dinâmicas com tipo, munição (disparo normal e rajada), taxa de tiro (ROF), notas e botão de **Rolagem de Dano** (ex: 3d6, 5d6) com detecção automática de Ferimento Crítico (quando rolar dois ou mais 6s).

---

### 🧬 PÁGINA 2: Perícias (Skills Matrix)
- **Cálculo Automatizado de BASE**:
  - $\text{BASE} = \text{STAT Efetivo} + \text{Nível da Perícia}$.
  - Atualização instantânea refletindo variações de cromo, ferimentos e armadura.
- **Todas as 9 Categorias Oficiais**:
  - *Awareness, Body, Control, Education, Fighting, Performance, Ranged Weapon, Social, Technique*.
- **Rolagem de Dados 1d10 Explosivo/Fumble**:
  - Regra oficial de **Explosão no 10** (+1d10 adicional contínuo).
  - Regra de **Falha Crítica no 1** (-1d10 subtraído).
  - Modal/Toast holográfico com breakdown matemático completo e efeitos sonoros via sintetizador Web Audio API.
- **Filtros e Busca em Tempo Real**:
  - Barra de busca por nome, descrição e atributo.
  - Filtros rápidos por categoria, atributo e opção "Apenas Treinadas".

---

### 🦾 PÁGINA 3: Ripperdoc (Sistema de Cyberware 2077)
- **Painel de Humanidade e Empatia**:
  - Humanidade Inicial: $\text{EMP Base} \times 10$.
  - Humanidade Atual: $\text{Humanidade Inicial} - \sum \text{HL de todos os implantes}$.
  - EMP Atual: $\lfloor \text{Humanidade Atual} / 10 \rfloor$, sincronizado automaticamente com as perícias sociais.
  - Alerta tático de **Risco de Ciberpsicose** ($< 20$) e **Alerta Crítico / Max-Tac** ($\le 0$).
- **Diagrama Corporal Interativo em SVG**:
  - Silhueta cibernética estilizada com linhas conectoras, anéis de radar e nós luminosos pulsantes.
  - 8 Regiões Corporais Clicáveis:
    1. *Cérebro / Sistema Nervoso (Neuralware & Neuroport 2077)*
    2. *Olhos (Cyberoptics - Olho Direito e Esquerdo)*
    3. *Ouvidos (Cyberaudio Suite)*
    4. *Torso Interno (Internal Cyberware)*
    5. *Pele / Torso Externo (External Cyberware & Fashionware)*
    6. *Braço Direito e Braço Esquerdo (Cyberarms)*
    7. *Perna Direita e Perna Esquerda (Cyberlegs)*
    8. *Esqueleto / Estrutura Completa (Borgware)*
- **Painel Lateral de Modificação (Drawer)**:
  - Medidor de slots ocupados vs. disponíveis por parte do corpo.
  - Catálogo pré-cadastrado com implantes de *Cyberpunk 2077* e *Cyberpunk RED* (Sandevistan, Kerenzikov, Óticas Kiroshi, Mantis Blades, Gorilla Arms, Subdermal Armor, Grafted Muscle, etc.).
  - Formulário para criação de implantes customizados informando nome, custo em eb, HL, slots e descrição.
  - Remoção de implantes com restauração instantânea de Humanidade e recálculo de stats.

---

### 💾 Persistência e Recursos Extras
- **Auto-Save**: Salva automaticamente todas as alterações no `localStorage`.
- **Exportar / Importar JSON**: Baixe e carregue arquivos `.json` da ficha para compartilhar ou fazer backup.
- **Efeitos de Áudio Sci-Fi**: Sintetizador de áudio procedural via Web Audio API (sem dependência de arquivos externos).
- **Filtro CRT / Scanlines**: Alternância estética com linhas de varredura holográfica retrô.

---

## 🚀 Como Executar Localmente

1. Instalar as dependências:
   ```bash
   npm install
   ```

2. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acessar no navegador:
   `http://localhost:5173/`
