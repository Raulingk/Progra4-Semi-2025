<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';

const router = useRouter();
const isLoggedIn = ref(false);
const user = ref(null);
const showMenu = ref(false);
let hoverTimeout;
  
onMounted(() => {
  const savedUser = localStorage.getItem('user');
  const savedLogin = localStorage.getItem('isLoggedIn') === 'true';
  if (savedLogin && savedUser) {
    user.value = JSON.parse(savedUser);
    isLoggedIn.value = true;
  }
});

function handleLogout() {
  localStorage.removeItem('user');
  localStorage.setItem('isLoggedIn', 'false');
  location.reload();
}

function goToLogin() {
  router.push('/auth/login');
}

function handleMouseEnter() {
  clearTimeout(hoverTimeout);
  showMenu.value = true;
}

function handleMouseLeave() {
  hoverTimeout = setTimeout(() => {
    showMenu.value = false;
  }, 300);
}
</script>

<template>
  <header class="glass-header">
    <div class="logo-container">
      <img src="/logo.png" alt="Ñam Tlatik SV" class="logo animate__animated animate__fadeIn" />
      <h1 class="animate__animated animate__fadeIn">Ñam Tlatik SV</h1>
    </div>

    <div
      class="login-container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <button class="auth-btn animate__animated animate__fadeIn" @click="goToLogin">
        <i class="fas fa-user"></i>
        {{ isLoggedIn ? user?.nombre : 'Iniciar Sesión' }}
      </button>

      <div v-show="showMenu" class="login-menu">
        <p v-if="isLoggedIn" style="margin: 0 0 8px 0;">
          Hola, <strong>{{ user?.nombre }}</strong>
        </p>
        <button
          v-if="isLoggedIn"
          @click="handleLogout"
          style="background:#fff; color:#ff6f61; border:none; border-radius:5px; padding:5px 10px; cursor:pointer;"
        >
          Cerrar sesión
        </button>
        <p v-else>Bienvenido! Por favor inicia sesión.</p>
      </div>
    </div>
  </header>

  <nav class="main-nav animate__animated animate__fadeInDown">
    <RouterLink to="/" title="Geolocalización">Geolocalización</RouterLink>
    <RouterLink to="/calendarizacion" title="Calendarización">Calendarización</RouterLink>
    <RouterLink to="/recetas" title="Recetas">Recetas</RouterLink>
    <RouterLink to="/historia" title="Historia">Historia</RouterLink>
    <RouterLink to="/comunidad" title="Comunidad">Comunidad</RouterLink>
  </nav>
</template>

<style scoped>
header.glass-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 15px 30px;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
  transition: box-shadow 0.3s ease, background 0.3s ease;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
}

.logo-container img.logo {
  height: 50px;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.logo-container h1 {
  color: #222;
  font-weight: 700;
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease, filter 0.3s ease;
}

.logo-container:hover img.logo,
.logo-container:hover h1 {
  transform: scale(1.1);
  filter: drop-shadow(0 0 5px #ff6f61);
}

.auth-btn {
  background: #ff6f61;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(255, 111, 97, 0.5);
  transition: background 0.3s ease;
  animation: pulseBtn 3s infinite;
  position: relative;
}

.auth-btn:hover {
  background: #e85b4e;
}

@keyframes pulseBtn {
  0%,
  100% {
    box-shadow: 0 3px 6px rgba(255, 111, 97, 0.5);
    background-color: #ff6f61;
  }
  50% {
    box-shadow: 0 6px 12px rgba(255, 111, 97, 0.8);
    background-color: #ff826f;
  }
}

button#loginBtn[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: #ff6f61;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 0.85rem;
  opacity: 0.9;
  pointer-events: none;
  z-index: 200;
}

header.glass-header.scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.3);
}

nav.main-nav {
  display: flex;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  margin: 15px auto 30px auto;
  max-width: 800px;
  padding: 10px 0;
  transition: background 0.3s ease;
}

nav.main-nav a {
  color: #222;
  text-decoration: none;
  margin: 0 25px;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  padding: 5px 0;
  transition: color 0.3s ease;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.2);
}

nav.main-nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 3px;
  background: #ff6f61;
  transition: width 0.3s ease;
  border-radius: 3px;
}

nav.main-nav a:hover,
nav.main-nav a:focus {
  color: #ff6f61;
}

nav.main-nav a:hover::after,
nav.main-nav a:focus::after {
  width: 100%;
}
.login-container {
  position: relative;
}

.login-menu {
  position: absolute;
  top: 110%;
  right: 0;
  background: rgba(255, 111, 97, 0.95);
  padding: 10px 15px;
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 150;
  transition: opacity 0.3s ease;
}
/* NUEVO estilo para el menú desplegable */
#loginMenu {
  position: absolute;
  background: rgba(255, 111, 97, 0.95);
  padding: 10px 15px;
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 150;
  display: none;
  transition: opacity 0.3s ease;
}
</style>