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

// Verificar o método da requisição
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Receber os dados do JavaScript
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['id'])) {
        echo json_encode(["success" => false, "error" => "ID do registro não informado"]);
        exit;
    }

    $id = $conn->real_escape_string($input['id']);

    // Deletar o registro
    $sql = "DELETE FROM informacoes_projeto WHERE id = '$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retornar todos os registros para exibição em ordem crescente
    $sql = "SELECT id, data_hora, cliente, projeto, descricao FROM informacoes_projeto ORDER BY data_hora ASC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo json_encode([]);
    }
}

$conn->close();
?>
