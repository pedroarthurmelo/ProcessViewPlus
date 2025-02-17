document.addEventListener("DOMContentLoaded", function () {
    // Carregar os usuários via AJAX
    fetch('../php/0.3_listar_usuarios.php')
        .then(response => response.json())
        .then(data => {
            const selectUsuarios = document.getElementById('usuarios');
            data.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id;
                option.textContent = usuario.nome_completo;
                selectUsuarios.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os usuários:', error);
        });

    // Remover o usuário via AJAX
    document.getElementById('remover-usuario').addEventListener('click', function () {
        const userId = document.getElementById('usuarios').value;

        if (!userId) {
            alert("Selecione um usuário para remover.");
            return;
        }

        fetch('../php/0.32_remover_usuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
        })
            .then(response => response.text())
            .then(data => {
                alert(data); // Mensagem de sucesso ou erro
                // Atualizar a lista de usuários
                location.reload();
            })
            .catch(error => {
                alert("Erro ao remover o usuário.");
                console.error(error);
            });
    });
});
