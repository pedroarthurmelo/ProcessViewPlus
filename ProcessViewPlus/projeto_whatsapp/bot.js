const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mysql = require('mysql');

app.use(express.json());
app.use(cors());

let isConnected = false;
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'grandezas',
    port: 3306
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('MySQL connection successful');
});

const client = new Client({
    authStrategy: new LocalAuth(),
    webCache: false,
    puppeteer: {
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    isConnected = false;
    qrcode.generate(qr, { small: true });
    io.emit('qr', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
    isConnected = true;
    io.emit('ready');
});

client.initialize().catch(err => {
    console.error('Failed to initialize client:', err);
});

app.get('/status', (req, res) => {
    res.json({ isConnected });
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(require.resolve('socket.io-client/dist/socket.io.js'));
});

client.on('disconnected', (reason) => {
    console.log('Client disconnected:', reason);
    isConnected = false;
    io.emit('disconnected');

    setTimeout(() => {
        client.initialize().catch(err => {
            console.error('Failed to reinitialize client:', err);
        });
    }, 5000);
});

const userConversationState = {};

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('pt-BR', options);
}

client.on('message', async (message) => {
    if (!message.isGroupMsg && !message.fromMe) {
        const userNumber = message.from;

        if (!userConversationState[userNumber]) {
            userConversationState[userNumber] = { step: 'initial', selectedEnvironment: null };
        }

        const userState = userConversationState[userNumber];

        if (message.body.toLowerCase() === 'oi' && userState.step === 'initial') {
            connection.query('SELECT id, Nome FROM nome_ambiente', (error, results) => {
                if (error) {
                    console.error('Database query error:', error);
                    client.sendMessage(message.from, 'Erro ao buscar os ambientes no banco de dados.');
                    return;
                }

                if (results.length > 0) {
                    const listaAmbientes = results.map(row => `${row.id}. ${row.Nome}`).join('\n');
                    const resposta = `Olá! Aqui estão os ambientes disponíveis:\n${listaAmbientes}\n\nDigite o ID do ambiente que deseja selecionar ou "voltar" para reiniciar.`;
                    client.sendMessage(message.from, resposta);
                    userState.step = 'waiting_environment';
                    userState.environments = results;
                } else {
                    client.sendMessage(message.from, 'Nenhum ambiente encontrado no banco de dados.');
                }
            });
        } else if (userState.step === 'waiting_environment') {
            if (message.body.toLowerCase() === 'voltar') {
                userState.step = 'initial';
                client.sendMessage(message.from, 'Você voltou para o início. Envie "oi" para começar novamente.');
                return;
            }

            const selectedId = parseInt(message.body);
            const environments = userState.environments;
            const selectedEnvironment = environments.find(env => env.id === selectedId);

            if (selectedEnvironment) {
                userState.selectedEnvironment = selectedEnvironment;
                userState.step = 'waiting_class';

                connection.query(
                    `SELECT DISTINCT c.id_classe, c.ds_Classe
                     FROM variavel_classe_ambiente vca
                     JOIN classes c ON vca.cd_classe = c.id_classe
                     WHERE vca.cd_ambiente = ?`,
                    [selectedEnvironment.id],
                    (error, results) => {
                        if (error) {
                            console.error('Database query error:', error);
                            client.sendMessage(message.from, 'Erro ao buscar as classes do ambiente.');
                            return;
                        }

                        if (results.length > 0) {
                            const listaClasses = results.map(row => `${row.id_classe}. ${row.ds_Classe}`).join('\n');
                            const resposta = `Você selecionou o ambiente *${selectedEnvironment.Nome}*.\n\nClasses disponíveis:\n${listaClasses}\n\nDigite o código da classe para ver o último valor ou "voltar" para escolher outro ambiente.`;
                            client.sendMessage(message.from, resposta);
                            userState.classes = results;
                        } else {
                            client.sendMessage(message.from, `Nenhuma classe encontrada para o ambiente *${selectedEnvironment.Nome}*.`);
                            userState.step = 'initial';
                        }
                    }
                );
            } else {
                client.sendMessage(message.from, 'ID de ambiente inválido. Digite um ID válido da lista ou "voltar".');
            }
        } else if (userState.step === 'waiting_class') {
            if (message.body.toLowerCase() === 'voltar') {
                userState.step = 'waiting_environment';
                userState.selectedEnvironment = null;

                const environments = userState.environments;
                if (environments && environments.length > 0) {
                    const listaAmbientes = environments.map(env => `${env.id}. ${env.Nome}`).join('\n');
                    const resposta = `Você voltou para a seleção de ambientes. Aqui estão os ambientes disponíveis:\n${listaAmbientes}\n\nDigite o ID do ambiente desejado ou "voltar" para reiniciar.`;
                    client.sendMessage(message.from, resposta);
                } else {
                    client.sendMessage(message.from, 'Não foi possível carregar a lista de ambientes. Envie "oi" para começar novamente.');
                }

                return;
            }

            const selectedId = parseInt(message.body);
            const classes = userState.classes;
            const selectedClass = classes.find(cls => cls.id_classe === selectedId);

            if (selectedClass) {
                const selectedEnvironment = userState.selectedEnvironment;

                connection.query(
                    `SELECT rg.DataHora, rg.Value, c.ds_Sufixo 
                     FROM registro_grandezas rg
                     JOIN classes c ON rg.cdClasse = c.id_classe
                     WHERE rg.Id_amb = ? AND rg.cdClasse = ?
                     ORDER BY rg.DataHora DESC LIMIT 1`,
                    [selectedEnvironment.id, selectedClass.id_classe],
                    (error, results) => {
                        if (error) {
                            console.error('Database query error:', error);
                            client.sendMessage(message.from, 'Erro ao buscar o último valor da classe.');
                            return;
                        }

                        if (results.length > 0) {
                            const row = results[0];
                            const dataFormatada = formatDate(row.DataHora);
                            const resposta = `Último valor registrado para a classe *${selectedClass.ds_Classe}*:\n\n${row.Value} ${row.ds_Sufixo} registrado em ${dataFormatada}.`;
                            client.sendMessage(message.from, resposta);
                        } else {
                            client.sendMessage(message.from, `Nenhum valor encontrado para a classe *${selectedClass.ds_Classe}*.`);
                        }
                    }
                );
            } else {
                client.sendMessage(message.from, 'Código de classe inválido. Digite um código válido ou "voltar".');
            }
        } else {
            client.sendMessage(message.from, 'Desculpe, não entendi sua mensagem. Tente enviar "oi" para listar os ambientes.');
        }
    }
});

server.listen(3333, () => {
    console.log('Server running on port 3333');
});
