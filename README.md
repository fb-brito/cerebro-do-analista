# O Cérebro do Analista de Dados

[![Status do Projeto](https://img.shields.io/badge/status-ativo-green.svg)](https://shields.io/)
[![Licença](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

Uma aplicação web interativa com guias, ferramentas e recursos para analistas de dados. O projeto é construído com uma arquitetura de componentes reutilizáveis, gerenciamento de dependências via npm e um processo de build profissional para o CSS com Tailwind.

---

## ✨ Funcionalidades Principais

* **Arquitetura de Componentes:** O cabeçalho e rodapé são carregados dinamicamente via JavaScript, eliminando a repetição de código e facilitando a manutenção.
* **Ambiente de Desenvolvimento Moderno:** Utiliza Node.js e npm para gerenciar as dependências do projeto.
* **Build de CSS Otimizado:** Usa o Tailwind CSS CLI para gerar um arquivo de estilos leve e otimizado, contendo apenas as classes utilizadas no projeto.

## 🚀 Tecnologias Utilizadas

* **HTML5:** Estrutura semântica das páginas.
* **CSS3 / Tailwind CSS:** Framework principal para a UI, compilado através da CLI do Tailwind.
* **JavaScript (ESM):** Interatividade, manipulação do DOM e lógica dos componentes através de Módulos ES6.
* **Node.js / npm:** Gerenciamento de dependências e execução de scripts de build.
* **PostCSS / Autoprefixer:** Ferramentas que otimizam o CSS gerado pelo Tailwind para máxima compatibilidade entre navegadores.

## 📋 Como Executar o Projeto

Para executar este projeto localmente, siga os passos abaixo.

### **Pré-requisitos**

* **Node.js e npm:** [Instale a partir do site oficial](https://nodejs.org/).
* **Visual Studio Code:** Recomendado para a melhor experiência.
* **Extensão Live Server:** [Instale a partir do Marketplace do VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

### **Passos de Instalação e Execução**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/fb-brito/cerebro-do-analista.git](https://github.com/fb-brito/cerebro-do-analista.git)
    cd cerebro-do-analista
    ```

2.  **Instale as dependências do projeto:**
    Este comando lê o `package.json` e instala as ferramentas necessárias, como o Tailwind CSS.
    ```bash
    npm install
    ```

3.  **Inicie o processo de build do CSS:**
    Este comando irá gerar o arquivo `css/styles.css` e ficará "assistindo" por qualquer alteração nos seus arquivos para recompilar o CSS automaticamente. **Você deve manter este terminal aberto enquanto desenvolve.**
    ```bash
    npm run tailwind:watch
    ```

4.  **Inicie o servidor local:**
    * Abra um **novo terminal** (deixando o anterior rodando o `tailwind:watch`).
    * No VS Code, clique com o botão direito no arquivo `index.html`.
    * Selecione **"Open with Live Server"**.

Seu navegador abrirá o projeto e ele será atualizado automaticamente sempre que você salvar um arquivo.

## 🗺️ Roadmap de Desenvolvimento

- [✔️] **Refatoração:** Mover JavaScript para arquivos `.js` dedicados.
- [✔️] **Centralização:** Criar um sistema de componentes reutilizáveis para cabeçalho e rodapé.
- [✔️] **Ambiente:** Migrar de CDN para um ambiente de build local com npm e Tailwind CLI.
- [ ] **Funcionalidade:** Implementar a lógica completa do "Quiz Gamificado".
- [ ] **Acessibilidade:** Realizar uma auditoria de acessibilidade (A11y) para garantir a usabilidade para todos.

## 🤝 Como Contribuir

Contribuições são bem-vindas! Para novas funcionalidades ou correção de bugs, por favor, siga o processo de Fork e Pull Request.