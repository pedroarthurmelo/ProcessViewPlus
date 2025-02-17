<?php
$host = 'localhost';
$db = 'grandezas';
$user = 'root';
$password = '';

$conn = new mysqli($host, $user, $password, $db);

if ($conn->connect_error) {
    echo json_encode(['error' => "Conexão falhou: " . $conn->connect_error]);
    exit();
}

$usuarioId = $_GET['usuario_id'];

if (!isset($usuarioId)) {
    echo json_encode(['error' => 'Usuário não especificado']);
    exit();
}

$stmt = $conn->prepare("SELECT area FROM permissoes WHERE usuario_id = ? AND permitido = 1");
$stmt->bind_param("i", $usuarioId);
$stmt->execute();
$result = $stmt->get_result();

$areas = [];
while ($row = $result->fetch_assoc()) {
    $areas[] = $row['area'];
}

$stmt->close();
$conn->close();

echo json_encode($areas);
?>
