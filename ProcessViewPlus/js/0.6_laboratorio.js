document.addEventListener('DOMContentLoaded', () => {
    // Carregar ambientes existentes
    fetch('../php/0.5_carregar_ambientes_lab.php')
        .then(response => response.json())
        .then(data => {
            const ambienteSelect = document.getElementById('nome_ambiente');

            if (data.success) {
                // Filtrando ambientes que começam com a letra 'L'
                const ambientesFiltrados = data.ambientes.filter(ambiente => ambiente.Nome.startsWith('L'));

                ambientesFiltrados.forEach(ambiente => {
                    const option = document.createElement('option');
                    option.value = ambiente.Nome;
                    option.textContent = ambiente.Nome;
                    ambienteSelect.appendChild(option);
                });
            } else {
                console.error('Erro ao carregar ambientes:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar ambientes:', error);
        });

    // Carregar classes (máquinas) existentes, mas com filtro específico
    fetch('../php/0.6_carregar_classes_lab.php')
        .then(response => response.json())
        .then(data => {
            const classeSelect = document.getElementById('ds_classe');

            // Lista de classes permitidas
            const classesPermitidas = [
                "Número Bobina", "Gramatura", "Umidade", "Cobb Teste", "Rct", 
                "Cmt", "Mullen", "Tração", "Elongação", "Tea", 
                "Dobras Duplas", "Elmedof"
            ];

            if (data.success) {
                // Filtrando as classes para exibir apenas as permitidas
                const classesFiltradas = data.classes.filter(classe => 
                    classesPermitidas.includes(classe.ds_classe)
                );

                classesFiltradas.forEach(classe => {
                    const option = document.createElement('option');
                    option.value = classe.ds_classe;
                    option.textContent = classe.ds_classe;
                    classeSelect.appendChild(option);
                });
            } else {
                console.error('Erro ao carregar classes:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar classes:', error);
        });
});

// Preencher os campos com base no ambiente selecionado
document.getElementById('nome_ambiente').addEventListener('change', function () {
    const nomeAmbiente = this.value;

    if (nomeAmbiente) {
        fetch(`../php/0.7_preencher_amb_lab.php?nome_ambiente=${nomeAmbiente}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const ambiente = data.ambiente;

                    // Preenchendo os campos
                    document.getElementById('cod').value = ambiente.cod || '';
                    document.getElementById('ds_classe').value = ambiente.ds_classe || '';
                    document.getElementById('ds_sufixo').value = ambiente.ds_sufixo || '';
                    document.getElementById('data_hora').value = ambiente.data_hora || '';
                    document.getElementById('value_input').value = ambiente.value_input || '';

                    // Preenchendo as variáveis associadas (se existirem)
                    if (data.variaveis.length > 0) {
                        const variavel = data.variaveis[0];
                        document.getElementById('ds_variavel').value = variavel.ds_variavel || '';
                        document.getElementById('ds_tipo_variavel').value = variavel.ds_TipoVariavel || '';
                    }
                } else {
                    console.error('Erro ao carregar ambiente:', data.message);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar ambiente:', error);
            });
    }
});

// Atualizar o campo Sufixo ao selecionar a classe
document.getElementById('ds_classe').addEventListener('change', function () {
    const dsClasse = this.value;

    if (dsClasse) {
        fetch(`../php/0.8_carregar_sufixo_lab.php?ds_classe=${dsClasse}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('ds_sufixo').value = data.sufixo || '';
                } else {
                    console.error('Erro ao carregar sufixo:', data.message);
                }
            })
            .catch(error => console.error('Erro ao carregar sufixo:', error));
    } else {
        document.getElementById('ds_sufixo').value = ''; // Limpar campo caso nenhuma classe seja selecionada
    }
});

// Enviar os dados do formulário
document.getElementById('submitBtn').addEventListener('click', () => {
    const form = document.getElementById('dataForm');
    const formData = new FormData(form);

    fetch('../php/0.9_processo_formulario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const responseDiv = document.getElementById('response');
        if (data.success) {
            responseDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
            alert('Dados enviados com sucesso!');
        } else {
            responseDiv.innerHTML = `<p style="color: red;">Erro: ${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Erro ao enviar os dados:', error);
    });
});
