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

-- LIBROS DE TERROR
INSERT INTO libros (titulo, id_autor, genero, cantidad) VALUES
('It', 2, 'Terror', 10),
('El resplandor', 2, 'Terror', 10),
('Cementerio de animales', 2, 'Terror', 10),
('Carrie', 2, 'Terror', 10),
('Misery', 2, 'Terror', 10),
('El misterio de Marie Roget', 3, 'Terror', 10),
('El gato negro', 3, 'Terror', 10),
('La caída de la Casa Usher', 3, 'Terror', 10);

-- LIBROS DE AMOR
INSERT INTO libros (titulo, id_autor, genero, cantidad) VALUES
('Orgullo y prejuicio', 5, 'Amor', 10),
('Emma', 5, 'Amor', 10),
('Persuasión', 5, 'Amor', 10),
('Sentido y sensibilidad', 5, 'Amor', 10),
('El amor en los tiempos del cólera', 1, 'Amor', 10),
('Como agua para chocolate', 1, 'Amor', 10),
('Jane Eyre', 5, 'Amor', 10),
('La abadía de Northanger', 5, 'Amor', 10);

-- LIBROS DE THRILLER
INSERT INTO libros (titulo, id_autor, genero, cantidad) VALUES
('Diez negritos', 4, 'Thriller', 10),
('Asesinato en el Orient Express', 4, 'Thriller', 10),
('El asesinato de Roger Ackroyd', 4, 'Thriller', 10),
('Muerte en el Nilo', 4, 'Thriller', 10),
('El misterio de la guía de ferrocarriles', 4, 'Thriller', 10),
('El hombre del traje marrón', 4, 'Thriller', 10),
('Después del funeral', 4, 'Thriller', 10),
('Cita con la muerte', 4, 'Thriller', 10);

-- LIBROS DE TEMAS CIENTÍFICOS
INSERT INTO libros (titulo, id_autor, genero, cantidad) VALUES
('Cosmos', 8, 'Temas científicos', 10),
('El mundo y sus demonios', 8, 'Temas científicos', 10),
('Contacto', 8, 'Temas científicos', 10),
('Pale Blue Dot', 8, 'Temas científicos', 10),
('Breve historia del tiempo', 8, 'Temas científicos', 10),
('El universo en una cáscara de nuez', 8, 'Temas científicos', 10),
('La teoría del todo', 8, 'Temas científicos', 10),
('El gran diseño', 8, 'Temas científicos', 10);

-- LIBROS DE CIENCIA FICCIÓN
INSERT INTO libros (titulo, id_autor, genero, cantidad) VALUES
('Viaje al centro de la Tierra', 6, 'Ciencia ficción', 10),
('De la Tierra a la Luna', 6, 'Ciencia ficción', 10),
('Veinte mil leguas de viaje submarino', 6, 'Ciencia ficción', 10),
('La vuelta al mundo en 80 días', 6, 'Ciencia ficción', 10),
('Yo, robot', 7, 'Ciencia ficción', 10),
('Fundación', 7, 'Ciencia ficción', 10),
('El fin de la eternidad', 7, 'Ciencia ficción', 10),
('Las bóvedas de acero', 7, 'Ciencia ficción', 10);