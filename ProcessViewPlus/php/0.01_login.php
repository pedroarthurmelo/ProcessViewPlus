<?php
// Conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

// Criando a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificando a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Recebe os dados do AJAX
$data = json_decode(file_get_contents('php://input'), true);

// Obtém o login e a senha
$login = $data['login'];
$senha = $data['senha'];

// Prepara a consulta SQL para verificar as credenciais
$sql = "SELECT * FROM usuarios WHERE login = ?";

// Prepara a declaração
$stmt = $conn->prepare($sql);

// Vincula o parâmetro
$stmt->bind_param("s", $login);

// Executa a consulta
$stmt->execute();

// Obtém o resultado
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Se o usuário for encontrado
    $row = $result->fetch_assoc();
    
    // Verifica se a senha está correta
    if (password_verify($senha, $row['senha'])) {
        // Retorna sucesso com nome completo
        echo json_encode([
            "success" => true,
            "nome_completo" => $row['nome_completo'] // Retorna o nome completo
        ]);
    } else {
        // Senha incorreta
        echo json_encode(["success" => false, "message" => "Senha incorreta"]);
    }
} else {
    // Usuário não encontrado
    echo json_encode(["success" => false, "message" => "Usuário não encontrado"]);
}

// Fechando a conexão
$stmt->close();
$conn->close();
?>
