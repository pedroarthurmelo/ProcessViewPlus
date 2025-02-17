<?php
// Conectar ao banco de dados
$host = 'localhost';
$db = 'grandezas';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consultar os cargos
    $stmt = $pdo->query("SELECT id, nome_cargo FROM cargos");
    $cargos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retornar os cargos como JSON
    echo json_encode($cargos);
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
