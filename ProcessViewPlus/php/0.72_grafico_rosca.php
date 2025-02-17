<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Erro na conexão com o banco de dados"]);
    exit;
}

// Query para buscar os dados do ambiente "A0.01-View Consumo"
$sql = "
    SELECT
        c.ds_Classe,
        c.ds_Sufixo,
        rg.Value
    FROM registro_grandezas rg
    INNER JOIN nome_ambiente na ON rg.Id_amb = na.id
    INNER JOIN classes c ON rg.cdClasse = c.id_classe
    WHERE na.Nome = 'A0.01-View Consumo'
    ORDER BY rg.DataHora DESC
    LIMIT 5
";

$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "ds_Classe" => $row["ds_Classe"],
            "ds_Sufixo" => $row["ds_Sufixo"],
            "Value" => $row["Value"],
        ];
    }
}

echo json_encode($data);

$conn->close();
?>
