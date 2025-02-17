document.addEventListener('DOMContentLoaded', function () {
    const ambienteSelect = document.getElementById('ambiente-select');
    const classesContainer = document.getElementById('classes-container');
    const dataInicioInput = document.getElementById('data-inicio');
    const dataFimInput = document.getElementById('data-fim');

    // Função para buscar os ambientes
    async function fetchEnvironments() {
        try {
            const response = await fetch('../php/0.2_get_ambientes_dashboard.php');
            if (!response.ok) throw new Error(`Erro ao buscar ambientes: ${response.statusText}`);
            const ambientes = await response.json();

            const filteredAmbientes = ambientes.filter(ambiente => ambiente.nome_ambiente.startsWith('D'));
            populateSelect(ambienteSelect, filteredAmbientes);
        } catch (error) {
            console.error('Erro ao carregar ambientes:', error);
        }
    }

    // Função para buscar as classes e valores
    async function fetchClassesAndValues(ambienteId, dataInicio, dataFim) {
        try {
            let url = `../php/0.3_get_data_dashboard.php?id=${ambienteId}`;
            if (dataInicio) url += `&data_inicio=${dataInicio}`;
            if (dataFim) url += `&data_fim=${dataFim}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro ao buscar classes e valores: ${response.statusText}`);
            const dados = await response.json();

            renderCards(dados, ambienteId);
        } catch (error) {
            console.error('Erro ao carregar classes e valores:', error);
        }
    }

    // Função para renderizar os cards
    function renderCards(dados, ambienteId) {
        classesContainer.innerHTML = '';
        dados.forEach(dado => {
            const card = createCard(dado.ds_Classe, dado.ds_Sufixo, dado.UltimoValor, ambienteId);
            classesContainer.appendChild(card);
        });
    }

    // Função para criar um card
    function createCard(classe, sufixo, ultimoValor, ambienteId) {
        const card = document.createElement('div');
        card.classList.add('card-body');

        // Mapear ícones para IDs de ambientes
        const iconMap = {
            37:  '../icones/3_areas.svg',
            43:  '../icones/3_areas.svg',
            47: '../icones/18_relogio.svg',
            51: '../icones/15_energia.svg',
            55: '../icones/14_vapor.svg',
            59: '../icones/6_laboratorio.svg',
        };

        // Define o caminho do ícone com base no mapa
        const iconPath = iconMap[ambienteId] || '../icones/17_database.svg'; // Caminho padrão caso não exista no mapa

        card.innerHTML = `
            <img src="${iconPath}">
            <h3>${classe}</h3>
            <p>${ultimoValor} ${sufixo}</p>
        `;
        return card;
    }

    // Função para preencher o select com os ambientes
    function populateSelect(selectElement, options) {
        selectElement.innerHTML = '<option value="">Selecione um Ambiente</option>';
        options.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.id;
            option.textContent = optionData.nome_ambiente;
            selectElement.appendChild(option);
        });
    }

    // Buscar ambientes ao carregar
    fetchEnvironments();

    // Atualizar classes ao selecionar um ambiente
    ambienteSelect.addEventListener('change', () => {
        const selectedAmbienteId = ambienteSelect.value;
        const dataInicio = dataInicioInput.value || null;
        const dataFim = dataFimInput.value || null;

        if (selectedAmbienteId) {
            fetchClassesAndValues(selectedAmbienteId, dataInicio, dataFim);
        }
    });

    // Atualizar classes ao alterar as datas
    [dataInicioInput, dataFimInput].forEach(input => {
        input.addEventListener('change', () => {
            const selectedAmbienteId = ambienteSelect.value;
            const dataInicio = dataInicioInput.value || null;
            const dataFim = dataFimInput.value || null;

            if (selectedAmbienteId) {
                fetchClassesAndValues(selectedAmbienteId, dataInicio, dataFim);
            }
        });
    });

    // Atualizar os cards automaticamente a cada 1 minuto
    setInterval(() => {
        const selectedAmbienteId = ambienteSelect.value;
        const dataInicio = dataInicioInput.value || null;
        const dataFim = dataFimInput.value || null;

        if (selectedAmbienteId) {
            fetchClassesAndValues(selectedAmbienteId, dataInicio, dataFim);
        }
    }, 20000); // 20.000 milissegundos = 1 minuto
});
