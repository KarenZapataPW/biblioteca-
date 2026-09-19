CREATE TABLE autores (
    id_autor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    nacionalidad TEXT
);

CREATE TABLE libros (
    id_libro INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    id_autor INTEGER NOT NULL,
    genero TEXT,
    cantidad INTEGER NOT NULL,
    FOREIGN KEY (id_autor) REFERENCES autores(id_autor)
);

CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    tipo_usuario TEXT NOT NULL
);

CREATE TABLE prestamos (
    id_prestamo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_libro INTEGER NOT NULL,
    fecha_prestamo TEXT NOT NULL,
    fecha_devolucion TEXT,
    estado TEXT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_libro) REFERENCES libros(id_libro)
);
INSERT INTO autores (nombre, nacionalidad) VALUES
('Gabriel García Márquez', 'Colombiana'),
('J.K. Rowling', 'Británica'),
('George Orwell', 'Británica');

INSERT INTO libros (titulo, id_autor, genero, cantidad) VALUES
('Cien años de soledad', 1, 'Novela', 5),
('Harry Potter y la piedra filosofal', 2, 'Fantasía', 3),
('1984', 3, 'Distopía', 4);
