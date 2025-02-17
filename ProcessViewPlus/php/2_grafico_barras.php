<?php
// Configurações de conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

// Criando a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificando a conexão
if ($conn->connect_error) {
    die(json_encode(['error' => "Erro de conexão: " . $conn->connect_error]));
}

// Definindo data e hora padrão, caso não sejam enviadas
$data_inicio = isset($_POST['data_inicio']) ? $_POST['data_inicio'] : date('Y-m-d');
$hora_inicio = isset($_POST['hora_inicio']) ? $_POST['hora_inicio'] : "00:00";
$data_fim = isset($_POST['data_fim']) ? $_POST['data_fim'] : date('Y-m-d');
$hora_fim = isset($_POST['hora_fim']) ? $_POST['hora_fim'] : "23:59";

// Combina data e hora para os limites
$data_hora_inicio = $data_inicio . " " . $hora_inicio;
$data_hora_fim = $data_fim . " " . $hora_fim;

// Verifica se as variáveis foram enviadas
if (!isset($_POST['variaveis_selecionadas'])) {
    echo json_encode(['error' => 'Nenhuma variável selecionada.']);
    exit;
}

$variaveis_selecionadas = $_POST['variaveis_selecionadas'];

// Arrays para armazenar os dados do gráfico
$dados_grafico = [];
$labels_grafico = [];

foreach ($variaveis_selecionadas as $variavel) {
    $partes = explode(",", $variavel);
    if (count($partes) < 5) {
        continue; // Ignorar variáveis mal formatadas
    }

    list($nome_ambiente, $classe, $sufixo, $tipo_variavel, $nome_variavel) = $partes;

    $stmt = $conn->prepare("
        SELECT rg.DataHora, rg.Value 
        FROM registro_grandezas rg 
        JOIN nome_ambiente n ON rg.Id_amb = n.id 
        JOIN classes c ON rg.cdClasse = c.id_classe 
        JOIN variaveis v ON rg.cdVariavel = v.id_variavel 
        WHERE v.ds_TipoVariavel = ? AND c.ds_Classe = ? AND n.Nome = ? AND v.ds_variavel = ?
          AND rg.DataHora BETWEEN ? AND ? 
        ORDER BY rg.DataHora
    ");

    $stmt->bind_param("ssssss", $tipo_variavel, $classe, $nome_ambiente, $nome_variavel, $data_hora_inicio, $data_hora_fim);
    $stmt->execute();
    $result_valor = $stmt->get_result();

    if ($result_valor->num_rows > 0) {
        $dados_temporarios = [];
        while ($row = $result_valor->fetch_assoc()) {
            $dados_temporarios[] = $row['Value'];
            $labels_grafico[] = $row['DataHora'];
        }

        $label = "{$nome_ambiente}.{$tipo_variavel}.{$classe}.{$nome_variavel}.{$sufixo}";
        $dados_grafico[$label] = $dados_temporarios;
    }
}

// Fechando conexão
$conn->close();

// Se nenhum dado for encontrado
if (empty($dados_grafico)) {
    echo json_encode([
        'labels' => [],
        'datasets' => [],
        'message' => 'Nenhum dado encontrado para o período selecionado.'
    ]);
    exit;
}

// Preparando os dados para JSON
$response = [
    'labels' => array_values(array_unique($labels_grafico)), // Garantir rótulos únicos
    'datasets' => array_map(function ($label, $data) {
        return ['label' => $label, 'data' => $data];
    }, array_keys($dados_grafico), $dados_grafico)
];

header('Content-Type: application/json');
echo json_encode($response);
?>