document.addEventListener('DOMContentLoaded', () => {
    const gitCommands = [
        { title: '1. Criar Nova Branch', command: 'git branch feature/nome-da-feature', explanation: 'Cria um novo ramo...', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '2. Mudar para a Branch', command: 'git checkout feature/nome-da-feature', explanation: 'Muda o seu "ponteiro"...', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '3. Adicionar Alterações', command: 'git add .', explanation: 'O ponto (.) adiciona todos os ficheiros...', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '4. Fazer o Commit', command: 'git commit -m "Feat: Descrição da alteração"', explanation: 'Grava permanentemente as alterações...', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '5. Enviar para o GitHub', command: 'git push --set-upstream origin feature/nome-da-feature', explanation: 'Envia a sua branch e os seus commits...', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '6. Voltar para a Main', command: 'git checkout main', explanation: 'Retorna para a branch principal...', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '7. Juntar as Alterações (Merge)', command: 'git merge feature/nome-da-feature', explanation: 'Pega todo o histórico de commits...', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '8. Atualizar a Main Remota', command: 'git push origin main', explanation: 'Após o merge local, este comando atualiza...', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '9. Apagar Branch Local', command: 'git branch -d feature/nome-da-feature', explanation: 'Uma vez que a funcionalidade foi integrada...', section: 'Limpeza do Ambiente' },
        { title: '10. Apagar Branch Remota', command: 'git push origin --delete feature/nome-da-feature', explanation: 'Também remove a branch do GitHub...', section: 'Limpeza do Ambiente' }
    ];

    const sectionDescriptions = {
        'Fluxo de Trabalho: Feature Branch': 'Este é o ciclo completo para desenvolver uma nova funcionalidade de forma segura e organizada, desde a criação até a integração.',
        'Limpeza do Ambiente': 'Após a integração, é uma boa prática remover as branches que não são mais necessárias para manter o repositório limpo.'
    };

    const mainContainer = document.getElementById('git-guide-container');

    const groupedCommands = gitCommands.reduce((acc, command) => {
        const section = command.section;
        if (!acc[section]) { acc[section] = []; }
        acc[section].push(command);
        return acc;
    }, {});

    mainContainer.innerHTML = '';

    for (const sectionName in groupedCommands) {
        const sectionBlock = document.createElement('div');
        sectionBlock.className = 'section-block';

        // --- NOVA LÓGICA DE MONTAGEM ---
        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = sectionName;

        const sectionParagraph = document.createElement('p');
        sectionParagraph.className = 'section-description';
        sectionParagraph.textContent = sectionDescriptions[sectionName] || '';

        const sectionGrid = document.createElement('div');
        sectionGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

        // Adiciona o título primeiro, para ele ficar por cima
        sectionBlock.appendChild(sectionTitle);
        // Depois a descrição e a grade
        sectionBlock.appendChild(sectionParagraph);
        sectionBlock.appendChild(sectionGrid);

        groupedCommands[sectionName].forEach(item => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'step-card-container';
            cardContainer.innerHTML = `
                        <div class="step-card">
                            <div class="card-face">
                                <h3 class="font-bold text-lg mb-2">${item.title}</h3>
                                <div class="code-block">${item.command}<button class="copy-icon" title="Copiar comando">📋</button></div>
                            </div>
                            <div class="card-face card-face-back">
                                <h3 class="font-bold text-lg mb-4">${item.title}</h3>
                                <p class="text-sm text-gray-700 flex-grow">${item.explanation}</p>
                            </div>
                        </div>
                    `;
            sectionGrid.appendChild(cardContainer);
        });

        mainContainer.appendChild(sectionBlock);
    }

    // A função de ajuste de altura e os eventos continuam como antes
    function adjustCardHeights() {
        const cards = document.querySelectorAll('.step-card-container');
        cards.forEach(card => {
            card.style.height = 'auto';
            const frontFace = card.querySelector('.card-face');
            const backFace = card.querySelector('.card-face-back');
            if (frontFace && backFace) {
                const frontHeight = frontFace.scrollHeight;
                const backHeight = backFace.scrollHeight;
                const maxHeight = Math.max(frontHeight, backHeight);
                card.style.height = `${maxHeight}px`;
            }
        });
    }

    mainContainer.addEventListener('click', function (e) {
        const copyButton = e.target.closest('.copy-icon');
        if (copyButton) {
            const commandText = copyButton.parentElement.innerText.replace('📋', '').trim();
            navigator.clipboard.writeText(commandText).then(() => {
                const notification = document.getElementById('copy-notification');
                // Nova chamada à função centralizada
                showCopyNotification('Comando copiado!');
            });
            return;
        }

        const cardContainer = e.target.closest('.step-card-container');
        if (cardContainer) {
            cardContainer.querySelector('.step-card').classList.toggle('is-flipped');
        }
    });

    adjustCardHeights();
    window.addEventListener('resize', adjustCardHeights);
});
