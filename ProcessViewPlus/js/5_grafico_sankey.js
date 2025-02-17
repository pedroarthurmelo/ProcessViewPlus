$(document).ready(function () {
    if (typeof google === 'undefined' || !google.charts) {
        console.error('Google Charts library not loaded');
        $('#sankey_multiple').html('<p>Biblioteca Google Charts não carregada.</p>');
        return;
    }

    google.charts.load('current', { 'packages': ['sankey'] });
    google.charts.setOnLoadCallback(prepareChart);

    function prepareChart() {
        var chartData = JSON.parse(localStorage.getItem('sankeyChartData'));

        if (!chartData) {
            console.error('Nenhum dado encontrado no localStorage');
            $('#sankey_multiple').html('<p>Nenhum dado selecionado para o gráfico Sankey.</p>');
            return;
        }

        $.ajax({
            url: '../php/5_grafico_sankey.php',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(chartData),
            success: function (sankeyData) {
                if (!sankeyData || sankeyData.length === 0) {
                    $('#sankey_multiple').html('<p>Nenhum dado disponível para o gráfico Sankey.</p>');
                    return;
                }

                // Filtra os dados válidos e armazena os inválidos
                const validData = sankeyData.filter(row => row[2] > 0);
                const invalidData = sankeyData.filter(row => row[2] <= 0);

                if (validData.length === 0) {
                    $('#sankey_multiple').html('<p>Nenhum dado com valores disponíveis para o gráfico Sankey.</p>');
                    return;
                }

                // Cria a tabela de dados para o gráfico
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'De');
                data.addColumn('string', 'Para');
                data.addColumn('number', 'Valor');
                data.addRows(validData);

                // Opções do gráfico
                var options = {
                    width: '100%',
                    height: 500,
                    sankey: {
                        node: {
                            colors: [
                                '#4CAF50',
                                '#2196F3',
                                '#FFC107',
                                '#FF5722',
                                '#9C27B0'
                            ]
                        },
                        link: {
                            colorMode: 'source'
                        }
                    }
                };

                // Desenha o gráfico
                var chart = new google.visualization.Sankey(document.getElementById('sankey_multiple'));
                chart.draw(data, options);

                // Exibe dados inválidos (sem valores)
                if (invalidData.length > 0) {
                    let invalidList = '<ul>';
                    invalidData.forEach(row => {
                        invalidList += `<li>
                            Máquina: ${row[0] || 'Não informado'}, 
                            Tipo de Variável: ${row[1] || 'Não informado'}, 
                            Classe: ${row[2] || 'Não informado'}, 
                            Sufixo: ${row[3] || 'Não informado'}, 
                            Variável: ${row[4] || 'Não encontrado'}
                        </li>`;
                    });
                    invalidList += '</ul>';
                
                    // Adiciona o aviso antes do div sankey_multiple
                    if (!$('#missing-data').length) {
                        $('#sankey_multiple').before(` 
                            <div id="missing-data" style="margin: 10px 0; color: red; font-size: 12px; text-align: center; margin-top: 2rem">
                                <p>Os seguintes dados não foram encontrados ou possuem valores inválidos:</p>
                                ${invalidList}
                            </div>
                        `);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro na requisição:', status, error);
                $('#sankey_multiple').html('<p>Erro ao carregar dados do gráfico Sankey.</p>');
            }
        });
    }
});
