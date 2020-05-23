function initChart(x_field, y_field, color_field) {
    // Create the base chart
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
    
    // We gun draw on that
    let svg = d3.select("#chart-container").append("svg")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", chart.width)
    .attr("height", chart.height);
}

function updateChart(x_field, y_field, color_field) {
    draw();
}

function drawChart() {
    
}

  // Done with the selection
function brushended() {
    var s = d3.event.selection;
    if (!s) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
        chart.x.domain(chart.x0);
        chart.y.domain(chart.y0);
    } else {
        chart.x.domain([s[0][0] - plot_margin.left, s[1][0] - plot_margin.left].map(chart.x.invert, chart.x));
        chart.y.domain([s[1][1] - plot_margin.top, s[0][1] - plot_margin.top].map(chart.y.invert, chart.y));
        svg.select(".brush").call(brush.move, null);
    }
    draw();
}

// ???
function idled() {
    idleTimeout = null;
}

// Tooltip for Pokémon


// Draw all the Pokémon with the size offset
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
        .attr("cx", p => chart.x(p[x_field]))
        .attr("cy", p => chart.y(p[y_field]))
        .attr("r", pointSize)
    } else if (pointSize <= 16) {
        data_points.selectAll("circle").attr("visibility", "hidden")
        svg.selectAll("image").transition(t);
        data_points.selectAll("image")
        .attr("visibility", "visible")
        .attr("x", p => chart.x(p[x_field]) - pointSize / 2)
        .attr("y", p => chart.y(p[y_field]) - pointSize / 2)
        .attr("width", 4 * Math.round(pointSize))
        .attr("height", 4 * Math.round(pointSize))
        .attr("xlink:href", p => "data/pictures/32x32/" + p.Id.lpad("0", 3) + ".png")
    } else if (pointSize <= 30) {
        data_points.selectAll("circle").attr("visibility", "hidden")
        svg.selectAll("image").transition(t);
        data_points.selectAll("image")
        .attr("visibility", "visible")
        .attr("x", p => chart.x(p[x_field]) - pointSize / 2)
        .attr("y", p => chart.y(p[y_field]) - pointSize / 2)
        .attr("width", 4 * Math.round(pointSize))
        .attr("height", 4 * Math.round(pointSize))
        .attr("xlink:href", p => "data/pictures/120x120/" + p.Id.lpad("0", 3) + ".png")
    } else {
        data_points.selectAll("circle").attr("visibility", "hidden")
        svg.selectAll("image").transition(t);
        data_points.selectAll("image")
        .attr("visibility", "visible")
        .attr("x", p => chart.x(p[x_field]) - pointSize / 2)
        .attr("y", p => chart.y(p[y_field]) - pointSize / 2)
        .attr("width", Math.round(pointSize))
        .attr("height", Math.round(pointSize))
        .attr("xlink:href", p => "data/pictures/256x256/" + p.Id.lpad("0", 3) + ".png")
    }
}