// api.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;
// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MariaDB
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'MBadmin',
    password: 'mbserver2025',
    database: 'Computadores'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a MariaDB:', err);
        return;
    }
    console.log('Conectado exitosamente a MariaDB');
});

/// ---------------------- RUTAS CRUD ------------------------ ///

// Obtener todos los computadores
app.get('/api/computadores', (req, res) => {
    db.query('SELECT * FROM Computador', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Obtener un computador por ID
app.get('/api/computadores/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM Computador WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json(results[0]);
    });
});

// Crear un computador
app.post('/api/computadores', (req, res) => {
    const { nombre_maquina, estado } = req.body;
    db.query('INSERT INTO Computador (nombre_maquina, estado) VALUES (?, ?)', [nombre_maquina, estado], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Computador creado', id: results.insertId });
    });
});

// Actualizar un computador
app.put('/api/computadores/:id', (req, res) => {
    const { nombre_maquina, estado } = req.body;
    const id = req.params.id;
    db.query('UPDATE Computador SET nombre_maquina = ?, estado = ? WHERE id = ?', [nombre_maquina, estado, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Computador actualizado' });
    });
});

// Eliminar un computador
app.delete('/api/computadores/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM Computador WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Computador eliminado' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});
