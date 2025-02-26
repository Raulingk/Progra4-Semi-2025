const materia = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            materias: [],
            idMateria: '',
            codigo: '',
            nombre: '',
            uv: '',
            alumnoRegistrado: false, // Propiedad para verificar si el alumno está registrado
            mensajeAdvertencia: '' // Propiedad para almacenar el mensaje de advertencia
        }
    },
    methods: {
        buscarMateria() {
            this.forms.buscarMateria.mostrar = !this.forms.buscarMateria.mostrar;
            this.$emit('buscar');
        },
        modificarMateria(materia) {
            this.accion = 'modificar';
            this.idMateria = materia.idMateria;
            this.codigo = materia.codigo;
            this.nombre = materia.nombre;
            this.uv = materia.uv;
        },
        verificarAlumno() {
            // Aquí deberías implementar la lógica para verificar si el alumno está registrado
            // Por ejemplo, podrías hacer una llamada a la base de datos o verificar en un array de alumnos registrados
            // Este es un ejemplo simple:
            const alumnoId = this.forms.alumnoId; // Suponiendo que tienes el ID del alumno en el formulario
            this.alumnoRegistrado = db.alumnos.some(alumno => alumno.id === alumnoId); // Verifica si el alumno está registrado
        },
        guardarMateria() {
            this.verificarAlumno(); // Verifica si el alumno está registrado antes de guardar

            if (!this.alumnoRegistrado) {
                this.mensajeAdvertencia = "El alumno no está registrado. No puede inscribir materias.";
                return; // Detiene la ejecución si el alumno no está registrado
            } else {
                this.mensajeAdvertencia = ''; // Limpia el mensaje si el alumno está registrado
            }

            let materia = {
                codigo: this.codigo,
                nombre: this.nombre,
                uv: this.uv
            };
            if (this.accion === 'modificar') {
                materia.idMateria = this.idMateria;
            }
            db.materias.put(materia);
            this.nuevoMateria();
            this.listarMaterias();
        },
        nuevoMateria() {
            this.accion = 'nuevo';
            this.idMateria = '';
            this.codigo = '';
            this.nombre = '';
            this.uv = '';
        }
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmMateria" name="frmMateria" @submit.prevent="guardarMateria">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de Materias</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">CODIGO</div>
                                <div class="col-9 col-md-4">
                                    <input required v-model="codigo" type="text" name="txtCodigoMateria" id="txtCodigoMateria" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">NOMBRE</div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zñÑáéíóú ]{3,150}" v-model="nombre" type="text" name="txtNombreMateria" id="txtNombreMateria" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">UV</div>
                                <div class="col-9 col-md-8">
                                    <input required v-model="uv" type="text" name="txtUVMateria" id="txtUVMateria" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning" @click="nuevoMateria">
                            <input type="button" @click="buscarMateria" value="Buscar" class="btn btn-info">
                        </div>
                    </div>
                </form>
                <div v-if="mensajeAdvertencia" class="alert alert-danger mt-2">
                    {{ mensajeAdvertencia }}
                </div>
            </div>
        </div>
    `
};