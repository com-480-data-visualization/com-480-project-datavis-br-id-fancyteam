let columns = []
let pokemons = [];
let pokemonCount = -1;

d3.csv(data_url).then(function(data) {
  data.forEach(pokemon => pokemons.push(pokemon));
  pokemonCount = pokemons.length;
  columns = Object.keys(pokemons[0]);

  let chart = new Chart({
    width: plot_width + plot_margin.left + plot_margin.right +
      filter_width,
    height: plot_height + plot_margin.top + plot_margin.bottom,
  });
  chart.chart_init();
  // chart.updateChart();
  //tabulate(columns);
});

const observer = lozad();
observer.observe();