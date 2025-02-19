<script setup lang="ts">
import {useWebSocketStore} from "~/stores/websocket";

const webSocketStore = useWebSocketStore();

function stringToColor(username: string | undefined) {
  if (!username) {
    console.log('Username is undefined in ConnectedUser component');
    return '#cccccc';
  }

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
  <div class="absolute top-8 right-8 flex flex-row justify-center items-end gap-1">
    <div class="connect">Connecté : </div>
    <div class="username" :style="{ color: `${stringToColor(webSocketStore.username)}`}">{{webSocketStore.username}}</div>
  </div>
</template>

<style scoped>
.connect {
  font-size: 0.85rem;
}

.username {
  font-size: 1rem;
  font-weight: bold;
}
</style>
