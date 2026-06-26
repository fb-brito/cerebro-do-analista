// Motor Lógico do Gráfico de Gantt Interativo — Edição Inline
document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // ESTADO
    // ========================================================
    let tasks = [];
    let editingTaskId = null; // ID da tarefa em edição, ou 'new' para nova tarefa
    let taskToDeleteId = null; // ID da tarefa pendente de confirmação de exclusão

    // ========================================================
    // ELEMENTOS DO DOM
    // ========================================================
    const tasksTableBody = document.getElementById('tasks-table-body');
    const emptyTasksMessage = document.getElementById('empty-tasks-message');
    const taskCounter = document.getElementById('task-counter');
    const ganttTimelineHeader = document.getElementById('gantt-timeline-header');
    const ganttRowsContainer = document.getElementById('gantt-rows-container');
    const ganttChartContainer = document.getElementById('gantt-chart-container');

    // Popup de Exclusão
    const deleteModal = document.getElementById('delete-confirm-modal');
    const deleteTaskNameEl = document.getElementById('delete-task-name');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    const btnCancelDelete = document.getElementById('btn-cancel-delete');

    // Botões de ação
    const btnNewTask = document.getElementById('btn-new-task');
    const btnClearAll = document.getElementById('btn-clear-all');
    const btnTemplateEstudos = document.getElementById('btn-template-estudos');
    const btnTemplateSprint = document.getElementById('btn-template-sprint');
    const btnExport = document.getElementById('btn-export');
    const btnImportTrigger = document.getElementById('btn-import-trigger');
    const fileImport = document.getElementById('file-import');

    // ========================================================
    // TEMPLATES DE PROJETOS
    // ========================================================
    const templateEstudos = [
        { id: "1", name: "Visão Geral de Bancos de Dados", phase: "Módulo 1: Conceitos", startDate: "2026-06-01", endDate: "2026-07-01", progress: 100, color: "purple" },
        { id: "2", name: "Modelo Relacional e Normalização", phase: "Módulo 1: Conceitos", startDate: "2026-06-05", endDate: "2026-07-10", progress: 100, color: "purple" },
        { id: "3", name: "Criação de Tabelas e Constraints", phase: "Módulo 2: DDL e DML", startDate: "2026-06-09", endDate: "2026-07-20", progress: 75, color: "blue" },
        { id: "4", name: "Consultas Básicas (SELECT, WHERE)", phase: "Módulo 2: DDL e DML", startDate: "2026-06-13", endDate: "2026-07-30", progress: 50, color: "blue" },
        { id: "5", name: "Junções e Agrupamentos (JOIN, GROUP BY)", phase: "Módulo 2: DDL e DML", startDate: "2026-06-17", endDate: "2026-08-05", progress: 20, color: "blue" },
        { id: "6", name: "Subqueries e Views", phase: "Módulo 3: Avançado", startDate: "2026-06-25", endDate: "2026-08-10", progress: 0, color: "green" },
        { id: "7", name: "Triggers e Stored Procedures", phase: "Módulo 3: Avançado", startDate: "2026-06-28", endDate: "2026-08-15", progress: 0, color: "yellow" }
    ];

    const templateSprint = [
        { id: "s1", name: "Definição de Backlog e Requisitos", phase: "Sprint 1: Design", startDate: "2026-06-01", endDate: "2026-07-01", progress: 100, color: "blue" },
        { id: "s2", name: "Wireframes e Prototipagem da UI", phase: "Sprint 1: Design", startDate: "2026-06-05", endDate: "2026-07-10", progress: 100, color: "blue" },
        { id: "s3", name: "Modelagem e Criação do Banco de Dados", phase: "Sprint 2: Dev", startDate: "2026-06-09", endDate: "2026-07-20", progress: 100, color: "purple" },
        { id: "s4", name: "Implementação das APIs e Backend", phase: "Sprint 2: Dev", startDate: "2026-06-13", endDate: "2026-07-30", progress: 70, color: "purple" },
        { id: "s5", name: "Desenvolvimento do Frontend", phase: "Sprint 2: Dev", startDate: "2026-06-17", endDate: "2026-08-05", progress: 50, color: "purple" },
        { id: "s6", name: "Testes Unitários e de Integração", phase: "Sprint 3: Testes", startDate: "2026-06-25", endDate: "2026-08-10", progress: 0, color: "green" },
        { id: "s7", name: "Deploy em Homologação (Staging)", phase: "Sprint 3: Testes", startDate: "2026-06-28", endDate: "2026-08-15", progress: 0, color: "yellow" },
        { id: "s8", name: "Lançamento Oficial em Produção", phase: "Sprint 3: Testes", startDate: "2026-06-30", endDate: "2026-08-20", progress: 0, color: "red" }
    ];

    // ========================================================
    // PERSISTÊNCIA (localStorage)
    // ========================================================
    const STORAGE_KEY = 'gantt-tasks';
    const STORAGE_VERSION = 'v2'; // Incrementar ao mudar estrutura dos templates

    function loadTasks() {
        const storedVersion = localStorage.getItem('gantt-tasks-version');
        const stored = localStorage.getItem(STORAGE_KEY);

        // Se a versão mudou ou não há dados, recarrega os templates padrão
        if (!stored || storedVersion !== STORAGE_VERSION) {
            tasks = [...templateEstudos];
            saveTasks();
        } else {
            tasks = JSON.parse(stored);
        }
        render();
    }

    function saveTasks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        localStorage.setItem('gantt-tasks-version', STORAGE_VERSION);
    }

    // ========================================================
    // HELPERS
    // ========================================================
    const colorMap = {
        blue: { dot: '#3b82f6', label: '🔵 Azul' },
        purple: { dot: '#8b5cf6', label: '🟣 Roxo' },
        green: { dot: '#10b981', label: '🟢 Verde' },
        yellow: { dot: '#f59e0b', label: '🟡 Amarelo' },
        pink: { dot: '#ec4899', label: '🌸 Rosa' },
        red: { dot: '#ef4444', label: '🔴 Vermelho' }
    };

    function formatDate(dateStr) {
        const [y, m, d] = dateStr.split('-');
        const date = new Date(Number(y), Number(m) - 1, Number(d));
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    }

    function parseDateUTC(dateStr) {
        const [y, m, d] = dateStr.split('-');
        return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    }

    function todayStr() {
        return new Date().toISOString().substring(0, 10);
    }

    function dateInNDays(n) {
        const d = new Date();
        d.setDate(d.getDate() + n);
        return d.toISOString().substring(0, 10);
    }

    function colorSelectOptions(selectedColor) {
        return Object.entries(colorMap).map(([val, info]) =>
            `<option value="${val}" ${val === selectedColor ? 'selected' : ''}>${info.label}</option>`
        ).join('');
    }

    // ========================================================
    // RENDERIZAÇÃO PRINCIPAL
    // ========================================================
    function render() {
        renderTable();
        renderGantt();
        updateCounter();
    }

    function updateCounter() {
        const count = tasks.length;
        taskCounter.textContent = `${count} ${count === 1 ? 'tarefa' : 'tarefas'}`;
        const isEmpty = count === 0 && editingTaskId !== 'new';
        emptyTasksMessage.classList.toggle('hidden', !isEmpty);
    }

    // -------------------------------------------------------
    // TABELA — linha normal (visualização)
    // -------------------------------------------------------
    function buildNormalRow(task) {
        const tr = document.createElement('tr');
        tr.dataset.taskId = task.id;

        const dotColor = colorMap[task.color]?.dot || '#3b82f6';
        const period = `${formatDate(task.startDate)} → ${formatDate(task.endDate)}`;
        const prog = task.progress;

        // Fundo bicolor: concluído (opaco) + pendente (suave) — igual às barras do Gantt
        tr.className = 'group task-progress-row transition-colors';
        const done = `${dotColor}38`; // ~22% — parte concluída
        const todo = `${dotColor}12`; // ~7%  — parte pendente (sempre visível)

        if (prog <= 0) {
            tr.style.background = todo;                     // 0%: só a cor suave
        } else if (prog >= 100) {
            tr.style.background = done;                     // 100%: linha inteira preenchida
        } else {
            tr.style.background =
                `linear-gradient(to right, ${done} ${prog}%, ${todo} ${prog}%)`; // bicolor
        }

        tr.innerHTML = `
            <td class="py-3 pl-4 max-w-[170px]">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:${dotColor}"></span>
                    <div class="min-w-0">
                        <div class="font-semibold text-gray-800 dark:text-gray-100 truncate">${task.name}</div>
                        <div class="text-[10px] text-gray-400 font-mono truncate">${task.phase || '—'}</div>
                    </div>
                </div>
            </td>
            <td class="py-3 text-xs text-gray-500 font-mono whitespace-nowrap">${period}</td>
            <td class="py-3 text-center">
                <span class="text-xs font-bold font-mono" style="color:${dotColor};opacity:${prog === 0 ? 0.45 : 0.85}">
                    ${prog}%
                </span>
            </td>
            <td class="py-3 pr-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                    <button class="btn-edit p-1.5 rounded text-gray-400 hover:text-primary hover:bg-primary/10 transition-all" data-id="${task.id}" title="Editar Tarefa">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button class="btn-delete p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" data-id="${task.id}" title="Excluir Tarefa">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </td>
        `;

        tr.querySelector('.btn-edit').addEventListener('click', () => startEdit(task.id));
        tr.querySelector('.btn-delete').addEventListener('click', () => showDeleteConfirm(task.id, task.name, task.phase));
        return tr;
    }

    // -------------------------------------------------------
    // TABELA — linha de edição inline
    // -------------------------------------------------------
    function buildEditRow(task) {
        const isNew = !task;
        const id = task?.id || '';
        const name = task?.name || '';
        const phase = task?.phase || '';
        const start = task?.startDate || todayStr();
        const end = task?.endDate || dateInNDays(3);
        const progress = task?.progress ?? 0;
        const color = task?.color || 'blue';

        const tr = document.createElement('tr');
        tr.className = 'edit-row';
        tr.dataset.taskId = isNew ? 'new' : id;

        tr.innerHTML = `
            <td colspan="4">
                <div class="edit-row-inner">
                    <!-- Linha 1: Nome + Fase -->
                    <div class="flex gap-2 mb-2">
                        <input
                            type="text"
                            id="inline-name"
                            class="inline-input flex-1 min-w-0"
                            placeholder="Nome da Tarefa / Atividade *"
                            value="${name}"
                        >
                        <input
                            type="text"
                            id="inline-phase"
                            class="inline-input flex-1 min-w-0"
                            placeholder="Fase / Módulo"
                            value="${phase}"
                        >
                    </div>
                    <!-- Linha 2: Datas + Progresso + Cor + Botões -->
                    <div class="flex flex-wrap gap-2 items-center">
                        <label class="flex items-center gap-1 text-[10px] text-gray-400 font-semibold uppercase whitespace-nowrap">
                            De
                            <input type="date" id="inline-start" class="inline-input" value="${start}">
                        </label>
                        <label class="flex items-center gap-1 text-[10px] text-gray-400 font-semibold uppercase whitespace-nowrap">
                            Até
                            <input type="date" id="inline-end" class="inline-input" value="${end}">
                        </label>
                        <label class="flex items-center gap-1 text-[10px] text-gray-400 font-semibold uppercase whitespace-nowrap">
                            %
                            <input type="number" id="inline-progress" class="inline-input w-14 text-center" min="0" max="100" value="${progress}">
                        </label>
                        <select id="inline-color" class="inline-input">
                            ${colorSelectOptions(color)}
                        </select>
                        <!-- Botões compactos na mesma linha -->
                        <div class="flex gap-2 ml-auto shrink-0">
                            <button id="btn-cancel-inline" class="compact-btn-cancel">
                                <i class="fas fa-times text-[10px]"></i>
                                <span>Cancelar</span>
                            </button>
                            <button id="btn-save-inline" class="compact-btn-save" data-id="${id}">
                                <i class="fas fa-check text-[10px]"></i>
                                <span>Salvar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </td>
        `;

        tr.querySelector('#btn-save-inline').addEventListener('click', () => saveInline(id));
        tr.querySelector('#btn-cancel-inline').addEventListener('click', cancelEdit);
        return tr;
    }

    // -------------------------------------------------------
    // Renderizar tabela completa
    // -------------------------------------------------------
    function renderTable() {
        tasksTableBody.innerHTML = '';

        // Row de nova tarefa no topo
        if (editingTaskId === 'new') {
            tasksTableBody.appendChild(buildEditRow(null));
        }

        // Tarefas ordenadas por data de início
        const sorted = [...tasks].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        sorted.forEach(task => {
            if (editingTaskId === task.id) {
                tasksTableBody.appendChild(buildEditRow(task));
            } else {
                tasksTableBody.appendChild(buildNormalRow(task));
            }
        });
    }

    // ========================================================
    // AÇÕES DE EDIÇÃO INLINE
    // ========================================================
    function startEdit(id) {
        // Cancela qualquer edição em andamento sem perder dados
        editingTaskId = id;
        render();
        // Foca no campo nome após renderizar
        setTimeout(() => document.getElementById('inline-name')?.focus(), 50);
    }

    function cancelEdit() {
        editingTaskId = null;
        render();
    }

    function saveInline(id) {
        const nameInput = document.getElementById('inline-name');
        const name = nameInput?.value?.trim();
        const phase = document.getElementById('inline-phase')?.value?.trim() || '';
        const startDate = document.getElementById('inline-start')?.value;
        const endDate = document.getElementById('inline-end')?.value;
        const progress = Math.min(100, Math.max(0, parseInt(document.getElementById('inline-progress')?.value, 10) || 0));
        const color = document.getElementById('inline-color')?.value || 'blue';

        // Validação: nome obrigatório
        if (!name) {
            nameInput.classList.add('error');
            nameInput.focus();
            return;
        }
        nameInput.classList.remove('error');

        // Validação: data de início não pode ser depois do fim
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            document.getElementById('inline-end').classList.add('error');
            document.getElementById('inline-end').focus();
            return;
        }

        if (id) {
            // Editar existente
            tasks = tasks.map(t =>
                t.id === id ? { id, name, phase, startDate, endDate, progress, color } : t
            );
        } else {
            // Criar nova
            tasks.push({ id: Date.now().toString(), name, phase, startDate, endDate, progress, color });
        }

        editingTaskId = null;
        saveTasks();
        render();
    }

    // ========================================================
    // POPUP DE CONFIRMAÇÃO DE EXCLUSÃO
    // ========================================================
    function showDeleteConfirm(id, name, phase) {
        taskToDeleteId = id;
        const label = phase ? `"${name}" — ${phase}` : `"${name}"`;
        deleteTaskNameEl.textContent = label;
        deleteModal.classList.remove('hidden');
    }

    function hideDeleteConfirm() {
        taskToDeleteId = null;
        deleteModal.classList.add('hidden');
    }

    btnCancelDelete.addEventListener('click', hideDeleteConfirm);

    // Fechar ao clicar no backdrop
    deleteModal.addEventListener('click', e => {
        if (e.target === deleteModal) hideDeleteConfirm();
    });

    // ========================================================
    // BOTÃO NOVA TAREFA
    // ========================================================
    btnNewTask.addEventListener('click', () => {
        editingTaskId = 'new';
        render();
        setTimeout(() => {
            const nameInput = document.getElementById('inline-name');
            if (nameInput) {
                nameInput.focus();
                nameInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 50);
    });

    // ========================================================
    // LIMPAR TUDO (reutiliza popup de exclusão)
    // ========================================================
    btnClearAll.addEventListener('click', () => {
        if (tasks.length === 0) return;
        taskToDeleteId = '__ALL__';
        deleteTaskNameEl.textContent = 'todas as tarefas do cronograma atual';
        deleteModal.classList.remove('hidden');
    });

    // ========================================================
    // TEMPLATES
    // ========================================================
    btnTemplateEstudos.addEventListener('click', () => {
        taskToDeleteId = '__TEMPLATE_ESTUDOS__';
        deleteTaskNameEl.textContent = 'o cronograma atual e carregar o exemplo de Estudos SQL';
        deleteModal.classList.remove('hidden');
    });

    btnTemplateSprint.addEventListener('click', () => {
        taskToDeleteId = '__TEMPLATE_SPRINT__';
        deleteTaskNameEl.textContent = 'o cronograma atual e carregar o exemplo de Projeto Ágil';
        deleteModal.classList.remove('hidden');
    });

    // Listener ÚNICO para todos os fluxos de confirmação
    btnConfirmDelete.addEventListener('click', () => {
        if (taskToDeleteId === '__TEMPLATE_ESTUDOS__') {
            tasks = [...templateEstudos];
        } else if (taskToDeleteId === '__TEMPLATE_SPRINT__') {
            tasks = [...templateSprint];
        } else if (taskToDeleteId === '__ALL__') {
            tasks = [];
        } else if (taskToDeleteId) {
            tasks = tasks.filter(t => t.id !== taskToDeleteId);
        }
        editingTaskId = null;
        saveTasks();
        render();
        hideDeleteConfirm();
    });

    // ========================================================
    // EXPORTAR / IMPORTAR JSON
    // ========================================================
    btnExport.addEventListener('click', () => {
        if (tasks.length === 0) {
            alert('Não há tarefas para exportar!');
            return;
        }
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', 'cronograma-gantt.json');
        document.body.appendChild(a);
        a.click();
        a.remove();
    });

    btnImportTrigger.addEventListener('click', () => fileImport.click());

    fileImport.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const imported = JSON.parse(event.target.result);
                const isValid = Array.isArray(imported) &&
                    imported.every(t => t.id && t.name && t.startDate && t.endDate);
                if (isValid) {
                    tasks = imported;
                    editingTaskId = null;
                    saveTasks();
                    render();
                } else {
                    alert('Erro: O formato do arquivo JSON é inválido.');
                }
            } catch {
                alert('Erro ao ler o arquivo JSON.');
            }
        };
        reader.readAsText(file);
        fileImport.value = '';
    });

    // ========================================================
    // RENDERIZADOR DO GRÁFICO DE GANTT (linha do tempo)
    // ========================================================
    function renderGantt() {
        ganttTimelineHeader.innerHTML = '';
        ganttRowsContainer.innerHTML = '';

        if (tasks.length === 0) {
            ganttChartContainer.style.minWidth = '100%';
            return;
        }

        const startDates = tasks.map(t => parseDateUTC(t.startDate));
        const endDates = tasks.map(t => parseDateUTC(t.endDate));

        let minDate = new Date(Math.min(...startDates));
        let maxDate = new Date(Math.max(...endDates));

        minDate.setUTCDate(minDate.getUTCDate() - 3);
        maxDate.setUTCDate(maxDate.getUTCDate() + 3);

        const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

        let columns = [];
        let columnWidth = 40;
        let daysPerColumn = 1;

        if (totalDays <= 30) {
            daysPerColumn = 1;
            columnWidth = 44;
            for (let d = 0; d < totalDays; d++) {
                const colDate = new Date(minDate);
                colDate.setUTCDate(minDate.getUTCDate() + d);
                columns.push({
                    text: colDate.getUTCDate().toString(),
                    subtext: colDate.toLocaleDateString('pt-BR', { weekday: 'short' }).substring(0, 1).toUpperCase()
                });
            }
        } else if (totalDays <= 75) {
            daysPerColumn = 3;
            columnWidth = 55;
            const colsCount = Math.ceil(totalDays / 3);
            for (let c = 0; c < colsCount; c++) {
                const colDate = new Date(minDate);
                colDate.setUTCDate(minDate.getUTCDate() + (c * 3));
                columns.push({
                    text: colDate.getUTCDate().toString(),
                    subtext: colDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
                });
            }
        } else {
            daysPerColumn = 7;
            columnWidth = 70;
            const colsCount = Math.ceil(totalDays / 7);
            for (let c = 0; c < colsCount; c++) {
                const colDate = new Date(minDate);
                colDate.setUTCDate(minDate.getUTCDate() + (c * 7));
                columns.push({
                    text: `${colDate.getUTCDate()}/${colDate.getUTCMonth() + 1}`,
                    subtext: 'S' + (c + 1)
                });
            }
        }

        const totalColumns = columns.length;
        const totalWidth = totalColumns * columnWidth;
        ganttTimelineHeader.style.width = `${totalWidth}px`;
        ganttRowsContainer.style.width = `${totalWidth}px`;

        columns.forEach(col => {
            const cell = document.createElement('div');
            cell.className = 'gantt-grid-cell font-mono text-gray-500 border-r dark:border-slate-800 flex flex-col justify-center';
            cell.style.width = `${columnWidth}px`;
            cell.innerHTML = `<span class="font-bold">${col.text}</span><span class="text-[9px] opacity-60">${col.subtext}</span>`;
            ganttTimelineHeader.appendChild(cell);
        });

        const sortedTasks = [...tasks].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        const pixelsPerDay = totalWidth / totalDays;

        sortedTasks.forEach(task => {
            const row = document.createElement('div');
            row.className = 'gantt-row w-full relative';

            const taskStart = parseDateUTC(task.startDate);
            const taskEnd = parseDateUTC(task.endDate);
            const startOffsetDays = Math.ceil((taskStart - minDate) / (1000 * 60 * 60 * 24));
            const durationDays = Math.ceil((taskEnd - taskStart) / (1000 * 60 * 60 * 24)) + 1;
            const leftPx = startOffsetDays * pixelsPerDay;
            const widthPx = durationDays * pixelsPerDay;
            const colorClass = `color-${task.color || 'blue'}`;

            row.innerHTML = `
                <div class="absolute inset-0 flex pointer-events-none">
                    ${Array.from({ length: totalColumns }).map(() =>
                `<div class="h-full border-r border-gray-100 dark:border-slate-800/30" style="width:${columnWidth}px;"></div>`
            ).join('')}
                </div>
                <div class="gantt-bar-container ${colorClass}" style="left:${leftPx}px;width:${widthPx}px;" title="${task.name} (${task.progress}%)">
                    <div class="gantt-bar-progress" style="width:${task.progress}%;"></div>
                    <div class="gantt-bar-text select-none">${task.name}</div>
                </div>
            `;
            ganttRowsContainer.appendChild(row);
        });

        // === LINHA DE HOJE ===
        const nowLocal = new Date();
        const todayUTC = new Date(Date.UTC(
            nowLocal.getFullYear(),
            nowLocal.getMonth(),
            nowLocal.getDate()
        ));

        if (todayUTC >= minDate && todayUTC <= maxDate) {
            const todayOffsetDays = (todayUTC - minDate) / (1000 * 60 * 60 * 24);
            const todayLeftPx = todayOffsetDays * pixelsPerDay;

            // Linha vertical no corpo do gráfico
            const todayLine = document.createElement('div');
            todayLine.className = 'gantt-today-line';
            todayLine.style.left = `${todayLeftPx}px`;
            todayLine.innerHTML = `<span class="gantt-today-label">Hoje</span>`;
            ganttRowsContainer.appendChild(todayLine);

            // Marcador triangular no cabeçalho
            const todayMarker = document.createElement('div');
            todayMarker.className = 'gantt-today-header-mark';
            todayMarker.style.left = `${todayLeftPx}px`;
            ganttTimelineHeader.style.position = 'relative';
            ganttTimelineHeader.appendChild(todayMarker);
        }
    }

    // ========================================================
    // INICIALIZAÇÃO
    // ========================================================
    loadTasks();
});
