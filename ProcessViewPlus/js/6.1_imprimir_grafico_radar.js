function imprimirGraficoRadar() {
    // Obter o canvas do gráfico
    const canvas = document.getElementById('radarChartCanvas');
    if (!canvas) {
        alert('Gráfico não encontrado!');
        return;
    }

    // Converter o canvas para uma imagem em formato base64
    const imagemGrafico = canvas.toDataURL('image/png');

    // Abrir uma nova janela para a impressão
    const janelaImpressao = window.open('', '_blank', 'width=800,height=600');
    janelaImpressao.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Imprimir Gráfico Radar</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
            </style>
        </head>
        <body>
            <img src="${imagemGrafico}" alt="Gráfico Radar">
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
