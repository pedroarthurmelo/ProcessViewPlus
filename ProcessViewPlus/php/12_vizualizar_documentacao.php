<?php
$host = 'localhost';
$dbname = 'grandezas';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT data_hora, cliente, projeto, descricao FROM informacoes_projeto ORDER BY data_hora ASC");
    $informacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($informacoes);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>