const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());



const db = new sqlite3.Database('./biblioteca.db', (error) => {
    if (error) {
        console.error('Error al conectar con la base de datos:', error.message);
    } else {
        console.log('Base de datos conectada correctamente.');
    }
});



app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Biblioteca funcionando correctamente'
    });
});

// MIDDLEWARE PARA ADMIN

const soloAdmin = (req, res, next) => {

    if (req.headers['x-tipo-usuario'] !== 'admin') {
        return res.status(403).json({
            error: 'No tienes permisos para realizar esta acción'
        });
    }

    next();
};


// LIBROS


// Obtener libros
app.get('/api/libros', (req, res) => {

    const sql = `
        SELECT 
            libros.id_libro,
            libros.titulo,
            autores.nombre AS autor,
            libros.genero,
            libros.cantidad
        FROM libros
        INNER JOIN autores
            ON libros.id_autor = autores.id_autor
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


// Agregar libro - SOLO ADMIN
app.post('/api/libros', soloAdmin, (req, res) => {

    const { titulo, id_autor, genero, cantidad } = req.body;

    const sql = `
        INSERT INTO libros (
            titulo,
            id_autor,
            genero,
            cantidad
        )
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [titulo, id_autor, genero, cantidad],
        function(error) {

            if (error) {
                return res.status(500).json({
                    error: 'Error al agregar el libro'
                });
            }

            res.status(201).json({
                mensaje: 'Libro agregado correctamente',
                id_libro: this.lastID
            });
        }
    );
});


// Modificar libro - SOLO ADMIN
app.put('/api/libros/:id', soloAdmin, (req, res) => {

    const { titulo, id_autor, genero, cantidad } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE libros
        SET
            titulo = ?,
            id_autor = ?,
            genero = ?,
            cantidad = ?
        WHERE id_libro = ?
    `;

    db.run(
        sql,
        [titulo, id_autor, genero, cantidad, id],
        function(error) {

            if (error) {
                return res.status(500).json({
                    error: 'Error al modificar el libro'
                });
            }

            res.json({
                mensaje: 'Libro modificado correctamente'
            });
        }
    );
});


// Eliminar libro - SOLO ADMIN
app.delete('/api/libros/:id', soloAdmin, (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM libros
        WHERE id_libro = ?
    `;

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


// Obtener autores
app.get('/api/autores', (req, res) => {

    const sql = `
        SELECT *
        FROM autores
    `;

    db.all(sql, [], (error, rows) => {

        if (error) {
            return res.status(500).json({
                error: 'Error al obtener los autores'
            });
        }

        res.json(rows);
    });
});


// Agregar autor - SOLO ADMIN
app.post('/api/autores', soloAdmin, (req, res) => {

    const { nombre, nacionalidad } = req.body;

    const sql = `
        INSERT INTO autores (
            nombre,
            nacionalidad
        )
        VALUES (?, ?)
    `;

    db.run(
        sql,
        [nombre, nacionalidad],
        function(error) {

            if (error) {
                return res.status(500).json({
                    error: 'Error al agregar el autor'
                });
            }

            res.status(201).json({
                mensaje: 'Autor agregado correctamente',
                id_autor: this.lastID
            });
        }
    );
});


// Modificar autor - SOLO ADMIN
app.put('/api/autores/:id', soloAdmin, (req, res) => {

    const { nombre, nacionalidad } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE autores
        SET
            nombre = ?,
            nacionalidad = ?
        WHERE id_autor = ?
    `;

    db.run(
        sql,
        [nombre, nacionalidad, id],
        function(error) {

            if (error) {
                return res.status(500).json({
                    error: 'Error al modificar el autor'
                });
            }

            res.json({
                mensaje: 'Autor modificado correctamente'
            });
        }
    );
});


// Eliminar autor - SOLO ADMIN
app.delete('/api/autores/:id', soloAdmin, (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM autores
        WHERE id_autor = ?
    `;

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


// USUARIOS


// Registrar usuario
app.post('/api/usuarios', (req, res) => {

    const {
        nombre,
        correo,
        password,
        tipo_usuario
    } = req.body;

    const sql = `
        INSERT INTO usuarios (
            nombre,
            correo,
            password,
            tipo_usuario
        )
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [nombre, correo, password, tipo_usuario],
        function(error) {

            if (error) {
                return res.status(500).json({
                    error: 'Error al registrar el usuario'
                });
            }

            res.status(201).json({
                mensaje: 'Usuario registrado correctamente',
                id_usuario: this.lastID
            });
        }
    );
});

//LOGIN

app.post('/api/login', (req, res) => {

    const {
        correo,
        password
    } = req.body;

    const sql = `
        SELECT
            id_usuario,
            nombre,
            correo,
            tipo_usuario
        FROM usuarios
        WHERE correo = ?
        AND password = ?
    `;

    db.get(
        sql,
        [correo, password],
        (error, usuario) => {

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
        }
    );
});



// Registrar préstamo
app.post('/api/prestamos', (req, res) => {

    const {
        id_usuario,
        id_libro,
        fecha_prestamo
    } = req.body;


    // Primero verificamos que haya ejemplares
    const buscarLibro = `
        SELECT cantidad
        FROM libros
        WHERE id_libro = ?
    `;

    db.get(
        buscarLibro,
        [id_libro],
        (error, libro) => {

            if (error) {
                return res.status(500).json({
                    error: 'Error al consultar el libro'
                });
            }

            if (!libro) {
                return res.status(404).json({
                    error: 'El libro no existe'
                });
            }

            if (libro.cantidad <= 0) {
                return res.status(400).json({
                    error: 'No hay ejemplares disponibles'
                });
            }


            // Registrar préstamo
            const registrarPrestamo = `
                INSERT INTO prestamos (
                    id_usuario,
                    id_libro,
                    fecha_prestamo,
                    estado
                )
                VALUES (?, ?, ?, ?)
            `;

            db.run(
                registrarPrestamo,
                [
                    id_usuario,
                    id_libro,
                    fecha_prestamo,
                    'Prestado'
                ],
                function(error) {

                    if (error) {
                        return res.status(500).json({
                            error: 'Error al registrar el préstamo'
                        });
                    }


                    // Descontar un ejemplar
                    const actualizarLibro = `
                        UPDATE libros
                        SET cantidad = cantidad - 1
                        WHERE id_libro = ?
                    `;

                    db.run(
                        actualizarLibro,
                        [id_libro],
                        function(error) {

                            if (error) {
                                return res.status(500).json({
                                    error: 'El préstamo se registró pero no se pudo actualizar la cantidad'
                                });
                            }

                            res.status(201).json({
                                mensaje: 'Libro rentado correctamente',
                                id_prestamo: this.lastID
                            });
                        }
                    );
                }
            );
        }
    );
});


// CONSULTAR PRÉSTAMOS - SOLO ADMIN


app.get('/api/prestamos', soloAdmin, (req, res) => {

    const sql = `
        SELECT
            prestamos.id_prestamo,
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
// MARCAR PRESTAMO COMO DEVUELTO
app.put('/api/prestamos/:id/devolver', soloAdmin, (req, res) => {

    const idPrestamo = req.params.id;

    const sqlPrestamo = `
        SELECT id_libro, estado
        FROM prestamos
        WHERE id_prestamo = ?
    `;

    db.get(sqlPrestamo, [idPrestamo], (error, prestamo) => {

        if (error) {
            return res.status(500).json({
                error: 'Error al buscar el préstamo'
            });
        }

        if (!prestamo) {
            return res.status(404).json({
                error: 'El préstamo no existe'
            });
        }

        if (prestamo.estado === 'Devuelto') {
            return res.status(400).json({
                error: 'Este libro ya fue devuelto'
            });
        }

        const fechaDevolucion = new Date()
            .toISOString()
            .split("T")[0];

        const sqlDevolucion = `
            UPDATE prestamos
            SET estado = 'Devuelto',
                fecha_devolucion = ?
            WHERE id_prestamo = ?
        `;

        db.run(
            sqlDevolucion,
            [fechaDevolucion, idPrestamo],
            function(error) {

                if (error) {
                    return res.status(500).json({
                        error: 'Error al registrar la devolución'
                    });
                }

                const sqlLibro = `
                    UPDATE libros
                    SET cantidad = cantidad + 1
                    WHERE id_libro = ?
                `;

                db.run(
                    sqlLibro,
                    [prestamo.id_libro],
                    function(error) {

                        if (error) {
                            return res.status(500).json({
                                error: 'La devolución se registró, pero no se pudo actualizar la cantidad'
                            });
                        }

                        res.json({
                            mensaje: 'Libro devuelto correctamente'
                        });
                    }
                );
            }
        );
    });
});
// INICIAR SERVIDOR
console.log("RUTA DE DEVOLUCIÓN CARGADA");
app.listen(PORT, () => {

    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );

});