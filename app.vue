<script setup lang="ts">
const selectedOption = ref('population');
const country = ref('');
const info = ref('population');
const value = ref('');
const url = ref('https://countriesnow.space/api/v0.1/countries/population');

function changeAPI(){
  if (selectedOption.value === 'population') {
    url.value = 'https://countriesnow.space/api/v0.1/countries/population';
  } else if (selectedOption.value === 'currency') {
    url.value = 'https://countriesnow.space/api/v0.1/countries/currency';
  } else if (selectedOption.value === 'capital') {
    url.value = 'https://countriesnow.space/api/v0.1/countries/capital';
  }
}

function fetchCountryInfo(countryId: string){
  const body = {
    country: countryId.toLowerCase()
  };
  fetch(url.value, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(response => response.json())
    .then(data => {
      if(selectedOption.value === 'population') {
        info.value = 'population';
        value.value = data.data.populationCounts[data.data.populationCounts.length - 1].value.toString();
      }
      else if(selectedOption.value === 'currency') {
        info.value = 'currency';
        value.value = data.data.currency;
      }
      else if(selectedOption.value === 'capital') {
        info.value = 'capital';
        value.value = data.data.capital;
      }
      country.value = countryId;
    });
}
</script>

<template>
    <div class="flex flex-col gap-12 w-full justify-center items-center">
      <div class="flex flex-row w-full justify-evenly items-center mt-10">
        <div class="text-3xl text-white font-black">Interactive World Map</div>
        <div>
          <label for="infoType" class="text-white">Choose information type:</label>
          <select id="infoType" v-model="selectedOption" @change="changeAPI" class="ml-2 p-2 rounded custom-input">
            <option value="population">Population 👥</option>
            <option value="currency">Currency 💵</option>
            <option value="capital">Capital 🗽</option>
          </select>
        </div>
      </div>
      <Map @submit="fetchCountryInfo"/>
      <Time :country="country" :info="info" :value="value"/>
    </div>
</template>

<style scoped>
.custom-input {
  background-color: var(--light);
  width: fit-content;
  border-radius: 1rem;
  border: 3px solid var(--secondary);
  padding: 5px 10px;
  color: var(--primary);
}
</style>
