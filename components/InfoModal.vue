<script setup lang="ts">
</script>

<template>
  <div class="absolute top-8 left-8">
    <div class="flex flex-row items-start justify-between bg-white/40 backdrop-blur-xl p-8 rounded-xl">
      <div class="flex flex-col gap-4 text-gray-800">
        <div class="flex flex-col gap-2">
          <div class="text-2xl font-bold">Intéractions collaboratives :</div>
          <ul class="text-xl list-disc ml-6">
            <li>Visualisation des utilisateurs connectés <span class="font-bold">(QUI ?)</span></li>
            <li>Visualisation de leurs positions <span class="font-bold">(OU ?)</span></li>
          </ul>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-2xl font-bold">Intéractions avancées :</div>
          <ul class="text-xl list-disc ml-6">
            <li><span class="font-bold">Simple clique</span> sur un pays pour afficher un bouton "like"</li>
            <li><span class="font-bold">Double clique</span> sur un pays pour liker instantanément</li>
            <br>
            <li><span class="font-bold">Clique droit</span> sur la page pour ouvrir la barre d'outils</li>
            <li class="flex flex-col">
              <ul class="list-disc ml-6">
                <li>La barre d'outils propose différentes options :</li>
                <ul class="list-circle ml-6">
                  <li><span class="font-bold">Supprimer</span> tous les pays marqués en favoris</li>
                  <li><span class="font-bold">Fermer</span> la barre d'outils</li>
                  <li><span class="font-bold">Déplacer</span> la barre d'outils en maintenant le bouton</li>
                  <li><span class="font-bold">Changer la couleur</span> de surbrillance des pays en<br>faisant du drag-and-drop des couleurs sur la carte</li>
                </ul>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div class="cursor-pointer hover:bg-white/10 rounded-lg transition-all" @click="$emit('close')">
        <Icon name="iconamoon:close-bold" class="text-gray-800" size="24"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-circle {
  list-style-type: circle;
}
</style>