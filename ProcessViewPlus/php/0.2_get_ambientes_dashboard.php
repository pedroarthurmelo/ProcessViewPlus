<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

$servername = "localhost";
$username = "root"; // Replace with your MySQL username
$password = ""; // Replace with your MySQL password
$dbname = "grandezas"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => "Conexão falhou: " . $conn->connect_error]);
    exit();
}

try {
    $sql = "SELECT id, Nome AS nome_ambiente FROM nome_ambiente";
    $result = $conn->query($sql);
    $ambientes = [];
    while ($row = $result->fetch_assoc()) {
        $ambientes[] = $row;
    }
    echo json_encode($ambientes);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $conn->close();
}
?>