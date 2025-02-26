const docente = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            idDocente: '',
            nombre: '',
            telefono: '',
            direccion: '',
            mensajeAdvertencia: ''
        }
    },
    methods: {
        guardarDocente() {
            if (!this.nombre || !this.telefono || !this.direccion) {
                this.mensajeAdvertencia = "Todos los campos son obligatorios.";
                return;
            } else {
                this.mensajeAdvertencia = ''; // Limpia el mensaje si todos los campos son válidos
            }

            let nuevoDocente = {
                nombre: this.nombre,
                telefono: this.telefono,
                direccion: this.direccion
            };

            // Aquí puedes agregar la lógica para guardar el docente en la base de datos
            db.docentes.put(nuevoDocente); // Suponiendo que tienes una base de datos Dexie configurada

            this.nuevoDocente(); // Reinicia el formulario
        },
        nuevoDocente() {
            this.accion = 'nuevo';
            this.idDocente = '';
            this.nombre = '';
            this.telefono = '';
            this.direccion = '';
        }
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form @submit.prevent="guardarDocente">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de Docentes</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">NOMBRE</div>
                                <div class="col-9 col-md-6">
                                    <input required v-model="nombre" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">TELÉFONO</div>
                                <div class="col-9 col-md-6">
                                    <input required v-model="telefono" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">DIRECCIÓN</div>
                                <div class="col-9 col-md-6">
                                    <input required v-model="direccion" type="text" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning" @click="nuevoDocente">
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