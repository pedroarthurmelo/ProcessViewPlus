<?php
// api.php

// Configurações de conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "grandezas";

// Definir cabeçalho de resposta JSON
header('Content-Type: application/json');

// Função para retornar erro em JSON
function returnError($message) {
    http_response_code(500);
    echo json_encode(['error' => $message]);
    exit;
}

// Criando a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificando a conexão
if ($conn->connect_error) {
    returnError("Erro de conexão: " . $conn->connect_error);
}

// Configurar charset para UTF-8
$conn->set_charset("utf8mb4");

// Consultas SQL para obter os dados
$sql_nome_ambiente = "SELECT * FROM nome_ambiente";
$result_nome_ambiente = $conn->query($sql_nome_ambiente);

// Verificar se a consulta foi bem-sucedida
if ($result_nome_ambiente === false) {
    returnError("Erro na consulta de ambientes: " . $conn->error);
}

$dados = [];

if ($result_nome_ambiente->num_rows > 0) {
    while($ambiente = $result_nome_ambiente->fetch_assoc()) {
        $ambienteData = [
            'id' => $ambiente['id'],
            'Nome' => $ambiente['Nome'],
            'classes' => []
        ];

        // Buscar classes para cada ambiente
        $stmt_classes = $conn->prepare("SELECT DISTINCT c.* 
                                       FROM classes c 
                                       JOIN variavel_classe_ambiente vca ON c.id_classe = vca.cd_classe 
                                       WHERE vca.cd_ambiente = ?");
        
        if ($stmt_classes === false) {
            returnError("Erro na preparação da consulta de classes: " . $conn->error);
        }
        
        $stmt_classes->bind_param("i", $ambiente['id']);
        $stmt_classes->execute();
        $result_classes = $stmt_classes->get_result();

        if ($result_classes->num_rows > 0) {
            while($classe = $result_classes->fetch_assoc()) {
                $classeData = [
                    'id_classe' => $classe['id_classe'],
                    'ds_Classe' => $classe['ds_Classe'],
                    'ds_Sufixo' => $classe['ds_Sufixo'],
                    'variaveis' => []
                ];

                // Buscar variáveis para cada classe
                $stmt_variaveis = $conn->prepare("SELECT DISTINCT v.* 
                                                 FROM variaveis v 
                                                 JOIN variavel_classe_ambiente vca ON v.id_variavel = vca.cd_variavel 
                                                 WHERE vca.cd_classe = ? AND vca.cd_ambiente = ?");
                
                if ($stmt_variaveis === false) {
                    returnError("Erro na preparação da consulta de variáveis: " . $conn->error);
                }
                
                $stmt_variaveis->bind_param("ii", $classe['id_classe'], $ambiente['id']);
                $stmt_variaveis->execute();
                $result_variaveis = $stmt_variaveis->get_result();

                if ($result_variaveis->num_rows > 0) {
                    while($variavel = $result_variaveis->fetch_assoc()) {
                        $classeData['variaveis'][] = [
                            'ds_TipoVariavel' => $variavel['ds_TipoVariavel'],
                            'ds_variavel' => $variavel['ds_variavel']
                        ];
                    }
                }

                $ambienteData['classes'][] = $classeData;
            }
        }

        $dados[] = $ambienteData;
    }
}

// Retornar os dados como JSON
echo json_encode($dados, JSON_UNESCAPED_UNICODE);

// Fechar a conexão
$stmt_classes->close();
$stmt_variaveis->close();
$conn->close();
?>