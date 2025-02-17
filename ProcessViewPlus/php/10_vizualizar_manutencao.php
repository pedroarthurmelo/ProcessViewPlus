<?php
$host = 'localhost';
$dbname = 'grandezas';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta incluindo a data_hora
    $stmt = $pdo->query("SELECT data_hora, drive, codigo_cu, codigo_pm, motor, 
                     CONCAT(tensao, ' ', unidade_tensao) AS tensao,
                     CONCAT(corrente, ' ', unidade_corrente) AS corrente,
                     CONCAT(potencia, ' ', unidade_potencia) AS potencia, 
                     CONCAT(rotacao, ' ', unidade_rotacao) AS rotacao, 
                     CONCAT(frequencia, ' ', unidade_frequencia) AS frequencia 
                     FROM especificacoes_motor 
                     ORDER BY data_hora ASC"); // Alterado para ASC


    $especificacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($especificacoes);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
