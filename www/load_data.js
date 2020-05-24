let columns = []
let pokemons = [];
let pokemonCount = -1;

d3.csv(data_url).then(function (data) {
  data.forEach(pokemon => pokemons.push(pokemon));
  pokemonCount = pokemons.length;
  columns = Object.keys(pokemons[0]);
  console.log(columns);
  createChart(columns[7], columns[7], columns[2]);
  //tabulate(columns);
});
