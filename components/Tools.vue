<script setup lang="ts">
import {useWebSocketStore} from "~/stores/websocket";
import {useCountriesStore} from "~/stores/countries";
const props = defineProps<{
  posX: number;
  posY: number;
}>();
const countriesStore = useCountriesStore();
const color = ref<string>(countriesStore.color);
const colorOpen = ref<boolean>(false);
const toolsDiv = ref<HTMLElement | null>(null);
const currentX = ref(props.posX + 5);
const currentY = ref(props.posY - 105);

onMounted(() => {
  if (toolsDiv.value) {
    toolsDiv.value.style.left = `${currentX.value}px`;
    toolsDiv.value.style.top = `${currentY.value}px`;
  }
});

function handleMouseDown(event: MouseEvent) {
  function handleMouseMove(e: MouseEvent) {
    if (toolsDiv.value) {
      currentX.value = e.clientX - 75;
      currentY.value = e.clientY - 37;
      toolsDiv.value.style.left = `${currentX.value}px`;
      toolsDiv.value.style.top = `${currentY.value}px`;
    }
  }
  function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function handleColorDragEnd(event: DragEvent, color: string) {
  console.log('Drag end:', color);
  countriesStore.setColor(color);
}

const webSocketStore = useWebSocketStore();
function stringToColor(username: string | undefined) {
  if (!username) {
    console.log('Username is undefined in Tool component');
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
  <div ref="toolsDiv" class="absolute flex flex-col items-start justify-start gap-1">
    <div class="flex flex-row items-center justify-center gap-1">
      <div class="tag2 flex justify-center items-center cursor-pointer" :style="{background: `${stringToColor(webSocketStore.username)}`}"
        @click="countriesStore.setCountries([])">
        <Icon name="tabler:trash" :size="24" />
      </div>
      <div class="tag2 flex justify-center items-center cursor-pointer" :style="{background: `${stringToColor(webSocketStore.username)}`}"
        @click="$emit('close')">
        <Icon name="iconamoon:close-bold" :size="24" />
      </div>
    </div>
    <div class="flex flex-row items-center justify-center gap-1">
      <div class="tag2 flex justify-center items-center cursor-pointer bg-green-500"
           draggable="true"
           @dragend="handleColorDragEnd($event, '#22c55e')">
        <Icon name="tabler:palette" :size="24" :style="{color: '#22c55e'}" />
      </div>
      <div class="tag2 flex justify-center items-center cursor-move" :style="{background: `${stringToColor(webSocketStore.username)}`}"
           @mousedown="handleMouseDown">
        <Icon name="tabler:arrows-move" :size="24" />
      </div>
    </div>
    <div class="flex flex-row items-center justify-center gap-1">
      <div class="tag2 flex justify-center items-center cursor-pointer bg-red-500"
          draggable="true"
           @dragend="handleColorDragEnd($event, '#ef4444')">
        <Icon name="tabler:palette" :size="24" :style="{color: '#ef4444'}" />
      </div>
      <div class="tag2 flex justify-center items-center cursor-pointer bg-yellow-500"
           draggable="true"
           @dragend="handleColorDragEnd($event, '#eab308')">
        <Icon name="tabler:palette" :size="24" :style="{color: '#eab308'}" />
      </div>
    </div>
    <div class="flex flex-row items-center justify-center gap-1">
      <div class="tag2 flex justify-center items-center cursor-pointer bg-purple-500"
           draggable="true"
           @dragend="handleColorDragEnd($event, '#a855f7')">
        <Icon name="tabler:palette" :size="24" :style="{color: '#a855f7'}" />
      </div>
      <div class="tag2 flex justify-center items-center cursor-pointer bg-teal-500"
           draggable="true"
           @dragend="handleColorDragEnd($event, '#14b8a6')">
        <Icon name="tabler:palette" :size="24" :style="{color: '#14b8a6'}" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag2 {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  padding: 12px;
  border-radius: 10px;
  -webkit-backdrop-filter: blur(5px);
  color: white;
}
</style>