document.addEventListener('DOMContentLoaded', () => {
    const gitCommands = [
        { title: '1. Criar Nova Branch', command: 'git branch feature/nome-da-feature', explanation: 'Cria um novo ramo de desenvolvimento isolado. Essencial para trabalhar em novas funcionalidades sem afetar a linha principal do código.', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '2. Mudar para a Branch', command: 'git checkout feature/nome-da-feature', explanation: 'Muda o seu "ponteiro" (HEAD) para a nova branch, permitindo que você comece a fazer commits nela.', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '3. Adicionar Alterações', command: 'git add .', explanation: 'Adiciona todas as alterações de arquivos no seu diretório de trabalho para a "área de preparação" (staging area), marcando-os para o próximo commit. O ponto (.) significa "todos os arquivos".', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '4. Fazer o Commit', command: 'git commit -m "Feat: Descrição da alteração"', explanation: 'Grava permanentemente as alterações que estão na área de preparação no seu histórico local. A mensagem deve ser clara e descritiva.', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '5. Enviar para o GitHub', command: 'git push --set-upstream origin feature/nome-da-feature', explanation: 'Envia a sua branch e os seus commits para o repositório remoto (GitHub). O "--set-upstream" cria um vínculo entre a sua branch local e a remota.', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '6. Voltar para a Main', command: 'git checkout main', explanation: 'Retorna para a branch principal, geralmente `main` ou `master`, em preparação para integrar suas novas alterações.', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '7. Juntar as Alterações (Merge)', command: 'git merge feature/nome-da-feature', explanation: 'Na branch `main`, este comando pega todo o histórico de commits da sua branch de funcionalidade e o integra na `main`.', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '8. Atualizar a Main Remota', command: 'git push origin main', explanation: 'Após o merge local, este comando atualiza a branch `main` no repositório remoto com as novas alterações integradas.', section: 'Fluxo de Trabalho: Feature Branch' },
        { title: '9. Apagar Branch Local', command: 'git branch -d feature/nome-da-feature', explanation: 'Uma vez que a funcionalidade foi integrada, você pode apagar a branch local para manter seu ambiente de trabalho limpo.', section: 'Limpeza do Ambiente' },
        { title: '10. Apagar Branch Remota', command: 'git push origin --delete feature/nome-da-feature', explanation: 'Também remove a branch do repositório remoto (GitHub), finalizando o ciclo de vida da funcionalidade.', section: 'Limpeza do Ambiente' },

        {
            title: 'Cenário 1: Descartar uma branch com erro (antes do merge)',
            command: '# 1. Garante que você está na branch principal\ngit checkout main\n\n# 2. Força a exclusão da branch localmente (-D)\ngit branch -D nome-da-branch-com-erro\n\n# 3. Remove a branch também do repositório remoto\ngit push origin --delete nome-da-branch-com-erro',
            explanation: 'Use estes comandos quando você cometeu um erro em uma branch e quer simplesmente apagá-la, tanto localmente quanto no GitHub, para começar de novo. O -D maiúsculo força a exclusão local.',
            section: 'Kit de Primeiros Socorros: Como Desfazer Ações'
        },
        {
            title: 'Cenário 2: Cancelar um merge com conflito',
            command: 'git merge --abort',
            explanation: 'Se você tentar um "git merge" e se deparar com conflitos que não sabe resolver, este comando é seu botão de pânico. Ele cancela o merge e retorna seu projeto ao estado anterior, como se nada tivesse acontecido.',
            section: 'Kit de Primeiros Socorros: Como Desfazer Ações'
        },
        {
            title: 'Cenário 3: Reverter um merge já concluído na "main"',
            command: '# 1. Encontre o HASH do commit de merge que você quer reverter\ngit log --oneline\n\n# 2. Crie um novo commit que desfaz o merge anterior\ngit revert -m 1 <hash_do_commit_de_merge>',
            explanation: 'Este é o comando para o arrependimento final. Se você já integrou uma funcionalidade na main e a enviou para o GitHub, mas descobriu um grande problema, use este comando. O "git revert" cria um NOVO commit que desfaz todas as alterações do merge, mantendo o histórico intacto e seguro.',
            section: 'Kit de Primeiros Socorros: Como Desfazer Ações'
        },
        // ===== ITEM ATUALIZADO COM OS COMANDOS CORRETOS =====
        {
            title: 'Cenário 4: Resetar o Repositório Remoto (Avançado)',
            command: '# 1. Cria uma nova branch "órfã", sem nenhum histórico\ngit checkout --orphan nova_main\n\n# 2. Cria um commit inicial vazio para estabelecer a nova história\ngit commit --allow-empty -m "Initial commit"\n\n# 3. Renomeia a branch local para "main" para consistência\ngit branch -M main\n\n# 4. Força o envio da sua nova "main" local para a remota, apagando tudo que estava lá\ngit push origin main --force',
            explanation: 'CUIDADO: Este é um processo destrutivo que apaga todo o histórico do seu repositório no GitHub. É útil para começar um projeto do zero em um repositório existente ou para corrigir erros graves no histórico.',
            section: 'Kit de Primeiros Socorros: Como Desfazer Ações'
        }
    ];

    const sectionDescriptions = {
        'Fluxo de Trabalho: Feature Branch': 'Este é o ciclo completo para desenvolver uma nova funcionalidade de forma segura e organizada, desde a criação até a integração.',
        'Limpeza do Ambiente': 'Após a integração, é uma boa prática remover as branches que não são mais necessárias para manter o repositório limpo.',
        'Kit de Primeiros Socorros: Como Desfazer Ações': 'Comandos essenciais para reverter erros comuns de forma segura, sem entrar em pânico.'
    };

    const mainContainer = document.getElementById('git-guide-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    const groupedCommands = gitCommands.reduce((acc, command) => {
        const section = command.section;
        if (!acc[section]) { acc[section] = []; }
        acc[section].push(command);
        return acc;
    }, {});

    for (const sectionName in groupedCommands) {
        const sectionBlock = document.createElement('div');
        sectionBlock.className = 'mb-12';

        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = sectionName;

        const sectionParagraph = document.createElement('p');
        sectionParagraph.className = 'text-gray-600 mb-6';
        sectionParagraph.textContent = sectionDescriptions[sectionName] || '';

        sectionBlock.appendChild(sectionTitle);
        sectionBlock.appendChild(sectionParagraph);

        const accordionContainer = document.createElement('div');
        accordionContainer.className = 'card p-6 md:p-8';

        groupedCommands[sectionName].forEach(item => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item border-b border-gray-200 last:border-b-0';
            // ATUALIZAÇÃO: Adicionada a classe "language-bash" na tag <code>
            accordionItem.innerHTML = `
                <button class="accordion-button w-full text-left p-4 font-semibold dark-accent-color focus:outline-none flex justify-between items-center">
                    <span>${item.title}</span>
                    <span class="accordion-icon transform transition-transform duration-300 text-2xl font-light">+</span>
                </button>
                <div class="accordion-content px-4 text-gray-700" style="max-height: 0px; overflow: hidden;">
                    <p class="py-4">${item.explanation}</p>
                    <div class="code-block mb-4">
                        <button class="copy-icon" title="Copiar comando"><i class="far fa-copy"></i></button>
                        <pre><code class="language-bash">${item.command}</code></pre>
                    </div>
                </div>
            `;
            accordionContainer.appendChild(accordionItem);

            accordionItem.querySelector('.copy-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                // Copia o texto sem os comentários para facilitar o uso
                const commandToCopy = item.command.split('\n').filter(line => !line.trim().startsWith('#')).join('\n');
                navigator.clipboard.writeText(commandToCopy).then(() => {
                    showCopyNotification('Comando copiado!');
                });
            });
        });

        sectionBlock.appendChild(accordionContainer);
        mainContainer.appendChild(sectionBlock);
    }

    initializeAccordions('#git-guide-container');
});