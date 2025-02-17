<?php
header("Content-Type: application/json");

// Conectar ao banco de dados
$host = "localhost";
$user = "root";
$password = "";
$database = "grandezas";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Erro na conexão com o banco de dados"]);
    exit;
}

// Receber os dados do JavaScript
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['codigo_pm'])) {
    echo json_encode(["success" => false, "error" => "Código PM não informado"]);
    exit;
}

$codigoPm = $conn->real_escape_string($input['codigo_pm']);

// Deletar o registro
$sql = "DELETE FROM especificacoes_motor WHERE codigo_pm = '$codigoPm'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$conn->close();
?>
