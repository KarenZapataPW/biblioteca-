const API_URL = "http://localhost:3000";

let libros = [];
let autores = [];
let usuarioActual = null;
let libroEditando = null;
let autorEditando = null;


// ==============================
// LOGIN
// ==============================

const formularioLogin = document.getElementById("login-form");

formularioLogin.addEventListener("submit", async function(event) {

    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje-login");

    try {

        const respuesta = await fetch(API_URL + "/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                correo: correo,
                password: password
            })

        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = datos.error;
            return;
        }

        usuarioActual = datos.usuario;

        // Guardar la sesión
        localStorage.setItem(
            "usuarioActual",
            JSON.stringify(usuarioActual)
        );

        mensaje.textContent = "";

        document.getElementById("login-section").hidden = true;

        if (usuarioActual.tipo_usuario === "admin") {

            document.getElementById("admin-section").hidden = false;

            document.getElementById("bienvenida-admin").textContent =
                "Bienvenido, " + usuarioActual.nombre;

            cargarAdmin();

        } else {

            document.getElementById("usuario-section").hidden = false;

            document.getElementById("bienvenida-usuario").textContent =
                "Bienvenido, " + usuarioActual.nombre;

            cargarLibros();

        }

    } catch (error) {

        mensaje.textContent =
            "No se pudo conectar con el servidor.";

        console.error(error);

    }

});


// ==============================
// MOSTRAR / OCULTAR PASSWORD
// ==============================

const botonPassword =
    document.getElementById("mostrar-password");

const campoPassword =
    document.getElementById("password");

botonPassword.addEventListener("click", function() {

    if (campoPassword.type === "password") {

        campoPassword.type = "text";
        botonPassword.textContent = "Ocultar";

    } else {

        campoPassword.type = "password";
        botonPassword.textContent = "Mostrar";

    }

});


// ==============================
// LIBROS PARA USUARIO
// ==============================

async function cargarLibros() {

    try {

        const respuesta =
            await fetch(API_URL + "/api/libros");

        libros = await respuesta.json();

        mostrarLibros(libros);

    } catch (error) {

        console.error(
            "Error al cargar los libros:",
            error
        );

    }

}


function mostrarLibros(lista) {

    const contenedor =
        document.getElementById("libros-container");

    contenedor.innerHTML = "";

    lista.forEach(libro => {

        const div = document.createElement("div");

        div.classList.add("libro");

        div.innerHTML = `

            <h3>${libro.titulo}</h3>

            <p>
                <strong>Autor:</strong>
                ${libro.autor}
            </p>

            <p>
                <strong>Género:</strong>
                ${libro.genero}
            </p>

            <p>
                <strong>Disponibles:</strong>
                ${libro.cantidad}
            </p>

            <button
                type="button"
                onclick="rentarLibro(${libro.id_libro})"
            >
                Rentar libro
            </button>

        `;

        div.addEventListener("click", function(event) {

            if (event.target.tagName !== "BUTTON") {
                mostrarDetalle(libro);
            }

        });

        contenedor.appendChild(div);

    });

}


function mostrarTodos() {

    mostrarLibros(libros);

}


function filtrarLibros(genero) {

    const librosFiltrados =
        libros.filter(function(libro) {

            return libro.genero === genero;

        });

    mostrarLibros(librosFiltrados);

}


function mostrarDetalle(libro) {

    const detalle =
        document.getElementById("detalle-container");

    detalle.innerHTML = `

        <h3>${libro.titulo}</h3>

        <p>
            <strong>Autor:</strong>
            ${libro.autor}
        </p>

        <p>
            <strong>Género:</strong>
            ${libro.genero}
        </p>

        <p>
            <strong>Ejemplares disponibles:</strong>
            ${libro.cantidad}
        </p>

    `;

}


// ==============================
// RENTAR LIBRO
// ==============================

async function rentarLibro(idLibro) {

    if (!usuarioActual) {
        return;
    }

    const confirmar =
        confirm("¿Deseas rentar este libro?");

    if (!confirmar) {
        return;
    }

    const fecha =
        new Date().toISOString().split("T")[0];

    try {

        const respuesta =
            await fetch(API_URL + "/api/prestamos", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-tipo-usuario": "usuario"
                },

                body: JSON.stringify({

                    id_usuario:
                        usuarioActual.id_usuario,

                    id_libro:
                        idLibro,

                    fecha_prestamo:
                        fecha

                })

            });

        const datos =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.error);
            return;

        }

        alert("Libro rentado correctamente.");

        // Actualizar los libros
        const respuestaLibros =
            await fetch(API_URL + "/api/libros");

        libros =
            await respuestaLibros.json();

        mostrarLibros(libros);

    } catch (error) {

        console.error(
            "Error al realizar el préstamo:",
            error
        );

        alert(
            "No se pudo realizar el préstamo."
        );

    }

}


// ==============================
// ADMIN
// ==============================

async function cargarAdmin() {

    await cargarAutores();

    await cargarLibrosAdmin();

    await cargarPrestamos();

}


// ==============================
// AUTORES
// ==============================

async function cargarAutores() {

    try {

        const respuesta =
            await fetch(API_URL + "/api/autores");

        autores =
            await respuesta.json();

        mostrarAutores();

        llenarSelectAutores();

    } catch (error) {

        console.error(
            "Error al cargar autores:",
            error
        );

    }

}


function llenarSelectAutores() {

    const select =
        document.getElementById("autor-libro");

    select.innerHTML = `
        <option value="">
            Selecciona un autor
        </option>
    `;

    autores.forEach(autor => {

        const option =
            document.createElement("option");

        option.value =
            autor.id_autor;

        option.textContent =
            autor.nombre;

        select.appendChild(option);

    });

}


function mostrarAutores() {

    const contenedor =
        document.getElementById(
            "admin-autores-container"
        );

    contenedor.innerHTML = "";

    autores.forEach(autor => {

        const div =
            document.createElement("div");

        div.classList.add("admin-item");

        div.innerHTML = `

            <p>
                <strong>${autor.nombre}</strong>
                - ${autor.nacionalidad}
            </p>

            <button
                type="button"
                onclick="editarAutor(${autor.id_autor})"
            >
                Editar
            </button>

            <button
                type="button"
                onclick="eliminarAutor(${autor.id_autor})"
            >
                Eliminar
            </button>

        `;

        contenedor.appendChild(div);

    });

}


// ==============================
// AGREGAR / EDITAR AUTOR
// ==============================

document
    .getElementById("autor-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const nombre =
            document.getElementById(
                "nombre-autor"
            ).value;

        const nacionalidad =
            document.getElementById(
                "nacionalidad-autor"
            ).value;

        let url =
            API_URL + "/api/autores";

        let metodo = "POST";

        if (autorEditando !== null) {

            url =
                API_URL + "/api/autores/" + autorEditando;

            metodo = "PUT";

        }

        try {

            const respuesta =
                await fetch(url, {

                    method: metodo,

                    headers: {

                        "Content-Type":
                            "application/json",

                        "x-tipo-usuario":
                            usuarioActual.tipo_usuario

                    },

                    body: JSON.stringify({

                        nombre:
                            nombre,

                        nacionalidad:
                            nacionalidad

                    })

                });

            const datos =
                await respuesta.json();

            if (!respuesta.ok) {

                alert(datos.error);
                return;

            }

            alert(datos.mensaje);

            autorEditando = null;

            document
                .getElementById("autor-form")
                .reset();

            cargarAutores();

        } catch (error) {

            console.error(error);

        }

    });


function editarAutor(id) {

    const autor =
        autores.find(
            autor => autor.id_autor === id
        );

    if (!autor) {
        return;
    }

    autorEditando = id;

    document.getElementById(
        "nombre-autor"
    ).value =
        autor.nombre;

    document.getElementById(
        "nacionalidad-autor"
    ).value =
        autor.nacionalidad;

}


async function eliminarAutor(id) {

    const confirmar =
        confirm("¿Deseas eliminar este autor?");

    if (!confirmar) {
        return;
    }

    try {

        const respuesta =
            await fetch(
                API_URL + "/api/autores/" + id,
                {

                    method: "DELETE",

                    headers: {

                        "x-tipo-usuario":
                            usuarioActual.tipo_usuario

                    }

                }
            );

        const datos =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.error);
            return;

        }

        alert(datos.mensaje);

        cargarAutores();

    } catch (error) {

        console.error(error);

    }

}


function cancelarEdicionAutor() {

    autorEditando = null;

    document
        .getElementById("autor-form")
        .reset();

}


// ==============================
// LIBROS ADMIN
// ==============================

async function cargarLibrosAdmin() {

    try {

        const respuesta =
            await fetch(API_URL + "/api/libros");

        libros =
            await respuesta.json();

        mostrarLibrosAdmin();

    } catch (error) {

        console.error(error);

    }

}


function mostrarLibrosAdmin() {

    const contenedor =
        document.getElementById(
            "admin-libros-container"
        );

    contenedor.innerHTML = "";

    libros.forEach(libro => {

        const div =
            document.createElement("div");

        div.classList.add("admin-item");

        div.innerHTML = `

            <h3>${libro.titulo}</h3>

            <p>
                Autor: ${libro.autor}
            </p>

            <p>
                Género: ${libro.genero}
            </p>

            <p>
                Cantidad: ${libro.cantidad}
            </p>

            <button
                type="button"
                onclick="editarLibro(${libro.id_libro})"
            >
                Editar
            </button>

            <button
                type="button"
                onclick="eliminarLibro(${libro.id_libro})"
            >
                Eliminar
            </button>

        `;

        contenedor.appendChild(div);

    });

}


// ==============================
// AGREGAR / EDITAR LIBRO
// ==============================

document
    .getElementById("libro-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const titulo =
            document.getElementById(
                "titulo-libro"
            ).value;

        const idAutor =
            document.getElementById(
                "autor-libro"
            ).value;

        const genero =
            document.getElementById(
                "genero-libro"
            ).value;

        const cantidad =
            document.getElementById(
                "cantidad-libro"
            ).value;

        let url =
            API_URL + "/api/libros";

        let metodo = "POST";

        if (libroEditando !== null) {

            url =
                API_URL + "/api/libros/" + libroEditando;

            metodo = "PUT";

        }

        try {

            const respuesta =
                await fetch(url, {

                    method: metodo,

                    headers: {

                        "Content-Type":
                            "application/json",

                        "x-tipo-usuario":
                            usuarioActual.tipo_usuario

                    },

                    body: JSON.stringify({

                        titulo:
                            titulo,

                        id_autor:
                            idAutor,

                        genero:
                            genero,

                        cantidad:
                            cantidad

                    })

                });

            const datos =
                await respuesta.json();

            if (!respuesta.ok) {

                alert(datos.error);
                return;

            }

            alert(datos.mensaje);

            libroEditando = null;

            document
                .getElementById("libro-form")
                .reset();

            cargarLibrosAdmin();

        } catch (error) {

            console.error(error);

        }

    });


function editarLibro(id) {

    const libro =
        libros.find(
            libro => libro.id_libro === id
        );

    if (!libro) {
        return;
    }

    libroEditando = id;

    document.getElementById(
        "titulo-libro"
    ).value =
        libro.titulo;

    const autor =
        autores.find(
            autor => autor.nombre === libro.autor
        );

    if (autor) {

        document.getElementById(
            "autor-libro"
        ).value =
            autor.id_autor;

    }

    document.getElementById(
        "genero-libro"
    ).value =
        libro.genero;

    document.getElementById(
        "cantidad-libro"
    ).value =
        libro.cantidad;

}


async function eliminarLibro(id) {

    const confirmar =
        confirm("¿Deseas eliminar este libro?");

    if (!confirmar) {
        return;
    }

    try {

        const respuesta =
            await fetch(
                API_URL + "/api/libros/" + id,
                {

                    method: "DELETE",

                    headers: {

                        "x-tipo-usuario":
                            usuarioActual.tipo_usuario

                    }

                }
            );

        const datos =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.error);
            return;

        }

        alert(datos.mensaje);

        cargarLibrosAdmin();

    } catch (error) {

        console.error(error);

    }

}


function cancelarEdicion() {

    libroEditando = null;

    document
        .getElementById("libro-form")
        .reset();

}


// ==============================
// PRÉSTAMOS PARA ADMIN
// ==============================

async function cargarPrestamos() {

    try {

        const respuesta =
            await fetch(
                API_URL + "/api/prestamos",
                {

                    headers: {

                        "x-tipo-usuario":
                            usuarioActual.tipo_usuario

                    }

                }
            );

        const prestamos =
            await respuesta.json();

        mostrarPrestamos(prestamos);

    } catch (error) {

        console.error(error);

    }

}


function mostrarPrestamos(prestamos) {

    const contenedor =
        document.getElementById(
            "admin-prestamos-container"
        );

    contenedor.innerHTML = "";

    if (prestamos.length === 0) {

        contenedor.innerHTML =
            "<p>No hay préstamos registrados.</p>";

        return;

    }

    prestamos.forEach(prestamo => {

        const div =
            document.createElement("div");

        div.classList.add("admin-item");

        div.innerHTML = `

            <p>
                <strong>Usuario:</strong>
                ${prestamo.usuario}
            </p>

            <p>
                <strong>Libro:</strong>
                ${prestamo.libro}
            </p>

            <p>
                <strong>Fecha de préstamo:</strong>
                ${prestamo.fecha_prestamo}
            </p>

            <p>
                <strong>Fecha de devolución:</strong>
                ${prestamo.fecha_devolucion || "Pendiente"}
            </p>

            <p>
                <strong>Estado:</strong>
                ${prestamo.estado}
            </p>

            ${
                prestamo.estado === "Prestado"
                ? `
                    <button
                        type="button"
                        onclick="devolverLibro(${prestamo.id_prestamo})"
                    >
                        Marcar como devuelto
                    </button>
                  `
                : ""
            }

        `;

        contenedor.appendChild(div);

    });

}
async function devolverLibro(idPrestamo) {
    const confirmar = confirm("¿El libro ya fue regresado?");

    if (!confirmar) return;

    try {
        const url = API_URL + "/api/prestamos/" + idPrestamo + "/devolver";

        console.log("URL:", url);
        console.log("Método: PUT");

        const respuesta = await fetch(url, {
            method: "PUT",
            headers: {
                "x-tipo-usuario": usuarioActual.tipo_usuario
            }
        });

        const texto = await respuesta.text();

        console.log("Código:", respuesta.status);
        console.log("Respuesta:", texto);

        if (!respuesta.ok) {
            alert("Error del servidor: " + texto);
            return;
        }

        const datos = JSON.parse(texto);

        alert(datos.mensaje);

        cargarPrestamos();
        cargarLibrosAdmin();

    } catch (error) {
        console.error("Error al registrar la devolución:", error);
        alert("Error: " + error.message);
    }
}



// ==============================
// CERRAR SESIÓN
// ==============================

function cerrarSesion() {

    usuarioActual = null;

    // Eliminar la sesión guardada
    localStorage.removeItem("usuarioActual");

    document.getElementById(
        "usuario-section"
    ).hidden = true;

    document.getElementById(
        "admin-section"
    ).hidden = true;

    document.getElementById(
        "login-section"
    ).hidden = false;

    document.getElementById(
        "login-form"
    ).reset();

}


// ==============================
// RECUPERAR SESIÓN
// ==============================

const usuarioGuardado =
    localStorage.getItem("usuarioActual");

if (usuarioGuardado) {

    try {

        usuarioActual =
            JSON.parse(usuarioGuardado);

        document.getElementById(
            "login-section"
        ).hidden = true;

        if (usuarioActual.tipo_usuario === "admin") {

            document.getElementById(
                "admin-section"
            ).hidden = false;

            document.getElementById(
                "bienvenida-admin"
            ).textContent =
                "Bienvenido, " + usuarioActual.nombre;

            cargarAdmin();

        } else {

            document.getElementById(
                "usuario-section"
            ).hidden = false;

            document.getElementById(
                "bienvenida-usuario"
            ).textContent =
                "Bienvenido, " + usuarioActual.nombre;

            cargarLibros();

        }

    } catch (error) {

        console.error(
            "Error al recuperar la sesión:",
            error
        );

        localStorage.removeItem("usuarioActual");

        usuarioActual = null;

    }

}