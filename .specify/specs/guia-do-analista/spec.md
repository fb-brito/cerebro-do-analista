# Especificação: Guia do Analista

**Status:** 🟡 Validado pelo Usuário (Fase 1: specify)  
**Data:** 03-09-2026  
**Autor:** Flávio de Brito & Antigravity  
**Arquivo Alvo:** `guia-do-analista.html`  
**Script Alvo:** `js/guia-do-analista.js`  
**Local:** `c:\Users\fbrito\.gemini\antigravity-ide\scratch\cerebro-do-analista\.specify\specs\guia-do-analista\spec.md`

---

## 1. Declaração do Problema
Analistas em ambientes corporativos (seja em operações, financeiro, controladoria, riscos ou dados) precisam de uma **Bancada de Trabalho e Consulta Rápida (Cheat Sheet Executivo)** para o dia a dia. Muitas vezes o analista precisa resolver um problema imediato — como criar um ranking em Tabela Dinâmica, calcular variações percentuais sem erro, parametrizar um gráfico com linha de meta tracejada ou escrever uma medida DAX no Power BI — e perde horas procurando tutoriais genéricos ou poluídos. O projeto `cerebro-do-analista` precisa de um hub central, elegante e universal chamado **"Guia do Analista"**, que funcione como uma extensão da memória de trabalho do profissional, cobrindo com rigor "o fino da análise de dados" construído sobre o ecossistema prático mais utilizado no mercado corporativo: **Excel Avançado, Power Query, VBA e Power BI (DAX)**.

---

## 2. Solução Proposta
Criar a página `guia-do-analista.html` e seu módulo JavaScript reativo `js/guia-do-analista.js`, integrados ao design system do projeto (Tailwind CSS, Glassmorphism, temas claro/escuro e componentes reutilizáveis de navegação). A página será estruturada em **4 Seções Estratégicas de Alto Impacto**:

### Seção 1: Operações Matemáticas & Fórmulas Percentuais Cirúrgicas
- **Cálculos Percentuais do Dia a Dia:**
  - Variação Percentual ($MoM / YoY$): Fórmula matemática pura e fórmula no Excel blindada contra divisão por zero e bases negativas:
    `=SE(Anterior=0; "-"; (Atual - Anterior) / ABS(Anterior))`
  - Participação sobre o Total (*Share of Wallet* / % do Total): Com travamento absoluto de células (`$`).
  - Margem Bruta e Margem de Contribuição: Conceito, cálculo e formatação executiva.
- **Fórmulas Mestras de Busca & Lógica:**
  - **PROCX (*XLOOKUP*) Passo a Passo:** Valor pesquisado, matriz de pesquisa, matriz de retorno, tratamento de `#N/D`, correspondência exata, caracteres curinga (`*` e `?`) e busca reversa (de baixo para cima).
  - **Funções de Agregação Condicional:** `SOMASES`, `CONT.SES` e `MÉDIASES` com critérios dinâmicos de texto, comparadores (`">=" & Célula`) e intervalos de datas.

### Seção 2: O Laboratório de Rankings (Excel, Power Query & DAX)
- **Ranqueamento via Tabela Dinâmica no Excel:**
  - Passo a passo de como configurar o campo de valor para "Mostrar Valores Como ➔ Classificação do Maior para o Menor" sem alterar a base original.
  - Filtro Top N (Top 5, Top 10) diretamente na Tabela Dinâmica.
- **Ranqueamento via Power Query:**
  - Como ordenar colunas e adicionar Coluna de Índice para gerar rankings determinísticos em bases consolidadas de ETL.
- **Ranqueamento no Power BI via DAX:**
  - A medida canônica de ranking universal:
    `Rank_Cliente = RANKX(ALL(Tabela[Cliente]), [Total_Vendas], , DESC, Dense)`
  - Dicas essenciais de DAX para analistas: `CALCULATE`, `ALL`, `DIVIDE` (tratamento automático de divisão por zero) e `USERELATIONSHIP`.

### Seção 3: Estúdio de Gráficos Executivos (O "Fino" da Visualização Corporativa)
Não apenas imagens conceituais, mas o **passo a passo de parametrização e formatação no Excel**:
- **Gráfico de Barras com Linha de Meta (Target Pontilhado/Tracejado):**
  - Como criar o gráfico de combinação (Barras de Realizado no Eixo Principal + Linha de Meta no Eixo Secundário ou barras sobrepostas).
  - Formatação da linha de meta: linha tracejada/pontilhada cinza-escura/vermelha, sem marcadores pesados.
- **Gráfico de Linhas Executivo com Marcadores Destacados:**
  - Como criar linhas suaves com marcadores sutis apenas nos pontos-chave (início, fim ou máximos/mínimos).
  - Posicionamento correto de rótulos de dados (acima do marcador, sem sobrepor linhas de grade).
- **Gráfico de Pareto Executivo (80/20):**
  - Barras ordenadas em ordem decrescente + Linha de percentual acumulado no eixo secundário.

### Seção 4: Automação Rápida de Rotinas (Power Query & VBA)
- **Power Query:**
  - Receita para importar e consolidar todos os arquivos de uma pasta em um único clique.
  - Desdinamizar colunas (*Unpivot*) para transformar tabelas horizontais em bases de dados fáceis de filtrar.
- **VBA Express:**
  - Macro para limpar cabeçalhos sujos, eliminar linhas em branco e aplicar formatação zebrada profissional em relatórios brutos extraídos de ERPs.

---

## 3. Seams de Teste e Verificação
- **Interface DOM e Interatividade (`js/guia-do-analista.js`):**
  - Abas/Filtros rápidos para navegação entre os 4 pilares sem recarregar a página.
  - Simuladores interativos de cálculos percentuais e rankings com inputs dinâmicos.
  - Caixas de código com botão de "Copiar Fórmula / Copiar DAX" em 1 clique.
- **Integração de Componentes:**
  - Carregamento de cabeçalho e rodapé via `components.js`.
  - Inclusão do link `guia-do-analista.html` no menu principal (`js/navigation.js`) sob a **Caixa de Ferramentas** com o rótulo **"Guia do Analista"**.
- **Acessibilidade & Responsividade:**
  - Suporte a telas mobile e desktop com grid responsivo e contraste WCAG AA no Tailwind CSS.

---

## 4. Estórias de Usuário (User Stories)
- **US-01:** Como analista no dia a dia de trabalho, quero consultar rapidamente como calcular variações percentuais e margens com fórmulas blindadas para não passar vergonha com erros de `#DIV/0!` em reuniões.
- **US-02:** Como analista montando relatórios, quero seguir o passo a passo exato para criar um ranking (seja no Excel, Power Query ou Power BI com `RANKX`) para ranquear clientes, custos ou prestadores em poucos minutos.
- **US-03:** Como analista preparando apresentações para lideranças, quero aprender a formatar gráficos de barra com linha de meta tracejada e gráficos de linha executivos para entregar um padrão visual sofisticado e profissional.
- **US-04:** Como analista que lida com relatórios brutos e manuais de ERP, quero copiar snippets testados de Power Query e VBA para automatizar tarefas repetitivas e reduzir o tempo de execução de horas para minutos.

---

## 5. Decisões de Implementação
- **Nome Canônico da Página:** `guia-do-analista.html`.
- **Nome Canônico do Script:** `js/guia-do-analista.js`.
- **Padrão de Navegação:** Item inserido no dropdown "Caixa de Ferramentas" como `Guia do Analista`.
- **Estilo:** Tailwind CSS local compilado, ícones FontAwesome e microinterações puras em Vanilla JS.
- **Ponte com o Obsidian Vault:** Seções terão tags de ancoragem para notas correspondentes do cofre em `06 - Estudos/` e `10 - SCRIPTs/`.

---

## 6. Decisões de Esclarecimento (Clarifications)
- **Q1: O guia deve ter foco exclusivo em um cargo específico (ex: operações)?**  
  ➔ **Decisão:** Não. O guia é universal para qualquer analista (`Guia do Analista`), mas suas bases práticas abordam as competências mais valorizadas no mercado (Excel Avançado, Power Query, DAX e Gráficos com Linha de Meta).
- **Q2: Devemos incluir tecnologias pesadas ou avançadas de imediato (ex: Microsoft Fabric)?**  
  ➔ **Decisão:** Não. O aprendizado e a bancada de trabalho seguem o "embrião" sólido do analista: Excel, Power Query, VBA e Power BI essencial. Tecnologias posteriores serão adicionadas degrau por degrau no roadmap futuro.

---

## 7. Fora de Escopo (Out of Scope)
- Ferramentas pagas ou conexões com bancos externos via cloud.
- Códigos extensos de linguagens não prioritárias nesta fase (como R ou Julia).
- Upload de bases de dados de clientes reais para o repositório público (proteção estrita de dados).
