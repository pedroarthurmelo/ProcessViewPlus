function imprimirGrafico() {
    const canvas = document.getElementById('pieChartCanvas');
    if (!canvas) {
        alert('Gráfico não encontrado!');
        return;
    }

    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        const imgData = canvas.toDataURL('image/png');

        // Criar o conteúdo da janela de impressão
        printWindow.document.write(`
            <html>
            <head>
                <title>Imprimir Gráfico de Pizza</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                </style>
            </head>
            <body>
                <img src="${imgData}" alt="Gráfico de Pizza">
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
        printWindow.document.close();
    } else {
        alert('Não foi possível abrir a janela de impressão.');
    }
}