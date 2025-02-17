function imprimirRelatorio() {
    // Obter a tabela
    const conteudo = document.getElementById('report-table').outerHTML;
    if (!conteudo) {
        alert('Tabela não encontrada!');
        return;
    }

    // Abrir uma nova janela para a impressão
    const janelaImpressao = window.open('', '_blank', 'width=800,height=600');
    janelaImpressao.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Imprimir Relatório</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
            </style>
        </head>
        <body>
            <h2>Relatório</h2>
            ${conteudo}
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `);
    janelaImpressao.document.close();
}
function exportarCSV() {
    let tabela = document.getElementById("report-table");
    let linhas = tabela.querySelectorAll("tr");
    let csvContent = [];

    linhas.forEach(linha => {
        let colunas = linha.querySelectorAll("th, td");
        let linhaCSV = [];
        
        colunas.forEach((celula, index) => {
            let texto = celula.innerText.trim().replace(/"/g, '""'); // Remove espaços extras e escapa aspas

            // Se for a primeira coluna (Data e Hora), envolver entre aspas duplas
            if (index === 3) {
                texto = `"${texto}"`;
            }

            linhaCSV.push(texto); // Adiciona ao array da linha
        });

        csvContent.push(linhaCSV.join(";")); // Usa ponto e vírgula como separador
    });

    let csvString = "\uFEFF" + csvContent.join("\n"); // Adiciona BOM para UTF-8
    let blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "comentarios.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}