// We are getting informations from here
const data_url = 'https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-datavis-br-id-fancyteam/master/www/data/pokemon001-721.csv'

// Basic parameters for the chart
const plot_height = window.innerHeight * 0.65;
const plot_width = window.innerWidth * 0.70;
const plot_margin = {
  top: 50,
  right: 40,
  bottom: 40,
  left: 100
};

const filter_height = window.innerHeight * 0.65;
const filter_width = window.innerWidth * 0.20;

// Map each color to a particular type
// Source: https://bulbapedia.bulbagarden.net/wiki/Category:Type_color_templates
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

// ???
String.prototype.lpad = function (padString, length) {
  var str = this;
  while (str.length < length)
    str = padString + str;
  return str;
}

function addressMake(p, size) {
  let base = `data/pictures/${size}x${size}/`;
  let ext = ".png";
  var id = p.Id;
  if (id.includes("-")) {
    let s = id.split("-");
    id = s[0].lpad("0", 3) + "-" + s[1];
    if (s.length > 2) {
      id = id + "-" + s[2];
    }
  } else {
    id = id.lpad("0", 3);
  }
  return base + id + ext;
}

// Scroll to a particular anchor
function scrollTo(h) {
  var url = location.href;
  location.href = "#" + h;
  history.replaceState(null, null, url);
}
