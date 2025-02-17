<?php
$host = 'localhost';
$db = 'grandezas';
$user = 'root';
$password = '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['ds_classe'])) {
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $ds_classe = $_GET['ds_classe'];

        $stmt = $pdo->prepare("SELECT ds_sufixo FROM classes WHERE ds_classe = :ds_classe");
        $stmt->execute([':ds_classe' => $ds_classe]);
        $sufixo = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'sufixo' => $sufixo['ds_sufixo'] ?? '']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
