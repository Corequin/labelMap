<script setup lang="ts">
const props = defineProps<{
  username: string;
  posX: number;
  posY: number;
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
</script>

<template>
  <div class="absolute flex flex-row justify-center items-start" :style="{ top: `${props.posY}px`, left: `${props.posX}px` }">
    <Icon name="iconamoon:cursor-fill" :style="{color: stringToColor(username)}" class="mt-4" />
    <div class="username" :style="{color: stringToColor(username)}">{{username}}</div>
  </div>
</template>

<style scoped>

</style>
