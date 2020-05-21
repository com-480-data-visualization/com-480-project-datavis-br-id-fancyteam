function createChart(x_field, y_field, color_field) {
  // Get max and min attack bounds for X-scale and defense bounds for Y-scale.
  let maxXPoint = 0;
  let minXPoint = 1000;
  let maxYPoint = 0;
  let minYPoint = 1000;

  pokemons.forEach(pokemon => {
    for (let field in pokemon) {
      if (pokemon.hasOwnProperty(field) && field == x_field) {
        value = parseFloat(pokemon[field]);
        if (value > maxXPoint) {
          maxXPoint = value;
        }
        if (value < minXPoint) {
          minXPoint = value;
        }
      }
      if (pokemon.hasOwnProperty(field) && field == y_field) {
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
    width: plot_width + plot_margin.left + plot_margin.right,
    height: plot_height + plot_margin.top + plot_margin.bottom,
    plot_width: plot_width,
    plot_height: plot_height,
    maxX: maxXPoint,
    minX: minXPoint,
    maxY: maxYPoint,
    minY: minYPoint,
  });

  let svg = d3.select("#chart-container").append("svg")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", chart.width)
    .attr("height", chart.height);

  var xAxis = d3.axisBottom(chart.x).ticks(plot_width/40);
  svg.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(" + plot_margin.left + "," + (plot_margin.top + plot_height) + ")")
    .call(xAxis);
  svg.append("text")
    .attr("transform", "translate(" + (plot_margin.left + plot_width / 2) +
      " ," + (chart.height - 5) +")")
    .style("text-anchor", "middle")
    .text("Attack");

  var xAxisTop = d3.axisTop(chart.x).tickValues([]);
  svg.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(" + plot_margin.left + "," + plot_margin.top + ")")
    .call(xAxisTop);

  var yAxis = d3.axisLeft(chart.y).ticks(plot_height/20);
  svg.append("g")
    .attr("class", "y_axis")
    .attr("transform", "translate(" + plot_margin.left + "," + plot_margin.top + ")")
    .call(yAxis);
  svg.append("text")
    .attr("transform", "translate(" + (plot_margin.left - 40) +
      " ," + (plot_margin.top + plot_height / 2) +") rotate(-90)")
    .style("text-anchor", "middle")
    .text("Defense");

  var yAxisRight = d3.axisRight(chart.y).tickValues([]);
  svg.append("g")
    .attr("class", "y_axis")
    .attr("transform", "translate(" + (plot_margin.left + plot_width) + "," + plot_margin.top + ")")
    .call(yAxisRight);

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", plot_width)
      .attr("height", plot_height)
      .attr("x", plot_margin.left)
      .attr("y", plot_margin.top);

  // Add brushing
  var brush = d3.brush()
    .extent([[plot_margin.left, plot_margin.top],
      [plot_margin.left + plot_width, plot_margin.top + plot_height]])
    .on("end", brushended),
    idleTimeout,
    idleDelay = 350;;

  svg.append("g")
    .attr("class", "brush")
    .call(brush)

  svg.append("text")
    .attr("class", "instructions")
    .attr("transform", "translate(" + plot_margin.left + "," + (chart.height - 5) + ")")
    .text('Click and drag above to zoom, double click to reset view');

  var points = d3.range(pokemonCount).map(i => {
    return pokemons[i]});
  var pointSize = (chart.x(1) - chart.x(0)) / 2;

  var data_points = svg.append('g')
    .attr('class', 'data_points')
    .attr('clip-path', 'url(#clip)');

  const circles = data_points.selectAll("circle")
    .data(points)
    .enter().append("circle")
      .attr("visibility", "hidden")
      .attr("cx", p => chart.x(p.Attack))
      .attr("cy", p => chart.y(p.Defense))
      .attr("r", pointSize)
      .attr("fill", p => {
        if (typeToColor.get(p.Type_1)) return typeToColor.get(p.Type_1);
          return typeToColor.get("???");
        })
      .attr("transform", "translate(" + plot_margin.left + "," + plot_margin.top + ")")
      .on("click", p => console.log(p.Name));

  const images = data_points.selectAll("image")
    .data(points)
    .enter().append("svg:image")
      .attr("visibility", "hidden")
      .attr("xlink:href", p => "data/pictures/32x32/" + p.Id.lpad("0",3) + ".png")
      .attr("x", p => chart.x(p.Attack) - pointSize/2)
      .attr("y", p => chart.y(p.Defense) - pointSize/2)
      .attr("width", Math.round(pointSize))
      .attr("height", Math.round(pointSize))
      .attr("transform", "translate(" + plot_margin.left + "," + plot_margin.top + ")")
      .on("click", p => console.log(p.Name));

  draw();

  function brushended() {
    var s = d3.event.selection;
    if (!s) {
      if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
      chart.x.domain(chart.x0);
      chart.y.domain(chart.y0);
    } else {
      chart.x.domain([s[0][0] - plot_margin.left, s[1][0] - plot_margin.left].map(chart.x.invert, chart.x));
      chart.y.domain([s[1][1] - plot_margin.top, s[0][1] - plot_margin.top].map(chart.y.invert, chart.y));
      svg.select(".brush").call(brush.move, null)
    }
    draw();
  }

  function idled() {
    idleTimeout = null;
  }

  function draw() {
    var t = svg.transition().duration(750);
    var pointSize = (chart.x(1) - chart.x(0)) / 2;

    svg.select(".x_axis").transition(t).call(xAxis);
    svg.select(".y_axis").transition(t).call(yAxis);

    if (pointSize <= 6) {
      data_points.selectAll("image").attr("visibility", "hidden")
      svg.selectAll("circle").transition(t);
      data_points.selectAll("circle")
        .attr("visibility", "visible")
        .attr("cx", p => chart.x(p.Attack))
        .attr("cy", p => chart.y(p.Defense))
        .attr("r", pointSize)

    } else if (pointSize <= 16) {
      data_points.selectAll("circle").attr("visibility", "hidden")
      svg.selectAll("image").transition(t);
      data_points.selectAll("image")
        .attr("visibility", "visible")
        .attr("x", p => chart.x(p.Attack) - pointSize/2)
        .attr("y", p => chart.y(p.Defense) - pointSize/2)
        .attr("width", 4 * Math.round(pointSize))
        .attr("height", 4 * Math.round(pointSize))
        .attr("xlink:href", p => "data/pictures/32x32/" + p.Id.lpad("0",3) + ".png")

    } else if (pointSize <= 30) {
      data_points.selectAll("circle").attr("visibility", "hidden")
      svg.selectAll("image").transition(t);
      data_points.selectAll("image")
        .attr("visibility", "visible")
        .attr("x", p => chart.x(p.Attack) - pointSize/2)
        .attr("y", p => chart.y(p.Defense) - pointSize/2)
        .attr("width", 4 * Math.round(pointSize))
        .attr("height", 4 * Math.round(pointSize))
        .attr("xlink:href", p => "data/pictures/120x120/" + p.Id.lpad("0",3) + ".png")
    } else {
      data_points.selectAll("circle").attr("visibility", "hidden")
      svg.selectAll("image").transition(t);
      data_points.selectAll("image")
        .attr("visibility", "visible")
        .attr("x", p => chart.x(p.Attack) - pointSize/2)
        .attr("y", p => chart.y(p.Defense) - pointSize/2)
        .attr("width", Math.round(pointSize))
        .attr("height", Math.round(pointSize))
        .attr("xlink:href", p => "data/pictures/256x256/" + p.Id.lpad("0", 3) + ".png")
    }
  }
}
