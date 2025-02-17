
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

$servername = "localhost";
$username = "root"; // Substitua pelo seu usuário do MySQL
$password = ""; // Substitua pela sua senha do MySQL
$dbname = "grandezas"; // Substitua pelo nome do seu banco de dados

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => "Conexão falhou: " . $conn->connect_error]);
    exit();
}

// Captura dos parâmetros
$ambienteId = isset($_GET['id']) ? (int)$_GET['id'] : null;
$dataInicio = isset($_GET['data_inicio']) ? $_GET['data_inicio'] : null;
$dataFim = isset($_GET['data_fim']) ? $_GET['data_fim'] : null;

try {
    if ($ambienteId === null) {
        throw new Exception("Ambiente ID é obrigatório.");
    }

    // Condição para as datas
    $dateCondition = $dataInicio && $dataFim ? "AND DATE(DataHora) BETWEEN ? AND ?" : "AND DATE(DataHora) = CURDATE()";

    $sql = "
        SELECT a.Nome AS nome_ambiente, c.ds_Classe, c.ds_Sufixo, 
               (SELECT Value FROM registro_grandezas 
                WHERE Id_amb = ? AND cdClasse = c.id_classe 
                $dateCondition
                ORDER BY DataHora DESC LIMIT 1) as UltimoValor
        FROM registro_grandezas rg
        JOIN classes c ON c.id_classe = rg.cdClasse
        JOIN nome_ambiente a ON a.id = rg.Id_amb
        WHERE rg.Id_amb = ?
        GROUP BY c.ds_Classe, c.ds_Sufixo";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Erro ao preparar a query: " . $conn->error);
    }

    // Verificação para datas
    if ($dataInicio && $dataFim) {
        $stmt->bind_param("issi", $ambienteId, $dataInicio, $dataFim, $ambienteId);
    } else {
        $stmt->bind_param("ii", $ambienteId, $ambienteId);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $dados = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($dados);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>