document.addEventListener('DOMContentLoaded', function () {
    const radarChartData = JSON.parse(localStorage.getItem('radarChartData'));

    if (radarChartData) {
        const formData = new FormData();
        formData.append('data_inicio', radarChartData.data_inicio);
        formData.append('hora_inicio', radarChartData.hora_inicio);
        formData.append('data_fim', radarChartData.data_fim);
        formData.append('hora_fim', radarChartData.hora_fim);

        radarChartData.variaveis_selecionadas.forEach(variavel => {
            formData.append('variaveis_selecionadas[]', variavel);
        });

        fetch('../php/6_grafico_radar.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (!data.datasets || data.datasets.length === 0) {
                    alert(data.message || 'Nenhum dado encontrado!');
                    return;
                }

                const ctx = document.getElementById('radarChartCanvas').getContext('2d');

                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: data.labels,
                        datasets: data.datasets.map((dataset, index) => ({
                            label: dataset.label,
                            data: dataset.data,
                            borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
                            backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.2)`,
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(0, 0, 0, 0.8)',
                            pointRadius: 0, // Cor dos pontos no radar
                        }))
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                angleLines: { color: '#ccc' },
                                grid: { color: '#eee' }
                            }
                        }
                    }
                });

                // Manter os dados no localStorage
                localStorage.setItem('radarChartData', JSON.stringify(radarChartData));
            })
            .catch(error => console.error('Erro ao gerar gráfico de radar:', error));
    }
});
