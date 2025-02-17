document.addEventListener('DOMContentLoaded', function () {
    const lineChartData = JSON.parse(localStorage.getItem('lineChartData'));

    if (lineChartData) {
        const formData = new FormData();
        formData.append('data_inicio', lineChartData.data_inicio);
        formData.append('hora_inicio', lineChartData.hora_inicio);
        formData.append('data_fim', lineChartData.data_fim);
        formData.append('hora_fim', lineChartData.hora_fim);

        lineChartData.variaveis_selecionadas.forEach(variavel => {
            formData.append('variaveis_selecionadas[]', variavel);
        });

        fetch('../php/3_grafico_linhas.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (!data.datasets || data.datasets.length === 0) {
                    alert(data.message || 'Nenhum dado encontrado!');
                    return;
                }

                const chartData = data.datasets.map((dataset) => ({
                    key: dataset.label,
                    values: dataset.data.map((value, index) => ({
                        x: new Date(data.labels[index]).getTime(),
                        y: parseFloat(value) || 0
                    }))
                }));

                nv.addGraph(() => {
                    const chart = nv.models.lineChart()
                        .useInteractiveGuideline(true)
                        .margin({ left: 100, top: 50, right: 50, bottom: 50 }) // Increased margins for legend space
                        .x(d => d.x)
                        .y(d => d.y);
                
                    // Explicit Legend Position and Styling
                    chart.legend.align(false) // disable automatic alignment.
                                      .rightAlign(false) // disable right alignment
                                      .width(200) //set a width for the legend container
                                      .margin({ top: 10, left: 10 }) // Adjust as needed
                                      .padding(20)
                                      .updateState(true);
                
                
                    chart.xAxis
                        .axisLabel('Data e Hora')
                        .tickFormat(d => d3.time.format('%Y-%m-%d %H:%M')(new Date(d)));
                
                    chart.yAxis
                        .axisLabel('Valor')
                        .tickFormat(d3.format('.02f'));
                
                    d3.select('#line_chart svg')
                        .datum(chartData)
                        .call(chart);
                
                    nv.utils.windowResize(chart.update);
                
                    return chart;
                });
                
            })
            .catch(error => {
                console.error('Erro ao gerar gráfico de linhas:', error);
            });
    }
});
