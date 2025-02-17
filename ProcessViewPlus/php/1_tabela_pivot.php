<?php
header("Content-Type: application/json");

// Database connection details
$servername = "localhost";
$username = "root";
$password = ""; // Update as needed
$dbname = "grandezas";

// Creating the connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "error" => "Connection failed",
        "details" => $conn->connect_error
    ]);
    exit;
}

// Receive data sent by JavaScript
$data = json_decode(file_get_contents("php://input"), true);

// Validate input data
if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON data"]);
    exit;
}

$data_inicio = $data['data_inicio'] ?? null;
$hora_inicio = $data['hora_inicio'] ?? '00:00';
$data_fim = $data['data_fim'] ?? null;
$hora_fim = $data['hora_fim'] ?? '23:59';
$variaveis_selecionadas = $data['variaveis_selecionadas'] ?? [];

// Validate required fields
if (!$data_inicio || !$data_fim || empty($variaveis_selecionadas)) {
    http_response_code(400);
    echo json_encode([
        "error" => "Missing required parameters",
        "details" => [
            "data_inicio" => $data_inicio,
            "data_fim" => $data_fim,
            "variaveis_selecionadas_count" => count($variaveis_selecionadas)
        ]
    ]);
    exit;
}

$data_hora_inicio = $data_inicio . " " . $hora_inicio;
$data_hora_fim = $data_fim . " " . $hora_fim;

$resultados = [];

// Ensure only selected variables are processed
foreach ($variaveis_selecionadas as $variavel) {
    $parts = explode(",", $variavel);
    if (count($parts) !== 5) {
        continue;
    }

    list($nome_ambiente, $classe, $sufixo, $tipo_variavel, $nome_variavel) = $parts;

    $stmt = $conn->prepare("
        SELECT 
            n.Nome AS Area,
            c.ds_Classe AS Medida,
            c.ds_Sufixo AS Unidade,
            v.ds_TipoVariavel AS Equipamento,
            v.ds_variavel AS Variavel,
            rg.Value AS Valor,
            rg.DataHora AS DataHora
        FROM registro_grandezas rg
        JOIN nome_ambiente n ON rg.Id_amb = n.id
        JOIN classes c ON rg.cdClasse = c.id_classe
        JOIN variaveis v ON rg.cdVariavel = v.id_variavel
        WHERE n.Nome = ? AND c.ds_Classe = ? AND v.ds_TipoVariavel = ? AND v.ds_variavel = ?
        AND rg.DataHora BETWEEN ? AND ?
        ORDER BY rg.DataHora
    ");

    $stmt->bind_param("ssssss", $nome_ambiente, $classe, $tipo_variavel, $nome_variavel, $data_hora_inicio, $data_hora_fim);
    $stmt->execute();

    $result_valor = $stmt->get_result();

    while ($row = $result_valor->fetch_assoc()) {
        $resultados[] = $row;
    }

    $stmt->close();
}

// Return results or empty array
echo json_encode($resultados);

$conn->close();
?>
