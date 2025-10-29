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

const pokemon_id = localStorage.getItem("verPokemonPorId");
const imagem = document.getElementsByClassName("imagem")[0];
const nome = document.getElementsByClassName("nome")[0];
const id = document.getElementsByClassName("id")[0];
const altura = document.getElementsByClassName("altura")[0];
const peso = document.getElementsByClassName("peso")[0];
const divParaTipos = document.getElementsByClassName("divParaTipos")[0];
console.log(pokemon_id);

async function pegarUmPokemon() {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_id}`);
  const dados = await res.json();

  imagem.src = await dados.sprites.other["official-artwork"].front_default;
  nome.textContent = dados.name.charAt(0).toUpperCase() + dados.name.slice(1);
  imagem.parentElement.style.backgroundColor =
    typeColors[dados.types[0].type.name];
  id.textContent = "#" + dados.id;
  altura.textContent = dados.height / 10 + "m";
  peso.textContent = dados.weight / 10 + "kg";
  console.log(dados.types[0].type.name, divParaTipos.children[0].children[0]);

  if (dados.types.length == 2) {
    dados.types.map((tipo, index) => {
      divParaTipos.children[index].children[0].textContent = tipo.type.name;
    });
  } else {
    divParaTipos.children[0].children[0].textContent = dados.types[0].type.name;
    divParaTipos.children[1].remove();
  }
}

pegarUmPokemon();
