const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./database/db');

const restauranteRoutes = require('./routes/restauranteRoutes');
const pratoRoutes = require('./routes/pratoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'view')));

app.use('/api/restaurantes', restauranteRoutes);
app.use('/api/pratos', pratoRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.get('/restaurantes/novo', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'restaurantes', 'novo.html'));
});

app.get('/pratos/novo', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'pratos', 'novo.html'));
});


console.log(`Acesse a aplicação no navegador: http://localhost:${PORT}/`);


module.exports = { app };

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Endpoints da API Restaurantes: http://localhost:${PORT}/api/restaurantes`);
    console.log(`Endpoints da API Pratos: http://localhost:${PORT}/api/pratos`);
});
