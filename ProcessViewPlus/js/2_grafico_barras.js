document.addEventListener('DOMContentLoaded', function () {
    let graficoBarras = null;

    const barChartData = JSON.parse(localStorage.getItem('barChartData'));

    if (barChartData) {
        const formData = new FormData();
        formData.append('data_inicio', barChartData.data_inicio);
        formData.append('hora_inicio', barChartData.hora_inicio);
        formData.append('data_fim', barChartData.data_fim);
        formData.append('hora_fim', barChartData.hora_fim);

        barChartData.variaveis_selecionadas.forEach(variavel => {
            formData.append('variaveis_selecionadas[]', variavel);
        });

        fetch('../php/2_grafico_barras.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (!data.datasets || data.datasets.length === 0) {
                    alert(data.message || 'Nenhum dado encontrado!');
                    return;
                }

                const ctx = document.getElementById('barChartCanvas').getContext('2d');

                if (graficoBarras) graficoBarras.destroy();

                graficoBarras = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.labels,
                        datasets: data.datasets.map((dataset, index) => ({
                            label: dataset.label,
                            data: dataset.data,
                            backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.2)`,
                            borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
                            borderWidth: 1
                        }))
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: {
                                    // Ajustar o tamanho e cor da legenda, se necessário
                                    font: { size: 12 },
                                },
                            },
                        },
                    }
                });

                // Manter os dados no localStorage
                localStorage.setItem('barChartData', JSON.stringify(barChartData));
            })
            .catch(error => console.error('Erro ao gerar gráfico de barras:', error));
    }
});