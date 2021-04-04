

var map = L
  .map('mapid')
  .setView([41, 20], 7);   // center position + zoom

// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 8,
    }).addTo(map);


// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 50, left: 70},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgTimeline = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


d3.csv("https://raw.githubusercontent.com/ajlarivi/ajlarivi.github.io/master/data/global_power_plant_database_wihtExtent.csv", function(plant_data){
	d3.json("https://raw.githubusercontent.com/ajlarivi/ajlarivi.github.io/master/data/countries.geojson", function(geoJsonData){
		jsonLayer = L.geoJSON(geoJsonData, {
			style: function (feature){
				return {fillOpacity: 0,
						opacity: 0,
						color: '#cc2537'}
			},
		    onEachFeature: onEachFeature
		}).addTo(map);

		L.svg().addTo(map);
		

	  function clickFeature(e) {
    		var layer = e.target;
    		country = layer.feature.properties.ADMIN
    		console.log(country)

    		jsonLayer.eachLayer(function(d){
    			d.setStyle({
    				opacity: 0,
    			})
    		})

    		layer.setStyle({
    			opacity: 1
    		})

    		update(country)


    		map.fitBounds(layer.getBounds());
    		console.log(map.getCenter())
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
	    /*var rank_extent = d3.extent(plant_data, function(d) { return +d.plant_rank; })

	    var oilRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['#6E2C00', '#FBEEE6'])
	    var hydroRange = d3.scaleLinear()
	    	.domain([rank_extent])
	    	.range(['#154360', '#EAF2F8'])
	    var windRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['#1B4F72', '#EBF5FB'])
	    var solarRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['##7E5109', '#7E5109'])
	    var biomassRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['#145A32', '#145A32'])
	    var gasRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['#512E5F', '#FDEDEC'])
	    var geothermalRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['#7D6608 ', '#FEF9E7'])
	    var coalRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['#17202A ', '#EAECEE'])
	    var nuclearRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['#7B241C', '#F9EBEA'])
	    var wasteRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['#4A235A', '#F4ECF7'])
	    var otherRange = d3.scaleLinear()
	    	.domain(rank_extent)
	    	.range(['#0B5345', '#E8F6F3'])*/


	    function getColorValue(rank, rank_max, primary_fuel){

	    	if(primary_fuel == "Oil"){
	    		var oilRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#3E2723', '#EFEBE9'])		  
	    		return oilRange(rank)

	    	} else if(primary_fuel == "Hydro"){
	    		var hydroRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#0D47A1', '#EAF2F8'])
	    		return hydroRange(rank)

	    	} else if(primary_fuel == "Wind"){
	    		var windRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#004D40', '#E0F2F1'])
	    		return windRange(rank)

	    	} else if(primary_fuel == "Solar"){
	    		var solarRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#F57F17', '#FFFDE7'])
	    		return solarRange(rank)

	    	} else if(primary_fuel == "Biomass"){
	    		var biomassRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#1B5E20', '#E8F5E9'])
	    		return biomassRange(rank)

	    	} else if(primary_fuel == "Gas"){
	    		var gasRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#880E4F', '#FCE4EC'])
	    		return gasRange(rank)

	    	} else if(primary_fuel == "Geothermal"){
	    		var geothermalRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#BF360C ', '#FBE9E7'])
	    		return geothermalRange(rank)

	    	} else if(primary_fuel == "Coal"){
	    		var coalRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#263238 ', '#ECEFF1'])
	    		return coalRange(rank)

	    	} else if(primary_fuel == "Nuclear"){
	    		var nuclearRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#B71C1C', '#FFEBEE'])
	    		return nuclearRange(rank)

	    	} else if(primary_fuel == "Waste"){
	    		var wasteRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#4A148C', '#F3E5F5'])
	    		return wasteRange(rank)

	    	} else {
	    		var otherRange = d3.scaleLinear()
		    	.domain([1,rank_max])
		    	.range(['#827717', '#F9FBE7'])
	    		return otherRange(rank)
	    	}
	    } 

	    function getStrokeColor(rank, rank_extent, primary_fuel){
	    	/*if(rank == 1){
	    		return '#FF06BF'
	    	}
	    	else{*/
	    		return getColorValue(rank, rank_extent, primary_fuel)
	    	//}
	    }

	    function updateCountry(){
	    	country = this.value
	    	map._layers[country].fire('click');  // 'clicks' on state name from search
        	//var layer = map._layers[a];
        	//map.fitBounds(layer.getBounds());  // zooms to selected poly
        	update(country)


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
	      .range([2, 35])  // Size in pixel

	    /*var opacity = d3.scaleLinear()
	       .domain(rank_extent)
	       .range([0.1,1])*/


	    var Tooltip = d3.select("#tooltipDiv")
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
    	var mouseoverMap = function(d) {
    		var point = d3.select(this)
    		if(point.style("opacity") == 1){
	      		Tooltip.style("opacity", 1)
	      		
	      		point.style("fill", "#cc2537")
	      		point.style("stroke", "#cc2537")

	      		var idnr = point.datum().gppd_idnr

	      		svgTimeline.selectAll("circle").
	      		filter(function(d){
	      			return d.gppd_idnr == idnr;
	      		})
	      		.style("fill", "#cc2537")
	      		.style("stroke", "#cc2537")
      		}
    	}
    	var mousemoveMap = function(d) {
      		Tooltip
        	  .html(d.name + "<br>" + "capacity (MW): " + d.capacity_mw + "<br>" + "primary fuel: " + d.primary_fuel + "<br>commissioning year: " + d.commissioning_year)
        	  .style("left", (d3.mouse(this)[0]+10) + "px")
        	  .style("top", (d3.mouse(this)[1]) + "px")
    	}
    	var mouseleaveMap = function(d) {
      		Tooltip.style("opacity", 0)
      		
      		var point = d3.select(this)
      		point.style("fill", function(d){ return getColorValue(d.plant_rank, d.rank_extent, d.primary_fuel)})
      		point.style("stroke", function(d){ return getStrokeColor(d.plant_rank, d.rank_extent, d.primary_fuel)})

      		var idnr = point.datum().gppd_idnr

      		svgTimeline.selectAll("circle").
      		filter(function(d){
      			return d.gppd_idnr == idnr;
      		})
      		.style("fill", function(d){ return getColorValue(d.plant_rank, d.rank_extent, d.primary_fuel)})
      		.style("stroke", function(d) { return getStrokeColor(d.plant_rank, d.rank_extent, d.primary_fuel)})

    	}

    	var mouseoverTimeline = function(d) {
      		Tooltip.style("opacity", 1)

      		var point = d3.select(this)

      		point.style("fill", "#cc2537")
      		point.style("stroke", "#cc2537")

      		var idnr = point.datum().gppd_idnr

      		d3.select("#mapid").select("svg").selectAll("circle").
      		filter(function(d){
      			return d.gppd_idnr == idnr;
      		})
      		.style("fill", "#cc2537")
      		.style("stroke", "#cc2537")
    	}
    	var mousemoveTimeline = function(d) {
      		Tooltip
        	  .html(d.name + "<br>" + "capacity (MW): " + d.capacity_mw + "<br>" + "primary fuel: " + d.primary_fuel + "<br>commissioning year: " + d.commissioning_year)
        	  .style("left", (d3.mouse(this)[0]+10) + "px")
        	  .style("top", (d3.mouse(this)[1]) + "px")
    	}
    	var mouseleaveTimeline = function(d) {
      		Tooltip.style("opacity", 0)
      		
      		var point = d3.select(this)
      		point.style("fill", function(d){ return getColorValue(d.plant_rank, d.rank_extent, d.primary_fuel)})
      		point.style("stroke", function(d){ return getStrokeColor(d.plant_rank, d.rank_extent, d.primary_fuel)})

      		var idnr = point.datum().gppd_idnr

      		d3.select("#mapid").select("svg").selectAll("circle").
      		filter(function(d){
      			return d.gppd_idnr == idnr;
      		})
      		.style("fill", function(d){ return getColorValue(d.plant_rank, d.rank_extent, d.primary_fuel)})
      		.style("stroke", function(d) { return getStrokeColor(d.plant_rank, d.rank_extent, d.primary_fuel)})
    	}

    	var timelineClick = function(d){
	    	var point = d3.select(this)
	    	console.log(point.datum().longitude)
	    	map.setView([point.datum().latitude, point.datum().longitude], 8)
	    }


	    // Add circles:
	    d3.select("#mapid").select("svg")
	      .selectAll("myCircles")
	      .data(plant_data.reverse())
	      .enter()
	      .append("circle")
	        .attr("class" , function(d){ return d.primary_fuel })
	        .attr("cx", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).x })
            .attr("cy", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).y })
	        .attr("r", function(d){ return size(d.capacity_mw) })
	        .style("fill", function(d){ return getColorValue(d.plant_rank, d.rank_extent, d.primary_fuel)})
	        .attr("stroke", function(d){ return getStrokeColor(d.plant_rank, d.rank_extent, d.primary_fuel)})
	        .attr("stroke-width", 1)
	        .attr("fill-opacity", 1)
	        .style("pointer-events", "auto")
	       .on("mouseover", mouseoverMap)
      	   .on("mousemove", mousemoveMap)
      	   .on("mouseleave", mouseleaveMap)


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

	        checkbox.style("color",  color(fuel_type + ";"))

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
		    if(diff > 4){
		    	diff = 4
		    }

		    if (diff > 0) {
		        d3.select("#mapid").select("svg").selectAll("circle").each(function(d){
		        	circle = d3.select(this)
		        	circle.attr("r", circle.attr("r")/(2*diff))
		    	});
		          
		    } else if (diff < 0) {
		        d3.select("#mapid").select("svg").selectAll("circle").each(function(d){
		        	circle = d3.select(this)
		        	circle.attr("r", circle.attr("r")*(2*Math.abs(diff)))
		        });
		    }
    		myZoom.start = map.getZoom()
		}

		function update_position() {
			d3.select("#mapid").select("svg").selectAll("circle")
    		  .attr("cx", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).x })
    		  .attr("cy", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).y })
    		  
		}

	    // When a button change, I run the update function
	    d3.selectAll(".checkbox").on("change",update_filter);

	    d3.select("#resetButton").on("click", function(d){
			d3.selectAll(".checkbox").each(function(d){
				checkbox = d3.select(this);
				checkbox.property("checked", false)
			})

			d3.select("#mapid").select("svg").selectAll("circle").transition().duration(1000).style("opacity", 0)
		});

		d3.select("#setButton").on("click", function(d){
			d3.selectAll(".checkbox").each(function(d){
				checkbox = d3.select(this);
				checkbox.property("checked", true)
			})
			console.log("TEST")

			d3.select("#mapid").select("svg").selectAll("circle").transition().duration(1000).style("opacity", 1)
		});

	    map.on('movestart', function(e) {
		  // myZoom.start = map.getZoom();
		});

	    map.on("moveend", update_size).on("moveend", update_position)

	    // And I initialize it at the beginning
	    update_filter()


	    var data = plant_data




	    var dataFilter = data.filter(function(d){return d.country_long == 'Albania' })

	    var xMin = d3.min(data, function(d) { return +d.commissioning_year; })
		var xMax = d3.max(data, function(d) { return +d.commissioning_year; })

		var x = d3.scaleLinear()
	      .domain([xMin,xMax])
	      .range([ 0, width ]);
	    svgTimeline.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x)
	      .ticks(25));

	    // Add Y axis
	    var y = d3.scalePoint()
	      .domain(["Biomass", "Geothermal", "Hydro", "Solar", "Wind", "Other", "Coal", "Gas", "Nuclear", "Oil", "Waste"].reverse())
	      .range([ height - 10, 0]);
	    svgTimeline.append("g")
	      .call(d3.axisLeft(y));


	    var dot = svgTimeline
	      .selectAll('circle')
	      .data(dataFilter)
	      .enter()
	      .append('circle')
	        .attr("cx", function(d) { return x(+d.commissioning_year) })
	        .attr("cy", function(d) { return y(d.primary_fuel) })
	        .attr("r", function(d) { return size(d.capacity_mw) })
	        .style("fill", function(d){ return getColorValue(d.plant_rank, d.rank_extent, d.primary_fuel)})
	        .attr("stroke", function(d){ return getStrokeColor(d.plant_rank, d.rank_extent, d.primary_fuel)})
	        .on("mouseover", mouseoverTimeline)
      	    .on("mousemove", mousemoveTimeline)
      	    .on("mouseleave", mouseleaveTimeline)
      	    .on("click", timelineClick)

      	map._layers["Albania"].fire('click');

	    function update(country) {

	      // Create new data with the selection?
	      var dataFilter = data.filter(function(d){return d.country_long == country })

	      svgTimeline.selectAll('circle').remove()
	      // Give these new data to update line
	      dot = svgTimeline
	      	.selectAll('circle')
	        .data(dataFilter)
	        .enter()
	        .append('circle')
	          .attr("cx", function(d) { return x(+d.commissioning_year) })
	          .attr("cy", function(d) { return y(d.primary_fuel) })
	          .attr("r", function(d) { return size(d.capacity_mw) })
	          .style("fill", function(d){ return getColorValue(d.plant_rank, d.rank_extent, d.primary_fuel)})
	          .attr("stroke", function(d){ return getStrokeColor(d.plant_rank, d.rank_extent, d.primary_fuel)})
	          .on("mouseover", mouseoverTimeline)
      	      .on("mousemove", mousemoveTimeline)
      	      .on("mouseleave", mouseleaveTimeline)
      	      .on("click", timelineClick)
	    }

	});
});
