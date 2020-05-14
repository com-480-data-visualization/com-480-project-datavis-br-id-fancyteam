const data_url = 'https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-datavis-br-id-fancyteam/master/www/data/pokemon001-721.csv'

const plot_height = window.innerHeight * 0.65;
const plot_width = window.innerWidth * 0.75;
const plot_margin = {
    top: 100,
    right: 40,
    bottom: 40,
    left: 100
  };

const typeToColor = new Map([
  ["Bug", d3.rgb(168, 184, 32)],
  ["Dark", d3.rgb(112, 88, 72)],
  ["Dragon", d3.rgb(112, 56, 248)],
  ["Electric", d3.rgb(248, 208, 48)],
  ["Fairy", d3.rgb(238, 153, 172)],
  ["Fighting", d3.rgb(192, 48, 40)],
  ["Fire", d3.rgb(240, 128, 48)],
  ["Flying", d3.rgb(168, 144, 240)],
  ["Ghost", d3.rgb(112, 88, 152)],
  ["Grass", d3.rgb(120, 200, 80)],
  ["Ground", d3.rgb(224, 192, 104)],
  ["Ice", d3.rgb(152, 216, 216)],
  ["Normal", d3.rgb(168, 168, 120)],
  ["Poison", d3.rgb(160, 64, 160)],
  ["Psychic", d3.rgb(248, 88, 136)],
  ["Rock", d3.rgb(184, 160, 56)],
  ["Steel", d3.rgb(184, 184, 208)],
  ["Water", d3.rgb(104, 144, 240)],
  ["???", d3.rgb(104, 160, 144)]
]);
