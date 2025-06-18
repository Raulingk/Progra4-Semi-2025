<template>
  <div class="comment-card" :class="{ 'highlighted': isHighlighted }">
    <div class="username">{{ comment.usuario }}</div>
    <div class="stars">
      <span v-for="star in 5" :key="star">
        <i 
          v-if="star <= comment.estrellas" 
          class="fas fa-star"
          style="color: gold;"
        ></i>
        <i 
          v-else 
          class="far fa-star"
          style="color: #ddd;"
        ></i>
      </span>
      <span class="rating">({{ comment.estrellas }})</span>
    </div>
    <div class="content">{{ comment.texto }}</div>
    <div class="reply" v-if="comment.respuesta">
      <strong>Respuesta:</strong> {{ comment.respuesta }}
    </div>
    <div class="actions">
      <button class="action-btn" @click="$emit('like')">
        <i class="fas fa-heart"></i> {{ comment.likes }}
      </button>
      <button class="action-btn" @click="$emit('reply')">
        <i class="fas fa-reply"></i> Responder
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  isHighlighted: {
    type: Boolean,
    default: false
  }
});

defineEmits(['like', 'reply']);
</script>

<style scoped>
.comment-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.comment-card.highlighted {
  border: 2px solid #ff6f61;
  box-shadow: 0 5px 15px rgba(255, 111, 97, 0.3);
  animation: pulse 1.5s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.comment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.username {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #ff6f61;
}

.stars {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stars i {
  font-size: 1.2rem;
  margin-right: 2px;
}

.rating {
  font-size: 0.9rem;
  color: #777;
  margin-left: 5px;
}

.content {
  color: #333;
  margin-bottom: 10px;
  line-height: 1.5;
}

.reply {
  background: #f7f7f7;
  border-left: 3px solid #ff6f61;
  padding: 12px;
  margin-top: 12px;
  border-radius: 5px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-btn {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover {
  background: #ff6f61;
  color: white;
  border-color: #ff6f61;
}

.action-btn i {
  font-size: 0.9rem;
}
</style>