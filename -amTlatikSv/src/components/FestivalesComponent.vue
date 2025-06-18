<template>
  <div class="festival-card" :class="{ 'featured': evento.featured }">
    <div class="festival-image" :style="{ backgroundImage: `url(${evento.imagen})` }">
      <div class="festival-badge" v-if="evento.featured">
        <i class="fas fa-star"></i> Destacado
      </div>
    </div>
    
    <div class="festival-content">
      <div class="festival-header">
        <h3>{{ evento.titulo }}</h3>
        <div class="festival-meta">
          <span class="date">
            <i class="fas fa-calendar-day"></i> {{ evento.fecha }}
          </span>
          <span class="location">
            <i class="fas fa-map-marker-alt"></i> {{ evento.ubicacion }}
          </span>
        </div>
      </div>
      
      <p class="festival-description">{{ evento.descripcionCorta }}</p>
      
      <div class="festival-details">
        <div class="organizador">
          <i class="fas fa-users"></i> Organiza: {{ evento.organizador }}
        </div>
        <div class="frecuencia">
          <i class="fas fa-sync-alt"></i> Frecuencia: {{ evento.frecuencia }}
        </div>
      </div>
      
      <div class="festival-actions">
        <button class="btn-details" @click="verDetalles">
          <i class="fas fa-info-circle"></i> Ver detalles
        </button>
        <button class="btn-reminder" @click="agregarRecordatorio">
          <i class="fas fa-bell"></i> Recordarme
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  evento: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const verDetalles = () => {
  router.push({ name: 'evento-detalle', params: { id: evento.id } });
};

const agregarRecordatorio = () => {
  alert(`Recordatorio agregado para: ${evento.titulo}`);
  // Aquí iría la lógica para agregar a calendario del usuario
};
</script>

<style scoped>
.festival-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 25px;
  border: 1px solid #eee;
}

.festival-card.featured {
  border-left: 4px solid #ff6f61;
  box-shadow: 0 6px 20px rgba(255, 111, 97, 0.2);
}

.festival-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.festival-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.festival-badge {
  position: absolute;
  top: 15px;
  right: 0;
  background: linear-gradient(90deg, #ff6f61, #ff8e7d);
  color: white;
  padding: 6px 15px;
  border-radius: 20px 0 0 20px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.festival-content {
  padding: 20px;
}

.festival-header h3 {
  margin: 0 0 10px 0;
  color: #222;
  font-size: 1.4rem;
}

.festival-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #555;
}

.festival-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.festival-description {
  color: #444;
  line-height: 1.6;
  margin-bottom: 15px;
}

.festival-details {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #555;
}

.festival-details div {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f8f8f8;
  padding: 8px 12px;
  border-radius: 8px;
}

.festival-actions {
  display: flex;
  gap: 10px;
}

.btn-details, .btn-reminder {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-details {
  background: #ff6f61;
  color: white;
}

.btn-details:hover {
  background: #e0574e;
}

.btn-reminder {
  background: #f0f0f0;
  color: #555;
}

.btn-reminder:hover {
  background: #e0e0e0;
}

@media (max-width: 768px) {
  .festival-actions {
    flex-direction: column;
  }
  
  .festival-meta, .festival-details {
    flex-direction: column;
    gap: 8px;
  }
}
</style>