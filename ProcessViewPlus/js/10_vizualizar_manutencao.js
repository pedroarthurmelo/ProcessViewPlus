document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#comentarios-table tbody");

    // Função para carregar os dados da API
    async function carregarDados() {
        try {
            const response = await fetch("../php/10_vizualizar_manutencao.php");
            const data = await response.json();

            if (data.error) {
                console.error(data.error);
                tableBody.innerHTML = "<tr><td colspan='9'>Erro ao carregar os dados.</td></tr>";
                return;
            }

            // Atualizar a tabela com os dados
            updateTable(data);

            // Configurar a pesquisa
            setupSearch(data);
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            tableBody.innerHTML = "<tr><td colspan='9'>Erro ao carregar os dados.</td></tr>";
        }
    }

    // Função para atualizar a tabela com os dados fornecidos
    function updateTable(data) {
        tableBody.innerHTML = data.map(row => `
            <tr>
                <td>${row.data_hora}</td>
                <td>${row.drive}</td>
                <td>${row.codigo_cu}</td>
                <td>
                    <a href="../pdfs/${row.codigo_pm}.pdf" target="_blank">${row.codigo_pm}</a>
                </td>
                <td>${row.motor}</td>
                <td>${row.tensao}</td>
                <td>${row.corrente}</td>
                <td>${row.potencia}</td>
                <td>${row.rotacao}</td>
                <td>${row.frequencia}</td>
            </tr>
        `).join("");
    }

    // Função para configurar a funcionalidade de pesquisa
    function setupSearch(data) {
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', function () {
            const filter = searchInput.value.toLowerCase();
            const filteredData = data.filter(row => {
                return Object.values(row).some(value =>
                    value && value.toString().toLowerCase().includes(filter)
                );
            });
            updateTable(filteredData);
        });
    }

    // Carregar os dados ao carregar a página
    carregarDados();
});
