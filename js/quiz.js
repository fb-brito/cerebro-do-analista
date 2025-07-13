document.addEventListener('DOMContentLoaded', () => {

    // 1. ESTRUTURA DE DADOS (Inalterada)
    const gameData = {
        "sql": {
            phaseName: "Fase SQL: O Mestre das Queries",
            passingScorePercentage: 80,
            levels: [
                {
                    levelName: "Nível 1: Fundamentos de SELECT",
                    questions: [
                        { question: "Qual comando seleciona TODAS as colunas de uma tabela chamada 'clientes'?", options: ["SELECT * FROM clientes;", "SELECT all FROM clientes;", "GET * FROM clientes;", "SELECT clientes;"], correctAnswer: 0, explanation: "O asterisco (*) é o caractere coringa em SQL usado para representar 'todas as colunas'." },
                        { question: "Como você selecionaria apenas as colunas 'nome' e 'email' de uma tabela 'usuarios'?", options: ["SELECT (nome, email) FROM usuarios;", "SELECT nome, email FROM usuarios;", "SELECT nome AND email FROM usuarios;", "GET nome, email FROM usuarios;"], correctAnswer: 1, explanation: "As colunas desejadas são listadas e separadas por vírgula após o comando SELECT." },
                        { question: "Qual cláusula é usada para filtrar linhas e retornar apenas aquelas onde a 'cidade' é 'São Paulo'?", options: ["FILTER BY cidade = 'São Paulo';", "IF cidade = 'São Paulo';", "HAVING cidade = 'São Paulo';", "WHERE cidade = 'São Paulo';"], correctAnswer: 3, explanation: "A cláusula WHERE é fundamental para filtrar registros com base em condições específicas." },
                        { question: "Para ordenar os resultados de uma consulta de produtos pelo 'preco' do mais caro para o mais barato, qual comando você usaria?", options: ["ORDER BY preco DESC;", "SORT BY preco;", "ORDER BY preco ASC;", "GROUP BY preco;"], correctAnswer: 0, explanation: "ORDER BY ordena os resultados, e a palavra-chave DESC (descendente) especifica a ordem do maior para o menor." },
                        { question: "Como você selecionaria uma lista de países únicos, sem repetições, da coluna 'pais' em uma tabela de 'fornecedores'?", options: ["SELECT UNIQUE pais FROM fornecedores;", "SELECT pais FROM fornecedores;", "SELECT DISTINCT pais FROM fornecedores;", "SELECT NOREPEATING pais FROM fornecedores;"], correctAnswer: 2, explanation: "A palavra-chave DISTINCT remove linhas duplicadas do conjunto de resultados, retornando apenas valores únicos." }
                    ]
                },
                {
                    levelName: "Nível 2: Agregação e Agrupamento",
                    questions: [
                        { question: "Qual função de agregação é usada para contar o número total de linhas em uma tabela?", options: ["SUM()", "TOTAL()", "COUNT()", "NUMBER()"], correctAnswer: 2, explanation: "COUNT(*) ou COUNT(nome_da_coluna) é usado para contar o número de registros que correspondem a uma condição." },
                        { question: "Para calcular a média salarial de todos os funcionários na tabela 'funcionarios', qual função você usaria?", options: ["MEDIAN(salario)", "SUM(salario) / COUNT(salario)", "AVG(salario)", "AVERAGE(salario)"], correctAnswer: 2, explanation: "A função AVG() (de average) é a maneira padrão em SQL para calcular a média de uma coluna numérica." },
                        { question: "Você quer saber o total de vendas para CADA categoria de produto. Qual cláusula você deve usar junto com SUM(vendas)?", options: ["ORDER BY categoria", "WHERE categoria", "GROUP BY categoria", "HAVING categoria"], correctAnswer: 2, explanation: "A cláusula GROUP BY é usada com funções de agregação (como SUM, COUNT, AVG) para agrupar o resultado por uma ou mais colunas." },
                        { question: "Qual a diferença principal entre as cláusulas WHERE e HAVING?", options: ["WHERE filtra grupos, HAVING filtra linhas", "Não há diferença, são sinônimos", "WHERE é usado apenas com números", "WHERE filtra linhas antes da agregação, HAVING filtra grupos após da agregação"], correctAnswer: 3, explanation: "Essa é uma distinção crucial: WHERE atua nas linhas individuais antes do GROUP BY, enquanto HAVING atua nos grupos já agregados." },
                        { question: "Qual seria a soma total de todos os 'valores' da tabela 'pedidos'?", options: ["TOTAL(valores) FROM pedidos;", "SUM(valor) FROM pedidos;", "AGGREGATE(valor) FROM pedidos;", "ADD(valor) FROM pedidos;"], correctAnswer: 1, explanation: "A função de agregação SUM() é usada para somar todos os valores de uma coluna numérica." }
                    ]
                }
            ]
        }
    };

    // 2. ELEMENTOS DA INTERFACE (DOM)
    const phaseCompleteTitle = document.getElementById('phase-complete-title');
    const gameScreen = document.getElementById('game-screen');
    const levelCompleteScreen = document.getElementById('level-complete-screen');
    const phaseCompleteScreen = document.getElementById('phase-complete-screen');
    const levelTitle = document.getElementById('level-title');
    const progressText = document.getElementById('progress-text');
    const livesContainer = document.getElementById('lives-container');
    const xpText = document.getElementById('xp-text');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackArea = document.getElementById('feedback-area');
    const nextBtn = document.getElementById('next-btn');
    const levelScoreText = document.getElementById('level-score-text');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const phaseScoreText = document.getElementById('phase-score-text');
    const phaseStatusText = document.getElementById('phase-status-text');
    const restartPhaseBtn = document.getElementById('restart-phase-btn');

    // 3. VARIÁVEIS DE ESTADO DO JOGO
    let currentPhaseId = "sql";
    let currentLevelIndex = 0;
    let currentQuestionIndexInLevel = 0;
    let score = 0;
    let lives = 5;
    let answered = false;
    let currentCorrectIndex; // Armazena o índice correto após o embaralhamento

    // =========================================================================
    // 4. FUNÇÕES DO JOGO (LÓGICA ATUALIZADA)
    // =========================================================================

    // NOVA FUNÇÃO para embaralhar as respostas
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
        }
        return array;
    }

    function updateXpDisplay() { xpText.textContent = `XP: ${score}`; }

    function updateLivesDisplay(animateIndex = -1) {
        livesContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const heartIcon = document.createElement('i');
            heartIcon.className = i < lives ? 'fas fa-heart heart-icon' : 'fas fa-heart-broken heart-icon heart-broken';
            if (i === animateIndex) {
                heartIcon.classList.add('animate-heart-break');
                setTimeout(() => heartIcon.classList.remove('animate-heart-break'), 500);
            }
            livesContainer.appendChild(heartIcon);
        }
    }

    function startPhase() {
        currentLevelIndex = 0;
        score = 0;
        lives = 5;
        startLevel();
    }

    function startLevel() {
        currentQuestionIndexInLevel = 0;
        levelCompleteScreen.classList.add('hidden');
        phaseCompleteScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        loadQuestion();
    }

    // ATUALIZADA: Agora com a lógica para embaralhar as respostas
    function loadQuestion() {
        answered = false;
        feedbackArea.classList.add('hidden');
        nextBtn.classList.add('hidden');

        const levelData = gameData[currentPhaseId].levels[currentLevelIndex];
        const questionData = levelData.questions[currentQuestionIndexInLevel];

        // Guarda o texto da resposta correta ANTES de embaralhar
        const correctAnswerText = questionData.options[questionData.correctAnswer];

        // Cria uma cópia e embaralha as opções
        const shuffledOptions = shuffleArray([...questionData.options]);

        // Encontra o NOVO índice da resposta correta no array embaralhado
        currentCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

        updateLivesDisplay();
        updateXpDisplay();

        levelTitle.textContent = `${gameData[currentPhaseId].phaseName} - ${levelData.levelName}`;
        progressText.textContent = `Questão ${currentQuestionIndexInLevel + 1} / ${levelData.questions.length}`;
        questionText.textContent = questionData.question;

        optionsContainer.innerHTML = '';
        shuffledOptions.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'w-full text-left p-4 border rounded-lg hover:bg-gray-100 transition-colors quiz-option';
            button.textContent = option;
            button.dataset.index = index; // O índice agora é da posição embaralhada
            button.addEventListener('click', selectAnswer);
            optionsContainer.appendChild(button);
        });
    }

    // ATUALIZADA: Agora compara com o índice correto da pergunta embaralhada
    function selectAnswer(e) {
        if (answered) return;
        answered = true;

        const selectedButton = e.target;
        const selectedAnswerIndex = parseInt(selectedButton.dataset.index);
        const questionData = gameData[currentPhaseId].levels[currentLevelIndex].questions[currentQuestionIndexInLevel];

        document.querySelectorAll('.quiz-option').forEach(btn => btn.disabled = true);

        // Compara com o índice correto que guardamos após o embaralhamento
        if (selectedAnswerIndex === currentCorrectIndex) {
            score++;
            updateXpDisplay();
            selectedButton.classList.add('bg-green-200', 'border-green-500');
            feedbackArea.innerHTML = `<p class="font-bold text-green-700">Correto!</p><p class="text-sm mt-1">${questionData.explanation}</p>`;
            feedbackArea.classList.remove('hidden');
            nextBtn.textContent = "Próxima Pergunta";
            nextBtn.classList.remove('hidden');
        } else {
            handleIncorrectAnswer(selectedButton, questionData);
        }
    }

    function handleIncorrectAnswer(selectedButton, questionData) {
        selectedButton.classList.add('bg-red-200', 'border-red-500');
        const lifeIndexToAnimate = lives > 0 ? lives - 1 : -1;
        lives = Math.max(0, lives - 1);
        updateLivesDisplay(lifeIndexToAnimate);

        if (lives > 0) {
            feedbackArea.innerHTML = `<p class="font-bold text-red-700">Incorreto.</p><p class="text-sm mt-2">Você tem ${lives} vidas restantes. Deseja usar uma para tentar de novo?</p><div class="flex justify-center gap-4 mt-4"><button id="retry-yes-btn" class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Sim, tentar de novo</button><button id="retry-no-btn" class="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600">Não, pular</button></div>`;
            document.getElementById('retry-yes-btn').addEventListener('click', useLifeAndRetry);
            document.getElementById('retry-no-btn').addEventListener('click', () => showExplanationAndContinue(questionData));
        } else {
            showGameOver();
        }
        feedbackArea.classList.remove('hidden');
    }

    function useLifeAndRetry() {
        answered = false;
        feedbackArea.classList.add('hidden');
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('bg-red-200', 'border-red-500');
        });
    }

    // ATUALIZADA: Agora destaca a resposta correta na sua nova posição embaralhada
    function showExplanationAndContinue(questionData) {
        feedbackArea.innerHTML = `<p class="font-bold text-red-700">Incorreto.</p><p class="text-sm mt-1">${questionData.explanation}</p>`;
        // Usa o currentCorrectIndex para destacar a resposta certa
        document.querySelector(`.quiz-option[data-index='${currentCorrectIndex}']`).classList.add('bg-green-200', 'border-green-500');
        nextBtn.textContent = "Próxima Pergunta";
        nextBtn.classList.remove('hidden');
    }

    // ATUALIZADA: Agora define o título como "Fase SQL - Game Over"
    function showGameOver() {
        gameScreen.classList.add('hidden');
        phaseCompleteScreen.classList.remove('hidden');
        const phaseData = gameData[currentPhaseId];
        phaseCompleteTitle.textContent = `${phaseData.phaseName} - Game Over`; // Define o título correto
        phaseScoreText.textContent = `Seu XP final foi: ${score}`;
        phaseStatusText.textContent = "Você perdeu todas as suas vidas. Tente novamente para se tornar um mestre!";
        phaseStatusText.className = "font-bold text-red-600";
    }

    // Funções de final de nível e fase (sem alterações lógicas, apenas o título da fase foi ajustado)
    function handleNext() {
        currentQuestionIndexInLevel++;
        const levelData = gameData[currentPhaseId].levels[currentLevelIndex];
        if (currentQuestionIndexInLevel < levelData.questions.length) {
            loadQuestion();
        } else {
            showLevelComplete();
        }
    }

    function showLevelComplete() {
        gameScreen.classList.add('hidden');
        levelCompleteScreen.classList.remove('hidden');
        const allPreviousQuestions = gameData[currentPhaseId].levels.slice(0, currentLevelIndex).reduce((acc, level) => acc + level.questions.length, 0);
        const scoreInThisLevel = score - allPreviousQuestions;
        const questionsInLevel = gameData[currentPhaseId].levels[currentLevelIndex].questions.length;
        levelScoreText.textContent = `Sua pontuação neste nível foi: ${scoreInThisLevel} de ${questionsInLevel}`;
        if (currentLevelIndex + 1 < gameData[currentPhaseId].levels.length) {
            nextLevelBtn.textContent = "Ir para o Próximo Nível";
        } else {
            nextLevelBtn.textContent = "Ver Resultado Final da Fase";
        }
    }

    function handleNextLevel() {
        currentLevelIndex++;
        if (currentLevelIndex < gameData[currentPhaseId].levels.length) {
            startLevel();
        } else {
            showPhaseComplete();
        }
    }

    function showPhaseComplete() {
        levelCompleteScreen.classList.add('hidden');
        phaseCompleteScreen.classList.remove('hidden');
        const phaseData = gameData[currentPhaseId];
        phaseCompleteTitle.textContent = `${phaseData.phaseName} Concluída!`;
        const totalQuestions = phaseData.levels.reduce((acc, level) => acc + level.questions.length, 0);
        const userPercentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
        phaseScoreText.textContent = `Sua pontuação final foi: ${score} de ${totalQuestions} (${userPercentage.toFixed(0)}%)`;
        if (userPercentage >= phaseData.passingScorePercentage) {
            phaseStatusText.textContent = "Parabéns, você foi aprovado e desbloqueou a próxima fase!";
            phaseStatusText.className = "font-bold text-green-600";
        } else {
            phaseStatusText.textContent = `Você não atingiu os ${phaseData.passingScorePercentage}% necessários para passar. Tente novamente!`;
            phaseStatusText.className = "font-bold text-red-600";
        }
    }

    // EVENT LISTENERS GERAIS
    nextBtn.addEventListener('click', handleNext);
    nextLevelBtn.addEventListener('click', handleNextLevel);
    restartPhaseBtn.addEventListener('click', startPhase);

    // INICIALIZAÇÃO
    startPhase();
});