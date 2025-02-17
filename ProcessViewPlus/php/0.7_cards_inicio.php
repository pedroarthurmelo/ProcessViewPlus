<?php
// arquivo: carregar_dados.php
header('Content-Type: application/json');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Consulta ajustada para pegar apenas o último valor de cada classe
$sql = "
    SELECT c.ds_Classe, rg.Value, c.ds_Sufixo, rg.DataHora as data_hora
    FROM registro_grandezas rg
    JOIN classes c ON rg.cdClasse = c.id_classe
    JOIN nome_ambiente na ON rg.Id_amb = na.id
    WHERE na.Nome = 'A0.00-View Geral'
    AND rg.DataHora = (
        SELECT MAX(DataHora)
        FROM registro_grandezas
        WHERE cdClasse = rg.cdClasse
    )
    ORDER BY c.ds_Classe
";

$result = $conn->query($sql);

$dados = [];
if ($result->num_rows > 0) {
    while ($data = $result->fetch_assoc()) {
        $dados[] = [
            'ds_Classe' => $data['ds_Classe'],
            'value' => $data['Value'],
            'ds_Sufixo' => $data['ds_Sufixo'],
            'data_hora' => $data['data_hora']
        ];
    }
    echo json_encode($dados);
} else {
    echo json_encode([]);
}

$conn->close();
?>
