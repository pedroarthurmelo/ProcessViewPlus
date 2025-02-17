document.addEventListener("DOMContentLoaded", () => {
    const configButton = document.getElementById("configButton");
    const configModal = document.getElementById("configModal");
    const closeBtn = configModal.querySelector(".close");
    const configLoginForm = document.getElementById("configLoginForm");

    // Abrir modal ao clicar no botão
    configButton.addEventListener("click", () => {
        configModal.style.display = "flex"; // Exibir modal com display flex
    });

    // Fechar modal ao clicar no "X"
    closeBtn.addEventListener("click", () => {
        configModal.style.display = "none";
    });

    // Validar o login e redirecionar
    configLoginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = document.getElementById("config-username").value;
        const password = document.getElementById("config-password").value;
    
        fetch('../php/0.001_validate_login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `login=${encodeURIComponent(username)}&senha=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const cargo = data.cargo;
                if (cargo === "admin") {
                    alert("Bem-vindo às configurações!");
                    window.location.href = "../html_principal/1_configuracoes.html";
                } else {
                    alert("Acesso negado às configurações.");
                }
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Erro na validação de login:", error);
            alert("Erro ao tentar fazer login.");
        });
    });
});
