DROP DATABASE IF EXISTS grandezas;
CREATE DATABASE grandezas CHARACTER SET utf8 COLLATE utf8_general_ci;
use grandezas;


CREATE TABLE cargos (
    id INT NOT NULL AUTO_INCREMENT, 
    nome_cargo VARCHAR(255) NOT NULL,
    descricao TEXT,    
    PRIMARY KEY (id)                          
);

CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT,        
    nome_completo VARCHAR(150) NOT NULL,     
    login VARCHAR(100) NOT NULL UNIQUE,      
    senha VARCHAR(255) NOT NULL,             
    cargo_id INT,                            
    PRIMARY KEY (id),                        
    FOREIGN KEY (cargo_id) REFERENCES cargos(id)  
);

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    matricula VARCHAR(50) NOT NULL,
    comentario TEXT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: grandezas.nome_ambiente
DROP TABLE IF EXISTS nome_ambiente;
CREATE TABLE nome_ambiente (
  id INT NOT NULL AUTO_INCREMENT,
  cod DECIMAL(10, 2) NOT NULL,
  cod_rast INT,
  Endereco INT,
  Nome VARCHAR(150) NOT NULL,
  Tipo VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (cod, Nome) -- Adicionando uma chave única para cod e Nome
);

-- Tabela: grandezas.classes
DROP TABLE IF EXISTS classes;
CREATE TABLE classes (
  id_classe INT NOT NULL AUTO_INCREMENT,
  ds_Classe VARCHAR(40) NOT NULL,
  ds_Prefixo VARCHAR(10),
  ds_Sufixo VARCHAR(10),
  PRIMARY KEY (id_classe),
  UNIQUE KEY (ds_Classe, ds_Prefixo, ds_Sufixo) -- Chave única para evitar duplicatas
);

-- Tabela: grandezas.AmbientesExistentes
DROP TABLE IF EXISTS AmbientesExistentes;
CREATE TABLE AmbientesExistentes (
  id_amb INT NOT NULL,
  Flag INT DEFAULT 1,
  PRIMARY KEY (id_amb),
  CONSTRAINT ae_fk FOREIGN KEY (id_amb)
      REFERENCES nome_ambiente (id)
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Tabela: grandezas.variaveis
DROP TABLE IF EXISTS variaveis;
CREATE TABLE variaveis (
  id_variavel INT NOT NULL AUTO_INCREMENT,
  ds_variavel VARCHAR(20) NOT NULL,
  ds_TipoVariavel VARCHAR(50),
  PRIMARY KEY (id_variavel),
  UNIQUE KEY (ds_variavel, ds_TipoVariavel) -- Chave única para evitar duplicatas
);

-- Tabela: grandezas.registro_grandezas
DROP TABLE IF EXISTS registro_grandezas;
CREATE TABLE registro_grandezas (
  DataHora DATETIME NOT NULL,
  Id_amb INT NOT NULL,
  cdVariavel INT NOT NULL,
  cdClasse INT NOT NULL,
  Value DECIMAL(15, 2) NOT NULL,
  Valido INT DEFAULT 1,
  cd_comentario INT,
  PRIMARY KEY (DataHora, Id_amb, cdVariavel, cdClasse),
  CONSTRAINT reg_grandezas_classe_fk FOREIGN KEY (cdClasse)
      REFERENCES classes (id_classe)
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT reg_grandezas_nome_ambiente_fk FOREIGN KEY (Id_amb)
      REFERENCES nome_ambiente (id)
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT reg_grandezas_variavel_fk FOREIGN KEY (cdVariavel)
      REFERENCES variaveis (id_variavel)
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Tabela: grandezas.variavel_classe_ambiente
DROP TABLE IF EXISTS variavel_classe_ambiente;
CREATE TABLE variavel_classe_ambiente (
  cd_variavel INT NOT NULL,
  cd_classe INT NOT NULL,
  cd_ambiente INT NOT NULL,
  flag INT DEFAULT 1,
  esporadico INT DEFAULT 0,
  PRIMARY KEY (cd_variavel, cd_classe, cd_ambiente),
  CONSTRAINT classes_assoc_fk FOREIGN KEY (cd_classe)
      REFERENCES classes (id_classe)
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT na_fk FOREIGN KEY (cd_ambiente)
      REFERENCES nome_ambiente (id)
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT variavel_assoc_fk FOREIGN KEY (cd_variavel)
      REFERENCES variaveis (id_variavel)
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT amb_fk FOREIGN KEY (cd_ambiente)
      REFERENCES AmbientesExistentes (id_amb)
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE especificacoes_motor (
    drive VARCHAR(50),
    codigo_cu VARCHAR(50),
    codigo_pm VARCHAR(50),
    motor VARCHAR(50),
    tensao DECIMAL(10, 1),
    unidade_tensao VARCHAR(5),
    corrente DECIMAL(10, 1),
    unidade_corrente VARCHAR(5),
    potencia DECIMAL(10, 1),
    unidade_potencia VARCHAR(5),
    rotacao INT,
    unidade_rotacao VARCHAR(5),
    frequencia INT,
    unidade_frequencia VARCHAR(5),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE informacoes_projeto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente VARCHAR(255) NOT NULL,
    projeto VARCHAR(50) NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

DELIMITER //

CREATE PROCEDURE atualiza_registros(
    IN p_nome_ambiente VARCHAR(150),
    IN p_cod DECIMAL(10, 2),
    IN p_tipo VARCHAR(45),
    IN p_ds_classe VARCHAR(40),
    IN p_ds_prefixo VARCHAR(10),
    IN p_ds_sufixo VARCHAR(10),
    IN p_ds_variavel VARCHAR(20),
    IN p_ds_tipo_variavel VARCHAR(50),
    IN p_data_hora DATETIME,
    IN p_value_input VARCHAR(50), -- Valor como string para permitir entrada flexível
    IN p_id_amb INT,
    IN p_cd_variavel INT,
    IN p_cd_classe INT
)
BEGIN
    DECLARE v_value DECIMAL(15, 2); -- Valor convertido
    DECLARE v_id_amb INT;
    DECLARE v_id_classe INT;
    DECLARE v_id_variavel INT;
    DECLARE v_id_assoc INT;

    -- Tenta converter o valor de entrada para DECIMAL
    SET v_value = CAST(p_value_input AS DECIMAL(15, 2));

    -- Atualiza ou insere o ambiente
    INSERT INTO nome_ambiente (cod, Nome, Tipo)
    VALUES (p_cod, p_nome_ambiente, p_tipo)
    ON DUPLICATE KEY UPDATE 
        Tipo = VALUES(Tipo);

    -- Obtém o ID do ambiente atualizado
    SELECT id INTO v_id_amb FROM nome_ambiente WHERE cod = p_cod AND Nome = p_nome_ambiente;

    -- Atualiza ou insere na tabela AmbientesExistentes com o ID do ambiente atualizado
    INSERT INTO AmbientesExistentes (id_amb)
    VALUES (v_id_amb)
    ON DUPLICATE KEY UPDATE 
        id_amb = VALUES(id_amb);

    -- Atualiza ou insere a classe
    INSERT INTO classes (ds_Classe, ds_Prefixo, ds_Sufixo)
    VALUES (p_ds_classe, p_ds_prefixo, p_ds_sufixo)
    ON DUPLICATE KEY UPDATE 
        ds_Prefixo = VALUES(ds_Prefixo),
        ds_Sufixo = VALUES(ds_Sufixo);

    SELECT id_classe INTO v_id_classe FROM classes WHERE ds_Classe = p_ds_classe AND ds_Prefixo = p_ds_prefixo AND ds_Sufixo = p_ds_sufixo;

    -- Atualiza ou insere a variável
    INSERT INTO variaveis (ds_variavel, ds_TipoVariavel)
    VALUES (p_ds_variavel, p_ds_tipo_variavel)
    ON DUPLICATE KEY UPDATE 
        ds_TipoVariavel = VALUES(ds_TipoVariavel);

    SELECT id_variavel INTO v_id_variavel FROM variaveis WHERE ds_variavel = p_ds_variavel AND ds_TipoVariavel = p_ds_tipo_variavel;

    -- Verifica se a associação entre variável, classe e ambiente já existe
    SELECT cd_variavel INTO v_id_assoc 
    FROM variavel_classe_ambiente 
    WHERE cd_variavel = v_id_variavel AND cd_classe = v_id_classe AND cd_ambiente = v_id_amb;

    IF v_id_assoc IS NULL THEN
        INSERT INTO variavel_classe_ambiente (cd_variavel, cd_classe, cd_ambiente, flag)
        VALUES (v_id_variavel, v_id_classe, v_id_amb, 1);
    END IF;

    -- Insere o registro de grandezas
    INSERT INTO registro_grandezas (DataHora, Id_amb, cdVariavel, cdClasse, Value)
    VALUES (p_data_hora, v_id_amb, v_id_variavel, v_id_classe, v_value)
    ON DUPLICATE KEY UPDATE 
        Value = VALUES(Value);
END //

DELIMITER ;




use grandezas;
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Número Bobina', '', 'n°', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Gramatura', '', 'g/m²', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Umidade', '', '%', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Cobb Teste', '', 'g/H²O 120s', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Rct', '', 'kgf', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Cmt', '', 'kgf', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Mullen', '', 'lbs/kgf', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Elongação', '', '%', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Tração', '', 'kgf', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Tea', '', 'Joule/m²', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Dobras Duplas', '', '', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('L3.00-Laboratório', 03.00, '', 'Elmedof', '', 'g/m²', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);

use grandezas;
CALL atualiza_registros('R4.00-Laboratório', 03.00, '', 'Elmedof', '', 'g/m²', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('B3.00-Laboratório', 03.00, '', 'Elmedof', '', 'g/m²', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);
CALL atualiza_registros('R3.00-Laboratório', 03.00, '', 'Elmedof', '', 'g/m²', 'PV', 'Laboratório', NOW(), 0, NULL, NULL, NULL);






