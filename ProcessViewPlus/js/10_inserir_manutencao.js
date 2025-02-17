document.getElementById("submitBtn").addEventListener("click", () => {
    const formData = new FormData(document.getElementById("motorForm"));

    fetch("../php/10_inserir_manutencao.php", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            const responseDiv = document.getElementById("response");
            responseDiv.style.display = "block";
            if (data.success) {
                responseDiv.textContent = "Dados inseridos com sucesso!";
                responseDiv.style.color = "green";
            } else {
                responseDiv.textContent = `Erro: ${data.message}`;
                responseDiv.style.color = "red";
            }
        })
        .catch(error => console.error("Erro:", error));
});
