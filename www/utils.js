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

// const evolutions = {
//   1: 2,
//   2: 3,
//   4: 5,
//   5: 6,
//   7: 8,
//   8: 9,
//   10: 11,
//   11: 12,
//   13: 14,
//   14: 15,
//   16: 17,
//   17: 18,
//   19: 20,
//   21: 22,
//   23: 24,
//   172: 25,
//   25: 26,
//   27: 28,
//   29: 30,
//   30: 31,
//   32: 33,
//   33: 34,
//   173: 35,
//   35: 36,
//   37: 38,
//   41: 42,
//   42: 169,
//   43: 44,
//   45: [45, 182]
// }

const evolutions = [
    {"source": 1, "target": 2},
    {"source": 2, "target": 3},
    {"source": 4, "target": 5},
    {"source": 5, "target": 6},
    {"source": 7, "target": 8} ,
    {"source": 8, "target": 9},
    {"source": 10, "target": 11},
    {"source": 11, "target": 12},
    {"source": 13, "target": 14},
    {"source": 14, "target": 15},
    {"source": 16, "target": 17},
    {"source": 17, "target": 18},
    {"source": 19, "target": 20},
    {"source": 21, "target": 22},
    {"source": 23, "target": 24},
    {"source": 172, "target": 25},
    {"source": 25, "target": 26},
    {"source": 27, "target": 28},
    {"source": 29, "target": 30},
    {"source": 30, "target": 31},
    {"source": 32, "target": 33},
    {"source": 33, "target": 34},
    {"source": 173, "target": 35},
    {"source": 35, "target": 36},
    {"source": 37, "target": 38},
    {"source": 41, "target": 42},
    {"source": 42, "target": 169},
    {"source": 43, "target": 44},
    {"source": 44, "target": 45},
    {"source": 44, "target": 182},
    {"source": 46, "target": 47},
    {"source": 48, "target": 49},
    {"source":50, "target": 51}
]


// pad a string with `padString` until il reaches length `length`
// e.g. "3".lpad("0", 5) --> "00003"
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

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// Scroll to a particular anchor
function scrollTo(h) {
  var url = location.href;
  location.href = "#" + h;
  history.replaceState(null, null, url);
}
