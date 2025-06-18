<script setup>
import { ref, onMounted } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const center = ref({
  lat: 13.6929,
  lng: -89.2182
});

const userMarkerOptions = ref(null);

function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}

onMounted(async () => {
  try {
    const userLocation = await getUserLocation();
    center.value = userLocation;

    // Solo configurar icono si google.maps ya está disponible
    if (window.google && window.google.maps) {
      userMarkerOptions.value = {
        position: userLocation,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: 'white',
        }
      };
    }
  } catch (error) {
    console.error('Error getting user location:', error);
  }
});
</script>

<template>
  <div>
    <div class="search-bar">
      <input type="text" id="query" placeholder="Buscar lugares..." />
      <button type="button" id="searchBtn">Buscar</button>
    </div>
    <GoogleMap
    :api-key="key"
    style="width: 100%; height: 800px"
    :center="center"
    :zoom="15"
    >
    <Marker v-if="userMarkerOptions" :options="userMarkerOptions" />
  </GoogleMap>
</div>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.search-bar input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
}
.search-bar button {
  padding: 10px 15px;
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.search-bar button:hover {
  background-color: #357ae8;
}
</style>