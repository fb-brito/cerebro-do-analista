// js/components.js

function showCopyNotification(message = 'Comando copiado!') {
    const notification = document.getElementById('copy-notification');
    if (!notification) return;

    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Função genérica para inicializar acordeões
// O parâmetro 'closeOthers' define se um item deve fechar os outros ao ser aberto.
function initializeAccordions(containerSelector, closeOthers = false) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Usaremos uma classe comum 'accordion-item' para encontrar os elementos
    const accordionItems = container.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const button = item.querySelector('.accordion-button');
        const content = item.querySelector('.accordion-content');
        const icon = button.querySelector('.accordion-icon');

        if (!button || !content || !icon) return;

        button.addEventListener('click', () => {
            const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

            // Se a opção 'closeOthers' for verdadeira, fecha todos os outros itens
            if (closeOthers) {
                accordionItems.forEach(otherItem => {
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent !== content) {
                        otherContent.style.maxHeight = '0px';
                        const otherIcon = otherItem.querySelector('.accordion-icon');
                        if (otherIcon) otherIcon.textContent = '+';
                    }
                });
            }

            // Abre ou fecha o item que foi clicado
            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.textContent = '−';
            } else {
                content.style.maxHeight = '0px';
                icon.textContent = '+';
            }
        });
    });
}