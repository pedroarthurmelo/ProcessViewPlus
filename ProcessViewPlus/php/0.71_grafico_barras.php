<?php
header('Content-Type: application/json');

try {
    $conn = new PDO("mysql:host=localhost;dbname=grandezas;charset=utf8", "root", ""); // Ajuste usuário e senha
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "
        SELECT c.ds_Classe, rg.Value AS value, c.ds_Sufixo
        FROM registro_grandezas rg
        INNER JOIN nome_ambiente na ON rg.Id_amb = na.id
        INNER JOIN classes c ON rg.cdClasse = c.id_classe
        WHERE na.Nome = 'A0.02-View Produção'
          AND rg.DataHora = (
              SELECT MAX(sub_rg.DataHora)
              FROM registro_grandezas sub_rg
              WHERE sub_rg.cdClasse = rg.cdClasse
          )
        ORDER BY c.ds_Classe ASC;
    ";
    $stmt = $conn->query($query);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
