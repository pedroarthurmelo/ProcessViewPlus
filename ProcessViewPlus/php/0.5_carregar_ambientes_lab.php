<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Configuração do banco de dados
    $host = 'localhost';
    $db = 'grandezas';
    $user = 'root';
    $password = '';

    try {
        // Conexão com o banco de dados
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Consulta para obter todos os ambientes
        $stmt = $pdo->prepare("SELECT id, Nome FROM nome_ambiente");
        $stmt->execute();
        $ambientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'ambientes' => $ambientes]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
