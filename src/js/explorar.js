let favoritos = localStorage.getItem("favoritos");
favoritos = JSON.parse(favoritos);
if (favoritos == null) favoritos = [];

const sectionTodosCards = document.getElementsByClassName(
  "section-todos-cards"
)[0];
const botaoVerFavoritos = document.getElementsByClassName("ver-favoritos")[0];
const input = document.getElementsByTagName("input")[0];
let verFavoritos = false;
let usuarioEstaBuscandoPokemon = false;
const todosCards = document.getElementsByClassName("card");
const paginacao = document.getElementById("paginacao");
let paginaAtual = 1;
const pokemonsPorPagina = 20;
const totalPokemons = 1050;
const totalPaginas = Math.ceil(totalPokemons / pokemonsPorPagina);
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

async function pegarPokemonComBaseEmIdOuNome(nome_ou_id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome_ou_id}`);
  return await res.json();
}

async function carregarApenasPokemonsFavoritos() {
  const dadosDosPokemonsFavoritos = [];

  for (const pokemon_id of favoritos) {
    const dados = await pegarPokemonComBaseEmIdOuNome(pokemon_id);
    dadosDosPokemonsFavoritos.push(dados);
  }

  if (sectionTodosCards.children.length > 0) sectionTodosCards.innerHTML = "";

  dadosDosPokemonsFavoritos.map(async (pokemonFavorito) => {
    const {
      pokemon_id,
      imagem_do_pokemon,
      nome_do_pokemon_com_id,
      tipo_principal,
      background_color,
      iconeFavorito,
      dadosDoPokemonAtual,
    } = criarDadosDoPokemon(pokemonFavorito);

    criarCard(
      pokemon_id,
      imagem_do_pokemon,
      nome_do_pokemon_com_id,
      tipo_principal,
      background_color,
      iconeFavorito,
      dadosDoPokemonAtual
    );
  });
}

function criarCard(
  pokemon_id,
  imagem_do_pokemon,
  nome_do_pokemon_com_id,
  tipo_principal,
  background_color,
  iconeFavorito,
  dadosDoPokemonAtual
) {
  const card = document.createElement("div");
  card.className = "h-3/4 relative rounded-md";

  card.innerHTML = `
              <div
          class="bg-[#0a0000] border-1 border-[#2b0000] rounded-xl p-4 flex flex-col justify-between gap-4 h-80 md:h-100 lg:h-80 xl:h-100 cursor-pointer hover:scale-105 hover:drop-shadow-[0_5px_5px_rgba(102,0,0,0.3)] cursor-pointer hover:scale-105 transform transition-all duration-300 card"
        >
          <div class="bg-[${background_color}] h-3/4 relative rounded-md">
            <img src="${imagem_do_pokemon}" alt="pokemon" class="w-full h-full" />
            <button
              class="absolute -top-0 -right-0 right-3 top-2 cursor-pointer hover:bg-[#ffcc00]/20 rounded-full p-1 hover:scale-110 transform transition-all duration-300 favorito" value="${pokemon_id}"
            >
              <img
                src="${iconeFavorito}"
                alt="favorito"
                class="size-5"
              />
            </button>
          </div>
          <div class="h-1/4 flex flex-col gap-3">
            <h4 class="orbitron text-[#ffcc00]">${nome_do_pokemon_com_id}</h4>
            <div class="flex gap-2">
              <div
                class="bg-[#ffcc00]/20 px-3 py-0.5 rounded-full border-1 border-[#ffcc00]/50"
              >
                <p class="font-poppins-card text-[#ffcc00]/70 text-[10px]">
                ${tipo_principal}
                </p>
              </div>
                  ${
                    dadosDoPokemonAtual.types.length == 2
                      ? `              <div
                class="bg-[#ffcc00]/20 px-3 py-0.5 rounded-full border-1 border-[#ffcc00]/50"
              >
                <p class="font-poppins-card text-[#ffcc00]/70 text-[10px]">
                  ${dadosDoPokemonAtual.types[1].type.name}
                </p>
              </div>`
                      : null
                  }
            </div>
          </div>
        </div>
      `;

  card.addEventListener("click", () => {
    localStorage.setItem("verPokemonPorId", pokemon_id);
    window.location.href = "informacoesDoPokemon.html";
  });

  sectionTodosCards.appendChild(card);

  const botaoFavorito = card.querySelector(".favorito");

  botaoFavorito.addEventListener("click", (event) => {
    event.stopPropagation();
    const pokemon_id = botaoFavorito.value;
    if (favoritos.includes(pokemon_id)) {
      favoritos = favoritos.filter(
        (favorito) => favorito !== botaoFavorito.value
      );
      botaoFavorito.children[0].src = "../images/estrela-branca.svg";
    } else {
      favoritos.push(pokemon_id);
      botaoFavorito.children[0].src = "../images/estrela-amarela.svg";
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  });
}

function criarDadosDoPokemon(dadosDoPokemonAtual) {
  const pokemon_id = dadosDoPokemonAtual.id;
  const imagem_do_pokemon =
    dadosDoPokemonAtual.sprites.other["official-artwork"].front_default;
  const nome_do_pokemon_com_id =
    dadosDoPokemonAtual.name.charAt(0).toUpperCase() +
    dadosDoPokemonAtual.name.slice(1) +
    " #" +
    pokemon_id;
  const tipo_principal = dadosDoPokemonAtual.types[0].type.name;
  const background_color = typeColors[dadosDoPokemonAtual.types[0].type.name];
  let iconeFavorito = "";
  if (favoritos.length > 0) {
    if (favoritos.includes(String(dadosDoPokemonAtual.id))) {
      iconeFavorito = "../images/estrela-amarela.svg";
    }
  } else {
    iconeFavorito = "../images/estrela-branca.svg";
  }

  return {
    pokemon_id,
    imagem_do_pokemon,
    nome_do_pokemon_com_id,
    tipo_principal,
    background_color,
    iconeFavorito,
    dadosDoPokemonAtual,
  };
}

async function carregarPokemons() {
  const dadosDeTodosPokemons = await pegarTodosPokemons();
  if (sectionTodosCards.children.length > 0) sectionTodosCards.innerHTML = "";

  dadosDeTodosPokemons.map(async (pokemon) => {
    const res = await pegarUmPokemon(pokemon.url);
    const {
      pokemon_id,
      imagem_do_pokemon,
      nome_do_pokemon_com_id,
      tipo_principal,
      background_color,
      iconeFavorito,
      dadosDoPokemonAtual,
    } = criarDadosDoPokemon(res);

    criarCard(
      pokemon_id,
      imagem_do_pokemon,
      nome_do_pokemon_com_id,
      tipo_principal,
      background_color,
      iconeFavorito,
      dadosDoPokemonAtual
    );
  });
}

carregarPokemons();

function renderizarPaginacao() {
  paginacao.innerHTML = "";
  if (verFavoritos || usuarioEstaBuscandoPokemon) return;

  const botaoAnterior = document.createElement("button");
  botaoAnterior.innerHTML = `<img src="../images/chevron-left.svg" alt="anterior" />`;
  botaoAnterior.className =
    "hover:bg-[#ffcc00]/20 rounded-full w-8 py-1 flex justify-center items-center cursor-pointer";
  botaoAnterior.disabled = paginaAtual === 1;
  botaoAnterior.addEventListener("click", () => mudarPagina(paginaAtual - 1));
  paginacao.appendChild(botaoAnterior);

  const inicio = Math.max(1, paginaAtual - 2);
  const fim = Math.min(totalPaginas, paginaAtual + 2);

  for (let i = inicio; i <= fim; i++) {
    const botao = document.createElement("button");
    botao.textContent = i;
    botao.className =
      "hover:bg-[#ffcc00]/20 rounded-full w-9 py-2 cursor-pointer font-poppins-card text-sm";
    if (i === paginaAtual) {
      botao.classList.add("bg-[#ffcc00]", "text-black");
    }
    botao.addEventListener("click", () => mudarPagina(i));
    paginacao.appendChild(botao);
  }

  const botaoProximo = document.createElement("button");
  botaoProximo.innerHTML = `<img src="../images/chevron-right.svg" alt="próximo" />`;
  botaoProximo.className =
    "hover:bg-[#ffcc00]/20 rounded-full w-8 py-1 flex justify-center items-center cursor-pointer";
  botaoProximo.disabled = paginaAtual === totalPaginas;
  botaoProximo.addEventListener("click", () => mudarPagina(paginaAtual + 1));
  paginacao.appendChild(botaoProximo);
}

function mudarPagina(novaPagina) {
  if (novaPagina < 1 || novaPagina > totalPaginas) return;
  paginaAtual = novaPagina;

  renderizarPaginacao();
  carregarPokemons();
}

renderizarPaginacao();

botaoVerFavoritos.addEventListener("click", async () => {
  input.value = "";
  input.disabled = true;
  verFavoritos = !verFavoritos;
  renderizarPaginacao();
  if (verFavoritos) carregarApenasPokemonsFavoritos();
  else {
    carregarPokemons();
    input.disabled = false;
  }
});

input.addEventListener("input", async (event) => {
  usuarioEstaBuscandoPokemon = true;
  renderizarPaginacao();
  sectionTodosCards.innerHTML = "";
  try {
    const res = await pegarPokemonComBaseEmIdOuNome(event.target.value);
    const {
      pokemon_id,
      imagem_do_pokemon,
      nome_do_pokemon_com_id,
      tipo_principal,
      background_color,
      iconeFavorito,
      dadosDoPokemonAtual,
    } = criarDadosDoPokemon(res);

    criarCard(
      pokemon_id,
      imagem_do_pokemon,
      nome_do_pokemon_com_id,
      tipo_principal,
      background_color,
      iconeFavorito,
      dadosDoPokemonAtual
    );
  } catch (error) {
    if (event.target.value === "") {
      usuarioEstaBuscandoPokemon = false;
      carregarPokemons();
      renderizarPaginacao();
    }
  }
});
