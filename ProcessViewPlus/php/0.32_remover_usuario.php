<?php
$host = 'localhost';
$db = 'grandezas';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Receber os dados via JSON
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];

    // Remover o usuário
    $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = :id");
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        echo "Usuário removido com sucesso!";
    } else {
        echo "Erro ao remover o usuário.";
    }
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
