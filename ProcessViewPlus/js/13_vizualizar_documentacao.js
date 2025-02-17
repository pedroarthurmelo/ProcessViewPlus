document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#comentarios-table tbody");

    async function carregarDados() {
        try {
            const response = await fetch("../php/12_vizualizar_documentacao.php");
            const data = await response.json();

            if (data.error) {
                console.error(data.error);
                tableBody.innerHTML = "<tr><td colspan='4'>Erro ao carregar os dados.</td></tr>";
                return;
            }

            updateTable(data);
            setupSearch(data);
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            tableBody.innerHTML = "<tr><td colspan='4'>Erro ao carregar os dados.</td></tr>";
        }
    }

    function updateTable(data) {
        tableBody.innerHTML = data.map(row => `
            <tr>
                <td>${row.data_hora}</td>
                <td>${row.cliente}</td>
                <td><a href="../pdfs/${row.projeto}.pdf" target="_blank">${row.projeto}</a></td>
                <td>${row.descricao}</td>
            </tr>
        `).join("");
    }

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

    carregarDados();
});