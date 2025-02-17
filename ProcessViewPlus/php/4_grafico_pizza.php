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

// Verifica se as variáveis necessárias foram enviadas via POST
if (!isset($_POST['variaveis_selecionadas']) || 
    !isset($_POST['data_inicio']) || 
    !isset($_POST['data_fim']) || 
    !isset($_POST['hora_inicio']) || 
    !isset($_POST['hora_fim'])) {
    echo json_encode(['error' => 'Dados incompletos']);
    exit;
}

$variaveis_selecionadas = $_POST['variaveis_selecionadas'];
$data_inicio = $_POST['data_inicio'] . ' ' . $_POST['hora_inicio'];
$data_fim = $_POST['data_fim'] . ' ' . $_POST['hora_fim'];

$dados_grafico = [];
$total_geral = 0;

foreach ($variaveis_selecionadas as $variavel) {
    // Garantir que o split sempre funcione
    $partes = explode(",", $variavel);
    if (count($partes) < 5) {
        continue; // Pula variáveis mal formatadas
    }

    list($nome_ambiente, $classe, $sufixo, $tipo_variavel, $nome_variavel) = $partes;

    // Consulta com filtro pelo tipo da variável
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
    $result_valor = $stmt->get_result();

    if ($result_valor->num_rows > 0) {
        $row = $result_valor->fetch_assoc();
        $total_value = floatval($row['total_value']);
        
        if ($total_value > 0) { // Só adiciona valores positivos
            $total_geral += $total_value;

            $label = "{$nome_ambiente}.{$tipo_variavel}.{$classe}.{$nome_variavel}.{$sufixo}";
            $dados_grafico[] = [
                'label' => $label,
                'value' => $total_value
            ];
        }
    }
}

// Se nenhum dado for encontrado, retorna arrays vazios
if (empty($dados_grafico)) {
    echo json_encode([
        'labels' => [],
        'data' => [],
        'colors' => [],
        'message' => 'Nenhum dado encontrado para o período selecionado.'
    ]);
    $conn->close();
    exit;
}

// Gerar cores aleatórias seguras
$colors = array_map(function() {
    return sprintf('rgba(%d, %d, %d, 0.7)', 
        mt_rand(50, 200), 
        mt_rand(50, 200), 
        mt_rand(50, 200)
    );
}, $dados_grafico);

// Retornar os dados formatados para o JavaScript
echo json_encode([
    'labels' => array_column($dados_grafico, 'label'),
    'data' => array_column($dados_grafico, 'value'),
    'colors' => $colors,
    'message' => 'Dados gerados com sucesso.'
]);

$conn->close();
?>
