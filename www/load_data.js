var url = 'https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-datavis-br-id-fancyteam/master/data/pokemon001-721.csv'

d3.csv(url).then(function(data) {
    const columns = [ '#','Name','Type 1','Type 2','Total','HP',
                      'Attack','Defense','Sp. Atk','Sp. Def','Speed',
                      'Generation','Legendary']
    tabulate(data,columns)
  });

var tabulate = function (data,columns) {
      var table = d3.select('#data_table') // this is the solution
      var thead = table.append('thead')
      var tbody = table.append('tbody')

      thead.append('tr')
        .selectAll('th')
          .data(columns)
          .enter()
        .append('th')
          .text(function (d) { return d })

      var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
        .append('tr')

      var cells = rows.selectAll('td')
          .data(function(row) {
              return columns.map(function (column) {
                  return { column: column, value: row[column] }
            })
        })
        .enter()
      .append('td')
        .text(function (d) { return d.value })

    return table;
  }
