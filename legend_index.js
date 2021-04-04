oil = "#5D4037"      

hydro = "#1976D2"

wind = "#00796B"

solar = "#FBC02D"

biomass = "#388E3C"

gas = "#C2185Bs"

geothermal = "#E64A19"

coal = "#455A64"

nuclear = "#D32F2F"

waste = "#7B1FA2"

other = "#AFB42B"

var fuels = [ "Biomass", "Geothermal", "Hydro", "Solar", "Wind", "Other", "Coal", "Gas", "Nuclear", "Oil", "Waste"]

var colorScale = d3.scaleOrdinal()
        .domain(fuels)
        .range([ biomass, geothermal, hydro, solar, wind, other, coal, gas, nuclear, oil, waste])

fuels.forEach(function (fuel, index) {
  var svgLegend = d3.select('#legendBars').append('svg').attr("width", 220).attr("height", 45)

		// append title
  /*svgLegend.append("text")
    .attr("class", "label")
    .attr("x", 100)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text(fuel)
    //.each(function(d){console.log(fuel)})*/

  
    
    //.each(function(d){console.log(this)})

  // draw the rectangle and fill with gradient
  svgLegend.append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", colorScale(fuel));
   svgLegend.append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", "none")
    .style("stroke", "black");


  svgLegend
    .attr("class", "axis")
    .append("g")
    .attr("transform", "translate(0, 40)")
    //.call(axisLeg);

    svgLegend.append("foreignObject")
    .attr("x", 30)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 30)
    .append("xhtml:body")
    .html("<input type=checkbox class=checkbox value=" + fuel + " checked><label value=" + fuel + ">" + fuel + "</label>")
});
