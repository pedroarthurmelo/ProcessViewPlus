<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['nome_ambiente'])) {
    // Configuração do banco de dados
    $host = 'localhost';
    $db = 'grandezas';
    $user = 'root';
    $password = '';

    try {
        // Conexão com o banco de dados
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $nome_ambiente = $_GET['nome_ambiente'];

        // Obter os dados do ambiente selecionado
        $stmt = $pdo->prepare("SELECT * FROM nome_ambiente WHERE Nome = :nome_ambiente");
        $stmt->execute([':nome_ambiente' => $nome_ambiente]);
        $ambiente = $stmt->fetch(PDO::FETCH_ASSOC);

        // Obter as variáveis associadas ao ambiente
        $stmt_variaveis = $pdo->prepare("SELECT v.ds_variavel, v.ds_TipoVariavel 
                                         FROM variaveis v 
                                         JOIN variavel_classe_ambiente vca ON v.id_variavel = vca.cd_variavel
                                         JOIN nome_ambiente na ON vca.cd_ambiente = na.id
                                         WHERE na.Nome = :nome_ambiente");
        $stmt_variaveis->execute([':nome_ambiente' => $nome_ambiente]);
        $variaveis = $stmt_variaveis->fetchAll(PDO::FETCH_ASSOC);

        // Retorna os dados do ambiente e variáveis
        echo json_encode([
            'success' => true,
            'ambiente' => $ambiente,
            'variaveis' => $variaveis
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
