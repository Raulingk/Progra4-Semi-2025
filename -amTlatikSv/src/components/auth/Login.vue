<template>
  <div class="login-root">
    <div class="main-container">
      <!-- Sección Izquierda -->
      <div class="login-left">
        <button class="back-button" @click="goBack">
          <i class="fas fa-arrow-left"></i> Atrás
        </button>
        <img src="/logo.png" alt="Logo Ñam Tlatik" class="login-logo" />
        <div class="welcome-message">
          <h2>Bienvenido de vuelta</h2>
          <p>Inicia sesión para acceder a tu cuenta</p>
        </div>
      </div>

      <!-- Sección Derecha -->
      <div class="login-right">
        <h1 class="login-title">Iniciar Sesión</h1>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="usuario">Usuario o Email</label>
            <input 
              type="text" 
              id="usuario" 
              v-model="loginForm.usuario"
              :class="{ error: errors.usuario }"
              required 
            />
            <span v-if="errors.usuario" class="error-message">{{ errors.usuario }}</span>
          </div>

          <div class="form-group">
            <label for="contrasena">Contraseña</label>
            <input 
              type="password" 
              id="contrasena" 
              v-model="loginForm.contrasena"
              :class="{ error: errors.contrasena }"
              required 
            />
            <span v-if="errors.contrasena" class="error-message">{{ errors.contrasena }}</span>
          </div>

          <div class="form-options">
            <div class="remember-me">
              <input 
                type="checkbox" 
                id="remember" 
                v-model="loginForm.remember"
              />
              <label for="remember">Recordarme</label>
            </div>
            <a href="#" class="forgot-password" @click.prevent="showForgotPassword = true">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button 
            type="submit" 
            class="btn-login" 
            :disabled="isLoading"
            @click.prevent="handleLogin" 
          >
            {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
          </button>

          <div v-if="generalError" class="error-message" style="text-align: center; margin-top: 10px;">
            {{ generalError }}
          </div>

          <div class="register-link">
            ¿No tienes una cuenta?
            <a href="#" @click.prevent="showRegisterModal=true">Regístrate aquí</a>
          </div>
        </form>
      </div>

      <!-- Modal de Recuperación de Contraseña -->
      <div v-if="showForgotPassword" class="modal" @click="closeForgotModal">
        <div class="modal-content" @click.stop>
          <span class="close-modal" @click="closeForgotModal">&times;</span>
          <h2 class="modal-title">Recuperar Contraseña</h2>

          <form @submit.prevent="handleForgotPassword">
            <div class="form-group">
              <label for="recoveryEmail">Correo Electrónico</label>
              <input
                type="email"
                id="recoveryEmail"
                v-model="recoveryEmail"
                required
              />
              <span v-if="errors.recoveryEmail" class="error-message">{{ errors.recoveryEmail }}</span>
            </div>

            <p style="margin-bottom: 20px; color: var(--gray); font-size: 0.9rem">
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </p>

            <div v-if="recoveryMessage" :class="recoveryMessageType">
              {{ recoveryMessage }}
            </div>

            <button type="submit" class="btn-login">Enviar Instrucciones</button>
          </form>
        </div>
      </div>
       <!-- Modal de Registro (componente importado) -->
      <SingIn 
        :show="showRegisterModal" 
        @close="showRegisterModal = false" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import SingIn from '@/components/auth/SingIn.vue'

const axios = inject('axios');  


const router = useRouter()
const showRegisterModal = ref(false) 

// Emit events
const emit = defineEmits(['show-register', 'login-success'])

// Reactive data
const loginForm = reactive({
  usuario: '',
  contrasena: '',
  remember: false
})

const errors = reactive({
  usuario: '',
  contrasena: '',
  recoveryEmail: ''
})

const isLoading = ref(false)
const generalError = ref('')
const showForgotPassword = ref(false)
const recoveryEmail = ref('')
const recoveryMessage = ref('')
const recoveryMessageType = ref('success-message')

// Methods
const goBack = () => {
  // Recarga la página para limpiar cualquier estado y estilos
 router.push ('/')
  
}

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  generalError.value = ''
}

const handleLogin = async () => {
  clearErrors()
  
  if (!loginForm.usuario.trim()) {
    errors.usuario = 'El usuario es requerido'
    return
  }
  
  if (!loginForm.contrasena.trim()) {
    errors.contrasena = 'La contraseña es requerida'
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post('/auth/login.php', {
      email: loginForm.usuario,
      password: loginForm.contrasena
    }); 

    const result = await response.data

    if (!result.success) {
      generalError.value = '❌ ' + result.message
      return
    }

    // Guardar información del usuario
    localStorage.setItem('user', JSON.stringify(result.user))
    localStorage.setItem('isLoggedIn', 'true')
    
    emit('login-success', result.user)
    router.push('/') 
    
  } catch (error) {
    generalError.value = '❌ Error de conexión con el servidor'
  } finally {
    isLoading.value = false
  }
}

const closeForgotModal = () => {
  showForgotPassword.value = false
  recoveryEmail.value = ''
  recoveryMessage.value = ''
  errors.recoveryEmail = ''
}

const handleForgotPassword = () => {
  if (!recoveryEmail.value.trim()) {
    errors.recoveryEmail = 'Por favor ingrese su correo electrónico'
    return
  }

  // Simular envío de email
  recoveryMessage.value = `Se han enviado instrucciones a ${recoveryEmail.value}`
  recoveryMessageType.value = 'success-message'

  setTimeout(() => {
    closeForgotModal()
  }, 2000)
}
</script>

<style scoped>
.login-root {
  --primary-color: #913e3e;
  --secondary-color: #f8dc9e;
  --text-color: #1d3557;
  --background-color: #fdf1d6;
  --input-border: #9cb49c;
  --success-color: #4caf50;
  --error-color: #f44336;
  --gray: #6c757d;
  min-height: 100vh;
  width: 100vw;
  background-color: var(--background-color);
  font-family: "Poppins", sans-serif;
}

/* CONTENEDOR PRINCIPAL */
.main-container {
  display: flex;
  height: 100vh;
  position: relative;
}

/* SECCIÓN IZQUIERDA (LOGIN) */
.login-left {
  background-color: var(--primary-color);
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  transition: all 0.5s ease;
  position: relative;
}

/* Botón Atrás */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.back-button i {
  margin-right: 5px;
}

.login-logo {
  max-width: 250px;
  height: auto;
  margin-bottom: 20px;
}

/* SECCIÓN DERECHA (LOGIN) */
.login-right {
  width: 60%;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.5s ease;
  position: relative;
}

.login-title {
  color: var(--text-color);
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
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

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
}

.form-group input.error {
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

.info-message {
  color: var(--gray);
  font-size: 0.8rem;
  margin-top: -10px;
  margin-bottom: 15px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
}

/* CHECKBOX CON EFECTO MEJORADO */
.remember-me input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid var(--primary-color);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  margin-right: 8px;
}

.remember-me input[type="checkbox"]:checked {
  background-color: var(--primary-color);
}

.remember-me input[type="checkbox"]:checked::after {
  content: "✓";
  position: absolute;
  color: white;
  font-size: 14px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.remember-me input[type="checkbox"]:hover {
  box-shadow: 0 0 5px var(--primary-color);
}

.remember-me label {
  cursor: pointer;
  transition: all 0.2s ease;
}

.remember-me input[type="checkbox"]:checked + label {
  color: var(--primary-color);
  font-weight: 600;
}

.forgot-password {
  font-size: 0.9rem;
  color: var(--text-color);
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
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
}

.btn-login:hover {
  background-color: #7a3434;
}

.btn-login:disabled {
  background-color: var(--gray);
  cursor: not-allowed;
}

.register-link {
  margin-top: 20px;
  font-size: 0.9rem;
  text-align: center;
}

.register-link a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

/* MODAL DE RECUPERACIÓN */
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

/* RESPONSIVE */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .login-left,
  .login-right {
    width: 100%;
    padding: 2rem;
  }

  .login-left {
    padding-top: 3rem;
    padding-bottom: 2rem;
  }

  .modal-content {
    padding: 20px;
  }
}
</style>