<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Conexão com o banco de dados
    $host = 'localhost'; // seu host
    $db = 'grandezas'; // seu banco de dados
    $user = 'root'; // seu usuário
    $pass = ''; // sua senha

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Recebendo os dados do formulário
        $nome_cargo = $_POST['nome_cargo'];
        $descricao = $_POST['descricao'];

        // Inserindo no banco de dados
        $sql = "INSERT INTO cargos (nome_cargo, descricao) VALUES (:nome_cargo, :descricao)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nome_cargo', $nome_cargo);
        $stmt->bindParam(':descricao', $descricao);
        
        if ($stmt->execute()) {
            echo "Novo cargo criado com sucesso!";
        } else {
            echo "Erro ao criar cargo!";
        }
    } catch (PDOException $e) {
        echo "Erro de conexão: " . $e->getMessage();
    }
}
?>
