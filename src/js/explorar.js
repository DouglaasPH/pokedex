let favoritos = localStorage.getItem("favoritos");
favoritos = JSON.parse(favoritos);
if (favoritos == null) favoritos = [];
console.log(favoritos);

const sectionTodosCards = document.getElementsByClassName(
  "section-todos-cards"
)[0];
const todosCards = document.getElementsByClassName("card");
const navegacao = document.getElementsByClassName("");
let paginaAtual = 1;
let paginaMaxima = 175;
const typeColors = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
};

async function pegarTodosPokemons() {
  const limit = 20;
  const offset = limit * (paginaAtual - 1);
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  const dados = await res.json();

  return dados.results;
}

async function pegarUmPokemon(url) {
  const res = await fetch(url);
  const dados = await res.json();
  return dados;
}

async function alterarPokemons() {
  const dadosDeTodosPokemons = await pegarTodosPokemons();

  dadosDeTodosPokemons.map(async (pokemon, pokemonIndex) => {
    const dadosDoPokemonAtual = await pegarUmPokemon(pokemon.url);
    todosCards[pokemonIndex].children[0].children[1].value =
      dadosDoPokemonAtual.id;
    todosCards[pokemonIndex].children[0].children[0].src =
      dadosDoPokemonAtual.sprites.other["official-artwork"].front_default;
    todosCards[pokemonIndex].children[1].children[0].textContent =
      dadosDoPokemonAtual.name.charAt(0).toUpperCase() +
      dadosDoPokemonAtual.name.slice(1) +
      " #" +
      dadosDoPokemonAtual.id;

    todosCards[pokemonIndex].children[0].style.backgroundColor =
      typeColors[dadosDoPokemonAtual.types[0].type.name];

    if (dadosDoPokemonAtual.types.length == 2) {
      dadosDoPokemonAtual.types.map((tipo, TipoIndex) => {
        todosCards[pokemonIndex].children[1].children[1].children[
          TipoIndex
        ].children[0].textContent = tipo.type.name;
      });
    } else {
      todosCards[
        pokemonIndex
      ].children[1].children[1].children[0].children[0].textContent =
        dadosDoPokemonAtual.types[0].type.name;
      todosCards[pokemonIndex].children[1].children[1].children[1].remove();
    }

    if (favoritos.length > 0) {
      if (favoritos.includes(String(dadosDoPokemonAtual.id))) {
        todosCards[pokemonIndex].children[0].children[1].children[0].src =
          "../images/estrela-amarela.svg";
      }
    }
  });
}

alterarPokemons();

document.querySelectorAll(".favorito").forEach((botaoFavorito) => {
  botaoFavorito.addEventListener("click", () => {
    const pokemon_id = botaoFavorito.value;
    if (favoritos.includes(pokemon_id)) {
      favoritos = favoritos.filter((favorito) => favorito !== botaoFavorito);
      botaoFavorito.children[0].src =
        "http://127.0.0.1:5500/src/images/estrela-branca.svg";
    } else {
      favoritos.push(pokemon_id);
      botaoFavorito.children[0].src =
        "http://127.0.0.1:5500/src/images/estrela-amarela.svg";
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  });
});

document
  .getElementsByClassName("ver-favoritos")[0]
  .addEventListener("click", () => {
    console.log(favoritos);
  });
