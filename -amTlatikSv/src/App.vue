<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <Header  v-if="$route.name !== 'login'" />
  <RouterView />
</template>

<style scoped>

</style>
