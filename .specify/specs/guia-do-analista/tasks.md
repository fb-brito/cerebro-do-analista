# Backlog de Tarefas: Guia do Analista

**Status:** 🟡 Pronto para Implementação (Fase 4: tasks)  
**Data:** 03-09-2026  
**Autor:** Flávio de Brito & Antigravity  
**Especificação:** [spec.md](file:///c:/Users/fbrito/.gemini/antigravity-ide/scratch/cerebro-do-analista/.specify/specs/guia-do-analista/spec.md)  
**Arquitetura:** [plan.md](file:///c:/Users/fbrito/.gemini/antigravity-ide/scratch/cerebro-do-analista/.specify/specs/guia-do-analista/plan.md)  
**Constituição:** [constitution.md](file:///c:/Users/fbrito/.gemini/antigravity-ide/scratch/cerebro-do-analista/.specify/constitution.md)  

---

## 🎯 Fatias Verticais (Tracer Bullets)

### 🔹 Task 01: Infraestrutura de Navegação & Esqueleto Semântico da Página [CONCLUÍDA]
- **O que entrega:** A nova página `guia-do-analista.html` criada e acessível pelo menu global de navegação (`js/navigation.js`), com estrutura semântica HTML5, injeção de cabeçalho/rodapé dinâmicos e layout responsivo com Tailwind CSS.
- **Bloqueado por:** Nenhum (Concluída).
- **Critérios de Aceitação:**
  - [x] Arquivo `guia-do-analista.html` criado com tags semânticas e referências aos estilos e scripts.
  - [x] Item `"Guia do Analista"` registrado no dropdown "Caixa de Ferramentas" em `js/navigation.js`.
  - [x] Ao acessar `guia-do-analista.html`, o menu exibe o link como ativo e o header/footer carregam sem erros no console.
  - [x] Grid principal estruturado com os 4 containers para as seções temáticas e pílulas de navegação rápida.

---

### 🔹 Task 02: Módulo 1 - Operações Matemáticas, Fórmulas Percentuais & PROCX Mestre [CONCLUÍDA]
- **O que entrega:** Componentes interativos de cálculos percentuais ($MoM/YoY$, representatividade com travamento `$`, margens) e o laboratório de busca com PROCX (curingas, busca reversa, multicritério), suportando sintaxe bilíngue (PT-BR e EN-US) e cópia em 1 clique.
- **Bloqueado por:** Task 01 (Concluída).
- **Critérios de Aceitação:**
  - [x] Simulador de Variação Percentual funcional em tempo real com tratamento de divisão por zero e bases negativas.
  - [x] Cartões de fórmulas de cálculos percentuais e margem com explicações claras da lógica matemática.
  - [x] Seção detalhada do PROCX (*XLOOKUP*) com sintaxe completa e exemplos de busca com curingas (`*` e `?`), busca reversa, bidirecional e multicritério.
  - [x] Botão "Copiar Fórmula" com feedback visual de confirmação na área de transferência.

---

### 🔹 Task 03: Módulo 2 - O Laboratório de Rankings (Excel, Power Query & DAX) [CONCLUÍDA]
- **O que entrega:** Seção prática ensinando as 3 formas definitivas de ranqueamento utilizadas no mercado corporativo: Tabela Dinâmica no Excel, ETL no Power Query e DAX no Power BI.
- **Bloqueado por:** Task 02 (Concluída).
- **Critérios de Aceitação:**
  - [x] Demonstração passo a passo de como criar rankings via Tabela Dinâmica ("Mostrar Valores Como ➔ Classificação do Maior para o Menor") com filtro Top N e maquete visual.
  - [x] Roteiro de criação de ranking e índices no Power Query com snippet de código em linguagem M.
  - [x] Cartão com a medida canônica de `RANKX` em DAX para Power BI, incluindo explicação de `ALL`, `CALCULATE`, `DIVIDE` e `ISINSCOPE`.
  - [x] Botões de cópia rápida para todos os códigos e medidas.

---

### 🔹 Task 04: Módulo 3 - Estúdio de Gráficos Executivos (O "Fino" da Visualização no Excel) [CONCLUÍDA]
- **O que entrega:** Maquetes vetoriais SVG/HTML fiéis com estética de consultoria de elite e o tutorial passo a passo de parametrização no Excel para os 3 gráficos mais cobrados pela liderança.
- **Bloqueado por:** Task 03 (Concluída).
- **Critérios de Aceitação:**
  - [x] Maquete de Gráfico de Barras com Linha de Meta Tracejada/Pontilhada (Target vs. Actual) + passo a passo detalhado no Excel (onde clicar, eixo secundário, formatação da linha).
  - [x] Maquete de Gráfico de Linhas Executivo com marcadores destacados nos pontos extremos e rótulos de dados limpos.
  - [x] Maquete de Gráfico de Pareto Executivo (80/20) com barras ordenadas e curva de percentual acumulado.
  - [x] Checklist de *decluttering* (eliminação de linhas de grade, eixos redundantes e excesso de cores).

---

### 🔹 Task 05: Módulo 4 - Automação Rápida (Power Query & VBA) e Validação de QA [CONCLUÍDA]
- **O que entrega:** Receitas práticas de automação de rotinas manuais (consolidação de pastas e desdinamização no Power Query; macros em VBA para limpeza de planilhas brutas de ERP) e validação técnica completa do guia.
- **Bloqueado por:** Task 04 (Concluída).
- **Critérios de Aceitação:**
  - [x] Snippets prontos e explicados para Power Query (unir arquivos de pasta e *Unpivot* de colunas).
  - [x] Macro em VBA funcional para formatar relatórios brutos de ERP em segundos.
  - [x] Validação de testes unitários automatizados para as funções de cálculo em `js/guia-do-analista.js` (Código de Saída 0).
  - [x] Auditoria de responsividade, contraste de cores e navegação em temas claro e escuro.
