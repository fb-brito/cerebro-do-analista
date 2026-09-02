# Script de Teste Automatizado de Endpoints e Recursos Web
param([string]$BaseUrl = "http://localhost:8080")

$pages = @(
    "index.html",
    "kanban.html",
    "gantt.html",
    "editor-markdown.html",
    "quiz.html",
    "guia-git.html",
    "guia-sql.html",
    "guia-python.html",
    "guia-markdown.html",
    "mapa-mental.html",
    "paleta-cores.html",
    "components/_header.html",
    "components/_footer.html",
    "css/styles.css",
    "js/main.js",
    "js/navigation.js",
    "js/kanban.js",
    "js/gantt.js",
    "js/editor.js",
    "js/quiz.js"
)

Write-Output "=================================================="
Write-Output "BATERIA DE TESTES DE CONECTIVIDADE E HTTP 200 OK"
Write-Output "URL Base: $BaseUrl"
Write-Output "=================================================="

$successCount = 0
$failCount = 0

foreach ($p in $pages) {
    $targetUrl = "$BaseUrl/$p"
    try {
        $res = Invoke-WebRequest -Uri $targetUrl -UseBasicParsing -TimeoutSec 5
        if ($res.StatusCode -eq 200) {
            Write-Output "[PASS] $p - HTTP 200 OK ($($res.RawContentLength) bytes)"
            $successCount++
        } else {
            Write-Output "[WARN] $p - HTTP $($res.StatusCode)"
            $failCount++
        }
    } catch {
        Write-Output "[FAIL] $p - Erro: $($_.Exception.Message)"
        $failCount++
    }
}

Write-Output "=================================================="
Write-Output "RESUMO: $successCount Passaram / $failCount Falharam de $($pages.Count) testados."
Write-Output "=================================================="
