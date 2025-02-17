<?php
header('Content-Type: application/json');

// Configurações de conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

// Criando a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificando a conexão
if ($conn->connect_error) {
    die(json_encode(["error" => "Erro de conexão: " . $conn->connect_error]));
}

// Recebe os dados via POST
$data = json_decode(file_get_contents('php://input'), true);

$sankeyData = [];

// Verifica se os dados necessários foram recebidos
if (isset($data['variaveis_selecionadas']) && 
    isset($data['data_inicio']) && 
    isset($data['data_fim']) && 
    isset($data['hora_inicio']) && 
    isset($data['hora_fim'])) {

    $variaveis_selecionadas = $data['variaveis_selecionadas'];
    $data_inicio = $data['data_inicio'] . ' ' . $data['hora_inicio'];
    $data_fim = $data['data_fim'] . ' ' . $data['hora_fim'];

    // Itera sobre as variáveis selecionadas
    foreach ($variaveis_selecionadas as $variavel) {
        // Separa os componentes da variável
        list($nome_ambiente, $classe, $sufixo, $tipo_variavel, $nome_variavel) = explode(",", $variavel);

        // Preparação da consulta SQL
        $stmt = $conn->prepare("
            SELECT SUM(rg.Value) as total_value 
            FROM registro_grandezas rg 
            JOIN nome_ambiente n ON rg.Id_amb = n.id 
            JOIN classes c ON rg.cdClasse = c.id_classe 
            JOIN variaveis v ON rg.cdVariavel = v.id_variavel 
            WHERE v.ds_variavel = ? AND c.ds_Classe = ? AND n.Nome = ? AND v.ds_TipoVariavel = ?
            AND rg.DataHora BETWEEN ? AND ?
        ");

        $stmt->bind_param("ssssss", $nome_variavel, $classe, $nome_ambiente, $tipo_variavel, $data_inicio, $data_fim);
        $stmt->execute();
        $result = $stmt->get_result();

        // Processamento dos resultados
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $total_value = $row['total_value'];

            // Cria dados para o Sankey (De, Para, Valor)
            $sankeyData[] = [
                $nome_ambiente, 
                $nome_variavel . " (" . $tipo_variavel . " - " . $classe . " - " . $sufixo . ")", 
                floatval($total_value)
            ];
        }
    }
}

// Retorna os dados em formato JSON
echo json_encode($sankeyData);
$conn->close();
?>
