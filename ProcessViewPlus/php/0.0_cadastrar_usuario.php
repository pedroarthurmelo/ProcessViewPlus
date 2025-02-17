<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Conectar ao banco de dados
    $host = 'localhost';
    $db = 'grandezas';
    $user = 'root';
    $pass = '';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Receber os dados do formulário
        $nome_completo = $_POST['nome_completo'];
        $login = $_POST['login'];
        $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT); // Hash da senha
        $cargo_id = $_POST['cargo'];

        // Inserir os dados no banco de dados
        $sql = "INSERT INTO usuarios (nome_completo, login, senha, cargo_id) 
                VALUES (:nome_completo, :login, :senha, :cargo_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nome_completo', $nome_completo);
        $stmt->bindParam(':login', $login);
        $stmt->bindParam(':senha', $senha);
        $stmt->bindParam(':cargo_id', $cargo_id);

        if ($stmt->execute()) {
            echo "Usuário cadastrado com sucesso!";
        } else {
            echo "Erro ao cadastrar o usuário.";
        }
    } catch (PDOException $e) {
        echo "Erro de conexão: " . $e->getMessage();
    }
}
?>
