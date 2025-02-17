const labButton = document.getElementById("labButton");
const loginModal = document.getElementById("loginModal");
const closeModal = document.querySelector(".close");
const loginForm = document.getElementById("loginForm");

// Exibe o modal
labButton.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

// Fecha o modal
closeModal.addEventListener("click", () => {
    loginModal.style.display = "none";
});

// Valida o login
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('../php/0.001_validate_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `login=${encodeURIComponent(username)}&senha=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const cargo = data.cargo;
            if (cargo === "admin" || cargo === "supervisor") {
                alert("Bem-vindo ao laboratório!");
                window.location.href = "../html_principal/5_laboratorio.html";
            } else {
                alert("Acesso negado ao laboratório.");
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

