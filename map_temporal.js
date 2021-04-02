

var map = L
  .map('mapid')
  .setView([47, 2], 5);   // center position + zoom

// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 8,
    }).addTo(map);

// Add a svg layer to the map
L.svg().addTo(map);

d3.csv("https://raw.githubusercontent.com/ajlarivi/ajlarivi.github.io/master/data/global_power_plant_database_WithAge_sorted.csv", function(plant_data){
	d3.json("https://raw.githubusercontent.com/ajlarivi/ajlarivi.github.io/master/data/countries.geojson", function(geoJsonData){
		L.geoJSON(geoJsonData, {
			style: function (feature){
				return {fillOpacity: 0,
						opacity: 0}
			},
		    onEachFeature: onEachFeature
		}).addTo(map);

	  function clickFeature(e) {
    		var layer = e.target;
    		country = layer.feature.properties.ADMIN
    		console.log(country)
    		map.fitBounds(layer.getBounds());
    		var sel = document.getElementById('sel')
        	var opts = sel.options
	        for(var opt, j = 0; opt = opts[j]; j++){
	          if(opt.value == country){
	            sel.selectedIndex = j;
	            break;
	          }
	        }
    		//console.log(layer.feature.properties.name); //country info from geojson
  		}

		function onEachFeature(feature, layer) {
		    layer._leaflet_id = feature.properties.ADMIN

		    layer.on({
		      click: clickFeature
		    });
		  }


	    var color = d3.scaleOrdinal()
	      .domain(["Oil", "Hydro", "Wind", "Solar", "Biomass", "Gas", "Geothermal", "Coal", "nuclear", "waste", "other"])
	      .range([ "#b15928", "#1f78b4", "#5ca2d1", "#ff7f00", "#229a00", "#bc80bd", "#fdbf6f", "#000000", "#4B0AE1", "#e31a1c", "#6a3d9a",  "#b2df8a"])


	    var valueExtent = d3.extent(plant_data, function(d) { return +d.capacity_mw; })
	    var yearExtent = d3.extent(plant_data, function(d) { return +d.plant_rank; })
	    console.log(yearExtent)

	    var oilRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#6E2C00', '#FBEEE6'])
	    var hydroRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#154360', '#EAF2F8'])
	    var windRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#1B4F72', '#EBF5FB'])
	    var solarRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['##7E5109', '#7E5109'])
	    var biomassRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#145A32', '#145A32'])
	    var gasRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#512E5F', '#FDEDEC'])
	    var geothermalRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#7D6608 ', '#FEF9E7'])
	    var coalRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#17202A ', '#EAECEE'])
	    var nuclearRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#7B241C', '#F9EBEA'])
	    var wasteRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#4A235A', '#F4ECF7'])
	    var otherRange = d3.scaleLinear()
	    	.domain(yearExtent)
	    	.range(['#0B5345', '#E8F6F3'])


	    function getColorValue(year, primary_fuel){
	    	if(primary_fuel == "Oil"){
	    		return oilRange(year)
	    	} else if(primary_fuel == "Hydro"){
	    		return hydroRange(year)
	    	} else if(primary_fuel == "Wind"){
	    		return windRange(year)
	    	} else if(primary_fuel == "Solar"){
	    		return solarRange(year)
	    	} else if(primary_fuel == "Biomass"){
	    		return biomassRange(year)
	    	} else if(primary_fuel == "Gas"){
	    		return gasRange(year)
	    	} else if(primary_fuel == "Geothermal"){
	    		return geothermalRange(year)
	    	} else if(primary_fuel == "Coal"){
	    		return coalRange(year)
	    	} else if(primary_fuel == "Nuclear"){
	    		return nuclearRange(year)
	    	} else if(primary_fuel == "Waste"){
	    		return wasteRange(year)
	    	} else {
	    		return otherRange(year)
	    	}
	    } 

	    function getStrokeColor(rank, year, primary_fuel){
	    	if(rank == 1){
	    		return '#FF06BF'
	    	}
	    	else{
	    		return getColorValue(year, primary_fuel)
	    	}
	    }

	    function updateCountry(){
	    	country = this.value
	    	map._layers[country].fire('click');  // 'clicks' on state name from search
        	//var layer = map._layers[a];
        	//map.fitBounds(layer.getBounds());  // zooms to selected poly


	    }


	    var countryOptions = d3.map(plant_data, function(d){return d.country_long;}).keys()

	    var select = d3.select("#countryOpts")
	    .append("select")
	    .attr("id", "sel")
	    .on("change", updateCountry)



	    var countryDropdown = select.selectAll(null)
	    .data(countryOptions)
	    .enter()
	    .append("option")
	    .text(function(d){return d})
	    .attr("value", function(d){return d})




	    // Add a scale for bubble size
	    var size = d3.scaleLinear()
	      .domain(valueExtent)  // What's in the data
	      .range([2, 30])  // Size in pixel

	    var opacity = d3.scaleLinear()
	       .domain(yearExtent)
	       .range([0.1,1])


	    var Tooltip = d3.select("body")
      	  .append("div")
      	  .attr("class", "tooltip")
      	  .style("opacity", 0)
      	  .style("background-color", "white")
      	  .style("border", "solid")
      	  .style("border-width", "2px")
      	  .style("border-radius", "5px")
      	  .style("padding", "5px")
      	  .style("z-index", "999")


      	// Three function that change the tooltip when user hover / move / leave a cell
    	var mouseover = function(d) {
    		if(myZoom.end > 6){
      			Tooltip.style("opacity", 1)
      		}
    	}
    	var mousemove = function(d) {
      		Tooltip
        	  .html(d.name + "<br>" + "capacity (MW): " + d.capacity_mw + "<br>" + "primary fuel: " + d.primary_fuel + "<br>commissioning year: " + d.commissioning_year)
        	  .style("left", (d3.mouse(this)[0]+10) + "px")
        	  .style("top", (d3.mouse(this)[1]) + "px")
    	}
    	var mouseleave = function(d) {
      		Tooltip.style("opacity", 0)
    	}

	    // Add circles:
	    d3.select("#mapid").select("svg")
	      .selectAll("myCircles")
	      .data(plant_data)
	      .enter()
	      .append("circle")
	        .attr("class" , function(d){ return d.primary_fuel })
	        .attr("cx", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).x })
            .attr("cy", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).y })
	        .attr("r", function(d){ return size(d.capacity_mw) })
	        .style("fill", function(d){ return getColorValue(d.plant_rank, d.primary_fuel)})
	        .attr("stroke", function(d){ return getStrokeColor(d.plant_rank, d.plant_rank, d.primary_fuel)})
	        .attr("stroke-width", 1)
	        .attr("fill-opacity", 1)
	        .style("pointer-events", "auto")
	       .on("mouseover", mouseover)
      	   .on("mousemove", mousemove)
      	   .on("mouseleave", mouseleave)


		var myZoom = {
		  start:  map.getZoom(),
		  end: map.getZoom()
		};


	    // This function is gonna change the opacity and size of selected and unselected circles
	    function update_filter(){

	      // For each check box:
	      d3.selectAll(".checkbox").each(function(d){
	        checkbox = d3.select(this);
	        fuel_type = checkbox.property("value")

	        checkbox.attr("style", "color:" + color(fuel_type + ";"))

	        // If the box is check, I show the group
	        if(checkbox.property("checked")){
	          d3.selectAll("circle."+fuel_type).transition().duration(1000).style("opacity", 1)//.attr("r", function(d){ return size(d.capacity_mw) })

	        // Otherwise I hide it
	        }else{
	          d3.selectAll("circle."+fuel_type).transition().duration(1000).style("opacity", 0)//.attr("r", 0)
	        }
	      })
	    }


	    function update_size() {
	    	myZoom.end = map.getZoom();
		    var diff = myZoom.start - myZoom.end;
		    console.log("size updated " + diff)
		    if(diff > 4){
		    	diff = 4
		    	console.log("adjusted")
		    }

		    if (diff > 0) {
		        d3.selectAll("circle").each(function(d){
		        	circle = d3.select(this)
		        	circle.attr("r", circle.attr("r")/(2*diff))
		    	});
		          
		    } else if (diff < 0) {
		        d3.selectAll("circle").each(function(d){
		        	circle = d3.select(this)
		        	circle.attr("r", circle.attr("r")*(2*Math.abs(diff)))
		        });
		    }
    		myZoom.start = map.getZoom()
		}

		function update_position() {
			d3.selectAll("circle")
    		  .attr("cx", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).x })
    		  .attr("cy", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).y })
    		  
		}

	    // When a button change, I run the update function
	    d3.selectAll(".checkbox").on("change",update_filter);

	    map.on('movestart', function(e) {
		  // myZoom.start = map.getZoom();
		});

	    map.on("moveend", update_size).on("moveend", update_position)

	    // And I initialize it at the beginning
	    update_filter()

	});
});
