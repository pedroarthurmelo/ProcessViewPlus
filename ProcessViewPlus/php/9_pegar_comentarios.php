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

// Capturar os parâmetros de data, se existirem
$dataInicio = isset($_GET['data_inicio']) ? $_GET['data_inicio'] : null;
$dataFim = isset($_GET['data_fim']) ? $_GET['data_fim'] : null;

// Construir a consulta SQL com ou sem filtro de data
if ($dataInicio && $dataFim) {
    $sql = "SELECT nome, matricula, comentario, data_hora 
            FROM comentarios 
            WHERE data_hora BETWEEN ? AND ? 
            ORDER BY data_hora DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $dataInicio, $dataFim);
} else {
    $sql = "SELECT nome, matricula, comentario, data_hora 
            FROM comentarios 
            ORDER BY data_hora DESC";
    $stmt = $conn->prepare($sql);
}

// Executar a consulta e armazenar os resultados
$stmt->execute();
$result = $stmt->get_result();

$comments = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }
} else {
    echo json_encode(["message" => "Nenhum comentário encontrado"]);
    exit();
}

// Retornar os dados em formato JSON
echo json_encode($comments);

// Fechar a conexão
$stmt->close();
$conn->close();
?>
