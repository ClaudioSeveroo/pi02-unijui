const express = require('express');
const mysql = require('mysql2');

const app = express();
// Permite que o servidor entenda o formato JSON
app.use(express.json()); 

// 1. Configurar a conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',       // Se o banco estiver na sua máquina
    user: 'root',            // Seu usuário do MySQL
    password: 'claudio_2006',            // Coloque a senha do seu banco aqui (ou deixe vazia se não usar)
    database: 'fazenda_db'   // O nome do banco
});

// 2. Conectar ao MySQL
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

// Rota raiz opcional para teste inicial
app.get('/', (req, res) => {
    res.send('Servidor da Fazenda Leiteira rodando! Acesse /dados para ver o histórico.');
});

// 3. Rota GET para visualizar os dados no navegador
app.get('/dados', (req, res) => {
    const query = 'SELECT * FROM leituras_sensores ORDER BY data_hora DESC LIMIT 10';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar dados.');
        }
        res.json(results);
    });
});

// 4. Rota POST para receber os dados do simulador Python (ou ESP32) e salvar no banco
app.post('/receber', (req, res) => {
    const { 
        dispositivo_id, 
        temperatura, 
        umidade, 
        indice_ith, 
        gas_bruto, 
        alerta_gas,
        nivel_agua, 
        ph_agua, 
        brinco_rfid_vaca, 
        condutividade_leite, 
        alerta_mastite 
    } = req.body;

    const query = `
        INSERT INTO leituras_sensores 
        (dispositivo_id, temperatura, umidade, indice_ith, gas_bruto, alerta_gas, nivel_agua, ph_agua, brinco_rfid_vaca, condutividade_leite, alerta_mastite) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        dispositivo_id, 
        temperatura, 
        umidade, 
        indice_ith, 
        gas_bruto, 
        alerta_gas,
        nivel_agua, 
        ph_agua, 
        brinco_rfid_vaca, 
        condutividade_leite, 
        alerta_mastite
    ], (err, results) => {
        if (err) {
            console.error('Erro ao salvar no banco:', err);
            return res.status(500).send('Erro interno do servidor.');
        }
        res.send('Dados salvos com sucesso!');
    });
});

// 5. Ligar o servidor na porta 3000
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em: http://localhost:${PORTA}`);
});