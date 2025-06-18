<template>
  <div class="comunidad-view">
    <header>
      <h1>Comunidad Ñam Tlatik SV</h1>
      <p>Lee lo que otros opinan y comparte tu experiencia culinaria</p>
    </header>

    <div class="search-container">
      <div class="filter-section">
        <select v-model="filterStars" class="filter-select">
          <option value="">Filtrar por estrellas</option>
          <option v-for="n in 5" :value="6 - n" :key="n">
            {{ '★'.repeat(6 - n) }}
          </option>
        </select>
        <input 
          v-model="searchTerm"
          type="text" 
          placeholder="Buscar comentarios..." 
          class="search-input"
        />
      </div>
      <button class="search-btn" @click="applyFilters">
        <i class="fas fa-search"></i> Buscar
      </button>
    </div>

    <div class="comments-section">
      <CommentCard 
        v-for="(comment, index) in filteredComments" 
        :key="index"
        :comment="comment"
        :is-highlighted="highlightedIndex === index"
        @like="likeComment(index)"
        @reply="replyToComment(index)"
      />
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="currentPage = page"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
    </div>

    <div class="back-container">
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-left"></i> Volver
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import CommentCard from '@/components/CommentCard.vue';

const router = useRouter();

// Datos de los comentarios
const comentarios = ref([
  { usuario: "Ana Martínez", estrellas: 5, texto: "La pupusa con loroco es de otro nivel, como las de mi abuela!", respuesta: "¡Gracias Ana! Esa es una de nuestras recetas más queridas.", likes: 12 },
  { usuario: "Luis Velásquez", estrellas: 4, texto: "Me gustó el evento del Mercado Nocturno, ¡muy ambientado!", respuesta: "Qué bueno que lo disfrutaste, Luis. ¡Te esperamos en el próximo!", likes: 8 },
  { usuario: "Carmen Soto", estrellas: 3, texto: "Me faltó más variedad en los postres, pero buena atención.", respuesta: "Gracias por tu sugerencia, Carmen. Lo tomaremos en cuenta.", likes: 5 },
  { usuario: "José Menéndez", estrellas: 5, texto: "La historia detrás de los tamales me conmovió mucho.", respuesta: "¡Qué gusto que conectaste con nuestras raíces, José!", likes: 15 },
  { usuario: "Elena Ramírez", estrellas: 2, texto: "No encontré estacionamiento cerca del evento.", respuesta: "Gracias por el comentario, mejoraremos la logística.", likes: 3 },
  { usuario: "Gabriel Torres", estrellas: 4, texto: "Buen ambiente y recetas interesantes en el taller de maíz.", respuesta: "Gracias por participar Gabriel, fue un gusto tenerte.", likes: 7 },
  { usuario: "María Solano", estrellas: 5, texto: "¡Los chefs fueron súper amables y explicativos!", respuesta: "Nos alegra que hayas disfrutado el taller, María.", likes: 20 },
  { usuario: "Esteban Guevara", estrellas: 1, texto: "Llegué tarde y ya no me dejaron entrar al evento.", respuesta: "Lamentamos eso, Esteban. Mejoraremos el control de acceso.", likes: 2 },
  { usuario: "Rosa Aguilar", estrellas: 3, texto: "Faltaron opciones sin gluten, pero el sabor estaba excelente.", respuesta: "Gracias por el apunte, Rosa. Lo añadiremos a nuestras mejoras.", likes: 6 },
  { usuario: "Iván Méndez", estrellas: 5, texto: "El festival del marisco estuvo fenomenal.", respuesta: "Gracias Iván, ¡esperamos verte en más eventos!", likes: 18 },
  { usuario: "Laura Peña", estrellas: 4, texto: "Me encantó probar platillos que nunca había visto antes.", respuesta: "Esa es la idea, Laura. ¡Gracias por tu apoyo!", likes: 9 },
  { usuario: "Tomás Núñez", estrellas: 2, texto: "No pude asistir porque cambiaron el horario sin avisar.", respuesta: "Lamentamos el inconveniente Tomás, corregiremos eso.", likes: 4 },
]);

// Filtros y paginación
const filterStars = ref('');
const searchTerm = ref('');
const currentPage = ref(1);
const commentsPerPage = 6;
const highlightedIndex = ref(null);

// Comentarios filtrados
const filteredComments = computed(() => {
  let result = [...comentarios.value];
  
  // Filtrar por estrellas
  if (filterStars.value) {
    result = result.filter(c => c.estrellas == filterStars.value);
  }
  
  // Filtrar por término de búsqueda
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(c => 
      c.usuario.toLowerCase().includes(term) || 
      c.texto.toLowerCase().includes(term) ||
      (c.respuesta && c.respuesta.toLowerCase().includes(term))
    );
  }
  
  return result;
});

// Paginación
const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * commentsPerPage;
  return filteredComments.value.slice(start, start + commentsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredComments.value.length / commentsPerPage);
});

// Métodos
const applyFilters = () => {
  currentPage.value = 1;
};

const likeComment = (index) => {
  comentarios.value[index].likes = (comentarios.value[index].likes || 0) + 1;
  highlightedIndex.value = index;
  setTimeout(() => highlightedIndex.value = null, 2000);
};

const replyToComment = (index) => {
  alert(`Respondiendo al comentario de ${comentarios.value[index].usuario}`);
  // Aquí se implementaría la lógica para abrir un formulario de respuesta
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.comunidad-view {
  font-family: 'Segoe UI', sans-serif;
  background: #fffaf5;
  min-height: 100vh;
  padding-bottom: 40px;
}

header {
  background-color: #ff6f61;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, #ff9e7d, #ff6f61);
}

header h1 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

header p {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 30px auto;
  padding: 0 20px;
  flex-wrap: wrap;
  max-width: 1000px;
}

.filter-section {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
}

.search-input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 30px;
  min-width: 250px;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #ff6f61;
  box-shadow: 0 2px 8px rgba(255, 111, 97, 0.2);
}

.filter-select {
  padding: 12px 15px;
  border-radius: 30px;
  border: 1px solid #ddd;
  background: white;
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.search-btn {
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 25px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 8px rgba(255, 111, 97, 0.3);
}

.search-btn:hover {
  background-color: #e0574e;
  transform: translateY(-2px);
}

.comments-section {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 25px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 30px 0;
}

.pagination button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination button:hover {
  background: #ff6f61;
  color: white;
  border-color: #ff6f61;
}

.pagination button.active {
  background: #ff6f61;
  color: white;
  border-color: #ff6f61;
}

.back-container {
  text-align: center;
  margin-top: 40px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ff6f61;
  color: white;
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.back-btn:hover {
  background: #e0564e;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .search-btn {
    width: 100%;
    justify-content: center;
  }
  
  .comments-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  header h1 {
    font-size: 1.8rem;
  }
  
  header p {
    font-size: 1rem;
  }
  
  .search-input, .filter-select {
    min-width: 100%;
  }
}
</style>