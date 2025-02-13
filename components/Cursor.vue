<script setup lang="ts">
const props = defineProps<{
  username: string;
  posX: number;
  posY: number;
}>();

function stringToColor(username: string | undefined) {
  if (!username) {
    console.log('Username is undefined in Cursor component');
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
  return `${baseColor}50`;
}
</script>

<template>
  <div
      class="absolute flex flex-row justify-center items-start"
      :style="{ top: `${props.posY}px`, left: `${props.posX}px` }"
  >
    <Icon
        name="iconamoon:cursor-fill"
        :style="{color: stringToColor(username)}"
        class="mt-4"
    />
    <div
        class="tag flex flex-row justify-center items-start bg-opacity-50"
        :style="{
        border: `2px solid ${stringToColor(username)}`,
        background: `${stringToColorOpacity30(username)}`
      }"
    >
      <div class="username">{{ username || 'Anonymous' }}</div>
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
  margin-left: 4px;
  font-size: 0.75rem;
}
</style>