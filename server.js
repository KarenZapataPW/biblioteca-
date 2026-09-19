const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Conexión con la base de datos
const db = new sqlite3.Database('./biblioteca.db', (error) => {
    if (error) {
        console.error('Error al conectar con la base de datos:', error.message);
    } else {
        console.log('Base de datos conectada correctamente.');
    }
});

// Ruta 
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Biblioteca funcionando correctamente'
    });
});

// Obtener los libros
app.get('/api/libros', (req, res) => {
    const sql = `
        SELECT libros.id_libro, libros.titulo, autores.nombre AS autor,
               libros.genero, libros.cantidad
        FROM libros
        INNER JOIN autores ON libros.id_autor = autores.id_autor
    `;

    db.all(sql, [], (error, rows) => {
        if (error) {
            return res.status(500).json({
                error: 'Error al obtener los libros'
            });
        }

        res.json(rows);
    });
});
// Agregar un autor
app.post('/api/autores', (req, res) => {
    const { nombre, nacionalidad } = req.body;

    const sql = `
        INSERT INTO autores (nombre, nacionalidad)
        VALUES (?, ?)
    `;

    db.run(sql, [nombre, nacionalidad], function(error) {
        if (error) {
            return res.status(500).json({
                error: 'Error al agregar el autor'
            });
        }

        res.status(201).json({
            mensaje: 'Autor agregado correctamente',
            id_autor: this.lastID
        });
    });
});
// Obtener todos los autores
app.get('/api/autores', (req, res) => {
    const sql = 'SELECT * FROM autores';

    db.all(sql, [], (error, rows) => {
        if (error) {
            return res.status(500).json({
                error: 'Error al obtener los autores'
            });
        }

        res.json(rows);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

setInterval(() => {}, 1000);