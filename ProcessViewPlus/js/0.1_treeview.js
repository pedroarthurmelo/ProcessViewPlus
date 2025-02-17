document.addEventListener('DOMContentLoaded', function () {
    // Mapeamento personalizado para os grupos
    const groupNames = {
        'A': 'A - View',
        'B': 'B - Laboratório',
        'C': 'C - Outros', // Adicione outros conforme necessário
    };

    // Fetch e construção do TreeView
    fetch('../php/0.1_treeview.php')
        .then(response => response.json())
        .then(data => {
            const treeView = document.getElementById('treeView');
            buildTreeView(data, treeView);
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));

    function buildTreeView(data, container) {
        // Criar mapa de grupos por letra inicial
        const groups = new Map();

        data.forEach(ambiente => {
            const firstLetter = ambiente.Nome.charAt(0).toUpperCase();
            if (!groups.has(firstLetter)) {
                groups.set(firstLetter, []);
            }
            groups.get(firstLetter).push(ambiente);
        });

        // Ordenar os grupos alfabeticamente
        const sortedGroups = Array.from(groups.keys()).sort();

        sortedGroups.forEach(letter => {
            const groupItem = document.createElement('li');
            const groupName = groupNames[letter] || `${letter} - Outros`; // Nome personalizado ou padrão

            groupItem.innerHTML = `<span class="caret">${groupName}</span>`;
            const groupSublist = document.createElement('ul');
            groupSublist.classList.add('nested');
            groupItem.appendChild(groupSublist);
            container.appendChild(groupItem);

            groups.get(letter).sort((a, b) => a.Nome.localeCompare(b.Nome));

            groups.get(letter).forEach(ambiente => {
                const ambienteItem = document.createElement('li');
                ambienteItem.innerHTML = `<span class="caret">${ambiente.Nome}</span>`;
                const ambienteSublist = document.createElement('ul');
                ambienteSublist.classList.add('nested');
                ambienteItem.appendChild(ambienteSublist);
                groupSublist.appendChild(ambienteItem);

                ambiente.classes.sort((a, b) => a.ds_Classe.localeCompare(b.ds_Classe));

                ambiente.classes.forEach(classe => {
                    const classeItem = document.createElement('li');
                    classeItem.innerHTML = `<span class="caret">${classe.ds_Classe} - ${classe.ds_Sufixo}</span>`;
                    const classeSublist = document.createElement('ul');
                    classeSublist.classList.add('nested');
                    classeItem.appendChild(classeSublist);
                    ambienteSublist.appendChild(classeItem);

                    const tipoVariaveisMap = new Map();
                    classe.variaveis.sort((a, b) => a.ds_variavel.localeCompare(b.ds_variavel));

                    classe.variaveis.forEach(variavel => {
                        if (!tipoVariaveisMap.has(variavel.ds_TipoVariavel)) {
                            const tipoVariavelItem = document.createElement('li');
                            tipoVariavelItem.innerHTML = `<span class="caret">${variavel.ds_TipoVariavel}</span>`;
                            const tipoVariavelSublist = document.createElement('ul');
                            tipoVariavelSublist.classList.add('nested');
                            tipoVariavelItem.appendChild(tipoVariavelSublist);
                            classeSublist.appendChild(tipoVariavelItem);
                            tipoVariaveisMap.set(variavel.ds_TipoVariavel, tipoVariavelSublist);
                        }

                        const tipoVariavelSublist = tipoVariaveisMap.get(variavel.ds_TipoVariavel);
                        const variavelItem = document.createElement('li');
                        variavelItem.className = 'variavel-item';
                        variavelItem.innerHTML = `
                            <label class="checkbox-container">
                                <input type="checkbox" 
                                       name="variaveis_selecionadas[]" 
                                       value="${ambiente.Nome},${classe.ds_Classe},${classe.ds_Sufixo},${variavel.ds_TipoVariavel},${variavel.ds_variavel}">
                                <span class="checkmark"></span>
                                ${variavel.ds_variavel}
                            </label>
                        `;
                        tipoVariavelSublist.appendChild(variavelItem);
                    });
                });
            });
        });

        // Código para abrir/fechar os itens da árvore
        const toggler = document.getElementsByClassName("caret");
        for (let i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function () {
                const nestedList = this.parentElement.querySelector(".nested");
                if (nestedList) {
                    nestedList.classList.toggle("active");
                    this.classList.toggle("caret-down");
                }
            });
        }
    }

    // Função genérica para armazenar dados no localStorage e redirecionar
    function handleChartButtonClick(buttonId, storageKey, redirectUrl) {
        document.getElementById(buttonId).addEventListener('click', function (e) {
            e.preventDefault();

            const dataInicio = document.getElementById('data_inicio').value;
            const horaInicio = document.getElementById('hora_inicio').value;
            const dataFim = document.getElementById('data_fim').value;
            const horaFim = document.getElementById('hora_fim').value;

            const variaveisSelecionadas = Array.from(
                document.querySelectorAll('input[name="variaveis_selecionadas[]"]:checked')
            ).map(checkbox => checkbox.value);

            if (variaveisSelecionadas.length === 0) {
                alert('Por favor, selecione pelo menos uma variável.');
                return;
            }

            if (!dataInicio || !dataFim) {
                alert('Por favor, preencha as datas de início e fim.');
                return;
            }

            localStorage.setItem(storageKey, JSON.stringify({
                data_inicio: dataInicio,
                hora_inicio: horaInicio,
                data_fim: dataFim,
                hora_fim: horaFim,
                variaveis_selecionadas: variaveisSelecionadas
            }));

            window.location.href = redirectUrl;
        });
    }

    // Chamadas da função genérica para cada botão
    handleChartButtonClick('generate-pivot-table', 'tabelaPivotData', '../html_graficos/1_tabela_pivot.html');
    handleChartButtonClick('generate-bar-chart', 'barChartData', '../html_graficos/2_grafico_barras.html');
    handleChartButtonClick('generate-line-chart', 'lineChartData', '../html_graficos/3_grafico_linhas.html');
    handleChartButtonClick('generate-pie-chart', 'pieChartData', '../html_graficos/4_grafico_pizza.html');
    handleChartButtonClick('generate-sankey-chart', 'sankeyChartData', '../html_graficos/5_grafico_sankey.html');
    handleChartButtonClick('generate-radar-chart', 'radarChartData', '../html_graficos/6_grafico_radar.html');
    handleChartButtonClick('generate-line-chart1', 'lineChartData1', '../html_graficos/7_grafico_area.html');
    handleChartButtonClick('generate-report-table', 'reportChartData', '../html_graficos/8_grafico_relatorio.html');
    handleChartButtonClick('generate-rosca-chart', 'roscaChartData', '../html_graficos/9_grafico_rosca.html');
});
