<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => "Conexão falhou: " . $conn->connect_error]);
    exit();
}

$ambienteId = isset($_GET['id']) ? (int)$_GET['id'] : null;
$dataInicio = isset($_GET['data_inicio']) ? $_GET['data_inicio'] : null;
$dataFim = isset($_GET['data_fim']) ? $_GET['data_fim'] : null;

try {
    if (!$ambienteId) throw new Exception("Ambiente ID é obrigatório.");
    $dateCondition = $dataInicio && $dataFim ? "AND DATE(DataHora) BETWEEN ? AND ?" : "";

    $sql = "
        SELECT rg.DataHora, c.ds_Classe, c.ds_Sufixo, rg.Value
        FROM registro_grandezas rg
        JOIN classes c ON c.id_classe = rg.cdClasse
        WHERE rg.Id_amb = ? $dateCondition
        ORDER BY rg.DataHora ASC";

    $stmt = $conn->prepare($sql);
    if ($dataInicio && $dataFim) $stmt->bind_param("iss", $ambienteId, $dataInicio, $dataFim);
    else $stmt->bind_param("i", $ambienteId);

    $stmt->execute();
    $result = $stmt->get_result();
    $dados = [];
    while ($row = $result->fetch_assoc()) $dados[] = $row;

    echo json_encode($dados);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>
