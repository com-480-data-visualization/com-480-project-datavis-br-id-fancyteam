class Chart {
  /* Constructor for the Chart. Call once. */
  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.idleBrushDelay =
    350; // milliseconds, delay to double click, otherwise the brush is triggered to zoom

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
        this.draw();
      });
    this.svg.append("g")
      .attr("class", "brush")
      .call(this.brush)
    this.svg.append("text")
      .attr("class", "instructions")
      .attr("transform", "translate(" + plot_margin.left + "," + (this
        .height - 5) + ")")
      .text('Click and drag above to zoom, double click to reset view');

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

    // Create the dropdown for the X axis
    this.xAxisButton = d3.select("#chart-container")
      .append('select')
      .attr("id", "xaxisselect")
      .attr("xAxis_label", "xAxis_label")
      .on('change', onChangeXAxis)
    
    this.xAxisButton.selectAll(
      'options') // Next 4 lines add 6 options = 6 colors
      .data(columns)
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
      cha.updateChart(selectValue, cha.y_field, cha.color_field)
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
      
    // Create the dropdown for the Y axis
    this.yAxisButton = d3.select("#chart-container")
      .append('select')
      .attr("id", "yaxisselect")
      .attr("yAxis_label", "yAxis_label")
      .on('change', onChangeYAxis)
    
    this.yAxisButton.selectAll(
      'options') // Next 4 lines add 6 options = 6 colors
      .data(columns)
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
      cha.updateChart(cha.x_field, selectValue, cha.color_field)
    }

    // Y right axis (just the line)
    this.yAxisRight = d3.axisRight(this.y).tickValues([]);
    this.svg.append("g")
      .attr("class", "y_axis")
      .attr("transform", "translate(" + (plot_margin.left + plot_width) +
        "," + plot_margin.top + ")")
      .call(this.yAxisRight);
    /* End Y axis */

    // complicated, but only defines arrow heads as "id=end"
    this.svg.append("svg:defs").selectAll("marker")
      .data(["end"]) // Different link/path types can be defined here
      .enter().append("svg:marker") // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0.5)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");
  }

  chart_init() {
    this.x_field = columns[7];  // 
    this.y_field = columns[6];  // 
    this.color_field = columns[2];  // 
    
    
    // Finally, update the chart
    this.updateChart(this.x_field, this.y_field, this.color_field)
  }
  
  updateChart(x_field = columns[7], y_field = columns[6], color_field = columns[
    2]) {
    this.x_field = x_field;
    this.y_field = y_field;
    this.color_field = color_field;

    // Get max and min attack bounds for X-scale and defense bounds for Y-scale.
    let maxXPoint = 0;
    let minXPoint = 1000;
    let maxYPoint = 0;
    let minYPoint = 1000;

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

    // Tooltip
    this.tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Create the data_points
    this.data_points = this.svg.append('g')
      .attr('class', 'data_points')
      .attr('clip-path', 'url(#clip)');

    this.draw_init();
  }

  draw_init() {

    this.points = d3.range(pokemonCount).map(i => {
      return pokemons[i]
    });

    // define tooltip for local usage (necessary)
    var tooltip = this.tooltip

    function display_tooltip(d) {
      tooltip.transition() // show tooltip
        .duration(200)
        .style("opacity", .9);
      tooltip.html(d.Name) // change text and position it close to mouse
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    }

    var pointSize = (this.x(1) - this.x(0)) / 2;
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

    var links = this.links;

    // Add pokemons' points
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




    // Add pokemons' images
    function hide_tooltip() {
      tooltip.transition().duration(200).style("opacity", 0)
    }
    const images = this.data_points.selectAll("image")
      .data(this.points)
      .enter()
      .append("svg:image")
      .attr("visibility", "hidden")
      .attr("xlink:href", p => addressMake(p, 32))
      .attr("x", p => this.x(p[this.x_field]) - pointSize / 2)
      .attr("y", p => this.y(p[this.y_field]) - pointSize / 2)
      .attr("width", Math.round(pointSize))
      .attr("height", Math.round(pointSize))
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


    this.draw();
  }

  getXpos(p, pointSize) {
    if (pointSize <= 6) {
      return this.x(p[this.x_field])
    } else {
      return this.x(p[this.x_field]) - pointSize / 2
    }
  }

  getYpos(p, pointSize) {
    if (pointSize <= 6) {
      return this.y(p[this.y_field])
    } else {
      return this.y(p[this.y_field]) - pointSize / 2
    }
  }
  
  draw() {
    var t = this.svg.transition().duration(750);
    var pointSize = (this.x(1) - this.x(0)) / 2;

    this.svg.select(".x_axis").transition(t).call(this.xAxis);
    this.svg.select(".y_axis").transition(t).call(this.yAxis);

    if (pointSize <= 6) {
      this.data_points.selectAll("image").attr("visibility", "hidden")
      this.svg.selectAll("circle").transition(t);
      this.data_points.selectAll("circle")
        .attr("visibility", "visible")
        .attr("cx", p => this.getXpos(p, pointSize))
        .attr("cy", p => this.getYpos(p, pointSize))
        .attr("r", pointSize)

    } else if (pointSize <= 16) {
      this.data_points.selectAll("circle").attr("visibility", "hidden")
      this.svg.selectAll("image").transition(t);
      this.data_points.selectAll("image")
        .attr("visibility", "visible")
        .attr("x", p => this.getXpos(p, pointSize))
        .attr("y", p => this.getYpos(p, pointSize))
        .attr("width", 4 * Math.round(pointSize))
        .attr("height", 4 * Math.round(pointSize))
        .attr("xlink:href", p => addressMake(p, 32))

    } else if (pointSize <= 30) {
      this.data_points.selectAll("circle").attr("visibility", "hidden")
      this.svg.selectAll("image").transition(t);
      this.data_points.selectAll("image")
        .attr("visibility", "visible")
        .attr("x", p => this.getXpos(p, pointSize))
        .attr("y", p => this.getYpos(p, pointSize))
        .attr("width", 4 * Math.round(pointSize))
        .attr("height", 4 * Math.round(pointSize))
        .attr("xlink:href", p => addressMake(p, 120))
    } else {
      this.data_points.selectAll("circle").attr("visibility", "hidden")
      this.svg.selectAll("image").transition(t);
      this.data_points.selectAll("image")
        .attr("visibility", "visible")
        .attr("x", p => this.getXpos(p, pointSize))
        .attr("y", p => this.getYpos(p, pointSize))
        .attr("width", Math.round(pointSize))
        .attr("height", Math.round(pointSize))
        .attr("xlink:href", p => addressMake(p, 256))
    }

    this.links
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
      });
  }
}