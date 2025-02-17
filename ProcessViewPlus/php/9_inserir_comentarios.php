<?php
// Conectar ao banco de dados
$host = "localhost";
$dbname = "grandezas";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Verificar se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = mysqli_real_escape_string($conn, $_POST["nome"]);
    $matricula = mysqli_real_escape_string($conn, $_POST["matricula"]);
    $comentario = mysqli_real_escape_string($conn, $_POST["comentario"]);

    // Inserir os dados no banco de dados
    $sql = "INSERT INTO comentarios (nome, matricula, comentario) VALUES ('$nome', '$matricula', '$comentario')";

    if ($conn->query($sql) === TRUE) {
        // Retornar resposta em formato JSON
        echo json_encode(["message" => "Comentário inserido com sucesso!"]);
    } else {
        echo json_encode(["message" => "Erro ao inserir comentário: " . $conn->error]);
    }

    // Fechar a conexão
    $conn->close();
} else {
    echo json_encode(["message" => "Método de solicitação inválido."]);
}
?>
