const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./biblioteca.db', (error) => {
    if (error) {
        console.error('Error al conectar:', error.message);
        return;
    }

    console.log('Base de datos conectada.');
});

const libros = [
    // Terror
    ['It', 2, 'Terror', 10],
    ['El resplandor', 2, 'Terror', 10],
    ['Cementerio de animales', 2, 'Terror', 10],
    ['Carrie', 2, 'Terror', 10],
    ['Misery', 2, 'Terror', 10],
    ['El misterio de Marie Roget', 3, 'Terror', 10],
    ['El gato negro', 3, 'Terror', 10],
    ['La caída de la Casa Usher', 3, 'Terror', 10],

    // Amor
    ['Orgullo y prejuicio', 5, 'Amor', 10],
    ['Emma', 5, 'Amor', 10],
    ['Persuasión', 5, 'Amor', 10],
    ['Sentido y sensibilidad', 5, 'Amor', 10],
    ['El amor en los tiempos del cólera', 1, 'Amor', 10],
    ['Como agua para chocolate', 1, 'Amor', 10],
    ['Jane Eyre', 5, 'Amor', 10],
    ['La abadía de Northanger', 5, 'Amor', 10],

    // Thriller
    ['Diez negritos', 4, 'Thriller', 10],
    ['Asesinato en el Orient Express', 4, 'Thriller', 10],
    ['El asesinato de Roger Ackroyd', 4, 'Thriller', 10],
    ['Muerte en el Nilo', 4, 'Thriller', 10],
    ['El misterio de la guía de ferrocarriles', 4, 'Thriller', 10],
    ['El hombre del traje marrón', 4, 'Thriller', 10],
    ['Después del funeral', 4, 'Thriller', 10],
    ['Cita con la muerte', 4, 'Thriller', 10],

    // Temas científicos
    ['Cosmos', 8, 'Temas científicos', 10],
    ['El mundo y sus demonios', 8, 'Temas científicos', 10],
    ['Contacto', 8, 'Temas científicos', 10],
    ['Pale Blue Dot', 8, 'Temas científicos', 10],
    ['Breve historia del tiempo', 8, 'Temas científicos', 10],
    ['El universo en una cáscara de nuez', 8, 'Temas científicos', 10],
    ['La teoría del todo', 8, 'Temas científicos', 10],
    ['El gran diseño', 8, 'Temas científicos', 10],

    // Ciencia ficción
    ['Viaje al centro de la Tierra', 6, 'Ciencia ficción', 10],
    ['De la Tierra a la Luna', 6, 'Ciencia ficción', 10],
    ['Veinte mil leguas de viaje submarino', 6, 'Ciencia ficción', 10],
    ['La vuelta al mundo en 80 días', 6, 'Ciencia ficción', 10],
    ['Yo, robot', 7, 'Ciencia ficción', 10],
    ['Fundación', 7, 'Ciencia ficción', 10],
    ['El fin de la eternidad', 7, 'Ciencia ficción', 10],
    ['Las bóvedas de acero', 7, 'Ciencia ficción', 10]
];

const sql = `
    INSERT INTO libros (titulo, id_autor, genero, cantidad)
    VALUES (?, ?, ?, ?)
`;

let completados = 0;

libros.forEach((libro) => {
    db.run(sql, libro, function(error) {
        if (error) {
            console.error('Error al insertar:', error.message);
        } else {
            completados++;

            if (completados === libros.length) {
                console.log('Se agregaron los 40 libros correctamente.');
                db.close();
            }
        }
    });
});