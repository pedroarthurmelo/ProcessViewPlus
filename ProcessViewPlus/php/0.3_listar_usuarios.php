<?php
$host = 'localhost';
$db = 'grandezas';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consultar os usuários
    $stmt = $pdo->query("SELECT id, nome_completo FROM usuarios");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retornar os usuários como JSON
    echo json_encode($usuarios);
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
