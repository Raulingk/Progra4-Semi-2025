<template>
  <div>
    <!-- Contenido principal -->
    <div class="container">
      <!-- Sidebar -->
      <div class="sidebar" :class="{ open: sidebarOpen }">
        <input 
          type="text" 
          v-model="searchTerm" 
          class="search-input"
          placeholder="Buscar historia..." 
          @input="filterHistorias"
        />
        <ul id="resultados">
          <li 
            v-for="historia in filteredHistorias" 
            :key="historia.id"
            @click="showDetail(historia.id)"
          >
            {{ historia.titulo }}
          </li>
          <li v-if="filteredHistorias.length === 0 && searchTerm.trim() !== ''">
            Historia no encontrada
          </li>
        </ul>
      </div>

      <!-- Área de contenido -->
      <div class="content">
        <!-- Vista de listado -->
        <div v-if="!showDetailView" class="historia-grid">
          <div 
            v-for="historia in filteredHistorias" 
            :key="historia.id" 
            class="historia-card"
            @click="showDetail(historia.id)"
          >
            <div class="historia-img">
              <img :src="historia.imagen" :alt="historia.titulo">
            </div>
            <div class="historia-content">
              <div class="historia-title">{{ historia.titulo }}</div>
              <div class="historia-desc">{{ truncateDescription(historia.descripcion) }}</div>
            </div>
          </div>
          <p v-if="filteredHistorias.length === 0" class="no-results">
            Historia no encontrada.
          </p>
        </div>

        <!-- Vista de detalle -->
        <div v-if="showDetailView" class="detalle">
          <img 
            :src="currentHistoria.imagen" 
            :alt="currentHistoria.titulo" 
            class="detalle-img"
          >
          <h2>{{ currentHistoria.titulo }}</h2>
          <p>{{ currentHistoria.descripcion }}</p>
          <button class="back-button" @click="goBackToList">← Volver</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Estado de la aplicación
const sidebarOpen = ref(false);
const searchTerm = ref('');
const showDetailView = ref(false);
const currentHistoria = ref(null);

// Datos de las historias
const historias = ref([
  {
    id: 1,
    titulo: "Pupusas",
    imagen: "/pupusas.jpeg",
    descripcion: "Las pupusas son uno de los símbolos culinarios más representativos de El Salvador. Su origen se remonta a los pueblos pipiles, quienes preparaban masas de maíz rellenas de ingredientes locales como frijoles, loroco y calabaza. Con el paso del tiempo, se incorporaron rellenos como queso, chicharrón y otros. Tradicionalmente cocinadas sobre comales de barro, las pupusas reflejan la fusión entre la cultura indígena y las influencias coloniales. Hoy en día, son patrimonio cultural y se celebran en ferias y festivales a lo largo del país. El proceso de preparación ha pasado de generación en generación, manteniendo vivo el conocimiento ancestral en la cocina salvadoreña."
  },
  {
    id: 2,
    titulo: "Montucas",
    imagen: "/montacua.jpg",
    descripcion: "Las montucas son una variante ancestral del tamal, preparadas a base de maíz tierno. Su sabor es dulce y suave, resultado de las costumbres indígenas de aprovechar el maíz en todas sus etapas. Eran comunes en celebraciones familiares y se preparaban con ingredientes sencillos."
  },
  {
    id: 3,
    titulo: "Nuégados",
    imagen: "nuegados.jpeg",
    descripcion: "Los nuégados son un postre típico salvadoreño, especialmente presente en las ferias y pueblos del interior. Elaborados con yuca rallada o masa de maíz, se fríen hasta quedar dorados y crujientes, para luego bañarse en una dulce miel de panela aromatizada con canela y clavo. Su origen está ligado a la creatividad de las cocineras rurales, quienes aprovechaban ingredientes sencillos para crear delicias irresistibles. El contraste entre lo crujiente del nuégado y lo espeso de la miel los convierte en una experiencia culinaria nostálgica y profundamente tradicional. Se considera un símbolo de la repostería artesanal de El Salvador."
  }
]);

// Filtrar historias basado en el término de búsqueda
const filteredHistorias = computed(() => {
  if (!searchTerm.value.trim()) return historias.value;
  
  const term = searchTerm.value.toLowerCase();
  return historias.value.filter(h => 
    h.titulo.toLowerCase().includes(term)
  );
});

// Mostrar detalle de una historia
const showDetail = (id) => {
  currentHistoria.value = historias.value.find(h => h.id === id);
  showDetailView.value = true;
};

// Volver al listado
const goBackToList = () => {
  showDetailView.value = false;
  currentHistoria.value = null;
};

// Alternar sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Truncar descripción para vista de listado
const truncateDescription = (desc) => {
  return desc.substring(0, 120) + '...';
};

// Obtener URL de imagen
const getImageUrl = (name) => {
  return new URL(`/src/assets/${name}`, import.meta.url).href;
};

// Inicializar mostrando todas las historias
onMounted(() => {
  // Inicialización adicional si es necesaria
});
</script>

<style scoped>
/* Sidebar search input igual que RecetasView */
.search-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 25px;
  margin-bottom: 15px;
  font-size: 1rem;
}

/* Estilos de la barra de navegación */
nav {
  background-color: #ff6f61;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  position: relative;
}

#toggleSidebarBtn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 20px;
}

.nav-links {
  flex: 1;
  text-align: center;
}

.nav-links a {
  margin: 0 15px;
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.nav-links a:hover {
  color: #ffe7e2;
}

.nav-links a.router-link-exact-active {
  text-decoration: underline;
  text-underline-offset: 5px;
}

.logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

/* Layout principal */
.container {
  display: flex;
  min-height: calc(100vh - 70px);
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #fff;
  border-right: 2px solid #ff6f61;
  padding: 20px;
  position: relative;
  z-index: 100;
}

.sidebar input {
  margin-top: 0;
}

#resultados {
  list-style: none;
  padding-left: 0;
  margin-top: 10px;
  max-height: 300px;
  overflow-y: auto;
}

#resultados li {
  padding: 6px 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  border-radius: 5px;
}

#resultados li:hover {
  background-color: #ffe2dc;
}

/* Contenido principal */
.content {
  flex: 1;
  padding: 30px;
}

/* Vista de listado */
.historia-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  min-height: 200px;
}

.historia-card {
  background-color: white;
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.historia-card:hover {
  transform: scale(1.02);
}

.historia-img {
  width: 100%;
  height: 180px;
}

.historia-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.historia-content {
  padding: 15px 20px;
}

.historia-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff6f61;
  margin-bottom: 10px;
}

.historia-desc {
  font-size: 1rem;
  color: #555;
  text-align: justify;
}

.no-results {
  font-size: 1.2rem;
  color: #555;
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
}

/* Vista de detalle */
.detalle {
  background: white;
  padding: 20px;
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-height: 80vh;
  overflow-y: auto;
}

.detalle-img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 20px;
  margin-bottom: 20px;
}

.detalle h2 {
  color: #ff6f61;
  margin-top: 0;
}

.detalle p {
  font-size: 1.05rem;
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 25px;
}

.back-button {
  display: inline-block;
  margin-top: 20px;
  background: #ff6f61;
  color: white;
  padding: 12px 30px;
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #e0574e;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  
  .sidebar {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .historia-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-links a {
    margin: 0 8px;
    font-size: 0.9rem;
  }
  
  .logo {
    width: 40px;
    height: 40px;
  }
}
</style>