const { createApp } = Vue;

const db = new Dexie("db_codigo_estudiante");

db.version(1).stores({
    autores: "++idAutor,codigo,nombre,pais,telefono",
    libros: "++idLibro,idAutor,isbn,titulo,editorial,edicion"
});

createApp({
    data() {
        return {
            nuevoAutor: { codigo: "", nombre: "", pais: "", telefono: "" },
            nuevoLibro: { idAutor: "", isbn: "", titulo: "", editorial: "", edicion: "" },
            autores: [],
            libros: [],
            busquedaAutor: "",
            busquedaLibro: ""
        };
    },
    methods: {
        // Método para mostrar la notificación
        mostrarNotificacion() {
            const toastElement = document.getElementById('toastEliminar');
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        },

        // Métodos para Autores
        async agregarAutor() {
            await db.autores.add({ ...this.nuevoAutor });
            this.nuevoAutor = { codigo: "", nombre: "", pais: "", telefono: "" };
            this.cargarAutores();
            this.guardarAutoresEnLocalStorage(); // Guardar en LocalStorage
        },
        async cargarAutores() {
            this.autores = await db.autores.toArray();
        },
        async eliminarAutor(id) {
            const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este autor?");
            if (confirmar) {
                await db.autores.delete(id);
                this.cargarAutores();
                this.guardarAutoresEnLocalStorage(); // Guardar en LocalStorage después de eliminar
                this.mostrarNotificacion();  // Mostrar notificación al eliminar
            }
        },
        async buscarAutor() {
            this.autores = await db.autores.filter(autor =>
                autor.nombre.toLowerCase().includes(this.busquedaAutor.toLowerCase()) ||
                autor.pais.toLowerCase().includes(this.busquedaAutor.toLowerCase())
            ).toArray();
        },

        // Métodos para Libros
        async agregarLibro() {
            await db.libros.add({ ...this.nuevoLibro });
            this.nuevoLibro = { idAutor: "", isbn: "", titulo: "", editorial: "", edicion: "" };
            this.cargarLibros();
            this.guardarLibrosEnLocalStorage(); // Guardar en LocalStorage
        },
        async cargarLibros() {
            this.libros = await db.libros.toArray();
        },
        async eliminarLibro(id) {
            const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este libro?");
            if (confirmar) {
                await db.libros.delete(id);
                this.cargarLibros();
                this.guardarLibrosEnLocalStorage(); // Guardar en LocalStorage después de eliminar
                this.mostrarNotificacion();  // Mostrar notificación al eliminar
            }
        },
        async buscarLibro() {
            this.libros = await db.libros.filter(libro =>
                libro.titulo.toLowerCase().includes(this.busquedaLibro.toLowerCase()) ||
                libro.isbn.toLowerCase().includes(this.busquedaLibro.toLowerCase())
            ).toArray();
        },

        // Funciones para almacenar los datos en LocalStorage
        guardarAutoresEnLocalStorage() {
            localStorage.setItem("autores", JSON.stringify(this.autores));
        },
        guardarLibrosEnLocalStorage() {
            localStorage.setItem("libros", JSON.stringify(this.libros));
        },

        // Cargar los autores y libros desde LocalStorage
        cargarDesdeLocalStorage() {
            const autoresGuardados = localStorage.getItem("autores");
            const librosGuardados = localStorage.getItem("libros");

            if (autoresGuardados) {
                this.autores = JSON.parse(autoresGuardados);
            }
            if (librosGuardados) {
                this.libros = JSON.parse(librosGuardados);
            }
        }
    },
    mounted() {
        this.cargarDesdeLocalStorage();  // Cargar los datos desde LocalStorage al inicio
        this.cargarAutores();  // Cargar los autores desde Dexie
        this.cargarLibros();   // Cargar los libros desde Dexie
    }
}).mount('#app');



