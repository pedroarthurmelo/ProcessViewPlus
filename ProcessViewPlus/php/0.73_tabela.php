<?php
header('Content-Type: application/json');

// Conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Falha na conexão com o banco de dados"]);
    exit();
}

// Query para buscar o último valor de cada ds_Classe
$sql = "
    SELECT 
        rg.DataHora,
        na.Nome AS nome_ambiente,
        c.ds_Classe,
        c.ds_Sufixo,
        v.ds_TipoVariavel,
        v.ds_variavel,
        rg.Value
    FROM registro_grandezas rg
    INNER JOIN nome_ambiente na ON rg.Id_amb = na.id
    INNER JOIN classes c ON rg.cdClasse = c.id_classe
    INNER JOIN variaveis v ON rg.cdVariavel = v.id_variavel
    WHERE na.Nome = 'A0.03-View Gramatura'
      AND rg.DataHora = (
          SELECT MAX(sub_rg.DataHora)
          FROM registro_grandezas sub_rg
          INNER JOIN classes sub_c ON sub_rg.cdClasse = sub_c.id_classe
          WHERE sub_c.ds_Classe = c.ds_Classe
      )
    ORDER BY c.ds_Classe ASC
";

$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);

$conn->close();
?>
