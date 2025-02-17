document.getElementById("form-cadastro").addEventListener("submit", function(event) {
    event.preventDefault();  // Impede o envio normal do formulário

    var nomeCompleto = document.getElementById("nome_completo").value;
    var matricula = document.getElementById("matricula").value;
    var comentario = document.getElementById("comentario").value;

    var formData = new FormData();
    formData.append("nome", nomeCompleto);
    formData.append("matricula", matricula);
    formData.append("comentario", comentario);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../php/9_inserir_comentarios.php", true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            document.getElementById("status-message").innerHTML = response.message;
            document.getElementById("form-cadastro").reset();  // Limpa o formulário
        } else {
            document.getElementById("status-message").innerHTML = "Erro ao inserir comentário.";
        }
    };

    xhr.send(formData);
});
