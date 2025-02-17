<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Configuração do banco de dados
    $host = 'localhost';
    $db = 'grandezas';
    $user = 'root';
    $password = '';

    try {
        // Conexão com o banco de dados
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Dados do formulário
        $nome_ambiente = $_POST['nome_ambiente'];
        $cod = $_POST['cod'];
        $ds_classe = $_POST['ds_classe'];
        $ds_sufixo = $_POST['ds_sufixo'];
        $ds_tipo_variavel = $_POST['ds_tipo_variavel'];
        $data_hora = $_POST['data_hora'];
        $value_input = $_POST['value_input'];

        // Obter o ID do ambiente
        $stmt = $pdo->prepare("SELECT id FROM nome_ambiente WHERE Nome = :nome_ambiente");
        $stmt->execute([':nome_ambiente' => $nome_ambiente]);
        $ambiente = $stmt->fetch(PDO::FETCH_ASSOC);
        $id_ambiente = $ambiente['id'];

        // Obter o ID da variável usando ds_TipoVariavel
        $stmt_variavel = $pdo->prepare("SELECT id_variavel FROM variaveis WHERE ds_TipoVariavel = :ds_tipo_variavel");
        $stmt_variavel->execute([':ds_tipo_variavel' => $ds_tipo_variavel]);
        $variavel = $stmt_variavel->fetch(PDO::FETCH_ASSOC);
        $id_variavel = $variavel['id_variavel'];

        // Obter o ID da classe
        $stmt_classe = $pdo->prepare("SELECT id_classe FROM classes WHERE ds_Classe = :ds_classe");
        $stmt_classe->execute([':ds_classe' => $ds_classe]);
        $classe = $stmt_classe->fetch(PDO::FETCH_ASSOC);
        $id_classe = $classe['id_classe'];

        // Inserir os dados na tabela de registros
        $stmt_insert = $pdo->prepare("INSERT INTO registro_grandezas 
                                      (DataHora, Id_amb, cdVariavel, cdClasse, Value) 
                                      VALUES 
                                      (:data_hora, :id_ambiente, :id_variavel, :id_classe, :value_input)");
        $stmt_insert->execute([
            ':data_hora' => $data_hora,
            ':id_ambiente' => $id_ambiente,
            ':id_variavel' => $id_variavel,
            ':id_classe' => $id_classe,
            ':value_input' => $value_input
        ]);

        echo json_encode(['success' => true, 'message' => 'Dados inseridos com sucesso!']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
