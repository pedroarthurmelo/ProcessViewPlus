<?php
header("Content-Type: application/json");

$host = "localhost"; // Altere conforme necessário
$user = "root"; // Altere conforme necessário
$password = ""; // Altere conforme necessário
$database = "grandezas"; // Altere conforme necessário

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Erro ao conectar ao banco de dados: " . $conn->connect_error]);
    exit;
}

$cliente = $_POST['cliente'] ?? '';
$projeto = $_POST['projeto'] ?? '';
$descricao = $_POST['descricao'] ?? '';

if (empty($cliente) || empty($projeto) || empty($descricao)) {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos."]);
    exit;
}

$sql = "INSERT INTO informacoes_projeto (cliente, projeto, descricao) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $cliente, $projeto, $descricao);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
