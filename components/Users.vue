<script setup lang="ts">
import type {User} from "~/types/types";

const props = defineProps<{
  users: User[];
}>();

const emit = defineEmits<{
  (e: 'selectUser', user: User): void
}>()

function spreadEvent(user: User) {
  emit('selectUser', user);
}

function stringToColor(username: string | undefined) {
  if (!username) {
    console.warn('Username is undefined in Users component');
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

function stringToColorOpacity30(username: string | undefined) {
  const baseColor = stringToColor(username);
  return `${baseColor}30`;
}
</script>

<template>
  <div class="absolute bottom-8 left-8 flex flex-row justify-center items-start gap-2 cursor-pointer">
    <div
        v-for="user in props.users"
        :key="user.username || Math.random()"
        @click="spreadEvent(user)"
        class="tag flex flex-row justify-center items-start bg-opacity-50"
        :style="{
        top: `${user.posY}px`,
        left: `${user.posX}px`,
        border: `2px solid ${stringToColor(user.username)}`,
        background: `${stringToColorOpacity30(user.username)}`
      }"
    >
      <div class="username">{{ user.username || 'Anonymous' }}</div>
    </div>
  </div>
</template>

<style scoped>
.tag {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  padding: 4px 10px;
  border-radius: 100px;
  -webkit-backdrop-filter: blur(5px);
  color: white;
}

.username {
  font-size: 0.75rem;
  color: white;
}
</style>