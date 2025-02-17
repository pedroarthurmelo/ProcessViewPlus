document.addEventListener('DOMContentLoaded', function () {
    let graficoLinhas1 = null;

    const lineChartData1 = JSON.parse(localStorage.getItem('lineChartData1'));

    if (lineChartData1) {
        const formData = new FormData();
        formData.append('data_inicio', lineChartData1.data_inicio);
        formData.append('hora_inicio', lineChartData1.hora_inicio);
        formData.append('data_fim', lineChartData1.data_fim);
        formData.append('hora_fim', lineChartData1.hora_fim);

        lineChartData1.variaveis_selecionadas.forEach(variavel => {
            formData.append('variaveis_selecionadas[]', variavel);
        });

        fetch('../php/7_grafico_area.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (!data.datasets || data.datasets.length === 0) {
                    alert(data.message || 'Nenhum dado encontrado!');
                    return;
                }

                const ctx = document.getElementById('lineChartCanvas1').getContext('2d');

                if (graficoLinhas1) graficoLinhas1.destroy();

                graficoLinhas1 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.labels,
                        datasets: data.datasets.map((dataset, index) => ({
                            label: dataset.label,
                            data: dataset.data,
                            borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
                            backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.2)`,
                            borderWidth: 2,
                            fill: true,
                            // pointRadius: 0,
                        }))
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });

                // Manter os dados no localStorage
                localStorage.setItem('lineChartData1', JSON.stringify(lineChartData1));
            })
            .catch(error => console.error('Erro ao gerar gráfico de linhas:', error));
    }
});