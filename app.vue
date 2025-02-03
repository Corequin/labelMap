<script setup lang="ts">
const country = ref('');
const isModalOpen = ref<boolean>(false);

function openCountryModal(event: string) {
  country.value = event;
  isModalOpen.value = true;
}
</script>

<template>
    <div class="flex flex-col gap-12 w-full justify-center items-center">
      <div class="flex flex-row w-full justify-evenly items-center mt-10">
        <div class="text-3xl text-white font-black">Interactive World Map</div>
      </div>
      <Map @country-id="openCountryModal($event)"/>
    </div>
</template>

<style scoped>

</style>
