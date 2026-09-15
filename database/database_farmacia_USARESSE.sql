CREATE DATABASE fazenda_db;
USE fazenda_db;

-- 1. TABELA DE DISPOSITIVOS
CREATE TABLE dispositivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    modulo ENUM('AMBIENTE', 'BEBEDOURO', 'ORDENHA') NOT NULL,
    localizacao VARCHAR(100)
);

-- 2. TABELA DE LEITURAS
CREATE TABLE leituras_sensores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dispositivo_id INT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Ambiente
    temperatura DECIMAL(4,2),
    umidade DECIMAL(4,2),
    indice_ith DECIMAL(5,2),
    gas_bruto INT,
    alerta_gas BOOLEAN DEFAULT FALSE,
    
    -- Bebedouro
    nivel_agua DECIMAL(5,2),
    ph_agua DECIMAL(3,2),
    
    -- Ordenha
    brinco_rfid_vaca VARCHAR(30),
    condutividade_leite DECIMAL(5,2),
    alerta_mastite BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id)
);

INSERT INTO dispositivos (nome, modulo, localizacao) VALUES 
('Sensor Ambiente 01', 'AMBIENTE', 'Galpão Principal'),
('Sensor Bebedouro 01', 'BEBEDOURO', 'Pasto A'),
('Sensor Ordenha 01', 'ORDENHA', 'Sala de Ordenha');

SELECT * FROM leituras_sensores;
