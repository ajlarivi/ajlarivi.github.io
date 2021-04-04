// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 35, left: 60},
    width = 1100 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgTimeline = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/ajlarivi/ajlarivi.github.io/master/data/global_power_plant_database_WithAge_sorted.csv", function(data) {


    // add the options to the button
    /*d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button*/
    var dataFilter = data.filter(function(d){return d.country_long == 'Albania' })
    var countryOptions = d3.map(data, function(d){return d.country_long;}).keys()

    var select = d3.select("#countryOpts")
    .append("select")
    .on("change", update)

    var countryDropdown = select.selectAll(null)
    .data(countryOptions)
    .enter()
    .append("option")
    .text(function(d){return d})
    .attr("value", function(d){return d})

	var xMin = d3.min(data, function(d) { return +d.commissioning_year; })
	var xMax = d3.max(data, function(d) { return +d.commissioning_year; })

	var sizeExtent = d3.extent(data, function(d) { return +d.capacity_mw; })
    //console.log(xExtent)

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([xMin,xMax])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
      .ticks(25));

    // Add Y axis
    var y = d3.scalePoint()
      .domain(["Biomass", "Geothermal", "Hydro", "Solar", "Wind", " ", "Coal", "Gas", "nuclear", "Oil", "Waste"].reverse())
      .range([ height - 10, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add a scale for bubble size
	    var size = d3.scaleLinear()
	      .domain(sizeExtent)  // What's in the data
	      .range([3, 15])  // Size in pixel

    // Initialize dots with group a
    var dot = svg
      .selectAll('circle')
      .data(dataFilter)
      .enter()
      .append('circle')
        .attr("cx", function(d) { return x(+d.commissioning_year) })
        .attr("cy", function(d) { return y(d.primary_fuel) })
        .attr("r", function(d) { return size(d.capacity_mw) })
        .style("fill", "#69b3a2")


    // A function that update the chart
    function update() {

      country = this.value
      console.log(country)

      // Create new data with the selection?
      var dataFilter = data.filter(function(d){return d.country_long == country })

      svg.selectAll('circle').remove()
      // Give these new data to update line
      dot = svg
      	.selectAll('circle')
        .data(dataFilter)
        .enter()
        .append('circle')
          .attr("cx", function(d) { return x(+d.commissioning_year) })
          .attr("cy", function(d) { return y(d.primary_fuel) })
          .attr("r", function(d) { return size(d.capacity_mw) })
          .style("fill", "#69b3a2")
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})