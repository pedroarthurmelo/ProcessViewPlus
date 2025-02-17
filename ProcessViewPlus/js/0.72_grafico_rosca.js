document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("doughnutChart").getContext("2d");

    fetch("../php/0.72_grafico_rosca.php")
        .then((response) => response.json())
        .then((data) => {
            const labels = data.map((item) => `${item.ds_Classe} (${item.ds_Sufixo})`);
            const values = data.map((item) => parseFloat(item.Value));

            // Função para gerar cores aleatórias
            function gerarCorAleatoria() {
                return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
            }

            // Gerar um array de cores aleatórias do tamanho dos dados
            const backgroundColors = values.map(() => gerarCorAleatoria());

            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: backgroundColors, // Cores aleatórias aplicadas aqui
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                },
                            },
                        },
                    },
                },
            });
        })
        .catch((error) => console.error("Erro ao carregar o gráfico:", error));
});
