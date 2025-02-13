<script setup lang="ts">
const props = defineProps<{
  username: string;
}>();

function stringToColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 16)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

function stringToColorOpacity30(username: string) {
  const baseColor = stringToColor(username);
  return `${baseColor}30`;
}
</script>

<template>
  <div class="absolute w-full h-full bg-transparent flex flex-row justify-end items-start viewly"
       :style="{
        border: `8px solid ${stringToColor(username)}`,
      }"
  >
    <div
        class="tag flex flex-row justify-center items-start bg-opacity-50 mt-6 mr-6 cursor-pointer"
        :style="{
          border: `3px solid ${stringToColor(username)}`,
          background: `${stringToColorOpacity30(username)}`
        }"
        @click="$emit('stop-following')"
    >
      <div class="username">Arrêter de suivre : {{ username || 'Anonymous' }}</div>
    </div>
  </div>
</template>

<style scoped>
.viewly {
  z-index: 1000;
  border-radius: 10px;
}
.tag {
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  padding: 4px 10px;
  border-radius: 100px;
  margin-left: 5px;
  -webkit-backdrop-filter: blur(5px);
  cursor: pointer;
}
.username {
  font-size: 1rem;
  font-weight: bold;
  color: white;
}
</style>