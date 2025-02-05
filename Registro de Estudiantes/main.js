const { createApp } = Vue;

createApp({
    data() {
        return {
            codigo: '',
            nombre: '',
            direccion: '',
            distrito: '',
            departamento: '',
            telefono: '',
            fechaNacimiento: '',
            sexo: '',
            email: '',
            alumnos: JSON.parse(localStorage.getItem('alumnos')) || [],
            editando: false
        };
    },
    methods: {
        guardarAlumno() {
            if (!this.validarFechaNacimiento()) {
                alert("Ingrese una fecha de nacimiento válida (mínimo 5 años, máximo 100 años).");
                return;
            }

            if (this.editando) {
                let index = this.alumnos.findIndex(a => a.codigo === this.codigo);
                if (index !== -1) {
                    this.alumnos[index] = this.obtenerAlumno();
                }
            } else {
                if (this.alumnos.some(a => a.codigo === this.codigo)) {
                    alert('El código ya existe. Use otro.');
                    return;
                }
                this.alumnos.push(this.obtenerAlumno());
            }

            this.actualizarLocalStorage();
            this.resetFormulario();
        },

        validarFechaNacimiento() {
            if (!this.fechaNacimiento) return false;

            let fechaNac = new Date(this.fechaNacimiento);
            let hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            let diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();
            let diferenciaDias = hoy.getDate() - fechaNac.getDate();

            if (diferenciaMeses < 0 || (diferenciaMeses === 0 && diferenciaDias < 0)) {
                edad--;
            }

            return edad >= 5 && edad <= 100;
        },

        obtenerAlumno() {
            return {
                codigo: this.codigo.trim(),
                nombre: this.nombre.trim(),
                direccion: this.direccion.trim(),
                distrito: this.distrito.trim(),
                departamento: this.departamento.trim(),
                telefono: this.telefono.trim(),
                fechaNacimiento: this.fechaNacimiento,
                sexo: this.sexo,
                email: this.email.trim()
            };
        },

        verAlumno(alumno) {
            this.codigo = alumno.codigo;
            this.nombre = alumno.nombre;
            this.direccion = alumno.direccion;
            this.distrito = alumno.distrito;
            this.departamento = alumno.departamento;
            this.telefono = alumno.telefono;
            this.fechaNacimiento = alumno.fechaNacimiento;
            this.sexo = alumno.sexo;
            this.email = alumno.email;
            this.editando = true;
        },

        eliminarAlumno(alumno) {
            if (confirm(`¿Estás seguro de que deseas eliminar a ${alumno.nombre} (Código: ${alumno.codigo})?`)) {
                this.alumnos = this.alumnos.filter(a => a.codigo !== alumno.codigo);
                this.actualizarLocalStorage();
                this.resetFormulario();
                alert(`El alumno ${alumno.nombre} (Código: ${alumno.codigo}) ha sido eliminado con éxito.`);
            }
        },

        resetFormulario() {
            this.codigo = '';
            this.nombre = '';
            this.direccion = '';
            this.distrito = '';
            this.departamento = '';
            this.telefono = '';
            this.fechaNacimiento = '';
            this.sexo = '';
            this.email = '';
            this.editando = false;
        },

        actualizarLocalStorage() {
            localStorage.setItem('alumnos', JSON.stringify(this.alumnos));
        }
    }
}).mount('#app');















