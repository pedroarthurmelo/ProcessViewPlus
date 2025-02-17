<?php
header('Content-Type: application/json');

// Conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Lê os dados do corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

$data_inicio = $data['data_inicio'] ?? null;
$hora_inicio = $data['hora_inicio'] ?? '00:00:00';
$data_fim = $data['data_fim'] ?? null;
$hora_fim = $data['hora_fim'] ?? '23:59:59';
$variaveis_selecionadas = $data['variaveis_selecionadas'] ?? [];

if (!$data_inicio || !$data_fim || empty($variaveis_selecionadas)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters']);
    exit;
}

$data_hora_inicio = $data_inicio . ' ' . $hora_inicio;
$data_hora_fim = $data_fim . ' ' . $hora_fim;

$sql = "SELECT rg.DataHora AS Hora";
$bind_params = [];
$headers = ['Hora'];

// Gerar as colunas dinamicamente com CASE WHEN
foreach ($variaveis_selecionadas as $key => $variavel) {
    $parts = explode(',', $variavel);
    if (count($parts) !== 5) {
        continue;
    }
    list($nome_ambiente, $classe, $sufixo, $tipo_variavel, $nome_variavel) = $parts;

    $alias = "col$key";
    $sql .= ", MAX(CASE 
                    WHEN na.Nome = ? 
                         AND cl.ds_Classe = ? 
                         AND va.ds_variavel = ? 
                    THEN CONCAT(rg.Value, ' ', cl.ds_Sufixo) -- Concatenando o valor com o sufixo
                ELSE NULL END) AS $alias";
    $headers[] = "$nome_ambiente.$tipo_variavel.$classe.$nome_variavel";

    $bind_params[] = $nome_ambiente;
    $bind_params[] = $classe;
    $bind_params[] = $nome_variavel;
}

$sql .= " FROM registro_grandezas rg
          JOIN nome_ambiente na ON rg.Id_amb = na.id
          JOIN classes cl ON rg.cdClasse = cl.id_classe
          JOIN variaveis va ON rg.cdVariavel = va.id_variavel
          WHERE rg.DataHora BETWEEN ? AND ?
          GROUP BY rg.DataHora
          ORDER BY rg.DataHora";

$bind_params = array_merge($bind_params, [$data_hora_inicio, $data_hora_fim]);

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'SQL prepare failed: ' . $conn->error]);
    exit;
}

$types = str_repeat('s', count($bind_params));
$stmt->bind_param($types, ...$bind_params);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'SQL execute failed: ' . $stmt->error]);
    exit;
}

$result = $stmt->get_result();
$rows = $result->fetch_all(MYSQLI_ASSOC);

// Envia os dados no formato correto
echo json_encode(['headers' => $headers, 'data' => $rows]);

$stmt->close();
$conn->close();
?>
