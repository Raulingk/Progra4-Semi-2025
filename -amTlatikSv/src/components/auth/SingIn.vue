<template>
  <div v-if="show" class="modal" @click.self="close">
    <div class="modal-content" @click.stop>
      <span class="close-modal" @click="close">&times;</span>
      <h2 class="modal-title">Registrar</h2>

      <form @submit.prevent="handleSubmit">
        <p class="info-message">
          Tu nombre de usuario se generará automáticamente y se te mostrará al
          completar el registro.
        </p>

        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input 
            type="text" 
            id="nombre" 
            v-model="form.nombre"
            :class="{ error: errors.nombre }"
            required 
          />
          <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
        </div>

        <div class="form-group">
          <label for="apellido">Apellido</label>
          <input 
            type="text" 
            id="apellido" 
            v-model="form.apellido"
            :class="{ error: errors.apellido }"
            required 
          />
          <span v-if="errors.apellido" class="error-message">{{ errors.apellido }}</span>
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico <span class="optional">(Opcional)</span></label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email"
            :class="{ error: errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input 
            type="tel" 
            id="telefono" 
            v-model="form.telefono"
            :class="{ error: errors.telefono }"
            required 
          />
          <span v-if="errors.telefono" class="error-message">{{ errors.telefono }}</span>
        </div>

        <div class="form-group">
          <label for="region">Región</label>
          <select 
            id="region" 
            v-model="form.region"
            :class="{ error: errors.region }"
            required
          >
            <option value="" disabled selected>Selecciona tu región</option>
            <option value="norte">Norte</option>
            <option value="centro">Centro</option>
            <option value="sur">Sur</option>
          </select>
          <span v-if="errors.region" class="error-message">{{ errors.region }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña (mínimo 6 caracteres)</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password"
            :class="{ error: errors.password }"
            required 
            autocomplete="new-password"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="form.confirmPassword"
            :class="{ error: errors.confirmPassword }"
            required 
            autocomplete="new-password"
          />
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <div v-if="message" :class="messageType">
          {{ message }}
        </div>

        <button type="submit" class="btn-login" :disabled="isSubmitting">
          {{ isSubmitting ? 'Registrando...' : 'Registrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, inject } from 'vue'
const axios = inject('axios');  

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'register-success'])

const form = reactive({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  region: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  region: '',
  password: '',
  confirmPassword: ''
})

const message = ref('')
const messageType = ref('success-message')
const isSubmitting = ref(false)

const close = () => {
  emit('close')
}

const validateForm = () => {
  let isValid = true
  const newErrors = {}

  if (!form.nombre.trim()) {
    newErrors.nombre = 'El nombre es obligatorio'
    isValid = false
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre)) {
    newErrors.nombre = 'Solo se permiten letras en el nombre'
    isValid = false
  }

  if (!form.apellido.trim()) {
    newErrors.apellido = 'El apellido es obligatorio'
    isValid = false
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.apellido)) {
    newErrors.apellido = 'Solo se permiten letras en el apellido'
    isValid = false
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Por favor ingrese un email válido'
    isValid = false
  }

  if (!form.telefono) {
    newErrors.telefono = 'El teléfono es obligatorio'
    isValid = false
  } else if (!/^\d{8,}$/.test(form.telefono)) {
    newErrors.telefono = 'El teléfono debe tener al menos 8 dígitos'
    isValid = false
  }

  if (!form.region) {
    newErrors.region = 'Por favor seleccione una región'
    isValid = false
  }

  if (!form.password) {
    newErrors.password = 'La contraseña es obligatoria'
    isValid = false
  } else if (form.password.length < 6) {
    newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  if (form.password !== form.confirmPassword) {
    newErrors.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  // Actualizar errors
  Object.keys(errors).forEach(key => {
    errors[key] = newErrors[key] || ''
  })

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await axios.post('/auth/register.php', {
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email || null,
      telefono: form.telefono,
      region: form.region,
      password: form.password,
      confirmPassword: form.confirmPassword
    });  
    const result = await response.data

    if (result.success) {
      message.value = '✅ Registro exitoso. Por favor inicia sesión.'
      messageType.value = 'success-message'

      
      // Limpiar el formulario
      Object.keys(form).forEach(key => {
        form[key] = ''
      })

      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        close()
      }, 2000)
    } else {
      message.value = '❌ ' + result.message
      messageType.value = 'error-message'
    }
  } catch (error) {
    message.value = '❌ Error de conexión con el servidor'
    messageType.value = 'error-message'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Estilos específicos para el modal de registro */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-title {
  color: var(--primary-color);
  margin-bottom: 20px;
  text-align: center;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--gray);
}

.info-message {
  color: var(--gray);
  font-size: 0.8rem;
  margin-top: -10px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 1.2rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
}

.form-group input.error,
.form-group select.error {
  border-color: var(--error-color);
}

.error-message {
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.success-message {
  color: var(--success-color);
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
}

.btn-login {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  width: 100%;
}

.btn-login:hover {
  background-color: #7a3434;
}

.btn-login:disabled {
  background-color: var(--gray);
  cursor: not-allowed;
}

.optional {
  color: var(--gray);
  font-size: 0.8rem;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 20px;
  }
}
</style>