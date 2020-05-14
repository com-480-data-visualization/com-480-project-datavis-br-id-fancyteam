let columns = ['Id','Name','Type_1','Type_2','Total','HP',
                'Attack','Defense','Sp_Atk','Sp_Def','Speed',
                'Generation','Legendary']

let pokemons = [];
let pokemonCount = pokemons.length;

d3.csv(data_url).then(function(data) {
  data.forEach(pokemon => pokemons.push(pokemon));

  createChart("Attack", "Defense");
  //tabulate(columns);
});
