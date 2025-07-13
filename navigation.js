document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('main-nav');
    if (!navContainer) return;

    const navLinks = [
        { href: './index.html', text: 'Principal' },
        {
            text: 'Caixa de Ferramentas',
            isDropdown: true,
            sublinks: [
                { href: './guia-python.html', text: 'Guia Python' },
                { href: './guia-git.html', text: 'Guia Git' },
                { href: './guia-sql.html', text: 'Guia SQL' },
                { href: './guia-markdown.html', text: 'Guia Markdown' },
            ]
        },
        { href: './paleta-cores.html', text: 'Paletas de Cores' },
        { href: './quiz.html', text: 'Quiz Gamificado', isHighlight: true } // LINK ATUALIZADO
    ];

    const currentPage = window.location.pathname.split('/').pop();

    const ul = document.createElement('ul');
    ul.className = 'flex justify-center flex-wrap items-center space-x-2 md:space-x-4 text-sm md:text-base font-semibold text-gray-600';

    navLinks.forEach(link => {
        const li = document.createElement('li');

        if (link.isDropdown) {
            li.className = 'relative';
            li.innerHTML = `
                <button class="dropdown-toggle flex items-center">
                    ${link.text}
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="dropdown-menu absolute mt-2 py-2 rounded-md border bg-white shadow-lg">
                    ${link.sublinks.map(sublink => `
                        <a href="${sublink.href}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">${sublink.text}</a>
                    `).join('')}
                </div>
            `;
        } else {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            if (link.href.includes(currentPage)) {
                a.classList.add('active');
            }
            if (link.isHighlight && !a.classList.contains('active')) {
                a.classList.add('accent-color', 'font-bold');
            }
            li.appendChild(a);
        }
        ul.appendChild(li);
    });

    navContainer.appendChild(ul);

    // LÓGICA DE CONTROLE DO DROPDOWN COM JAVASCRIPT
    const dropdowns = document.querySelectorAll('.relative');
    let leaveTimer;

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        if (toggle && menu) {
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(leaveTimer);
                menu.classList.add('is-visible');
            });

            dropdown.addEventListener('mouseleave', () => {
                leaveTimer = setTimeout(() => {
                    menu.classList.remove('is-visible');
                }, 200);
            });
        }
    });
});