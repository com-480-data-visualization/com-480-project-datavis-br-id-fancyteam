function createFilter(c) {
  var filters = d3.select("#filters-area")
    .append('select')
  filters.selectAll('options') // Next 4 lines add 6 options = 6 colors
    .data(columns)
    .enter()
    .append('option')
    .text(function(d) {
      return d;
    })
    .attr("value", function(d) {
      return d;
    }) // corresponding value returned by the button
}