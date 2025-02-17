document.addEventListener("DOMContentLoaded", function() {
    // Carregar os cargos via AJAX
    fetch('../php/0.2_carregar_cargo.php')
        .then(response => response.json())
        .then(data => {
            const selectCargo = document.getElementById('cargo');
            data.forEach(cargo => {
                const option = document.createElement('option');
                option.value = cargo.id;
                option.textContent = cargo.nome_cargo;
                selectCargo.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os cargos:', error);
        });

    // Enviar o formulário via AJAX
    document.getElementById('form-cadastro').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch('../php/0.0_cadastrar_usuario.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Mensagem de sucesso ou erro
        })
        .catch(error => {
            alert("Erro ao cadastrar o usuário.");
        });
    });
});
