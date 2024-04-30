<template>
  <section
    v-if="isLoading || randomPokemon.id === null"
    class="flex flex-col justify-center items-center w-screen h-screen"
  >
    <h1 class="text-3xl">Espere por favor</h1>
    <h3 class="animate-pulse">Cargando Pokémons</h3>
  </section>

  <section v-else class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="m-5">¿Quien es este Pokémon?</h1>
    <div class="h-20">
      <button
        v-if="gameStatus !== GameStatus.Playing"
        class="bg-blue-500 text-white shadow-md rounded-lg p-2 m-1 cursor-pointer w-40 text-center transition-all hover:bg-gray-600"
        @click="getNextRound()"
      >
        ¿Jugar de nuevo?
      </button>
    </div>

    <!-- <p class="capitalize">{{ gameStatus }}</p> -->
    <!-- Pokemon picture -->
    <PokemonPicture
      :pokemon-id="randomPokemon.id"
      :show-pokemon="gameStatus !== GameStatus.Playing"
    />
    <!-- Pokemon options -->
    <PokemonOptions
      :block-selection="gameStatus !== GameStatus.Playing"
      :options="options"
      :correct-answer="randomPokemon.id"
      @selected-options="checkAnswer"
    />
  </section>
</template>

<script lang="ts" setup>
import PokemonPicture from '../components/PokemonPicture.vue';
import PokemonOptions from '../components/PokemonOptions.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const {
  randomPokemon,
  gameStatus,
  isLoading,
  pokemonsOptions: options,
  checkAnswer,
  getNextRound,
} = usePokemonGame();
console.log(gameStatus.value === GameStatus.Playing);
</script>

<style scoped></style>
