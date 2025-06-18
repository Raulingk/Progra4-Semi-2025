<template>
  <div class="recetas-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h3 class="sidebar-title">Buscar Receta</h3>
      <input 
        type="text" 
        v-model="searchTerm"
        class="search-input" 
        placeholder="Buscar por nombre..." 
      />
      <ul class="recipe-list">
        <li 
          v-for="(receta, index) in filteredRecetas" 
          :key="index"
          @click="selectRecipe(index)"
          @keypress.enter="selectRecipe(index)"
          tabindex="0"
        >
          {{ receta.nombre }}
        </li>
        <li v-if="filteredRecetas.length === 0">No se encontraron recetas.</li>
      </ul>
    </aside>

    <main class="content">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i> Volver al inicio
      </button>

      <div class="recipe-detail">
        <img 
          :src="selectedRecipe.imagen" 
          :alt="'Imagen de ' + selectedRecipe.nombre" 
          class="recipe-image" 
        />
        <section class="ingredients">
          <h3>Ingredientes</h3>
          <ul>
            <li v-for="(ingrediente, idx) in selectedRecipe.ingredientes" :key="idx">
              {{ ingrediente }}
            </li>
          </ul>
        </section>
        <section class="instructions">
          <h3>Instrucciones</h3>
          <ol>
            <li v-for="(instruccion, idx) in selectedRecipe.instrucciones" :key="idx">
              {{ instruccion }}
            </li>
          </ol>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const searchTerm = ref('');
const selectedIndex = ref(0);

const recetas = ref([
  {
    nombre: "Pupusas",
    imagen: "/pupusas.jpeg",
    ingredientes: [
      "2 tazas de masa de maíz",
      "1 taza de frijoles refritos",
      "Queso rallado",
      "Chicharrón molido",
      "Curtido",
      "Salsa roja"
    ],
    instrucciones: [
      "Mezclar la masa con agua hasta obtener una consistencia manejable.",
      "Formar bolitas con la masa y hacer un hueco en el centro.",
      "Rellenar con frijoles, queso o chicharrón.",
      "Cerrar y aplanar formando una tortilla gruesa.",
      "Cocinar en comal caliente hasta dorar ambos lados.",
      "Servir con curtido y salsa."
    ]
  },
  {
    nombre: "Tamales",
    imagen: "/tamales.jpeg",
    ingredientes: [
      "Masa de maíz",
      "Hojas de plátano",
      "Carne de cerdo",
      "Aceitunas",
      "Pasas",
      "Salsa roja"
    ],
    instrucciones: [
      "Preparar la masa de maíz con caldo de pollo.",
      "Colocar masa en hoja de plátano.",
      "Agregar relleno de carne, aceitunas y pasas.",
      "Cerrar la hoja formando un paquete.",
      "Cocer al vapor por 1 hora.",
      "Servir caliente."
    ]
  },
  {
    nombre: "Empanadas",
    imagen: "/empanadasleche.jpeg",
    ingredientes: [
      "Masa de maíz",
      "Frijoles refritos",
      "Azúcar",
      "Aceite para freír"
    ],
    instrucciones: [
      "Formar discos con la masa.",
      "Rellenar con frijoles y azúcar.",
      "Cerrar bien los bordes.",
      "Freír en aceite caliente hasta dorar.",
      "Escurrir y servir."
    ]
  }
]);

const selectedRecipe = computed(() => {
  return recetas.value[selectedIndex.value] || recetas.value[0];
});

const filteredRecetas = computed(() => {
  if (!searchTerm.value) return recetas.value;
  const term = searchTerm.value.toLowerCase();
  return recetas.value.filter(r => 
    r.nombre.toLowerCase().includes(term)
  );
});

const selectRecipe = (index) => {
  selectedIndex.value = index;
};

const goBack = () => {
  router.push('/');
};

onMounted(() => {
  if (recetas.value.length > 0) {
    selectedIndex.value = 0;
  }
});
</script>

<style scoped>
.recetas-container {
  font-family: 'Arial', sans-serif;
  margin: 0; 
  padding: 0;
  background-color: #f9f9f9;
  color: #333;
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
  flex-direction: row;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #fff;
  border-right: 1.5px solid #ff6f61;
  box-shadow: 2px 0 5px rgba(0,0,0,0.03);
  padding: 20px 15px;
  overflow-y: auto;
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  color: #ff6f61;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: bold;
}

.search-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 25px;
  margin-bottom: 15px;
  font-size: 1rem;
}

ul.recipe-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 70vh;
  overflow-y: auto;
}

ul.recipe-list li {
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s ease;
}

ul.recipe-list li:hover {
  background: #ff6f61;
  color: white;
}

/* Main content */
.content {
  flex: 1;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
}

.back-btn {
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 25px;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-start;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(255,111,97,0.4);
  transition: background 0.3s ease;
}

.back-btn:hover {
  background: #e65151;
}

.recipe-detail {
  display: flex;
  gap: 30px;
  height: 70vh;
}

.recipe-image {
  max-width: 400px;
  border-radius: 15px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.ingredients, .instructions {
  background: white;
  border-radius: 15px;
  padding: 15px 20px;
  flex: 1;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.ingredients h3, .instructions h3 {
  color: #ff6f61;
  margin-top: 0;
  margin-bottom: 10px;
  border-bottom: 2px solid #ff6f61;
  padding-bottom: 5px;
}

/* Responsive */
@media (max-width: 900px) {
  .recetas-container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    min-height: auto;
    border-right: none;
    border-bottom: 1.5px solid #ff6f61;
    box-shadow: none;
    max-height: 200px;
    position: static;
  }
  .content {
    padding: 10px 20px;
  }
  .recipe-detail {
    flex-direction: column;
    height: auto;
  }
  .recipe-image {
    max-width: 100%;
    margin-bottom: 15px;
  }
}
</style>