document.addEventListener('DOMContentLoaded', () => {

    const podcastComponent = document.getElementById('podcast-component');

    if (podcastComponent) {
        
        const audioPlayer = {
            audioElement: document.getElementById('audio-element'),
            trackNameEl: document.getElementById('track-name'),
            playlistContainer: document.getElementById('playlist-container'),
            albumCoversContainer: document.getElementById('album-covers-container'),
            prevBtn: document.getElementById('prev-track'),
            nextBtn: document.getElementById('next-track'),
            filterButtons: document.querySelectorAll('.playlist-filter-btn'),
            swiperInstance: null,

            // PLAYLIST COMPLETA COM TODOS OS 25 ARQUIVOS
            fullPlaylist: [
                { id: 1, category: 'geral', title: '1. O Analista de Dados 4.0', audioSrc: 'audio/1. geral/1. O Analista de Dados 4.0.mp3' },
                { id: 1, category: 'aulas', title: '1. [Aula 1] Visão Geral da Formação SQL Database Specialist', audioSrc: 'audio/2. aula/1. [Aula 1] Visão Geral da Formação SQL Database Specialist.wav' },
                { id: 2, category: 'aulas', title: '2. [Aula 2] Pré-requisitos para essa formação', audioSrc: 'audio/2. aula/2. [Aula 2] Pré-requisitos para essa formação.wav' },
                { id: 3, category: 'aulas', title: '3. [Aula 3] Apresentação inicial', audioSrc: 'audio/2. aula/3. [Aula 3] Apresentação inicial.wav' },
                { id: 4, category: 'aulas', title: '4. [Aula 4] Cenários de Dados', audioSrc: 'audio/2. aula/4. [Aula 4] Cenários de Dados.wav' },
                { id: 5, category: 'aulas', title: '5. [Aula 5] O que são banco de dados', audioSrc: 'audio/2. aula/5. [Aula 5] O que são banco de dados.wav' },
                { id: 6, category: 'aulas', title: '6. [Aula 6] Sistemas de Gerenciamento de Banco de dados - SGBDs', audioSrc: 'audio/2. aula/6. [Aula 6] Sistemas de Gerenciamento de Banco de dados - SGBDs.wav' },
                { id: 7, category: 'aulas', title: '7. [Aula 7] Breve histórico de SGBDs', audioSrc: 'audio/2. aula/7. [Aula 7] Breve histórico de SGBDs.wav' },
                { id: 8, category: 'aulas', title: '8. [Aula 8] Modelo de Banco de Dados Relacional', audioSrc: 'audio/2. aula/8. [Aula 8] Modelo de Banco de Dados Relacional.wav' },
                { id: 9, category: 'aulas', title: '9. [Aula 9] SGBDs mais utilizados pelo mercado', audioSrc: 'audio/2. aula/9. [Aula 9] SGBDs mais utilizados pelo mercado.wav' },
                { id: 10, category: 'aulas', title: '10. [Aula 10] A era dos dados e o futuro da modelagem - Parte 1', audioSrc: 'audio/2. aula/10. [Aula 10] A era dos dados e o futuro da modelagem - Parte 1.wav' },
                { id: 11, category: 'aulas', title: '11. [Aula 11] A era dos dados e o futuro da modelagem - Parte 2', audioSrc: 'audio/2. aula/11. [Aula 11] A era dos dados e o futuro da modelagem - Parte 2.wav' },
                { id: 12, category: 'aulas', title: '12. [Aula 12] Novo cenário e novas tecnologias - E agora', audioSrc: 'audio/2. aula/12. [Aula 12] Novo cenário e novas tecnologias - E agora.wav' },
                { id: 1, category: 'podcast', title: '1. [Aula 1] Podcast', audioSrc: 'audio/3. podcast/1. [Aula 1] Podcast.wav' },
                { id: 2, category: 'podcast', title: '2. [Aula 2] Podcast', audioSrc: 'audio/3. podcast/2. [Aula 2] Podcast.wav' },
                { id: 3, category: 'podcast', title: '3. [Aula 3] Podcast', audioSrc: 'audio/3. podcast/3. [Aula 3] Podcast.wav' },
                { id: 4, category: 'podcast', title: '4. [Aula 4] Podcast', audioSrc: 'audio/3. podcast/4. [Aula 4] Podcast.wav' },
                { id: 5, category: 'podcast', title: '5. [Aula 5] Podcast', audioSrc: 'audio/3. podcast/5. [Aula 5] Podcast.wav' },
                { id: 6, category: 'podcast', title: '6. [Aula 6] Podcast', audioSrc: 'audio/3. podcast/6. [Aula 6] Podcast.wav' },
                { id: 7, category: 'podcast', title: '7. [Aula 7] Podcast', audioSrc: 'audio/3. podcast/7. [Aula 7] Podcast.wav' },
                { id: 8, category: 'podcast', title: '8. [Aula 8] Podcast', audioSrc: 'audio/3. podcast/8. [Aula 8] Podcast.wav' },
                { id: 9, category: 'podcast', title: '9. [Aula 9] Podcast', audioSrc: 'audio/3. podcast/9. [Aula 9] Podcast.wav' },
                { id: 10, category: 'podcast', title: '10. [Aula 10] Podcast', audioSrc: 'audio/3. podcast/10. [Aula 10] Podcast.wav' },
                { id: 11, category: 'podcast', title: '11. [Aula 11] Podcast', audioSrc: 'audio/3. podcast/11. [Aula 11] Podcast.wav' },
                { id: 12, category: 'podcast', title: '12. [Aula 12] Podcast', audioSrc: 'audio/3. podcast/12. [Aula 12] Podcast.wav' }
            ],
            
            activePlaylist: [],
            currentTrackIndexInActivePlaylist: 0,
            activeFilter: 'all',

            getCoverImage(track) {
                switch (track.category) {
                    case 'geral': return 'img/geral/geral.jpg';
                    case 'podcast': return 'img/podcast/podcast.jpg';
                    case 'aulas':
                        if (track.id >= 1 && track.id <= 5) { return `img/aula/${track.id}.JPG`; }
                        return `img/aula/${track.id}.jpg`;
                    default: return 'img/default.jpg';
                }
            },
            
            filterPlaylist(filter) {
                this.activeFilter = filter;
                this.activePlaylist = (filter === 'all')
                    ? [...this.fullPlaylist]
                    : this.fullPlaylist.filter(track => track.category === filter);
                
                this.filterButtons.forEach(button => {
                    button.classList.toggle('active', button.dataset.filter === filter);
                });
                
                this.currentTrackIndexInActivePlaylist = 0;
                this.renderAlbumCovers();
                this.swiperInstance.slideTo(0, 0); // Volta para o primeiro slide sem animação
                this.loadTrack(0);
                this.audioElement.pause();
            },

            renderPlaylist() {
                this.playlistContainer.innerHTML = '';
                this.renderPlaylistItem(this.currentTrackIndexInActivePlaylist, true);
                if (this.currentTrackIndexInActivePlaylist < this.activePlaylist.length - 1) {
                    this.renderPlaylistItem(this.currentTrackIndexInActivePlaylist + 1, false);
                }
            },

            renderPlaylistItem(index, isPlaying) {
                const track = this.activePlaylist[index];
                if (!track) return;
                
                const trackElement = document.createElement('button');
                trackElement.className = 'w-full text-left p-1.5 rounded-md hover:bg-gray-100 transition-colors playlist-item flex items-center gap-2 text-sm';
                const icon = isPlaying ? '<i class="fas fa-volume-up accent-color"></i>' : '<i class="fas fa-headphones text-gray-400"></i>';
                trackElement.innerHTML = `<div>${icon}</div><div>${track.title}</div>`;
                if (isPlaying) trackElement.classList.add('playing');
                
                trackElement.addEventListener('click', () => {
                    this.loadTrack(index);
                    this.audioElement.play();
                });
                this.playlistContainer.appendChild(trackElement);
            },
            
            renderAlbumCovers() {
                this.albumCoversContainer.innerHTML = '';
                this.activePlaylist.forEach(track => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    const imgSrc = this.getCoverImage(track);
                    slide.innerHTML = `<img src="${imgSrc}" alt="Capa para ${track.title}">`;
                    this.albumCoversContainer.appendChild(slide);
                });
                if(this.swiperInstance) this.swiperInstance.update();
            },

            loadTrack(indexInActivePlaylist) {
                if (indexInActivePlaylist >= 0 && indexInActivePlaylist < this.activePlaylist.length) {
                    this.currentTrackIndexInActivePlaylist = indexInActivePlaylist;
                    const track = this.activePlaylist[indexInActivePlaylist];
                    this.audioElement.src = track.audioSrc;
                    this.trackNameEl.textContent = track.title;
                    
                    this.updateButtons();
                    this.renderPlaylist();

                    if (this.swiperInstance) {
                        this.swiperInstance.slideTo(indexInActivePlaylist, 300);
                    }
                }
            },

            playNext() {
                if (this.currentTrackIndexInActivePlaylist < this.activePlaylist.length - 1) {
                    this.loadTrack(this.currentTrackIndexInActivePlaylist + 1);
                    this.audioElement.play();
                }
            },

            playPrev() {
                if (this.currentTrackIndexInActivePlaylist > 0) {
                    this.loadTrack(this.currentTrackIndexInActivePlaylist - 1);
                    this.audioElement.play();
                }
            },

            updateButtons() {
                this.prevBtn.disabled = this.currentTrackIndexInActivePlaylist === 0;
                this.nextBtn.disabled = this.currentTrackIndexInActivePlaylist >= this.activePlaylist.length - 1;
            },
            
            init() {
                this.activePlaylist = [...this.fullPlaylist];
                this.renderAlbumCovers();

                this.swiperInstance = new Swiper('.swiper', {
                    effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto',
                    coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
                });

                this.loadTrack(0);
                
                this.nextBtn.addEventListener('click', () => this.playNext());
                this.prevBtn.addEventListener('click', () => this.playPrev());
                this.audioElement.addEventListener('ended', () => this.playNext());
                
                this.swiperInstance.on('slideChange', () => {
                    const newIndex = this.swiperInstance.activeIndex;
                    if (newIndex !== this.currentTrackIndexInActivePlaylist) {
                        this.loadTrack(newIndex);
                        this.audioElement.play();
                    }
                });

                this.filterButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        this.filterPlaylist(e.currentTarget.dataset.filter);
                    });
                });
            }
        };

        audioPlayer.init();
    }


    // LÓGICA DO ACORDEÃO CRISP-DM (COMPLETA E INALTERADA)
    const crispDmData = [
        { title: "1. Compreensão do Negócio", content: "Definir os objetivos de negócio e traduzir um desafio empresarial em uma questão analítica clara. Fase mais crítica." },
        { title: "2. Compreensão dos Dados", content: "Coletar dados iniciais, explorá-los para identificar padrões e verificar a qualidade geral. Formar hipóteses." },
        { title: "3. Preparação dos Dados", content: "Fase mais demorada. Limpar dados, tratar valores nulos, criar novas variáveis (feature engineering) e formatar." },
        { title: "4. Modelagem", content: "Aplicar técnicas analíticas ou de machine learning para extrair insights e construir modelos preditivos." },
        { title: "5. Avaliação", content: "Avaliar os resultados técnicos no contexto dos objetivos de negócio. A solução resolve o problema original?" },
        { title: "6. Implementação", content: "Colocar a solução (dashboard, modelo) em produção, treinar os usuários e planejar o monitoramento contínuo." }
    ];
    const crispDmContainer = document.getElementById('crisp-dm-container');
    if (crispDmContainer) {
        crispDmContainer.innerHTML = '';
        crispDmData.forEach((step) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'accordion-item border-b border-gray-200';
            stepEl.innerHTML = `
                <button class="accordion-button w-full text-left p-4 font-semibold accent-color focus:outline-none flex justify-between items-center">
                    <span>${step.title}</span>
                    <span class="accordion-icon transform transition-transform duration-300 text-2xl font-light">+</span>
                </button>
                <div class="accordion-content px-4 text-gray-600" style="max-height: 0px; overflow: hidden;">
                    <p class="py-4">${step.content}</p>
                </div>
            `;
            crispDmContainer.appendChild(stepEl);
        });
        initializeAccordions('#crisp-dm-container', true);
    }
});