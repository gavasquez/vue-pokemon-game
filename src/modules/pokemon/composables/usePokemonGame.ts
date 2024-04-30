import { computed, onMounted, ref } from 'vue';
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces';
import { pokemonApi } from '../api/pokemonApi';
import confetti from 'canvas-confetti';

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing);

  const pokemons = ref<Pokemon[]>([]);

  const pokemonsOptions = ref<Pokemon[]>([]);

  const isLoading = computed(() => pokemons.value.length === 0);

  const randomPokemon = computed(() => {
    /* Math.floor redondear y no devuelva decimales */
    const randoIndex = Math.floor(Math.random() * pokemonsOptions.value.length);
    return pokemonsOptions.value[randoIndex];
  });

  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/?limit=151');

    const pokemosArray = response.data.results.map((pokemon) => {
      const urlParts = pokemon.url.split('/');
      const id = urlParts.at(-2) ?? 0;
      return {
        name: pokemon.name,
        /* Para obtener el ante penultimo dato */
        /* Asi se obtiene el ultimo dato  urlParts.length - 1*/
        /* id: urlParts[urlParts.length - 2], */
        //* Tambien se puede de esta forma
        id: +id,
      };
    });
    /* Orden mezclado con el sort */
    return pokemosArray.sort(() => Math.random() - 0.5);
  };

  const getNextRound = (howMany = 4) => {
    gameStatus.value = GameStatus.Playing;
    /* Regresamos los primeros 4 del arreglo, cortamos de 0 a el valor que tenga el howMany */
    pokemonsOptions.value = pokemons.value.slice(0, howMany);
    /* Eliminamos esos 4 del arreglo original */
    pokemons.value = pokemons.value.slice(howMany);
  };

  const checkAnswer = (id: number) => {
    const hasWon = randomPokemon.value.id === id;
    //* Si gana
    if (hasWon) {
      gameStatus.value = GameStatus.Won;
      confetti({
        particleCount: 300,
        spread: 150,
        origin: { y: 0.6 },
      });
      return;
    }
    //* Si pierde
    gameStatus.value = GameStatus.Lost;
  };

  /* Cuando se monta se ejecuta el onMounted */
  onMounted(async () => {
    pokemons.value = await getPokemons();
    getNextRound();
  });

  return {
    /* Propiedades */
    gameStatus,
    isLoading,
    pokemonsOptions,
    randomPokemon,
    //* Metodos
    getNextRound,
    checkAnswer,
  };
};
