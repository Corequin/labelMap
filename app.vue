<script setup lang="ts">
import InfoModal from "~/components/InfoModal.vue";

const showInfo = ref(false);

function toggleInfo() {
  showInfo.value = !showInfo.value;
}
</script>

<template>
    <div class="relative h-screen w-full flex flex-col gap-12 justify-start items-center">
      <div class="flex flex-row items-center mt-12">
        <div class="flex flex-row items-center justify-center gap-4 text-3xl text-white font-black">
          Interactive World Map
          <Icon name="si:info-fill" class="cursor-help" @click="toggleInfo"/>
        </div>
      </div>
      <InfoModal v-if="showInfo" @close="toggleInfo"/>
      <Map/>
    </div>
</template>

<style scoped>

</style>
