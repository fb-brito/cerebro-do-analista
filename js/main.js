import { initializeNavigation } from './navigation.js';

async function loadComponent(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const text = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = text;
        }
    } catch (error) {
        console.error(`Falha ao carregar componente de ${url}:`, error);
    }
}

async function initializeApp() {
    // Carrega o header E espera a conclusão.
    await loadComponent('/components/_header.html', 'header-placeholder');
    
    // Carrega o footer E espera a conclusão.
    await loadComponent('/components/_footer.html', 'footer-placeholder');

    // Somente APÓS os componentes estarem no DOM,
    // nós executamos a lógica de navegação.
    initializeNavigation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}