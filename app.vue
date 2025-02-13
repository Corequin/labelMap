<script setup lang="ts">
const country = ref('');
const isModalOpen = ref<boolean>(false);

function openCountryModal(event: string) {
  country.value = event;
  isModalOpen.value = true;
}
</script>

<template>
    <div class="relative h-screen w-full flex flex-col gap-12 justify-start items-center">
      <div class="flex flex-row items-center mt-12">
        <div class="text-3xl text-white font-black">Interactive World Map</div>
      </div>
      <Map @country-id="openCountryModal($event)"/>
    </div>
</template>

<style scoped>

</style>
