document.addEventListener('DOMContentLoaded', () => {
    const palettes = [
        { id: 'N3', colors: ['#121212', '#1E1E1E', '#EAEAEA', '#A0A0A0', '#00DAC6'], category: 'Web Apps', use_case: 'Otimizada para Dark Mode. Focada no conforto visual e com um destaque vibrante.' },
        { id: 'P21', colors: ['#6DA67A', '#99A66D', '#A9BD68', '#B5CC6A', '#C0DE5D'], category: 'Natureza', use_case: 'A melhor paleta de verdes enviada. Coesa, orgânica e muito versátil para o tema.' },
        { id: 'P2', colors: ['#4180AB', '#FFFFFF', '#8AB3CF', '#BDD1DE', '#E4EBF0'], category: 'Corporativo', use_case: 'Paleta segura e limpa. O azul aço é uma ótima cor primária.' },
        { id: 'N1', colors: ['#F8F9FA', '#112D4E', '#3F72AF', '#28A745', '#DC3545'], category: 'Corporativo', use_case: 'Otimizada para função. Define cores para fundo, texto, ação e alertas, garantindo clareza.' },
        { id: 'P3', colors: ['#3B3F49', '#FDFAEB', '#FAEDDF', '#F3C6B9', '#F7A29E'], category: 'Web Apps', use_case: 'Bom contraste entre o escuro e o creme. Os tons rosados são suaves, bons para sites de lifestyle.' },
        { id: 'N2', colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'], category: 'Visualização', use_case: 'Otimizada para acessibilidade. Cores distintas para usar em gráficos, testadas para daltonismo.' },
        { id: 'P7', colors: ['#FE958F', '#F3D7C2', '#8BB6A3', '#17A7A8', '#122F51'], category: 'Energia', use_case: 'Combinação vibrante de coral e turquesa. Funciona para marcas jovens e eventos.' },
        { id: 'P4', colors: ['#62A07B', '#4F8B89', '#536C8D', '#5C4F79', '#613860'], category: 'Natureza', use_case: 'Gradação de verdes e azuis muito coesa. Passa uma sensação de tecnologia e natureza.' },
        { id: 'P27', colors: ['#2C2B4B', '#A75293', '#9C7A9D', '#9DDACB', '#F8DCB4'], category: 'Web Apps', use_case: 'Excelente identidade visual. Moderna, tecnológica e com cores de destaque bem definidas.' },
        { id: 'P1', colors: ['#CBDAD5', '#89A7B1', '#566981', '#3A415A', '#34344E'], category: 'Corporativo', use_case: 'Sóbria e profissional. Os tons de azul-acinzentado são ótimos para menus e fundos.' },
        { id: 'P9', colors: ['#2B2C30', '#35313B', '#453745', '#613C4C', '#FF1457'], category: 'Web Apps', use_case: 'Dark mode poderoso. O rosa choque é um CTA fortíssimo, mas deve ser usado pouco.' },
        { id: 'P20', colors: ['#4AEDD7', '#705647', '#ED6D4A', '#FFCA64', '#3FD97F'], category: 'Energia', use_case: 'Alto contraste entre o ciano vibrante e o marrom. Paleta energética e moderna.' }
    ];

    const gallery = document.getElementById('palette-gallery');
    const filtersContainer = document.getElementById('filters');
    const notification = document.getElementById('copy-notification');

    const categories = ['Todas', ...new Set(palettes.map(p => p.category))];

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 transition-colors';
        if (category === 'Todas') button.classList.add('active');
        button.textContent = category;
        button.dataset.category = category;
        button.addEventListener('click', handleFilterClick);
        filtersContainer.appendChild(button);
    });

    function handleFilterClick(e) {
        const category = e.target.dataset.category;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderPalettes(category);
    }

    function renderPalettes(filter = 'Todas') {
        gallery.innerHTML = '';
        const filteredPalettes = filter === 'Todas' ? palettes : palettes.filter(p => p.category === filter);

        filteredPalettes.forEach(palette => {
            const card = document.createElement('div');
            card.className = 'palette-card';
            card.innerHTML = `
                        <div class="flex">
                            ${palette.colors.map(color => `<div class="color-strip flex-1" style="background-color: ${color}"></div>`).join('')}
                        </div>
                        <div class="p-4">
                            <h3 class="font-bold text-lg">${palette.id} <span class="text-sm font-normal text-gray-500">- ${palette.category}</span></h3>
                            <p class="text-sm text-gray-600 mt-1 mb-3">${palette.use_case}</p>
                            <div class="flex flex-wrap gap-2">
                                ${palette.colors.map(color => `
                                    <button class="copy-btn text-xs font-mono p-1 rounded-md border" data-color="${color}">
                                        ${color}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `;
            gallery.appendChild(card);
        });

        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                navigator.clipboard.writeText(color).then(() => {
                    // Nova chamada à função centralizada
                    showCopyNotification('Comando copiado!');
                });
            });
        });
    }

    renderPalettes();
});