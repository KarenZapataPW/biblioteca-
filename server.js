const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Verificar que sea administrador
const soloAdmin = (req, res, next) => {
    if (req.headers['x-tipo-usuario'] !== 'admin') {
        return res.status(403).json({
            error: 'No tienes permisos para realizar esta acción'
        });
    }

    next();
};

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
// Agregar un libro POST
app.post('/api/libros',soloAdmin, (req, res) => {
    const { titulo, id_autor, genero, cantidad } = req.body;

    const sql = `
        INSERT INTO libros (titulo, id_autor, genero, cantidad)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [titulo, id_autor, genero, cantidad], function(error) {
        if (error) {
            return res.status(500).json({
                error: 'Error al agregar el libro'
            });
        }

        res.status(201).json({
            mensaje: 'Libro agregado correctamente',
            id_libro: this.lastID
        });
    });
});
// Modificar un libro PUT
app.put('/api/libros/:id', soloAdmin, (req, res) => {
    const { titulo, id_autor, genero, cantidad } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE libros
        SET titulo = ?, id_autor = ?, genero = ?, cantidad = ?
        WHERE id_libro = ?
    `;

    db.run(sql, [titulo, id_autor, genero, cantidad, id], function(error) {
        if (error) {
            return res.status(500).json({
                error: 'Error al modificar el libro'
            });
        }

        res.json({
            mensaje: 'Libro modificado correctamente'
        });
    });
});
// Eliminar un libro DELETE
app.delete('/api/libros/:id', soloAdmin, (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM libros WHERE id_libro = ?';

    db.run(sql, [id], function(error) {
        if (error) {
            return res.status(500).json({
                error: 'Error al eliminar el libro'
            });
        }

        res.json({
            mensaje: 'Libro eliminado correctamente'
        });
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
// Modificar un autor
app.put('/api/autores/:id', (req, res) => {
    const { nombre, nacionalidad } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE autores
        SET nombre = ?, nacionalidad = ?
        WHERE id_autor = ?
    `;

    db.run(sql, [nombre, nacionalidad, id], function(error) {
        if (error) {
            return res.status(500).json({
                error: 'Error al modificar el autor'
            });
        }

        res.json({
            mensaje: 'Autor modificado correctamente'
        });
    });
});

// Eliminar un autor
app.delete('/api/autores/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM autores WHERE id_autor = ?';

    db.run(sql, [id], function(error) {
        if (error) {
            return res.status(500).json({
                error: 'Error al eliminar el autor'
            });
        }

        res.json({
            mensaje: 'Autor eliminado correctamente'
        });
    });
});
// Registrar usuario
app.post('/api/usuarios', (req, res) => {
    const { nombre, correo, password, tipo_usuario } = req.body;

    const sql = `
        INSERT INTO usuarios (nombre, correo, password, tipo_usuario)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [nombre, correo, password, tipo_usuario], function(error) {
        if (error) {
            return res.status(500).json({
                error: 'Error al registrar el usuario'
            });
        }

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            id_usuario: this.lastID
        });
    });
});
// Iniciar sesión
app.post('/api/login', (req, res) => {
    const { correo, password } = req.body;

    const sql = `
        SELECT id_usuario, nombre, correo, tipo_usuario
        FROM usuarios
        WHERE correo = ? AND password = ?
    `;

    db.get(sql, [correo, password], (error, usuario) => {
        if (error) {
            return res.status(500).json({
                error: 'Error al iniciar sesión'
            });
        }

        if (!usuario) {
            return res.status(401).json({
                error: 'Correo o contraseña incorrectos'
            });
        }

        res.json({
            mensaje: 'Inicio de sesión correcto',
            usuario: usuario
        });
    });
});
// Registrar préstamo
app.post('/api/prestamos', (req, res) => {
    const { id_usuario, id_libro, fecha_prestamo } = req.body;

    const sql = `
        INSERT INTO prestamos (
            id_usuario,
            id_libro,
            fecha_prestamo,
            estado
        )
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [id_usuario, id_libro, fecha_prestamo, 'Prestado'],
        function(error) {
            if (error) {
                return res.status(500).json({
                    error: 'Error al registrar el préstamo'
                });
            }

            res.status(201).json({
                mensaje: 'Préstamo registrado correctamente',
                id_prestamo: this.lastID
            });
        }
    );
});
// Obtener préstamos
app.get('/api/prestamos', (req, res) => {
    const sql = `
        SELECT prestamos.id_prestamo,
               usuarios.nombre AS usuario,
               libros.titulo AS libro,
               prestamos.fecha_prestamo,
               prestamos.fecha_devolucion,
               prestamos.estado
        FROM prestamos
        INNER JOIN usuarios
            ON prestamos.id_usuario = usuarios.id_usuario
        INNER JOIN libros
            ON prestamos.id_libro = libros.id_libro
    `;

    db.all(sql, [], (error, rows) => {
        if (error) {
            return res.status(500).json({
                error: 'Error al obtener los préstamos'
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