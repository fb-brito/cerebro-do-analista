// Dentro de js/components.js

function showCopyNotification(message = 'Comando copiado!') {
    const notification = document.getElementById('copy-notification');
    if (!notification) return;

    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}