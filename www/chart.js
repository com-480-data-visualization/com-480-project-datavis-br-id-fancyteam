class Chart {
  /* Constructor for the Chart. Call once. */
  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.idleBrushDelay = 350;  // milliseconds, delay to double click, otherwise the brush is triggered to zoom

    // The whole chart area, i.e. plot, axis, filters, ...
    this.svg = d3.select("#chart-container").append("svg")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", this.width)
      .attr("height", this.height);

    // Initialization of the axis
    this.createAxis();

    // The brush feature
    var idleBrushTimeout;
    this.brush = d3.brush()
      .extent([
        [plot_margin.left, plot_margin.top],
        [plot_margin.left + plot_width, plot_margin.top + plot_height]
      ])
      .on("end", _ => {
        var s = d3.event.selection;
        if (!s) {
          if (!idleBrushTimeout) {
            return idleBrushTimeout = setTimeout(idled, this
            .idleBrushDelay);
          }
          this.x.domain(this.x0);
          this.y.domain(this.y0);
        } else {
          this.x.domain([s[0][0] - plot_margin.left, s[1][0] - plot_margin
            .left
          ].map(this.x.invert, this.x));
          this.y.domain([s[1][1] - plot_margin.top, s[0][1] - plot_margin
            .top
          ].map(this.y.invert, this.y));
          this.svg.select(".brush").call(this.brush.move, null);
        }
        // When the brush selection is done, draw the points and the evolutions
        this.draw_pkmn_evols();
      });
    this.svg.append("g")
      .attr("class", "brush")
      .call(this.brush)
    this.svg.append("text")
      .attr("class", "instructions")
      .attr("transform", "translate(" + plot_margin.left + "," + (this
        .height - 5) + ")")
      .text('Click and drag above to zoom, double click to reset view');

    // Reset the timeout for the brush
    function idled() {
      idleBrushTimeout = null;
    }

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = this.svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", plot_width)
      .attr("height", plot_height)
      .attr("x", plot_margin.left)
      .attr("y", plot_margin.top);
  }

  /* Create the original axis. Call once. */
  createAxis() {
    // Basic parameters
    this.maxX = 1000;
    this.minX = 0;
    this.maxY = 1000;
    this.minY = 0;

    this.x0 = [this.minX, this.maxX];
    this.x = d3.scaleLinear().domain(this.x0).range([0, plot_width]);
    this.y0 = [this.minY, this.maxY];
    this.y = d3.scaleLinear().domain(this.y0).range([plot_height, 0]);

    // Reference to the chart so we can pass it down.
    var cha = this;

    /* X axis */
    this.xAxis = d3.axisBottom(this.x).ticks(plot_width / 40);
    this.svg.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(" + plot_margin.left + "," + (plot_margin
        .top + plot_height) + ")")
      .call(this.xAxis);

    // Corresponding label
    this.svg.append("text")
      .attr("id", "xlabel")
      .attr("transform", "translate(" + (plot_width + plot_margin.left + 15)
        + " ," + (plot_height + plot_margin.top + 5) + ")")
      .text(columns[7]);

    // Create the dropdown for the X axis
    this.xAxisButton = d3.select("#chart-container")
      .append("div")
      .text("x Axis : ")
      .append('select')
      .attr("id", "xaxisselect")
      .attr("xAxis_label", "xAxis_label")
      .on('change', onChangeXAxis)

    this.xAxisButton.selectAll('options')
      .data(columns.slice(4, -2))  // We do not want "special" values such as string and bool
      .enter()
      .append('option')
      .text(text => text)
      .attr("value", function(d) {
        return d;
      })
      .property("selected", function(d){  // Base option
        return d === columns[7];
      });

    // Update on X axis dropdown
    function onChangeXAxis() {
      var selectValue = d3.select('#xaxisselect').property("value");
      cha.chart_update(selectValue, cha.y_field, cha.color_field);
      d3.select(xlabel).text(selectValue);
    }

    // X top axis (just the line)
    this.xAxisTop = d3.axisTop(this.x).tickValues([]);
    this.svg.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(" + plot_margin.left + "," + plot_margin
        .top + ")")
      .call(this.xAxisTop);
    /* End X axis */

    /* Y axis */
    this.yAxis = d3.axisLeft(this.y).ticks(plot_height / 20);
    this.svg.append("g")
      .attr("class", "y_axis")
      .attr("transform", "translate(" + plot_margin.left + "," + plot_margin
        .top + ")")
      .call(this.yAxis);

    // Corresponding label
    this.svg.append("text")
      .attr("id", "ylabel")
      .attr("transform", "translate(" + (plot_margin.left - 10)
        + " ," + (plot_margin.top - 15) + ")")
      .text(columns[6]);

    // Create the dropdown for the Y axis
    this.yAxisButton = d3.select("#chart-container")
      .append("div")
      .text("y Axis : ")
      .append('select')
      .attr("id", "yaxisselect")
      .attr("yAxis_label", "yAxis_label")
      .on('change', onChangeYAxis)

    this.yAxisButton.selectAll('options')
      .data(columns.slice(4, -2))  // We do not want "special" values such as string and bool
      .enter()
      .append('option')
      .text(text => text)
      .attr("value", function(d) {
        return d;
      })
      .property("selected", function(d){  // Base option
        return d === columns[6];
      });

    // Update on Y axis dropdown
    function onChangeYAxis() {
      var selectValue = d3.select('#yaxisselect').property("value");
      cha.chart_update(cha.x_field, selectValue, cha.color_field);
      d3.select(ylabel).text(selectValue);
    }

    // Y right axis (just the line)
    this.yAxisRight = d3.axisRight(this.y).tickValues([]);
    this.svg.append("g")
      .attr("class", "y_axis")
      .attr("transform", "translate(" + (plot_margin.left + plot_width) +
        "," + plot_margin.top + ")")
      .call(this.yAxisRight);
    /* End Y axis */

    // TODO color axis

    // complicated, but only defines arrow heads as "id=end"
    this.svg.append("svg:defs").selectAll("marker")
      .data(["end"]) // Different link/path types can be defined here
      .enter().append("svg:marker") // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0.5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");
  }

  /* Initialization of the chart with default values. Called once. */
  chart_init() {
    this.x_field = columns[7];  // Base value, Defense
    this.y_field = columns[6];  // Base value, Attack
    this.color_field = columns[2];  // Base value, Type_1

    // Filters stuff.
    var slider_total = d3.select("#chart-container").append("p")
      .attr("align", "right")
      .text("Total   ")
      .append("input")
      .attr("type", "range")
      .attr("min", 180)
      .attr("max", 780)
      .attr("step", 1)
      .attr("value", 180)
      .on("input", slided);

    var slider_hp = d3.select("#chart-container").append("p")
      .attr("align", "right")
      .text("HP   ")
      .append("input")
      .attr("type", "range")
      .attr("min", 1)
      .attr("max", 255)
      .attr("step", 1)
      .attr("value", 1)
      .on("input", slided);

    var slider_attack = d3.select("#chart-container").append("p")
      .attr("align", "right")
      .text("Attack   ")
      .append("input")
      .attr("type", "range")
      .attr("min", 5)
      .attr("max", 190)
      .attr("step", 1)
      .attr("value", 5)
      .on("input", slided);

    var slider_defense = d3.select("#chart-container").append("p")
      .attr("align", "right")
      .text("Defense   ")
      .append("input")
      .attr("type", "range")
      .attr("min", 5)
      .attr("max", 230)
      .attr("step", 1)
      .attr("value", 5)
      .on("input", slided);

    var slider_spatk = d3.select("#chart-container").append("p")
      .attr("align", "right")
      .text("Sp_Atk   ")
      .append("input")
      .attr("type", "range")
      .attr("min", 10)
      .attr("max", 194)
      .attr("step", 1)
      .attr("value", 10)
      .on("input", slided);

    var slider_spdef = d3.select("#chart-container").append("p")
      .attr("align", "right")
      .text("Sp_Def   ")
      .append("input")
      .attr("type", "range")
      .attr("min", 20)
      .attr("max", 230)
      .attr("step", 1)
      .attr("value", 20)
      .on("input", slided);

    var slider_speed = d3.select("#chart-container").append("p")
      .attr("align", "right")
      .text("Speed   ")
      .append("input")
      .attr("type", "range")
      .attr("min", 5)
      .attr("max", 180)
      .attr("step", 1)
      .attr("value", 5)
      .on("input", slided);

    var slider_generation = d3.select("#chart-container").append("p")
      .attr("align", "right")
      .text("Generation   ")
      .append("input")
      .attr("type", "range")
      .attr("min", 1)
      .attr("max", 6)
      .attr("step", 1)
      .attr("value", 1)
      .on("input", slided);

    function slided(d) {
      console.log(d3.select(this).property("value"));
    }

    var filterArea = d3.select("#chart-container") // this.svg.append("div") //
    var filters = filterArea.selectAll("filter")
      .data(columns.filter(c => {
        return pokemons[0][c] != parseFloat(pokemons[0][c])
      }))
      .enter()
      .append("div")
      .attr("align", "right")
    var filter_labels = filters.append("text")
      .attr("class", "filter_label")
      .text(t => t)
      .attr("font-family", "sans-serif")
      .attr("font-size", "17px")
      .attr("fill", "black")
    var filter_fields = filters.append('select')
      .attr("id", c => ("filter_by_" + c))
      .attr("class", "filter_text_option")
      .attr("multiple", "")
      .selectAll('options')
      .data(c => Array.from(new Set(pokemons.map(p => p[c]))).sort((c1,
      c2) => {
        if (c1 == parseFloat(c1) || c2 == parseFloat(c2)) {
          return c1 - c2;
        } else {
          return c1.localeCompare(c2)
        }
      }))
      .enter()
      .append('option')
      .text(p => p)
      .attr("value", p => p)

    // Tooltip tool creation
    this.tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Create the data_points
    this.data_points = this.svg.append('g')
      .attr('class', 'data_points')
      .attr('clip-path', 'url(#clip)');

    // Define links between evolutions (the lil' arrows).
    this.links = this.data_points.selectAll("line")
      .data(evolutions)
      .enter().append("line")
      .attr("class", "connector")
      .style("stroke", p => {
        return "#000";
      })
      .attr("transform", "translate(" + plot_margin.left + "," + plot_margin
        .top + ")")
      .attr("marker-end", "url(#end)") // arrow heads
      .attr("source-pt", p => p.source)
      .attr("target-pt", p => p.target)

    // Finally, update the chart
    this.chart_update(this.x_field, this.y_field, this.color_field)
  }

  /* Used to update the chart when for instance a label is changed. */
  chart_update(x_field = columns[7], y_field = columns[6], color_field = columns[
    2]) {
    this.x_field = x_field;
    this.y_field = y_field;
    this.color_field = color_field;

    // Get max and min attack bounds for X-scale and defense bounds for Y-scale.
    let maxXPoint = 0;
    let minXPoint = 1000;
    let maxYPoint = 0;
    let minYPoint = 1000;

    // Seek for min and max values.
    pokemons.forEach(pokemon => {
      for (let field in pokemon) {
        if (pokemon.hasOwnProperty(field) && field == x_field) {
          let value = parseFloat(pokemon[field]);
          if (value > maxXPoint) {
            maxXPoint = value;
          }
          if (value < minXPoint) {
            minXPoint = value;
          }
        }
        if (pokemon.hasOwnProperty(field) && field == y_field) {
          let value = parseFloat(pokemon[field]);
          if (value > maxYPoint) {
            maxYPoint = value;
          }
          if (value < minYPoint) {
            minYPoint = value;
          }
        }
      }
    });

    this.maxX = maxXPoint + 5;
    this.minX = minXPoint - 5;
    this.maxY = maxYPoint + 5;
    this.minY = minYPoint - 5;

    this.x0 = [this.minX, this.maxX];
    this.x.domain(this.x0);
    this.y0 = [this.minY, this.maxY];
    this.y.domain(this.y0);

    // Update and center the label for the X axis
    function updateAxisX(lbl) {
      this.svg.append("text")
        .attr("transform", "translate(" + (plot_margin.left + plot_width /
          2) + " ," + (chart.height - 5) + ")")
        .style("text-anchor", "middle")
        .text(lbl);
    }

    // Update and center the label for the Y axis
    function updateAxisY(lbl) {
      this.svg.append("text")
        .attr("transform", "translate(" + (plot_margin.left - 40) + " ," + (
          plot_margin.top + plot_height / 2) + ") rotate(-90)")
        .style("text-anchor", "middle")
        .text(lbl);
    }

    // Initialization of the Pkmn values
    this.init_pkmn();

    // Finally, draw the points and the evolutions
    this.draw_pkmn_evols();
  }

  /* Prepare the Pokémon and evolutions drawing. Called each time the axis change. */
  // We can prolly optimize that thing.
  init_pkmn() {
    // Points contains informations about Pokémon
    this.points = d3.range(pokemonCount).map(i => {
      return pokemons[i]
    });

    // Reference to the chart so we can pass it down.
    var cha = this;

    // Point size. Duh.
    var pointSize = (this.x(1) - this.x(0)) / 2;

    // Compulsory local variable for links.
    var links = this.links;

    // Add Pokémon' points
    const circles = this.data_points.selectAll("circle")
      .data(this.points)
      .enter().append("circle")
      .attr("visibility", "hidden")
      .attr("cx", p => this.x(p[this.x_field]))
      .attr("cy", p => this.y(p[this.y_field]))
      .attr("r", pointSize)
      .attr("id", p => p.Id)
      .attr("fill", p => {
        if (typeToColor.get(p[this.color_field])) return typeToColor.get(p[
          this.color_field]);
        return typeToColor.get("???");
      })
      .attr("transform", "translate(" + plot_margin.left + "," + plot_margin
        .top + ")")
      .on("click", p => console.log(p))
      .on("mouseover", function(d) {
        //put "hovered-other" class to all
        circles.classed("hovered-other", true)
        //then remove and put "hovered-this" for hovered
        d3.select(this).classed("hovered-other", false)
        // add class "hovered-other" to all links
        links.classed("hovered-over", p => (p.target == d.Id || p.source ==
          d.Id))

        display_tooltip(d)
      })
      .on("mouseout", function(d) {
        // remove all classes
        circles.classed("hovered-other", false)
        links.classed("hovered-over", false)
        hide_tooltip()
      });

    // Add Pokémon' images
    const images = this.data_points.selectAll("image")
      .data(this.points)
      .enter()
      .append("svg:image")
      .attr("class", "lozad")
      .attr("visibility", "hidden")
      .attr("xlink:href", "")
      .attr("x", p => this.x(p[this.x_field]) - pointSize / 2)
      .attr("y", p => this.y(p[this.y_field]) - pointSize / 2)
      .attr("width", 5 * Math.round(pointSize))
      .attr("height", 5 * Math.round(pointSize))
      .attr("transform", "translate(" + plot_margin.left + "," + plot_margin
        .top + ")")
      .on("click", p => console.log(p))
      .on("mouseover", function(d) {
        display_tooltip(d);
        images.classed("hovered-other", true)
        links.classed("hovered-over", p => (p.target == d.Id || p.source ==
          d.Id))
        d3.select(this).classed("hovered-other", false).moveToFront()

      })
      .on("mouseout", function(d) {
        hide_tooltip();
        links.classed("hovered-over", false)
        images.classed("hovered-other", false)
      });

    /* Tooltip */
    // Define a tooltip variable for local usage (necessary)(because js)
    var tooltip = this.tooltip

    function formatPokemon(d) {
      var rtn = "";
      rtn += "#" + d.Id + " " + d.Name + "<br/>";
      rtn += d.Type_1;
      if(d.Type_2) rtn += "/" + d.Type_2;
      rtn += "<br/>"
      rtn += cha.x_field + ": " + d[cha.x_field] + "<br/>"
      rtn += cha.y_field + ": " + d[cha.y_field] + "<br/>"
      return rtn
    }

    // Show tooltip
    function display_tooltip(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);

      // Change text and position it close to mouse
      tooltip.html(formatPokemon(d))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    }

    // Hide tooltip
    function hide_tooltip() {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0)
    }
    /* End Tooltip */
  }

  // Offset function
  getXpos(p, pointSize) {
    if (pointSize <= 6) {
      return this.x(p[this.x_field])
    } else {
      return this.x(p[this.x_field]) - pointSize / 2
    }
  }

  // Offset function
  getYpos(p, pointSize) {
    if (pointSize <= 6) {
      return this.y(p[this.y_field])
    } else {
      return this.y(p[this.y_field]) - pointSize / 2
    }
  }

  /* Draw the points and the evolutions */
  draw_pkmn_evols() {  // Everything is in memory, not optimal.
    var t = this.svg.transition().duration(750);
    var pointSize = (this.x(1) - this.x(0)) / 2;
    // Axis
    this.svg.select(".x_axis").transition(t).call(this.xAxis);
    this.svg.select(".y_axis").transition(t).call(this.yAxis);

    // We have multiple sets of PNGs to use.
    function sizeToPixel(pointSize) {
      if(pointSize <= 16) return 32;
      if(pointSize <= 32) return 120;
      return 256;
    }

    // Draw Pokémon
    if(pointSize <= 5) {  // Use circles
      this.data_points.selectAll("image")
        .transition(t)
        .attr("visibility", "hidden")
      this.data_points.selectAll("circle")
        .transition(t)
        .attr("visibility", "visible")
        .attr("cx", p => this.getXpos(p, pointSize))
        .attr("cy", p => this.getYpos(p, pointSize))
        .attr("r", pointSize)
    } else {  // Use images
      this.data_points.selectAll("circle")
        .transition(t)
        .attr("visibility", "hidden")
      this.data_points.selectAll("image")
        .transition(t)
        .attr("visibility", "visible")
        .attr("x", p => this.getXpos(p, 5 * pointSize))
        .attr("y", p => this.getYpos(p, 5 * pointSize))
        .attr("width", 5 * Math.round(pointSize))
        .attr("height", 5 * Math.round(pointSize))
        .attr("xlink:href", p => addressMake(p, sizeToPixel(pointSize)))
    }

    // Draw evolutions
    this.links
      .transition(t)
      .attr("x1", d => {
        for (var i = 0; i < this.points.length; i++) {
          if (this.points[i].Id == d.source) {
            return this.getXpos(this.points[i], pointSize)
          }
        }
      })
      .attr("y1", d => {
        for (var i = 0; i < this.points.length; i++) {
          if (this.points[i].Id == d.source) {
            return this.getYpos(this.points[i], pointSize)
          }
        }
      })
      .attr("x2", d => {
        for (var i = 0; i < this.points.length; i++) {
          if (this.points[i].Id == d.target) {
            return this.getXpos(this.points[i], pointSize)
          }
        }
      })
      .attr("y2", d => {
        for (var i = 0; i < this.points.length; i++) {
          if (this.points[i].Id == d.target) {
            return this.getYpos(this.points[i], pointSize)
          }
        }
      })
      .attr("stroke-width", pointSize/4);
  }
}
