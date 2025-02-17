document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#comentarios-table tbody");

    async function carregarDados() {
        try {
            const response = await fetch("../php/12_deletar_documentacao.php");
            const data = await response.json();

            if (data.error) {
                console.error(data.error);
                tableBody.innerHTML = "<tr><td colspan='5'>Erro ao carregar os dados.</td></tr>";
                return;
            }

            updateTable(data);
            setupSearch(data);
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            tableBody.innerHTML = "<tr><td colspan='5'>Erro ao carregar os dados.</td></tr>";
        }
    }

    function updateTable(data) {
        tableBody.innerHTML = data.map(row => `
            <tr>
                <td>${row.data_hora}</td>
                <td>${row.cliente}</td>
                <td>${row.projeto}</td>
                <td>${row.descricao}</td>
                <td>
                    <button class="delete-button" data-id="${row.id}">Deletar</button>
                </td>
            </tr>
        `).join("");

        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                deletarRegistro(id);
            });
        });
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

    async function deletarRegistro(id) {
        if (!confirm("Tem certeza que deseja deletar este registro?")) {
            return;
        }

        try {
            const response = await fetch("../php/12_deletar_documentacao.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id })
            });

            const result = await response.json();

            if (result.success) {
                alert("Registro deletado com sucesso!");
                carregarDados();
            } else {
                alert("Erro ao deletar registro: " + (result.error || "Erro desconhecido"));
            }
        } catch (error) {
            console.error("Erro ao deletar registro:", error);
            alert("Erro ao deletar registro. Verifique o console para mais detalhes.");
        }
    }

    carregarDados();
});
