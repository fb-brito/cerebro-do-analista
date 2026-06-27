/**
 * js/kanban.js
 * Script principal para o Quadro Kanban com Suporte a Multi-Layouts (Projetos).
 */

function initializeKanban() {
    // ===== Estado de Dados Dinâmicos =====
    let tasks = [];
    let statuses = [];
    let priorities = [];
    let categories = [];
    let platforms = [];
    let healths = [];
    let currentViews = []; // Filtros visíveis de acordo com layout
    let columnColors = {}; // Armazena as cores personalizadas das colunas
    let tagColors = {}; // Armazena as cores personalizadas das etiquetas (tags)

    // ===== Estado de Navegação e Modais =====
    let currentView = 'status'; // será preenchido dinamicamente
    let currentLayout = 'gerenciamento'; // 'gerenciamento', 'conteudo', 'fluxo'
    let currentCalendarDate = new Date();

    let activeDeleteType = null; // 'task', 'column', 'clear'
    let activeDeleteId = null;
    let activeDeleteColType = null;

    // ===== Elementos do DOM =====
    const kanbanBoardContainer = document.getElementById('kanban-board-container');
    const kanbanCalendarContainer = document.getElementById('kanban-calendar-container');
    const viewButtons = document.querySelectorAll('.view-btn');
    const layoutButtons = document.querySelectorAll('.layout-btn');
    const mainTitle = document.getElementById('main-title');
    const mainDesc = document.getElementById('main-desc');

    // Modais de Tarefa
    const itemModal = document.getElementById('kanban-item-modal');
    const itemForm = document.getElementById('kanban-form');
    const modalTitle = document.getElementById('modal-title');
    const modalItemId = document.getElementById('modal-item-id');
    const itemTitleInput = document.getElementById('item-title');
    const itemStatusSelect = document.getElementById('item-status');
    const itemPrioritySelect = document.getElementById('item-priority');
    const itemCategorySelect = document.getElementById('item-category');
    const itemPlatformSelect = document.getElementById('item-platform');
    const itemBudgetInput = document.getElementById('item-budget');
    const itemHealthSelect = document.getElementById('item-health');
    const itemAssigneeInput = document.getElementById('item-assignee');
    const itemStartDateInput = document.getElementById('item-start-date');
    const itemEndDateInput = document.getElementById('item-end-date');
    const itemNotesTextarea = document.getElementById('item-notes');
    const btnDeleteModalItem = document.getElementById('btn-delete-modal-item');
    const lblPriority = document.querySelector('label[for="item-priority"]');
    const dynamicFieldsRow = document.getElementById('dynamic-fields-row');

    // Modais de Colunas
    const columnModal = document.getElementById('kanban-column-modal');
    const columnForm = document.getElementById('kanban-column-form');
    const columnModalTitle = document.getElementById('column-modal-title');
    const columnModalOldName = document.getElementById('column-modal-old-name');
    const columnNameInput = document.getElementById('column-name');
    const columnColorInput = document.getElementById('column-color-input');
    const tagColorInput = document.getElementById('tag-color-input');
    const btnCloseColumnModal = document.getElementById('btn-close-column-modal');
    const btnCancelColumnModal = document.getElementById('btn-cancel-column-modal');

    // Botões
    const btnNewItem = document.getElementById('btn-new-item');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const btnClearKanban = document.getElementById('btn-clear-kanban');
    const btnExportKanban = document.getElementById('btn-export-kanban');
    const fileImportKanban = document.getElementById('file-import-kanban');
    const btnImportKanbanTrigger = document.getElementById('btn-import-kanban-trigger');

    // Botões Calendário
    const btnCalendarPrev = document.getElementById('btn-calendar-prev');
    const btnCalendarNext = document.getElementById('btn-calendar-next');
    const btnCalendarToday = document.getElementById('btn-calendar-today');

    // Modal de Confirmação
    const deleteModal = document.getElementById('kanban-delete-modal');
    const deleteModalTitle = document.getElementById('delete-modal-title');
    const deleteModalDesc = document.getElementById('delete-modal-desc');
    const deleteItemNameEl = document.getElementById('delete-item-name');
    const deleteModalWarning = document.getElementById('delete-modal-warning');
    const deleteBtnText = document.getElementById('delete-btn-text');
    const btnCancelDelete = document.getElementById('btn-cancel-kanban-delete');
    const btnConfirmDelete = document.getElementById('btn-confirm-kanban-delete');

    function showToast(message) {
        if (typeof showCopyNotification === 'function') {
            showCopyNotification(message);
        } else {
            alert(message);
        }
    }

    // ===== Persistência de Dados e Layouts =====
    function getStorageKey(type) {
        return `kanban-${currentLayout}-${type}`;
    }

    function applyLayoutVisuals() {
        if (currentLayout === 'gerenciamento') {
            mainTitle.textContent = "Gerenciamento de Tarefas";
            mainDesc.textContent = "Organize suas atividades diárias e sprints.";
            lblPriority.textContent = "Prioridade";
        } else if (currentLayout === 'conteudo') {
            mainTitle.textContent = "Planejamento de Conteúdo";
            mainDesc.textContent = "Gestão de publicações, redes sociais e roteiros.";
            lblPriority.textContent = "Plataforma (Rede)";
        } else if (currentLayout === 'fluxo') {
            mainTitle.textContent = "Fluxo do Projeto";
            mainDesc.textContent = "Acompanhamento das grandes fases de desenvolvimento.";
            lblPriority.textContent = "Prioridade";
        }
    }

    function getDefaultTemplates(layout) {
        if (layout === 'gerenciamento') {
            return {
                views: [
                    { id: 'status', icon: 'fa-arrow-right-long', label: 'Status' },
                    { id: 'priority', icon: 'fa-arrow-up-long', label: 'Prioridade' },
                    { id: 'category', icon: 'fa-tags', label: 'Categorias' },
                    { id: 'calendar', icon: 'fa-calendar-days', label: 'Calendário' }
                ],
                statuses: ['A fazer', 'Em andamento', 'Concluído', 'Sem Status'],
                priorities: ['Alto', 'Média', 'Baixo', 'Sem Prioridade'],
                categories: ['Trabalho', 'Pessoal', 'Aprendizagem', 'Outros'],
                platforms: [],
                healths: [],
                tagColors: {},
                tasks: [
                    { id: "ex-1", title: "Atividade 1", status: "A fazer", priority: "Baixo", category: "Trabalho", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-2", title: "Atividade 2", status: "Em andamento", priority: "Média", category: "Trabalho", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-3", title: "Atividade 3", status: "Concluído", priority: "Alto", category: "Trabalho", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-4", title: "Atividade 4", status: "Sem Status", priority: "Sem Prioridade", category: "Trabalho", assignee: "", startDate: "", endDate: "", notes: "" }
                ]
            };
        } else if (layout === 'conteudo') {
            return {
                views: [
                    { id: 'status', icon: 'fa-arrow-right-long', label: 'Fluxo de status' },
                    { id: 'platform', icon: 'fa-desktop', label: 'Plataforma' },
                    { id: 'priority', icon: 'fa-arrow-up-long', label: 'Prioridade' },
                    { id: 'calendar', icon: 'fa-calendar-days', label: 'Calendário' },
                    { id: 'contentByStatus', icon: 'fa-list-check', label: 'Conteúdo por status' },
                    { id: 'nextByPlatform', icon: 'fa-step-forward', label: 'Próximos por plataforma' }
                ],
                statuses: ['Publicado', 'Aprovado', 'Elaboração', 'Projetando', 'Programado', 'Ideia', 'Sem Status'],
                priorities: ['Alto', 'Média', 'Baixo', 'Sem Prioridade'],
                categories: [],
                platforms: ['Instagram', 'LinkedIn', 'YouTube', 'Blog', 'TikTok', 'Sem Plataforma'],
                healths: [],
                tagColors: {
                    'Instagram': 'pink',
                    'LinkedIn': 'blue',
                    'YouTube': 'red',
                    'Blog': 'orange',
                    'TikTok': 'purple'
                },
                tasks: [
                    { id: "ex-c1", title: "Atividade 1", status: "Publicado", platform: "Instagram", priority: "Baixo", category: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-c2", title: "Atividade 2", status: "Aprovado", platform: "LinkedIn", priority: "Média", category: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-c3", title: "Atividade 3", status: "Elaboração", platform: "YouTube", priority: "Alto", category: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-c4", title: "Atividade 4", status: "Projetando", platform: "Blog", priority: "Baixo", category: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-c5", title: "Atividade 5", status: "Programado", platform: "TikTok", priority: "Média", category: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-c6", title: "Atividade 6", status: "Ideia", platform: "Instagram", priority: "Alto", category: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-c7", title: "Atividade 7", status: "Sem Status", platform: "Sem Plataforma", priority: "Sem Prioridade", category: "", assignee: "", startDate: "", endDate: "", notes: "" }
                ]
            };
        } else if (layout === 'fluxo') {
            return {
                views: [
                    { id: 'status', icon: 'fa-project-diagram', label: 'Fluxo' },
                    { id: 'priority', icon: 'fa-arrow-up-long', label: 'Prioridade' },
                    { id: 'budget', icon: 'fa-money-bill', label: 'Orçamento' },
                    { id: 'health', icon: 'fa-heartbeat', label: 'Saúde do projeto' },
                    { id: 'calendar', icon: 'fa-calendar-days', label: 'Cronograma' }
                ],
                statuses: ['Ideação', 'Revisão', 'Execução', 'Concluído', 'Aperfeiçoamento', 'Planejamento', 'Sem Status'],
                priorities: ['Alto', 'Média', 'Baixo', 'Sem Prioridade'],
                categories: [],
                platforms: [],
                healths: ['Em dia', 'Em risco', 'Atrasado', 'Sem Status'],
                tagColors: {},
                tasks: [
                    { id: "ex-f1", title: "Atividade 1", status: "Ideação", priority: "Baixo", health: "Em dia", budget: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-f2", title: "Atividade 2", status: "Revisão", priority: "Média", health: "Em risco", budget: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-f3", title: "Atividade 3", status: "Execução", priority: "Alto", health: "Em dia", budget: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-f4", title: "Atividade 4", status: "Concluído", priority: "Baixo", health: "Atrasado", budget: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-f5", title: "Atividade 5", status: "Aperfeiçoamento", priority: "Média", health: "Em dia", budget: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-f6", title: "Atividade 6", status: "Planejamento", priority: "Alto", health: "Em risco", budget: "", assignee: "", startDate: "", endDate: "", notes: "" },
                    { id: "ex-f7", title: "Atividade 7", status: "Sem Status", priority: "Sem Prioridade", health: "Sem Status", budget: "", assignee: "", startDate: "", endDate: "", notes: "" }
                ]
            };
        }
    }

    function loadData() {
        const defs = getDefaultTemplates(currentLayout);
        currentViews = defs.views;
        currentView = currentViews[0].id;

        // Controle de versão de Cache para injetar as colunas atualizadas com emojis e views do Notion
        const CACHE_VERSION = 'v6';
        if (localStorage.getItem(getStorageKey('cache_version')) !== CACHE_VERSION) {
            localStorage.removeItem(getStorageKey('tasks'));
            localStorage.removeItem(getStorageKey('statuses'));
            localStorage.removeItem(getStorageKey('priorities'));
            localStorage.removeItem(getStorageKey('categories'));
            localStorage.removeItem(getStorageKey('platforms'));
            localStorage.removeItem(getStorageKey('healths'));
            localStorage.removeItem(getStorageKey('tag_colors'));
            localStorage.setItem(getStorageKey('cache_version'), CACHE_VERSION);
        }

        const storedTasks = localStorage.getItem(getStorageKey('tasks'));
        if (storedTasks) tasks = JSON.parse(storedTasks);
        else { tasks = defs.tasks; saveTasks(); }

        const storedStatuses = localStorage.getItem(getStorageKey('statuses'));
        if (storedStatuses) statuses = JSON.parse(storedStatuses);
        else { statuses = defs.statuses; saveStatuses(); }

        const storedPriorities = localStorage.getItem(getStorageKey('priorities'));
        if (storedPriorities) priorities = JSON.parse(storedPriorities);
        else { priorities = defs.priorities; savePriorities(); }

        const storedCategories = localStorage.getItem(getStorageKey('categories'));
        if (storedCategories) categories = JSON.parse(storedCategories);
        else { categories = defs.categories; saveCategories(); }

        const storedPlatforms = localStorage.getItem(getStorageKey('platforms'));
        if (storedPlatforms) platforms = JSON.parse(storedPlatforms);
        else { platforms = defs.platforms; savePlatforms(); }

        const storedHealths = localStorage.getItem(getStorageKey('healths'));
        if (storedHealths) healths = JSON.parse(storedHealths);
        else { healths = defs.healths; saveHealths(); }

        const storedColors = localStorage.getItem(getStorageKey('column_colors'));
        if (storedColors) columnColors = JSON.parse(storedColors);
        else columnColors = {};

        const storedTagColors = localStorage.getItem(getStorageKey('tag_colors'));
        if (storedTagColors) tagColors = JSON.parse(storedTagColors);
        else { tagColors = defs.tagColors || {}; saveTagColors(); }

        applyLayoutVisuals();
        renderViewButtons();
    }

    function saveTasks() { localStorage.setItem(getStorageKey('tasks'), JSON.stringify(tasks)); }
    function saveStatuses() { localStorage.setItem(getStorageKey('statuses'), JSON.stringify(statuses)); }
    function savePriorities() { localStorage.setItem(getStorageKey('priorities'), JSON.stringify(priorities)); }
    function saveCategories() { localStorage.setItem(getStorageKey('categories'), JSON.stringify(categories)); }
    function savePlatforms() { localStorage.setItem(getStorageKey('platforms'), JSON.stringify(platforms)); }
    function saveHealths() { localStorage.setItem(getStorageKey('healths'), JSON.stringify(healths)); }
    function saveColumnColors() { localStorage.setItem(getStorageKey('column_colors'), JSON.stringify(columnColors)); }
    function saveTagColors() { localStorage.setItem(getStorageKey('tag_colors'), JSON.stringify(tagColors)); }

    function renderViewButtons() {
        const viewsContainer = document.getElementById('kanban-views');
        viewsContainer.innerHTML = '';
        currentViews.forEach((v, index) => {
            const btn = document.createElement('button');
            btn.className = 'view-btn px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 flex items-center gap-2 transition-all';
            if (v.id === currentView) btn.classList.add('active-view');
            btn.setAttribute('data-view', v.id);
            btn.innerHTML = `<i class="fas ${v.icon}"></i> ${v.label}`;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active-view'));
                btn.classList.add('active-view');
                currentView = v.id;
                render();
            });
            viewsContainer.appendChild(btn);
        });
    }

    function populateFormSelects() {
        const populateSelect = (selectElem, arr) => {
            selectElem.innerHTML = '';
            arr.forEach(val => {
                const o = document.createElement('option');
                o.value = val; o.textContent = val;
                selectElem.appendChild(o);
            });
        };
        populateSelect(itemStatusSelect, statuses);
        populateSelect(itemPrioritySelect, priorities);
        populateSelect(itemCategorySelect, categories);
        populateSelect(itemPlatformSelect, platforms);
        populateSelect(itemHealthSelect, healths);
    }

    // ===== Auxiliares Visuais =====
    function formatTaskDate(startStr, endStr) {
        if (!startStr && !endStr) return '';
        const formatDate = (dateStr) => {
            const parts = dateStr.split('-');
            if (parts.length !== 3) return dateStr;
            const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
            return `${parseInt(parts[2], 10)} de ${months[parseInt(parts[1], 10) - 1]}`;
        };
        if (startStr && endStr) return startStr === endStr ? formatDate(startStr) : `${formatDate(startStr)} - ${formatDate(endStr)}`;
        return startStr ? formatDate(startStr) : formatDate(endStr);
    }

    function getInitials(name) {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return parts[0].substring(0, 2).toUpperCase();
    }

    function getAvatarColorClass(name) {
        if (!name) return 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300';
        const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colors = ['bg-indigo-100 text-indigo-800', 'bg-pink-100 text-pink-800', 'bg-teal-100 text-teal-800', 'bg-emerald-100 text-emerald-800', 'bg-amber-100 text-amber-800', 'bg-rose-100 text-rose-800'];
        return colors[sum % colors.length] + ' dark:bg-opacity-30';
    }

    function getPriorityBadgeClass(priority) {
        if (['Alto', 'Alta', 'Urgente'].includes(priority)) return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark-badge-border';
        if (['Média', 'Normal', 'Instagram', 'YouTube'].includes(priority)) return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark-badge-border';
        if (['Baixo', 'Baixa', 'LinkedIn', 'Blog'].includes(priority)) return 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 dark-badge-border';
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark-badge-border';
    }

    function getCategoryBadgeClass(category) {
        if (['Trabalho', 'Backend', 'Vídeo'].includes(category)) return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 dark-badge-border';
        if (['Pessoal', 'Marketing', 'Post'].includes(category)) return 'bg-pink-100 text-pink-800 dark:bg-pink-950/40 dark:text-pink-300 dark-badge-border';
        if (['Aprendizagem', 'Frontend', 'Artigo'].includes(category)) return 'bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 dark-badge-border';
        return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-400 dark-badge-border';
    }

    function getStatusBadgeClass(status) {
        if (['A Fazer', 'Sem Status', 'Ideia', 'Pesquisa'].includes(status)) return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-300';
        if (['Em Andamento', 'Escrevendo', 'Revisão', 'Design', 'Desenvolvimento', 'Testes'].includes(status)) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        if (['Concluído', 'Publicado', 'Finalizado'].includes(status)) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        return 'bg-slate-200 text-slate-700 dark:bg-slate-750 dark:text-slate-400';
    }

    function render() {
        if (currentView === 'calendar') {
            kanbanBoardContainer.classList.add('hidden');
            kanbanCalendarContainer.classList.remove('hidden');
            renderCalendar();
        } else {
            kanbanCalendarContainer.classList.add('hidden');
            kanbanBoardContainer.classList.remove('hidden');
            renderBoard();
        }
    }

    // ===== Render Board (Kanban e Drag & Drop) =====
    function renderBoard() {
        kanbanBoardContainer.innerHTML = '';
        let columns = [];
        if (currentView === 'status' || currentView === 'contentByStatus') columns = statuses;
        else if (currentView === 'priority') columns = priorities;
        else if (currentView === 'category') columns = categories;
        else if (currentView === 'platform' || currentView === 'nextByPlatform') columns = platforms;
        else if (currentView === 'health') columns = healths;
        else if (currentView === 'budget') columns = Array.from(new Set(tasks.map(t => t.budget || 'Sem Orçamento')));

        columns.forEach(colValue => {
            const filteredTasks = tasks.filter(t => {
                if (currentView === 'status' || currentView === 'contentByStatus') return (t.status || 'Sem Status') === colValue;
                if (currentView === 'priority') return (t.priority || 'Sem Prioridade') === colValue;
                if (currentView === 'category') return (t.category || 'Outros') === colValue;
                if (currentView === 'platform' || currentView === 'nextByPlatform') return (t.platform || 'Sem Plataforma') === colValue;
                if (currentView === 'health') return (t.health || 'Sem Status') === colValue;
                if (currentView === 'budget') return (t.budget || 'Sem Orçamento') === colValue;
                return false;
            });

            const colTheme = columnColors[colValue] || 'default';
            const columnEl = document.createElement('div');
            columnEl.className = `kanban-column kanban-column-themed col-theme-${colTheme} flex flex-col rounded-2xl p-4 min-h-[500px] shrink-0 transition-all duration-200`;
            columnEl.setAttribute('data-value', colValue);
            columnEl.setAttribute('draggable', 'true');

            const isDefaultCol = ['Sem Status', 'Sem Prioridade', 'Outros', 'Sem Plataforma', 'Sem Orçamento'].includes(colValue);

            let colTagTheme = tagColors[colValue] || 'default';
            if (currentView === 'priority') {
                if (colValue === 'Alto') colTagTheme = 'red';
                else if (colValue === 'Média') colTagTheme = 'yellow';
                else if (colValue === 'Baixo') colTagTheme = 'blue';
            }

            const colHeader = document.createElement('div');
            colHeader.className = 'flex justify-between items-center mb-4 pb-2 border-b border-gray-200/50 dark:border-slate-800/50 select-none cursor-move';
            colHeader.innerHTML = `
                <div class="flex items-center gap-2 group/col flex-grow min-w-0 mr-2">
                    <span class="kanban-tag-themed tag-theme-${colTagTheme} text-sm truncate max-w-[180px]" title="${colValue}">${colValue}</span>
                    <span class="text-xs text-slate-400 dark:text-slate-500 font-bold shrink-0">${filteredTasks.length}</span>
                    <div class="opacity-0 group-hover/col:opacity-100 flex items-center gap-1 transition-opacity shrink-0 ml-1">
                        <button class="btn-col-edit text-gray-400 hover:text-primary transition-colors p-1" data-col="${colValue}" title="Renomear / Mudar Cor">
                            <i class="fas fa-pen text-xs"></i>
                        </button>
                        ${!isDefaultCol ? `<button class="btn-col-delete text-gray-400 hover:text-red-500 transition-colors p-1" data-col="${colValue}" title="Excluir Cartão"><i class="fas fa-trash-alt text-xs"></i></button>` : ''}
                    </div>
                </div>
                <button class="btn-col-add text-gray-400 hover:text-primary transition-colors p-1 shrink-0" title="Adicionar item"><i class="fas fa-plus text-xs"></i></button>
            `;

            colHeader.querySelector('.btn-col-add').addEventListener('click', e => { e.stopPropagation(); openModal(null, colValue); });
            colHeader.querySelector('.btn-col-edit').addEventListener('click', e => { e.stopPropagation(); openColumnModal(colValue); });
            const btnDelCol = colHeader.querySelector('.btn-col-delete');
            if (btnDelCol) btnDelCol.addEventListener('click', e => { e.stopPropagation(); openDeleteModal(colValue, 'column'); });

            columnEl.appendChild(colHeader);

            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'flex flex-col gap-3 flex-grow overflow-y-auto max-h-[600px] pr-1';

            filteredTasks.forEach(task => {
                const cardEl = document.createElement('div');
                cardEl.className = 'kanban-card bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/60 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/20 transition-all flex flex-col gap-3';
                cardEl.setAttribute('draggable', 'true');
                cardEl.setAttribute('data-id', task.id);

                const dateRangeStr = formatTaskDate(task.startDate, task.endDate);
                function getCustomBadge(val, field) {
                    if (!val || ['Sem Status', 'Sem Prioridade', 'Outros', 'Sem Plataforma'].includes(val)) return '';
                    let theme = tagColors[val] || 'default';
                    if (field === 'priority') {
                        if (val === 'Alto') theme = 'red';
                        else if (val === 'Média') theme = 'yellow';
                        else if (val === 'Baixo') theme = 'blue';
                    }
                    return `<span class="kanban-tag-themed tag-theme-${theme}">${val}</span>`;
                }

                let tagsHTML = '';
                if (currentView !== 'status' && currentView !== 'contentByStatus') tagsHTML += getCustomBadge(task.status, 'status');
                if (currentView !== 'priority') tagsHTML += getCustomBadge(task.priority, 'priority');
                if (currentView !== 'category') tagsHTML += getCustomBadge(task.category, 'category');
                if (currentView !== 'platform' && currentView !== 'nextByPlatform') tagsHTML += getCustomBadge(task.platform, 'platform');
                if (currentView !== 'health') tagsHTML += getCustomBadge(task.health, 'health');
                if (currentView !== 'budget' && task.budget && task.budget !== 'Sem Orçamento') tagsHTML += `<span class="badge-status bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">R$ ${task.budget}</span>`;

                cardEl.innerHTML = `
                    <div class="flex justify-between items-start gap-2">
                        <h4 class="font-semibold text-sm leading-snug text-gray-800 dark:text-gray-200 cursor-pointer hover:text-primary transition-colors flex-grow break-words">${task.title}</h4>
                        <div class="flex items-center gap-1 opacity-0 hover:opacity-100 card-actions transition-opacity shrink-0">
                            <button class="btn-card-edit p-1 text-gray-400 hover:text-primary transition-colors" title="Editar"><i class="fas fa-edit text-xs"></i></button>
                            <button class="btn-card-delete p-1 text-gray-400 hover:text-red-500 transition-colors" title="Excluir"><i class="fas fa-trash-alt text-xs"></i></button>
                        </div>
                    </div>
                    ${tagsHTML ? `<div class="flex flex-wrap gap-1.5">${tagsHTML}</div>` : ''}
                    <div class="flex justify-between items-center mt-1 border-t border-gray-50 dark:border-slate-800/80 pt-2 text-xs">
                        <div class="text-gray-400 flex items-center gap-1">${dateRangeStr ? `<i class="far fa-calendar text-[10px]"></i> <span>${dateRangeStr}</span>` : '<span class="italic text-[10px] text-gray-400/60">Sem período</span>'}</div>
                        <div class="avatar flex items-center justify-center w-5 h-5 rounded-full ${getAvatarColorClass(task.assignee)} text-[9px] font-bold shrink-0" title="${task.assignee || 'Sem responsável'}">${getInitials(task.assignee)}</div>
                    </div>
                `;

                cardEl.addEventListener('mouseenter', () => { const a = cardEl.querySelector('.card-actions'); if (a) a.style.opacity = '1'; });
                cardEl.addEventListener('mouseleave', () => { const a = cardEl.querySelector('.card-actions'); if (a) a.style.opacity = '0'; });

                cardEl.querySelector('h4').addEventListener('click', () => openModal(task.id));
                cardEl.querySelector('.btn-card-edit').addEventListener('click', e => { e.stopPropagation(); openModal(task.id); });
                cardEl.querySelector('.btn-card-delete').addEventListener('click', e => { e.stopPropagation(); openDeleteModal(task.id, 'task'); });

                cardEl.addEventListener('dragstart', e => {
                    e.stopPropagation();
                    e.dataTransfer.setData('text/task-id', task.id);
                    cardEl.classList.add('dragging');
                });
                cardEl.addEventListener('dragend', () => cardEl.classList.remove('dragging'));
                cardsContainer.appendChild(cardEl);
            });

            columnEl.appendChild(cardsContainer);

            // Drag Coluna
            columnEl.addEventListener('dragstart', e => {
                if (e.target.classList.contains('kanban-card') || e.target.closest('.kanban-card')) { e.preventDefault(); return; }
                e.dataTransfer.setData('text/column-name', colValue);
                columnEl.classList.add('column-dragging');
            });
            columnEl.addEventListener('dragend', () => columnEl.classList.remove('column-dragging'));
            columnEl.addEventListener('dragover', e => {
                e.preventDefault();
                e.dataTransfer.types.includes('text/column-name') ? columnEl.classList.add('column-drag-hover') : columnEl.classList.add('kanban-drag-hover');
            });
            columnEl.addEventListener('dragleave', () => {
                columnEl.classList.remove('kanban-drag-hover', 'column-drag-hover');
            });
            columnEl.addEventListener('drop', e => {
                e.preventDefault();
                columnEl.classList.remove('kanban-drag-hover', 'column-drag-hover');

                if (e.dataTransfer.types.includes('text/column-name')) {
                    const draggedCol = e.dataTransfer.getData('text/column-name');
                    const targetCol = columnEl.getAttribute('data-value');
                    if (draggedCol !== targetCol) {
                        let colArray = null;
                        if (currentView === 'status' || currentView === 'contentByStatus') colArray = statuses;
                        else if (currentView === 'priority') colArray = priorities;
                        else if (currentView === 'category') colArray = categories;
                        else if (currentView === 'platform' || currentView === 'nextByPlatform') colArray = platforms;
                        else if (currentView === 'health') colArray = healths;

                        if (colArray) {
                            const idxDrag = colArray.indexOf(draggedCol);
                            const idxTarg = colArray.indexOf(targetCol);
                            if (idxDrag !== -1 && idxTarg !== -1) {
                                colArray.splice(idxDrag, 1);
                                colArray.splice(idxTarg, 0, draggedCol);
                                if (currentView === 'status' || currentView === 'contentByStatus') saveStatuses();
                                else if (currentView === 'priority') savePriorities();
                                else if (currentView === 'category') saveCategories();
                                else if (currentView === 'platform' || currentView === 'nextByPlatform') savePlatforms();
                                else if (currentView === 'health') saveHealths();
                                render();
                            }
                        }
                    }
                }
                else if (e.dataTransfer.types.includes('text/task-id') || e.dataTransfer.types.includes('text/plain')) {
                    const taskId = e.dataTransfer.getData('text/task-id') || e.dataTransfer.getData('text/plain');
                    const targetVal = columnEl.getAttribute('data-value');
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        if (currentView === 'status' || currentView === 'contentByStatus') task.status = targetVal;
                        else if (currentView === 'priority') task.priority = targetVal;
                        else if (currentView === 'category') task.category = targetVal;
                        else if (currentView === 'platform' || currentView === 'nextByPlatform') task.platform = targetVal;
                        else if (currentView === 'health') task.health = targetVal;
                        else if (currentView === 'budget') task.budget = targetVal.replace('R$ ', '').trim();
                        saveTasks(); render();
                    }
                }
            });
            kanbanBoardContainer.appendChild(columnEl);
        });

        if (currentView !== 'calendar') {
            const addColCard = document.createElement('div');
            addColCard.className = 'kanban-column flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-slate-800 hover:border-primary/45 hover:bg-gray-50/20 dark:hover:bg-slate-900/10 rounded-2xl p-6 min-h-[150px] max-h-[180px] shrink-0 cursor-pointer transition-colors duration-200';
            addColCard.innerHTML = `<div class="text-gray-400 hover:text-primary flex flex-col items-center gap-2 font-semibold text-xs"><i class="fas fa-plus-circle text-xl"></i><span>Criar Cartão</span></div>`;
            addColCard.addEventListener('click', () => openColumnModal());
            kanbanBoardContainer.appendChild(addColCard);
        }
    }

    function renderCalendar() {
        const monthYearEl = document.getElementById('calendar-month-year');
        const daysGridEl = document.getElementById('calendar-days-grid');
        if (!monthYearEl || !daysGridEl) return;
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        monthYearEl.textContent = `${monthNames[month]} de ${year}`;
        daysGridEl.innerHTML = '';
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const prevMonthTotalDays = new Date(year, month, 0).getDate();
        const today = new Date();

        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day-box empty border-r border-b border-gray-200/60 dark:border-slate-800/80';
            cell.innerHTML = `<span class="calendar-day-num opacity-40">${prevMonthTotalDays - i}</span>`;
            daysGridEl.appendChild(cell);
        }

        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement('div');
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
            cell.className = `calendar-day-box border-r border-b border-gray-200/60 dark:border-slate-800/80 ${isToday ? 'today' : ''}`;
            let cellHTML = `<span class="calendar-day-num">${day}</span>`;
            const cellDate = new Date(year, month, day);
            cellDate.setHours(0, 0, 0, 0);

            const dayTasks = tasks.filter(task => {
                if (!task.startDate && !task.endDate) return false;
                const start = task.startDate ? new Date(task.startDate + 'T00:00:00') : null;
                const end = task.endDate ? new Date(task.endDate + 'T00:00:00') : null;
                if (start) start.setHours(0, 0, 0, 0);
                if (end) end.setHours(0, 0, 0, 0);
                if (start && end) return cellDate >= start && cellDate <= end;
                if (start) return cellDate.getTime() === start.getTime();
                if (end) return cellDate.getTime() === end.getTime();
                return false;
            });

            let tasksHTML = '<div class="flex flex-col gap-1 w-full overflow-y-auto max-h-[62px] pr-1 mt-1 custom-scrollbar">';
            dayTasks.forEach(task => {
                let colorClass = 'bg-primary/10 text-primary border-l-2 border-primary';
                if (['Alto', 'Alta', 'Urgente'].includes(task.priority)) colorClass = 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 border-l-2 border-rose-500';
                else if (['Média', 'Normal', 'Instagram', 'YouTube'].includes(task.priority)) colorClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 border-l-2 border-amber-500';
                else if (['Baixo', 'Baixa', 'LinkedIn', 'Blog'].includes(task.priority)) colorClass = 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 border-l-2 border-sky-500';

                tasksHTML += `<div class="calendar-task-tag ${colorClass} text-[10px] px-1.5 py-0.5 rounded font-semibold truncate hover:opacity-85 transition-opacity" data-id="${task.id}" title="${task.title}">${task.title}</div>`;
            });
            tasksHTML += '</div>';

            cell.innerHTML = cellHTML + tasksHTML;
            cell.addEventListener('click', e => {
                if (e.target.classList.contains('calendar-task-tag')) return;
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                openModal(null, statuses[0] || 'A Fazer', dateString);
            });
            daysGridEl.appendChild(cell);
        }

        const remainingCells = (7 - ((firstDayIndex + totalDays) % 7)) % 7;
        for (let day = 1; day <= remainingCells; day++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day-box empty border-r border-b border-gray-200/60 dark:border-slate-800/80';
            cell.innerHTML = `<span class="calendar-day-num opacity-40">${day}</span>`;
            daysGridEl.appendChild(cell);
        }

        daysGridEl.querySelectorAll('.calendar-task-tag').forEach(tag => {
            tag.addEventListener('click', e => {
                e.stopPropagation();
                openModal(tag.getAttribute('data-id'));
            });
        });
    }

    // ===== Modais =====
    function openModal(taskId = null, defaultColValue = '', defaultDate = '') {
        populateFormSelects();
        itemForm.reset();

        const wrapPlatform = document.getElementById('wrap-platform');
        const wrapBudget = document.getElementById('wrap-budget');
        const wrapHealth = document.getElementById('wrap-health');
        const wrapCategory = document.getElementById('wrap-category');

        dynamicFieldsRow.classList.add('hidden');
        wrapPlatform.classList.add('hidden');
        wrapBudget.classList.add('hidden');
        wrapHealth.classList.add('hidden');
        wrapCategory.classList.add('hidden');

        if (currentLayout === 'gerenciamento') {
            wrapCategory.classList.remove('hidden');
        } else if (currentLayout === 'conteudo') {
            dynamicFieldsRow.classList.remove('hidden');
            wrapPlatform.classList.remove('hidden');
        } else if (currentLayout === 'fluxo') {
            dynamicFieldsRow.classList.remove('hidden');
            wrapBudget.classList.remove('hidden');
            wrapHealth.classList.remove('hidden');
        }

        if (taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;
            modalTitle.textContent = "Editar Item";
            modalItemId.value = task.id;
            itemTitleInput.value = task.title || '';
            itemStatusSelect.value = task.status || statuses[0] || '';
            itemPrioritySelect.value = task.priority || priorities[3] || priorities[0] || '';
            itemCategorySelect.value = task.category || categories[3] || categories[0] || '';
            itemPlatformSelect.value = task.platform || platforms[0] || '';
            itemBudgetInput.value = task.budget || '';
            itemHealthSelect.value = task.health || healths[0] || '';
            itemAssigneeInput.value = task.assignee || '';
            itemStartDateInput.value = task.startDate || '';
            itemEndDateInput.value = task.endDate || '';
            itemNotesTextarea.value = task.notes || '';
            if (btnDeleteModalItem) btnDeleteModalItem.classList.remove('hidden');
        } else {
            modalTitle.textContent = "Novo Item do Kanban";
            modalItemId.value = '';
            if (defaultColValue) {
                if (currentView === 'status' || currentView === 'contentByStatus') itemStatusSelect.value = defaultColValue;
                else if (currentView === 'priority') itemPrioritySelect.value = defaultColValue;
                else if (currentView === 'category') itemCategorySelect.value = defaultColValue;
                else if (currentView === 'platform' || currentView === 'nextByPlatform') itemPlatformSelect.value = defaultColValue;
                else if (currentView === 'budget') itemBudgetInput.value = defaultColValue;
                else if (currentView === 'health') itemHealthSelect.value = defaultColValue;
            } else {
                itemStatusSelect.value = statuses[0] || '';
                itemPrioritySelect.value = priorities[0] || '';
                itemCategorySelect.value = categories[0] || '';
                itemPlatformSelect.value = platforms[0] || '';
                itemBudgetInput.value = '';
                itemHealthSelect.value = healths[0] || '';
            }
            if (defaultDate) { itemStartDateInput.value = defaultDate; itemEndDateInput.value = defaultDate; }
            if (btnDeleteModalItem) btnDeleteModalItem.classList.add('hidden');
        }

        const statusColorInput = document.getElementById('status-color-input');
        const categoryColorInput = document.getElementById('category-color-input');
        const platformColorInput = document.getElementById('platform-color-input');
        
        if (statusColorInput) {
            statusColorInput.value = tagColors[itemStatusSelect.value] || 'default';
            if (statusColorInput.updateUI) statusColorInput.updateUI(statusColorInput.value);
        }
        if (categoryColorInput) {
            categoryColorInput.value = tagColors[itemCategorySelect.value] || 'default';
            if (categoryColorInput.updateUI) categoryColorInput.updateUI(categoryColorInput.value);
        }
        if (platformColorInput) {
            platformColorInput.value = tagColors[itemPlatformSelect.value] || 'default';
            if (platformColorInput.updateUI) platformColorInput.updateUI(platformColorInput.value);
        }

        itemModal.classList.remove('hidden');
    }

    function closeModal() { itemModal.classList.add('hidden'); modalItemId.value = ''; itemForm.reset(); }

    function handleFormSubmit(e) {
        e.preventDefault();
        const taskId = modalItemId.value;
        const taskData = {
            title: itemTitleInput.value.trim(),
            status: itemStatusSelect.value,
            priority: itemPrioritySelect.value,
            category: itemCategorySelect.value,
            platform: itemPlatformSelect.value,
            budget: itemBudgetInput.value.trim(),
            health: itemHealthSelect.value,
            assignee: itemAssigneeInput.value.trim(),
            startDate: itemStartDateInput.value,
            endDate: itemEndDateInput.value,
            notes: itemNotesTextarea.value.trim()
        };
        if (taskId) {
            const idx = tasks.findIndex(t => t.id === taskId);
            if (idx !== -1) tasks[idx] = { ...tasks[idx], ...taskData };
        } else {
            tasks.push({ id: Date.now().toString(), ...taskData });
        }

        const statusColorInput = document.getElementById('status-color-input');
        if (statusColorInput && itemStatusSelect.value) {
            tagColors[itemStatusSelect.value] = statusColorInput.value;
        }
        const categoryColorInput = document.getElementById('category-color-input');
        if (categoryColorInput && itemCategorySelect.value) {
            tagColors[itemCategorySelect.value] = categoryColorInput.value;
        }
        const platformColorInput = document.getElementById('platform-color-input');
        if (platformColorInput && itemPlatformSelect.value) {
            tagColors[itemPlatformSelect.value] = platformColorInput.value;
        }
        saveTagColors();

        saveTasks(); closeModal(); render();
    }

    function openColumnModal(oldName = '') {
        columnForm.reset();
        if (oldName) {
            columnModalTitle.textContent = "Editar Cartão";
            columnModalOldName.value = oldName;
            columnNameInput.value = oldName;
            
            const cColor = document.getElementById('column-color-input');
            const tColor = document.getElementById('tag-color-input');
            if (cColor) {
                cColor.value = columnColors[oldName] || 'default';
                if (cColor.updateUI) cColor.updateUI(cColor.value);
            }
            if (tColor) {
                tColor.value = tagColors[oldName] || 'default';
                if (tColor.updateUI) tColor.updateUI(tColor.value);
            }
        } else {
            columnModalTitle.textContent = "Novo Cartão";
            columnModalOldName.value = '';
            columnNameInput.value = '';
            
            const cColor = document.getElementById('column-color-input');
            const tColor = document.getElementById('tag-color-input');
            if (cColor) {
                cColor.value = 'default';
                if (cColor.updateUI) cColor.updateUI(cColor.value);
            }
            if (tColor) {
                tColor.value = 'default';
                if (tColor.updateUI) tColor.updateUI(tColor.value);
            }
        }
        columnModal.classList.remove('hidden');
        columnNameInput.focus();
    }
    function closeColumnModal() { columnModal.classList.add('hidden'); columnForm.reset(); }

    function handleColumnFormSubmit(e) {
        e.preventDefault();
        const oldName = columnModalOldName.value.trim();
        const newName = columnNameInput.value.trim();
        if (!newName) return;
        let colArray = (currentView === 'status' || currentView === 'contentByStatus') ? statuses : currentView === 'priority' ? priorities : categories;

        if (colArray.includes(newName) && newName !== oldName) { showToast("Esse nome de cartão já existe!"); return; }
        if (oldName) {
            const idx = colArray.indexOf(oldName);
            if (idx !== -1) {
                colArray[idx] = newName;
                tasks.forEach(t => {
                    if ((currentView === 'status' || currentView === 'contentByStatus') && t.status === oldName) t.status = newName;
                    else if (currentView === 'priority' && t.priority === oldName) t.priority = newName;
                    else if (currentView === 'category' && t.category === oldName) t.category = newName;
                });
                saveTasks();
            }
            if (newName !== oldName) {
                delete columnColors[oldName];
                delete tagColors[oldName];
            }
        } else {
            const defaultValues = ['Sem Status', 'Sem Prioridade', 'Outros', 'Sem Plataforma'];
            const lastIdx = colArray.findIndex(v => defaultValues.includes(v));
            if (lastIdx !== -1) colArray.splice(lastIdx, 0, newName);
            else colArray.push(newName);
        }
        
        const localColumnColorInput = document.getElementById('column-color-input');
        const localTagColorInput = document.getElementById('tag-color-input');
        
        if (localColumnColorInput) {
            columnColors[newName] = localColumnColorInput.value;
            saveColumnColors();
        }
        
        if (localTagColorInput) {
            tagColors[newName] = localTagColorInput.value;
            saveTagColors();
        }

        if (currentView === 'status' || currentView === 'contentByStatus') saveStatuses(); else if (currentView === 'priority') savePriorities(); else saveCategories();
        closeColumnModal(); render(); showToast(oldName ? "Cartão editado!" : "Novo cartão criado!");
    }

    function openDeleteModal(idOrName, type) {
        closeModal();
        activeDeleteType = type; activeDeleteId = idOrName;
        if (type === 'task') {
            const task = tasks.find(t => t.id === idOrName);
            if (!task) return;
            deleteModalTitle.textContent = "Confirmar Exclusão"; deleteModalDesc.textContent = "Você está prestes a excluir este item:"; deleteItemNameEl.textContent = task.title;
            deleteItemNameEl.classList.remove('hidden'); deleteModalWarning.textContent = "Esta ação não pode ser desfeita."; deleteBtnText.textContent = "Excluir";
        } else if (type === 'column') {
            activeDeleteColType = currentView;
            deleteModalTitle.textContent = "Excluir Cartão de Grupo"; deleteModalDesc.textContent = "Você está prestes a excluir o cartão:"; deleteItemNameEl.textContent = idOrName;
            deleteItemNameEl.classList.remove('hidden'); deleteModalWarning.textContent = "Atenção: Todos os itens de tarefas inseridos neste cartão serão deletados permanentemente."; deleteBtnText.textContent = "Excluir Cartão";
        } else if (type === 'clear') {
            deleteModalTitle.textContent = "Limpar Todo o Kanban"; deleteModalDesc.textContent = "Você tem certeza de que deseja apagar absolutamente TODAS as tarefas deste layout?";
            deleteItemNameEl.classList.add('hidden'); deleteModalWarning.textContent = "Esta ação é irreversível e limpará todo o histórico deste quadro."; deleteBtnText.textContent = "Limpar Tudo";
        }
        deleteModal.classList.remove('hidden');
    }

    function closeDeleteModal() { deleteModal.classList.add('hidden'); activeDeleteType = activeDeleteId = activeDeleteColType = null; }

    function confirmDelete() {
        if (activeDeleteType === 'task') {
            tasks = tasks.filter(t => t.id !== activeDeleteId);
            saveTasks(); showToast("Item excluído!");
        } else if (activeDeleteType === 'column') {
            const cName = activeDeleteId;
            if (activeDeleteColType === 'status' || activeDeleteColType === 'contentByStatus') { statuses = statuses.filter(s => s !== cName); saveStatuses(); tasks = tasks.filter(t => t.status !== cName); }
            else if (activeDeleteColType === 'priority') { priorities = priorities.filter(p => p !== cName); savePriorities(); tasks = tasks.filter(t => t.priority !== cName); }
            else if (activeDeleteColType === 'category') { categories = categories.filter(c => c !== cName); saveCategories(); tasks = tasks.filter(t => t.category !== cName); }
            saveTasks(); showToast("Cartão e tarefas anexadas excluídos!");
        } else if (activeDeleteType === 'clear') {
            tasks = []; saveTasks(); showToast("Quadro atual limpo!");
        }
        closeDeleteModal(); render();
    }

    // ===== Listeners =====
    layoutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            layoutButtons.forEach(b => { b.classList.remove('active-layout', 'bg-white', 'dark:bg-slate-900', 'text-primary', 'shadow-sm'); b.classList.add('text-gray-500', 'dark:text-gray-400'); });
            btn.classList.add('active-layout', 'bg-white', 'dark:bg-slate-900', 'text-primary', 'shadow-sm');
            btn.classList.remove('text-gray-500', 'dark:text-gray-400');
            currentLayout = btn.getAttribute('data-layout');
            loadData(); render();
        });
    });

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active-view'));
            btn.classList.add('active-view');
            currentView = btn.getAttribute('data-view');
            render();
        });
    });

    btnNewItem.addEventListener('click', () => openModal());
    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);
    itemForm.addEventListener('submit', handleFormSubmit);
    if (btnDeleteModalItem) btnDeleteModalItem.addEventListener('click', () => { if (modalItemId.value) openDeleteModal(modalItemId.value, 'task'); });
    itemModal.addEventListener('click', e => { if (e.target === itemModal) closeModal(); });

    btnCloseColumnModal.addEventListener('click', closeColumnModal);
    btnCancelColumnModal.addEventListener('click', closeColumnModal);
    columnForm.addEventListener('submit', handleColumnFormSubmit);
    columnModal.addEventListener('click', e => { if (e.target === columnModal) closeColumnModal(); });

    btnCancelDelete.addEventListener('click', closeDeleteModal);
    btnConfirmDelete.addEventListener('click', confirmDelete);
    deleteModal.addEventListener('click', e => { if (e.target === deleteModal) closeDeleteModal(); });

    btnClearKanban.addEventListener('click', () => openDeleteModal(null, 'clear'));

    btnExportKanban.addEventListener('click', () => {
        if (!tasks.length) return showToast("Sem tarefas para exportar.");
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
        const a = document.createElement('a'); a.href = dataUri; a.download = `kanban-${currentLayout}-export.json`; a.click();
    });
    btnImportKanbanTrigger.addEventListener('click', () => fileImportKanban.click());
    fileImportKanban.addEventListener('change', e => {
        const fr = new FileReader();
        fr.onload = ev => {
            try { const p = JSON.parse(ev.target.result); if (Array.isArray(p)) { tasks = p; saveTasks(); render(); showToast("Tarefas importadas!"); } } catch { showToast("Erro de arquivo."); }
        };
        fr.readAsText(e.target.files[0]);
    });

    btnCalendarPrev.addEventListener('click', () => { currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1); renderCalendar(); });
    function initColorPickers() {
        const COLOR_OPTIONS = [
            { value: 'default', label: 'Padrão', hex: '#94a3b8' },
            { value: 'gray', label: 'Cinza', hex: '#9ca3af' },
            { value: 'brown', label: 'Marrom', hex: '#a8a29e' },
            { value: 'orange', label: 'Laranja', hex: '#f97316' },
            { value: 'yellow', label: 'Amarelo', hex: '#eab308' },
            { value: 'green', label: 'Verde', hex: '#22c55e' },
            { value: 'blue', label: 'Azul', hex: '#3b82f6' },
            { value: 'purple', label: 'Roxo', hex: '#a855f7' },
            { value: 'pink', label: 'Rosa', hex: '#ec4899' },
            { value: 'red', label: 'Vermelho', hex: '#ef4444' },
        ];
        
        const pickers = document.querySelectorAll('.custom-color-picker-container');
        pickers.forEach(container => {
            const inputId = container.getAttribute('data-input-id');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.id = inputId;
            hiddenInput.value = 'default';
            container.appendChild(hiddenInput);
            
            const button = document.createElement('button');
            button.type = 'button';
            // Button with square and arrow
            button.className = 'w-[60px] flex items-center justify-between px-2 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:border-primary h-[34px] transition-colors';
            
            const btnColorBox = document.createElement('div');
            btnColorBox.className = 'w-5 h-5 rounded-md shadow-sm transition-colors duration-200';
            btnColorBox.style.backgroundColor = COLOR_OPTIONS[0].hex;
            
            const arrow = document.createElement('i');
            arrow.className = 'fas fa-chevron-down text-gray-400 text-[10px]';
            
            button.appendChild(btnColorBox);
            button.appendChild(arrow);
            
            const menu = document.createElement('div');
            // Vertical menu layout like original
            menu.className = 'absolute right-0 sm:left-0 sm:right-auto mt-1 w-24 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl hidden z-50 py-1 max-h-60 overflow-y-auto custom-scrollbar color-menu';
            
            COLOR_OPTIONS.forEach(opt => {
                const item = document.createElement('div');
                item.className = 'flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors';
                item.title = opt.label;
                
                const itemLeft = document.createElement('div');
                itemLeft.className = 'flex items-center';
                
                const itemBox = document.createElement('div');
                // Square box in the menu list
                itemBox.className = 'w-5 h-5 rounded-md shadow-sm';
                itemBox.style.backgroundColor = opt.hex;
                
                itemLeft.appendChild(itemBox);
                
                const check = document.createElement('i');
                // The tick is placed to the right, beside the square
                check.className = 'fas fa-check text-xs text-primary check-icon';
                check.style.display = 'none'; // Initially hidden
                
                item.appendChild(itemLeft);
                item.appendChild(check);
                
                item.addEventListener('click', () => {
                    hiddenInput.value = opt.value;
                    updateUI(opt.value);
                    menu.classList.add('hidden');
                    hiddenInput.dispatchEvent(new Event('change'));
                });
                
                menu.appendChild(item);
            });
            
            container.classList.add('relative');
            container.appendChild(button);
            container.appendChild(menu);
            
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = menu.classList.contains('hidden');
                document.querySelectorAll('.color-menu').forEach(m => m.classList.add('hidden'));
                if (isHidden) menu.classList.remove('hidden');
            });
            
            function updateUI(val) {
                const opt = COLOR_OPTIONS.find(o => o.value === val) || COLOR_OPTIONS[0];
                btnColorBox.style.backgroundColor = opt.hex;
                Array.from(menu.children).forEach((child, idx) => {
                    const check = child.querySelector('.check-icon');
                    if (COLOR_OPTIONS[idx].value === val) {
                        check.style.display = 'inline-block';
                    } else {
                        check.style.display = 'none';
                    }
                });
            }
            hiddenInput.updateUI = updateUI;
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-color-picker-container')) {
                document.querySelectorAll('.color-menu').forEach(m => m.classList.add('hidden'));
            }
        });
    }

    initColorPickers();

    itemStatusSelect.addEventListener('change', () => {
        const statusColorInput = document.getElementById('status-color-input');
        if (statusColorInput) {
            statusColorInput.value = tagColors[itemStatusSelect.value] || 'default';
            if (statusColorInput.updateUI) statusColorInput.updateUI(statusColorInput.value);
        }
    });
    itemCategorySelect.addEventListener('change', () => {
        const categoryColorInput = document.getElementById('category-color-input');
        if (categoryColorInput) {
            categoryColorInput.value = tagColors[itemCategorySelect.value] || 'default';
            if (categoryColorInput.updateUI) categoryColorInput.updateUI(categoryColorInput.value);
        }
    });

    loadData(); render();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeKanban);
else initializeKanban();
