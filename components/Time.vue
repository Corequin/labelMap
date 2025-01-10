<script setup lang="ts">
defineProps({
  country: String,
  info: String,
  value: String,
})
</script>

<template>
  <div id="timeCont">
    <p id="time" v-if="country!=='' && info!=='' && value!==''">{{country}}'s {{ info }} is {{value}}</p>
    <p id="time" v-else>Select a country to get information about it.</p>
  </div>
</template>

<style scoped>
#timeCont{
  background-color: var(--light);
  width: fit-content;
  font-size: 1.5rem;
  padding: 5px 5px;
  border-radius: 5px;
  border: 3px solid var(--secondary);
}
</style>
