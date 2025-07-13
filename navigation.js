/**
 * navigation.js
 * This script handles the creation of a consistent navigation menu across all pages.
 * It identifies the current page and applies an 'active' class to the corresponding link.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Find the container for the main navigation
    const navContainer = document.getElementById('main-nav');
    if (!navContainer) return;

    // Define the navigation links and their properties
    const navLinks = [
        { href: './index.html', text: 'Principal' },
        { href: './guia-git.html', text: 'Guia Git' },
        { href: './guia-sql.html', text: 'Guia SQL' }, // NOVO LINK
        { href: './guia-markdown.html', text: 'Guia Markdown' },
        { href: './paleta-cores.html', text: 'Paletas de Cores' },
        { href: './index.html#toolkit', text: 'Quiz Gamificado', isHighlight: true }
    ];

    // Get the filename of the current page to identify it
    const currentPage = window.location.pathname.split('/').pop();

    // Create the Unordered List element for the navigation
    const ul = document.createElement('ul');
    ul.className = 'flex justify-center flex-wrap space-x-2 md:space-x-4 text-sm md:text-base font-semibold text-gray-600';

    // Loop through the links to create and append them
    navLinks.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;

        // Check if the current link's href matches the current page's filename
        if (link.href.includes(currentPage)) {
            a.classList.add('active');
        }

        // Add a special highlight class for the gamified quiz link
        if (link.isHighlight && !a.classList.contains('active')) {
            a.classList.add('accent-color', 'font-bold');
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    // Add the complete navigation list to its container in the DOM
    navContainer.appendChild(ul);
});
