<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Erro na conexão com o banco de dados"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login = $_POST['login'];
    $senha = $_POST['senha'];

    // Consulta o usuário
    $query = "SELECT u.id, u.nome_completo, u.senha, c.nome_cargo 
              FROM usuarios u 
              LEFT JOIN cargos c ON u.cargo_id = c.id 
              WHERE u.login = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($senha, $user['senha'])) {
            echo json_encode([
                'success' => true,
                'message' => 'Login realizado com sucesso!',
                'cargo' => $user['nome_cargo']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Senha incorreta.'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Usuário não encontrado.'
        ]);
    }
}
?>

