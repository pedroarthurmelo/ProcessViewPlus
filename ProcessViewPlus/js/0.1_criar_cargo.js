document.getElementById('form-cargo').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(this);

    fetch('../php/0.1_criar_cargo.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('message').innerText = data;
    })
    .catch(error => {
        document.getElementById('message').innerText = "Erro ao enviar o formulário.";
    });
});
