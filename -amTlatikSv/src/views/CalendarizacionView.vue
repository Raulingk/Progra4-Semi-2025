<template>
  <div class="calendarizacion-view">
    <div class="calendar-header">
      <h1>Eventos Gastronómicos en El Salvador</h1>
      <p>Descubre festivales, ferias y eventos culinarios en todo el país</p>
    </div>
    
    <div class="calendar-controls">
      <div class="month-navigation">
        <button @click="cambiarMes(-1)">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2>{{ mesActual }} {{ añoActual }}</h2>
        <button @click="cambiarMes(1)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div class="view-options">
        <button :class="{ active: vistaActual === 'calendario' }" @click="vistaActual = 'calendario'">
          <i class="fas fa-calendar-alt"></i> Calendario
        </button>
        <button :class="{ active: vistaActual === 'lista' }" @click="vistaActual = 'lista'">
          <i class="fas fa-list"></i> Lista
        </button>
      </div>
      
      <div class="filter-options">
        <select v-model="filtroDepartamento">
          <option value="">Todos los departamentos</option>
          <option v-for="depto in departamentos" :key="depto" :value="depto">
            {{ depto }}
          </option>
        </select>
        
        <select v-model="filtroCategoria">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="calendar-container" v-if="vistaActual === 'calendario'">
      <div class="calendar-grid">
        <div class="calendar-weekdays">
          <div v-for="dia in diasSemana" :key="dia" class="weekday">
            {{ dia }}
          </div>
        </div>
        
        <div class="calendar-days">
          <div 
            v-for="(dia, index) in diasCalendario" 
            :key="index" 
            class="day"
            :class="{
              'current-month': dia.mesActual,
              'has-events': dia.eventos.length > 0,
              'today': dia.esHoy
            }"
          >
            <div class="day-number">{{ dia.numero }}</div>
            
            <div class="day-events">
              <div 
                v-for="evento in dia.eventos" 
                :key="evento.id" 
                class="event-indicator"
                :style="{ backgroundColor: getColorCategoria(evento.categoria) }"
                :title="evento.titulo"
              >
                {{ evento.titulo.substring(0, 15) }}...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="eventos-lista" v-if="vistaActual === 'lista'">
      <FestivalesComponent 
        v-for="evento in eventosFiltrados" 
        :key="evento.id" 
        :evento="evento" 
      />
    </div>
    
    <div class="eventos-proximos" v-if="vistaActual === 'calendario'">
      <h3>Eventos destacados de {{ mesActual }}</h3>
      <div class="proximos-container">
        <FestivalesComponent 
          v-for="evento in eventosDestacados" 
          :key="evento.id" 
          :evento="evento" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import FestivalesComponent from '@/components/FestivalesComponent.vue';

// Estado del componente
const fechaActual = ref(new Date());
const vistaActual = ref('calendario');
const filtroDepartamento = ref('');
const filtroCategoria = ref('');

// Datos de eventos
const eventos = ref([
  {
    id: "pupusas",
    titulo: "Festival de Pupusas 2025",
    fecha: "15 Octubre 2025",
    hora: "10:00 AM - 8:00 PM",
    ubicacion: "Parque Central de San Salvador",
    descripcion: "El evento más grande de pupusas tradicionales con más de 50 stands y competencias en vivo. Disfruta de variedades únicas como pupusas de loroco con queso, revueltas y ayote. Habrá talleres gratuitos para aprender a hacer pupusas, zona infantil con actividades y presentaciones culturales de música y danza tradicional.",
    descripcionCorta: "El festival más grande de pupusas en El Salvador con más de 50 stands y actividades culturales.",
    imagen: "/pupusas.png",
    categoria: "Festival",
    departamento: "San Salvador",
    organizador: "Municipalidad de San Salvador",
    frecuencia: "Anual",
    featured: true,
    reseñas: [
      "¡Las mejores pupusas que he probado en mi vida! La masa estaba perfecta - Carlos M.",
      "Llevé a mis hijos y aprendimos a hacer pupusas juntos. Experiencia inolvidable - Ana R.",
      "La variedad de curtidos era impresionante. ¡Volveré el próximo año! - Luis H."
    ]
  },
  {
    id: "maiz",
    titulo: "Festival del Maíz en Alegría",
    fecha: "18 Agosto 2025",
    hora: "9:00 AM - 5:00 PM",
    ubicacion: "Alegría, Usulután",
    descripcion: "Festival organizado por la parroquia San Pedro Apóstol para recaudar fondos. Disfruta de platillos tradicionales basados en maíz, como atoles, tortillas, tamales y más. Evento familiar con música en vivo, venta de artesanías y actividades para niños.",
    descripcionCorta: "Festival tradicional del maíz en el pintoresco pueblo de Alegría, Usulután.",
    imagen: "/maiz.png",
    categoria: "Festival",
    departamento: "Usulután",
    organizador: "Parroquia San Pedro Apóstol",
    frecuencia: "Anual",
    featured: true,
    reseñas: [
      "El ambiente en Alegría es mágico. Las vistas y la comida son increíbles - Sofía L.",
      "Los tamales de elote eran los mejores que he probado - Javier P.",
      "Evento familiar perfecto, mis hijos disfrutaron mucho - Marta G."
    ]
  },
  {
    id: "cafe",
    titulo: "Ruta del Café Artesanal",
    fecha: "5 Noviembre 2025",
    hora: "8:00 AM - 4:00 PM",
    ubicacion: "Fincas Cafetaleras de Apaneca",
    descripcion: "Recorrido guiado por las fincas cafetaleras más emblemáticas de Apaneca. Conoce el proceso completo desde la cosecha hasta la taza, con catación de variedades premium. Incluye transporte desde San Salvador, desayuno típico, almuerzo y muestras de café para llevar. Visita a cultivos orgánicos y proceso de tostado artesanal.",
    descripcionCorta: "Recorrido por fincas cafetaleras de Apaneca con catación de variedades premium.",
    imagen: "/cafe.png",
    categoria: "Tour",
    departamento: "Ahuachapán",
    organizador: "Asociación de Caficultores",
    frecuencia: "Trimestral",
    featured: false,
    reseñas: [
      "El tour por los cafetales al amanecer fue mágico - Roberto S.",
      "Nunca había apreciado tanto el trabajo detrás de una taza de café - Laura T.",
      "Los cafés gourmet eran exquisitos, especialmente el Pacamara - Diego M."
    ]
  },
  {
    id: "mercado",
    titulo: "Mercado Gastronómico Nocturno",
    fecha: "18 Noviembre 2025",
    hora: "5:00 PM - 11:00 PM",
    ubicacion: "Plaza El Salvador",
    descripcion: "Evento nocturno donde podrás disfrutar de lo mejor de la comida callejera salvadoreña en un ambiente festivo. Más de 30 puestos ofreciendo platillos tradicionales y fusiones innovadoras. Habrá barra de cócteles artesanales, música en vivo y área de juegos tradicionales. Perfecto para familias y grupos de amigos.",
    descripcionCorta: "Mercado nocturno con lo mejor de la comida callejera salvadoreña y música en vivo.",
    imagen: "/mercado.png",
    categoria: "Mercado",
    departamento: "San Salvador",
    organizador: "Plaza El Salvador",
    frecuencia: "Mensual",
    featured: false,
    reseñas: [
      "Las enchiladas estaban para chuparse los dedos - Patricia V.",
      "El ambiente con las luces y la música era increíble - Oscar R.",
      "Probé platillos que nunca había visto antes - Gabriela C."
    ]
  },
  {
    id: "postres",
    titulo: "Concurso de Postres Tradicionales",
    fecha: "25 Noviembre 2025",
    hora: "1:00 PM - 6:00 PM",
    ubicacion: "Salón de Eventos La Flor",
    descripcion: "Evento donde los mejores reposteros del país competirán por el título del mejor postre tradicional. Los asistentes podrán votar por su favorito y disfrutar de muestras gratuitas. Habrá categorías para semitas, quesadillas, marquesotes, atoles y postres innovadores basados en recetas tradicionales. Zona de venta para llevar postres a casa.",
    descripcionCorta: "Concurso nacional de postres tradicionales salvadoreños con degustaciones.",
    imagen: "/postres.png",
    categoria: "Concurso",
    departamento: "San Salvador",
    organizador: "Asociación de Reposteros",
    frecuencia: "Anual",
    featured: true,
    reseñas: [
      "La semita de piña ganó mi corazón - Luis H.",
      "Nunca había probado tantas variedades de marquesote - Daniela P.",
      "Los jueces eran muy conocedores y explicaban bien - Jorge R."
    ]
  },
  {
    id: "mariscos",
    titulo: "Festival del Marisco",
    fecha: "2 Diciembre 2025",
    hora: "11:00 AM - 9:00 PM",
    ubicacion: "Playa El Tunco",
    descripcion: "Disfruta de los más frescos mariscos preparados por chefs locales frente al mar. Evento con puestos de ceviches, cócteles, mariscadas y platillos innovadores. Habrá zona de hamacas, música en vivo y espectáculo de danza folklórica al atardecer. Perfecto para un día de playa con buena comida.",
    descripcionCorta: "Festival de mariscos frescos en la playa El Tunco con música y actividades.",
    imagen: "/mariscos.png",
    categoria: "Festival",
    departamento: "La Libertad",
    organizador: "Comité de Turismo de La Libertad",
    frecuencia: "Anual",
    featured: true,
    reseñas: [
      "Los cócteles de concha eran increíblemente frescos - María G.",
      "Ver el atardecer mientras comíamos fue inolvidable - Juan P.",
      "La atención en los puestos era muy buena - Carlos M."
    ]
  }
]);

// Datos auxiliares
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const departamentos = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad',
  'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador',
  'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután'
];
const categorias = [
  'Festival', 'Mercado', 'Concurso', 'Taller', 'Tour', 'Feria'
];

// Propiedades computadas
const añoActual = computed(() => fechaActual.value.getFullYear());
const mesActual = computed(() => meses[fechaActual.value.getMonth()]);

const eventosFiltrados = computed(() => {
  return eventos.value.filter(evento => {
    const matchesDepartamento = filtroDepartamento.value ? 
      evento.departamento === filtroDepartamento.value : true;
    
    const matchesCategoria = filtroCategoria.value ? 
      evento.categoria === filtroCategoria.value : true;
    
    return matchesDepartamento && matchesCategoria;
  });
});

const eventosDestacados = computed(() => {
  return eventosFiltrados.value.filter(evento => evento.featured);
});

const diasCalendario = computed(() => {
  const year = fechaActual.value.getFullYear();
  const month = fechaActual.value.getMonth();
  
  // Primer día del mes
  const firstDay = new Date(year, month, 1);
  
  // Último día del mes
  const lastDay = new Date(year, month + 1, 0);
  
  // Días en el mes
  const daysInMonth = lastDay.getDate();
  
  // Crear array de días
  const days = [];
  
  // Añadir días del mes anterior para completar la semana
  const startDayOfWeek = firstDay.getDay();
  for (let i = startDayOfWeek; i > 0; i--) {
    const prevDate = new Date(year, month, -i + 1);
    days.push({
      numero: prevDate.getDate(),
      mesActual: false,
      eventos: [],
      esHoy: false
    });
  }
  
  // Añadir días del mes actual
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const esHoy = date.toDateString() === today.toDateString();
    
    const eventosDia = eventos.value.filter(evento => {
      // Esta es una simplificación - en una app real tendrías fechas reales
      return evento.fecha.includes(i.toString());
    });
    
    days.push({
      numero: i,
      mesActual: true,
      eventos: eventosDia,
      esHoy
    });
  }
  
  return days;
});

// Métodos
const cambiarMes = (incremento) => {
  const newDate = new Date(fechaActual.value);
  newDate.setMonth(newDate.getMonth() + incremento);
  fechaActual.value = newDate;
};

const getColorCategoria = (categoria) => {
  const colores = {
    'Festival': '#ff6f61',
    'Mercado': '#4caf50',
    'Concurso': '#2196f3',
    'Taller': '#ff9800',
    'Tour': '#9c27b0',
    'Feria': '#e91e63'
  };
  
  return colores[categoria] || '#607d8b';
};

// Inicialización
onMounted(() => {
  // Aquí podrías cargar eventos desde una API
});
</script>

<style scoped>
.calendarizacion-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.calendar-header {
  text-align: center;
  margin-bottom: 30px;
}

.calendar-header h1 {
  font-size: 2.5rem;
  color: #222;
  margin-bottom: 10px;
}

.calendar-header p {
  font-size: 1.2rem;
  color: #555;
  max-width: 700px;
  margin: 0 auto;
}

.calendar-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 12px;
}

.month-navigation {
  display: flex;
  align-items: center;
  gap: 15px;
}

.month-navigation button {
  background: #ff6f61;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.month-navigation button:hover {
  background: #e0574e;
}

.month-navigation h2 {
  margin: 0;
  min-width: 200px;
  text-align: center;
}

.view-options {
  display: flex;
  gap: 10px;
}

.view-options button {
  background: #f0f0f0;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.view-options button.active {
  background: #ff6f61;
  color: white;
}

.view-options button:hover:not(.active) {
  background: #e0e0e0;
}

.filter-options {
  display: flex;
  gap: 10px;
}

.filter-options select {
  padding: 8px 15px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: white;
  min-width: 180px;
}

.calendar-grid {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #ff6f61;
  color: white;
  font-weight: bold;
}

.weekday {
  padding: 15px 0;
  text-align: center;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e0e0e0;
}

.day {
  background: white;
  min-height: 120px;
  padding: 10px;
  position: relative;
}

.day.current-month {
  background: white;
}

.day:not(.current-month) {
  background: #f9f9f9;
  color: #aaa;
}

.day.today {
  background: #fff9e6;
}

.day.today .day-number {
  font-weight: bold;
  color: #ff6f61;
}

.day.has-events {
  border-bottom: 2px solid #ff6f61;
}

.day-number {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.day-events {
  max-height: 90px;
  overflow-y: auto;
}

.event-indicator {
  font-size: 0.8rem;
  padding: 3px 6px;
  border-radius: 4px;
  color: white;
  margin-bottom: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-indicator:hover {
  opacity: 0.9;
}

.eventos-lista {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.eventos-proximos {
  margin-top: 40px;
}

.eventos-proximos h3 {
  text-align: center;
  margin-bottom: 25px;
  color: #222;
  font-size: 1.8rem;
  position: relative;
}

.eventos-proximos h3::after {
  content: "";
  display: block;
  width: 100px;
  height: 4px;
  background: #ff6f61;
  margin: 10px auto 0;
  border-radius: 2px;
}

.proximos-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

@media (max-width: 992px) {
  .calendar-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .month-navigation {
    justify-content: center;
  }
  
  .view-options, .filter-options {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .calendar-header h1 {
    font-size: 2rem;
  }
  
  .calendar-header p {
    font-size: 1rem;
  }
  
  .day {
    min-height: 100px;
  }
  
  .proximos-container {
    grid-template-columns: 1fr;
  }
  
  .filter-options {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .calendar-weekdays, .calendar-days {
    grid-template-columns: repeat(7, 1fr);
    font-size: 0.9rem;
  }
  
  .day {
    padding: 5px;
    min-height: 80px;
  }
  
  .day-number {
    font-size: 1rem;
  }
  
  .event-indicator {
    font-size: 0.7rem;
    padding: 2px 4px;
  }
}
</style>