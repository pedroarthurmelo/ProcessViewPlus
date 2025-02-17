window.onload = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../php/9_pegar_comentarios.php", true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var tableBody = document.getElementById("comentarios-table").getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ""; // Limpa a tabela antes de inserir os dados
            
            // Itera sobre os comentários e os adiciona à tabela
            response.forEach(function(comment) {
                var row = tableBody.insertRow();
                
                var cellNome = row.insertCell(0);
                cellNome.textContent = comment.nome;
                
                var cellMatricula = row.insertCell(1);
                cellMatricula.textContent = comment.matricula;
                
                var cellComentario = row.insertCell(2);
                cellComentario.textContent = comment.comentario;
                
                var cellDataHora = row.insertCell(3);
                cellDataHora.textContent = comment.data_hora;
            });
        } else {
            console.log("Erro ao carregar os comentários.");
        }
    };
    
    xhr.send();
};
