document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/0.71_grafico_barras.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Erro ao carregar os dados:', data.error);
                return;
            }

            if (data.length > 0) {
                const dsClasse = data.map(item => item.ds_Classe);
                const values = data.map(item => parseFloat(item.value));
                const dsSufixo = data.map(item => item.ds_Sufixo);

                // Gera cores aleatórias
                const randomColors = values.map(() => {
                    const r = Math.floor(Math.random() * 256);
                    const g = Math.floor(Math.random() * 256);
                    const b = Math.floor(Math.random() * 256);
                    return `rgba(${r}, ${g}, ${b}, 0.6)`; // Cor de fundo com opacidade
                });

                const borderColors = randomColors.map(color => color.replace(/0\.6/, '1')); // Bordas mais sólidas

                // Renderiza o gráfico de barras
                const ctx = document.getElementById('barChart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: dsClasse,
                        datasets: [{
                            label: 'Produção',
                            data: values,
                            backgroundColor: randomColors,
                            borderColor: borderColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.raw} ${dsSufixo[context.dataIndex]}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            } else {
                console.error('Nenhum dado disponível para o ambiente especificado.');
            }
        })
        .catch(error => console.error('Erro na requisição:', error));
});
