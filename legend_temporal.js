oil = ['#3E2723', '#EFEBE9']      

hydro = ['#0D47A1', '#E3F2FD']

wind = ['#004D40', '#E0F2F1']

solar = ['#F57F17', '#FFFDE7']

biomass = ['#1B5E20', '#E8F5E9']

gas = ['#880E4F', '#FCE4EC']

geothermal = ['#BF360C ', '#FBE9E7']

coal = ['#263238 ', '#ECEFF1']

nuclear = ['#B71C1C', '#FFEBEE']

waste = ['#4A148C', '#F3E5F5']

other = ['#827717', '#F9FBE7']

var fuels = [ "Biomass", "Geothermal", "Hydro", "Solar", "Wind", "Other", "Coal", "Gas", "Nuclear", "Oil", "Waste"]

var colorScale = d3.scaleOrdinal()
        .domain(fuels)
        .range([ biomass, geothermal, hydro, solar, wind, other, coal, gas, nuclear, oil, waste])

fuels.forEach(function (fuel, index) {
  var svgLegend = d3.select('#legendBars').append('svg').attr("width", 220).attr("height", 45)
  var defs = svgLegend.append('defs')
  var linearGradient = defs.append('linearGradient')
  					.attr('id', 'linear-gradient-'+fuel)

  linearGradient
		.attr("x1", "0%")
		.attr("y1", "0%")
		.attr("x2", "100%")
		.attr("y2", "0%");

  		// append multiple color stops by using D3's data/enter step
		linearGradient.selectAll("stop")
		  .data([
		    {offset: "0%", color: colorScale(fuel)[0]},
		    {offset: "100%", color: colorScale(fuel)[1]}
		  ])
		  .enter().append("stop")
		  .attr("offset", function(d) { 
		    return d.offset; 
		  })
		  .attr("stop-color", function(d) { 
		    return d.color; 
		  });

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
    .attr("y", 30)
    .attr("width", 200)
    .attr("height", 10)
    .style("fill", "url(#linear-gradient-" + fuel + ")");
   svgLegend.append("rect")
    .attr("x", 10)
    .attr("y", 30)
    .attr("width", 200)
    .attr("height", 10)
    .style("fill", "none")
    .style("stroke", "black");


  svgLegend
    .attr("class", "axis")
    .append("g")
    .attr("transform", "translate(0, 40)")
    //.call(axisLeg);

    svgLegend.append("foreignObject")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 500)
    .attr("height", 50)
    .append("xhtml:body")
    .html("<input type=checkbox class=checkbox value=" + fuel + " checked><label value=" + fuel + ">" + fuel + "</label>")
});
