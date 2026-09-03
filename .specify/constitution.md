# Constituição de Engenharia: O Cérebro do Analista

**Projeto:** `cerebro-do-analista`  
**Versão:** 1.0.0  
**Data:** 03-09-2026  
**Status:** Ativa & Obrigatória  

---

## 🏛️ Artigo I: Princípios Fundamentais & Stack Tecnológica
1. **Frontend Leve e Autônomo:** A aplicação é orientada a páginas HTML5 semânticas, estilizadas via **Tailwind CSS** (compilado localmente) e dinamizadas por **Vanilla JavaScript modular** (ESM).
2. **Zero Frameworks Invasivos:** É vedada a introdução de frameworks pesados de frontend (React, Angular, Vue, Next.js) que descaracterizem a arquitetura estática leve e de carregamento instantâneo.
3. **Reutilização de Componentes:** Cabeçalho (`_header.html`) e Rodapé (`_footer.html`) são obrigatoriamente gerenciados de forma centralizada por `js/components.js` e o menu de navegação por `js/navigation.js`.

---

## 🎨 Artigo II: Design System & Experiência do Usuário (UX/UI)
1. **Padrão Visual Corporativo de Alto Nível:** As novas telas devem utilizar a paleta de classes utilitárias estabelecida no projeto (`glass-card`, `hover-lift`, `text-gradient`, `bg-light dark:bg-dark`).
2. **O "Fino" da Análise de Dados:** Elementos de dados, tabelas e gráficos devem seguir padrões sóbrios (estilo McKinsey, Big 4 e manuais executivos), priorizando clareza, rótulos de dados limpos, linhas de meta pontilhadas e eliminação de poluição visual (*decluttering*).
3. **Responsividade & Acessibilidade:** Todas as novas interfaces devem ser totalmente responsivas (mobile, tablet e desktop) e cumprir requisitos mínimos de contraste WCAG AA, com semântica adequada (`<section>`, `<article>`, `<button>`, tags ARIA).

---

## 🔬 Artigo III: Integridade Técnica do Conteúdo (Cheat Sheet Executivo)
1. **Fórmulas e Códigos Fatuais:** Toda fórmula de Excel (`PROCX`, `SOMASES`, variações percentuais), transformação de Power Query (M) e medida DAX (`RANKX`, `CALCULATE`, `DIVIDE`) apresentada deve ser tecnicamente testada, com sintaxe válida para a versão em português e equivalência internacional.
2. **Facilidade de Cópia em 1 Clique:** Todo bloco de código, fórmula ou snippet deve conter um botão interativo de cópia para a área de transferência (`Copiar`), melhorando a ergonomia do analista no expediente.
3. **Ponte com o Segundo Cérebro:** Sempre que relevante, indicar âncoras conceituais para estudos aprofundados no cofre Obsidian (`06 - Estudos/`).

---

## 🛡️ Artigo IV: Governança de Código & Diffs Cirúrgicos
1. **Proibição de Sobrescrita Total:** É terminantemente proibido o uso de `write_to_file` com `Overwrite: true` para modificar arquivos existentes no repositório.
2. **Edição Cirúrgica Mandatória:** Toda alteração em arquivos preexistentes deve ser executada exclusivamente via `replace_file_content` ou `multi_replace_file_content` após inspeção de linhas com `view_file`.
3. **Stop Gates Human-in-the-Loop:** Cada fase do ciclo SDD e cada fatia vertical de implementação devem ser validadas individualmente antes do próximo passo.
