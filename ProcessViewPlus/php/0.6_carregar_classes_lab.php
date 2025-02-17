<?php
// Configuração do banco de dados
$host = 'localhost';
$db = 'grandezas';
$user = 'root';
$password = '';

try {
    // Conexão com o banco de dados
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta para buscar todas as classes
    $stmt = $pdo->query("SELECT DISTINCT ds_classe FROM classes");
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retorna as classes no formato JSON
    echo json_encode([
        'success' => true,
        'classes' => $classes
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
