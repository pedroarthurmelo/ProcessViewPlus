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

$drive = $_POST['drive'] ?? '';
$codigo_cu = $_POST['codigo_cu'] ?? '';
$codigo_pm = $_POST['codigo_pm'] ?? '';
$motor = $_POST['motor'] ?? '';
$tensao = $_POST['tensao'] ?? 0;
$unidade_tensao = $_POST['unidade_tensao'] ?? '';
$corrente = $_POST['corrente'] ?? 0;
$unidade_corrente = $_POST['unidade_corrente'] ?? '';
$potencia = $_POST['potencia'] ?? 0;
$unidade_potencia = $_POST['unidade_potencia'] ?? '';
$rotacao = $_POST['rotacao'] ?? 0;
$unidade_rotacao = $_POST['unidade_rotacao'] ?? '';
$frequencia = $_POST['frequencia'] ?? 0;
$unidade_frequencia = $_POST['unidade_frequencia'] ?? '';

$sql = "INSERT INTO especificacoes_motor (drive, codigo_cu, codigo_pm, motor, tensao, unidade_tensao, corrente, unidade_corrente, potencia, unidade_potencia, rotacao, unidade_rotacao, frequencia, unidade_frequencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssdsssdsdsds", $drive, $codigo_cu, $codigo_pm, $motor, $tensao, $unidade_tensao, $corrente, $unidade_corrente, $potencia, $unidade_potencia, $rotacao, $unidade_rotacao, $frequencia, $unidade_frequencia);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
