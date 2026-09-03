/**
 * Guia do Analista: Bancada Executiva de Trabalho & Consulta
 * Script modular para cálculos percentuais, simuladores e gerenciamento de clipboard.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Guia do Analista: Módulo de infraestrutura carregado com sucesso.");
    initializeClipboardManager();
    initializePercentageSimulator();
});

/**
 * Motor Matemático Puro: Cálculo de variação percentual blindada
 * @param {number} current - Valor atual ou realizado
 * @param {number} previous - Valor anterior ou base
 * @returns {object} { percent, diff, formattedPercent, formattedDiff, status, advice }
 */
export function calculatePercentageVariance(current, previous) {
    const curr = Number(current);
    const prev = Number(previous);

    if (isNaN(curr) || isNaN(prev)) {
        return {
            percent: null,
            diff: 0,
            formattedPercent: "-",
            formattedDiff: "R$ 0,00",
            status: "neutral",
            advice: "Informe valores numéricos válidos."
        };
    }

    const diff = curr - prev;

    if (prev === 0) {
        return {
            percent: null,
            diff: diff,
            formattedPercent: "Novo / s/ base",
            formattedDiff: (diff >= 0 ? "+" : "") + formatCurrency(diff),
            status: diff >= 0 ? "positive" : "negative",
            advice: "Base anterior zerada: impossível calcular taxa relativa (evita erro #DIV/0!)."
        };
    }

    // Fórmula blindada com denominador absoluto ABS()
    const percent = (diff / Math.abs(prev)) * 100;
    const formattedPercent = (percent > 0 ? "+" : "") + percent.toFixed(2).replace('.', ',') + "%";
    const formattedDiff = (diff > 0 ? "+" : "") + formatCurrency(diff);

    let status = "neutral";
    let advice = "Sem alteração em relação ao período anterior.";

    if (percent > 0) {
        status = "positive";
        advice = `Crescimento de ${formattedDiff} (+${percent.toFixed(2).replace('.', ',')}%) sobre a base anterior.`;
    } else if (percent < 0) {
        status = "negative";
        advice = `Redução de ${formattedDiff} (${percent.toFixed(2).replace('.', ',')}%) sobre a base anterior.`;
    }

    return {
        percent,
        diff,
        formattedPercent,
        formattedDiff,
        status,
        advice
    };
}

/**
 * Formata valor em moeda brasileira BRL
 */
export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Inicializa os listeners do simulador interativo de variação percentual
 */
export function initializePercentageSimulator() {
    const inputAnterior = document.getElementById('input-valor-anterior');
    const inputAtual = document.getElementById('input-valor-atual');
    const resultadoPercentual = document.getElementById('resultado-variacao-percentual');
    const resultadoAbsoluto = document.getElementById('resultado-variacao-absoluta');
    const resultadoDiagnostico = document.getElementById('resultado-diagnostico');

    if (!inputAnterior || !inputAtual || !resultadoPercentual) return;

    function updateSimulator() {
        const prev = parseFloat(inputAnterior.value);
        const curr = parseFloat(inputAtual.value);
        const res = calculatePercentageVariance(curr, prev);

        resultadoAbsoluto.textContent = res.formattedDiff;
        resultadoDiagnostico.textContent = res.advice;

        if (res.status === "positive") {
            resultadoPercentual.className = "text-3xl font-extrabold text-green-500 flex items-center gap-1";
            resultadoPercentual.innerHTML = `<i class="fas fa-arrow-up text-xl"></i> ${res.formattedPercent}`;
        } else if (res.status === "negative") {
            resultadoPercentual.className = "text-3xl font-extrabold text-red-500 flex items-center gap-1";
            resultadoPercentual.innerHTML = `<i class="fas fa-arrow-down text-xl"></i> ${res.formattedPercent}`;
        } else {
            resultadoPercentual.className = "text-3xl font-extrabold text-gray-500 flex items-center gap-1";
            resultadoPercentual.innerHTML = `<i class="fas fa-minus text-xl"></i> ${res.formattedPercent}`;
        }
    }

    inputAnterior.addEventListener('input', updateSimulator);
    inputAtual.addEventListener('input', updateSimulator);
    updateSimulator(); // Executa o cálculo inicial
}

/**
 * Utilitário universal para cópia de fórmulas e trechos de código com feedback visual
 */
export function initializeClipboardManager() {
    document.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.btn-copy-snippet');
        if (!copyBtn) return;

        const targetSelector = copyBtn.getAttribute('data-target');
        const textToCopy = targetSelector 
            ? document.querySelector(targetSelector)?.textContent?.trim() 
            : copyBtn.getAttribute('data-code');

        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHtml = copyBtn.innerHTML;
                copyBtn.innerHTML = `<i class="fas fa-check text-green-400 mr-1"></i> Copiado!`;
                copyBtn.classList.add('bg-green-500/20', 'border-green-500/40');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalHtml;
                    copyBtn.classList.remove('bg-green-500/20', 'border-green-500/40');
                }, 2000);
            }).catch(err => {
                console.error("Erro ao copiar texto: ", err);
            });
        }
    });
}

