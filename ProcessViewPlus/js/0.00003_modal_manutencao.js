const manutencaoButton = document.getElementById("manutencaoButton");
const manutencaoModal = document.getElementById("manutencaoModal");
const manutencaoClose = manutencaoModal.querySelector(".close");
const manutencaoLoginForm = document.getElementById("manutencaoLoginForm");

// Exibir o modal de manutenção ao clicar no botão
manutencaoButton.addEventListener("click", () => {
    manutencaoModal.style.display = "flex";
});

// Fechar o modal de manutenção ao clicar no botão "X"
manutencaoClose.addEventListener("click", () => {
    manutencaoModal.style.display = "none";
});

// Validar o login no modal de manutenção
manutencaoLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("manutencao-username").value;
    const password = document.getElementById("manutencao-password").value;

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
                alert("Bem-vindo à área de manutenção!");
                window.location.href = "../html_principal/9_manutencao.html";
            } else {
                alert("Acesso negado à área de manutenção.");
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
