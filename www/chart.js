const margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
  },

width = window.innerWidth * 0.70;
height = window.innerHeight * 0.60;

var url = 'https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-datavis-br-id-fancyteam/master/www/data/pokemon001-721.csv'

d3.csv(url).then(function(data) {
  createChart(data)
});

function createChart(data) {
  const svg = d3.select("#chart-container").append("svg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", (width + margin.left + margin.right))
    .attr("height", (height + margin.top + margin.bottom));

  let pokemons = [];
  data.forEach(pokemon => pokemons.push(pokemon));
  let pokemonCount = pokemons.length;

  // Get max and min attack bounds for X-scale and defense bounds for Y-scale.
  let maxXPoint = 0;
  let minXPoint = 1000;
  let maxYPoint = 0;
  let minYPoint = 1000;

  pokemons.forEach(pokemon => {
    for (let field in pokemon) {
      if (pokemon.hasOwnProperty(field) && field == "Attack") {
        value = parseFloat(pokemon[field]);
        if (value > maxXPoint) {
          maxXPoint = value;
        }
        if (value < minXPoint) {
          minXPoint = value;
        }
      }
      if (pokemon.hasOwnProperty(field) && field == "Defense") {
        value = parseFloat(pokemon[field]);
        if (value > maxYPoint) {
          maxYPoint = value;
        }
        if (value < minYPoint) {
          minYPoint = value;
        }
      }
    }
  });
  maxXPoint += 5;
  minXPoint -= 5;
  maxYPoint += 5;
  minYPoint -= 5;

  let chart = new Chart({
    data: pokemons,
    width: width,
    height: height,
    maxX: maxXPoint,
    minX: minXPoint,
    maxY: maxYPoint,
    minY: minYPoint,
    svg: svg,
    name: "Pokemon chart",
    margin: margin,
    showBottomAxis: true
  });
}

class Chart {
  constructor(options) {
    this.data = options.data;
    this.width = options.width;
    this.height = options.height;
    this.maxX = options.maxX;
    this.minX = options.minX;
    this.maxY = options.maxY;
    this.minY = options.minY;
    var svg = options.svg;
    this.name = options.name;
    this.margin = options.margin;
    this.showBottomAxis = options.showBottomAxis;

    var x0 = [this.minX, this.maxX],
        y0 = [this.minY, this.maxY],
        x = d3.scaleLinear().domain(x0).range([0, this.width]),
        y = d3.scaleLinear().domain(y0).range([this.height, 0]);

    // Add the chart to the HTML page
    svg.append("g")
      .attr('class', this.name.toLowerCase())
      .attr("transform", "translate(70, 30)");
    svg.append("text")
      .attr("class", "chart-title")
      .attr("transform", "translate(" + (70 + this.width / 2) + ", 20)")
      .style("text-anchor", "middle")
      .text(this.name);

    var xAxis = d3.axisBottom(x).ticks(this.width/40);
    svg.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(70," + (30 + this.height) + ")")
      .call(xAxis);
    svg.append("text")
      .attr("transform", "translate(" + (70 + this.width / 2) + " ," + (30 + this.height + margin.bottom - 5) +")")
      .style("text-anchor", "middle")
      .text("Attack");

    var xAxisTop = d3.axisTop(x).tickValues([]);
    svg.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(70, 30)")
      .call(xAxisTop);

    var yAxis = d3.axisLeft(y).ticks(this.height/20);
    svg.append("g")
      .attr("class", "y_axis")
      .attr("transform", "translate(70, 30)")
      .call(yAxis);

    var yAxisRight = d3.axisRight(y).tickValues([]);
    svg.append("g")
      .attr("class", "y_axis")
      .attr("transform", "translate(" + (70 + this.width) + ", 30)")
      .call(yAxisRight);
    svg.append("text")
      .attr("transform", "translate(" + (70 + 5 - margin.left) + " ," + (30 + this.height / 2) +") rotate(-90)")
      .style("text-anchor", "middle")
      .text("Defense");

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", x(x0[1]))
        .attr("height", y(y0[0]))
        .attr("x", x(x0[0]) + 70)
        .attr("y", 30);

    // Add brushing
    var brush = d3.brush()
      .extent([[0, 0],[this.width, this.height]])
      .on("end", brushended),
      idleTimeout,
      idleDelay = 350;

    svg.append("g")
      .attr("class", "brush")
      .call(brush)

    svg.append("text")
      .attr("class", "instructions")
      .attr("transform", "translate(70," + (height + 30 + 40) + ")")
      .text('Click and drag above to zoom, double click to reset view');

    const main = svg.append('g')
      	.attr('class', 'main')
      	.attr('clip-path', 'url(#clip)');

    var points = d3.range(this.data.length).map(i => {
      return [parseFloat(this.data[i].Attack),
      parseFloat(this.data[i].Defense), this.data[i].Type_1]});

    var typeToColor = new Map([
      ["Fire", d3.rgb(255, 0, 0)],
      ["Grass", d3.rgb(0, 255, 0)],
      ["Water", d3.rgb(0, 0, 255)]
    ]);

    main.selectAll("circle")
    .data(points)
    .enter().append("circle")
      .attr("cx", d => x(d[0]))
      .attr("cy", d => y(d[1]))
      .attr("r", 3)
      .attr("fill", d => typeToColor.get(d[2]))
      .attr("transform", "translate(70, 30)");

    function brushended() {
      var s = d3.event.selection;
      if (!s) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
        x.domain(x0);
        y.domain(y0);
      } else {
        x.domain([s[0][0], s[1][0]].map(x.invert, x));
        y.domain([s[1][1], s[0][1]].map(y.invert, y));
        svg.select(".brush").call(brush.move, null)
      }
      zoom();
    }

    function idled() {
      idleTimeout = null;
    }

    function zoom() {
      var t = svg.transition().duration(750);
      svg.select(".x_axis").transition(t).call(xAxis);
      svg.select(".y_axis").transition(t).call(yAxis);
      svg.selectAll("circle").transition(t)
          .attr("cx", function(d) { return x(d[0]); })
          .attr("cy", function(d) { return y(d[1]); });
    }
  }
}

Chart.prototype.showOnly = function(b) {
  this.xScale.domain(b);
  this.chartContainer.select("path").data([this.chartData]).attr("d", this.area);
  this.chartContainer.select(".x.axis.top").call(this.xAxisTop);
  this.chartContainer.select(".x.axis.bottom").call(this.xAxisBottom);
}
