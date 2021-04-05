var map = L
  .map('mapid')
  .setView([47, 2], 5);   // center position + zoom

// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer(
    'https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 8,
    accessToken: 'fvKMY1WDwbc69b4SxJKRZGu5NCYT4s11hrf0N9u3FUGDDEcTRFeb2RS1Ekxl0jkk'
    }).addTo(map);

var currentlyDisplayed = 'Renewables'
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 35, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 575 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgScatter = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// create a clipping region 
svgScatter.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width+8)
    .attr("height", height+8)
    .attr('transform', 'translate(-3,-3)');



d3.csv("https://raw.githubusercontent.com/ajlarivi/ajlarivi.github.io/master/data/global_power_plant_database_processed.csv", function(plant_data){
	d3.json("https://raw.githubusercontent.com/ajlarivi/ajlarivi.github.io/master/data/countries.geojson", function(geoJsonData){
	d3.json("https://raw.githubusercontent.com/ajlarivi/ajlarivi.github.io/master/data/country_stats3.json", function(data) {
	    

	  	function clickFeature(e) {
    		var layer = e.target;
    		country = layer.feature.properties.ADMIN
    		jsonLayer.eachLayer(function(d){
    			d.setStyle({
    				opacity: 0,
    			})
    		})

    		layer.setStyle({
    			opacity: 1
    		})

    		map.fitBounds(layer.getBounds());
    		var sel = document.getElementById('sel')
        	var opts = sel.options
	        for(var opt, j = 0; opt = opts[j]; j++){
	          if(opt.value == country){
	            sel.selectedIndex = j;
	            break;
	          }
	        }

	        updateScatter(country)
    		//console.log(layer.feature.properties.name); //country info from geojson
  		}

		function onEachFeature(feature, layer) {
		    layer._leaflet_id = feature.properties.ADMIN

		    layer.on({
		      click: clickFeature
		    });
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

	    /*function updateCountry(){
	    	country = this.value
	    	map._layers[country].fire('click');  // 'clicks' on state name from search
        	//var layer = map._layers[a];
        	//map.fitBounds(layer.getBounds());  // zooms to selected poly
	    }*/

	    //CHECK THIS
		function updateCountry(dotCountry){
		    if(dotCountry){
		      var country = dotCountry
		    }
		    else{
		      var country = this.value;
		    }

		    updateScatter(country)

		    //country = this.value
	    	map._layers[country].fire('click');  // 'clicks' on state name from search  
		      

		}

		function updateScatter(country){
			var countries = svgScatter.selectAll("circle")
		      .attr("style", "fill:#69b3a2")

		    countries
		      .filter(function(d){
		        return d.Country == country
		      })
		      .attr("style", "fill:red")
		}



	    var color = d3.scaleOrdinal()
	      .domain(["Oil", "Hydro", "Wind", "Solar", "Biomass", "Gas", "Geothermal", "Coal", "Nuclear", "Waste", "Other"])
	      .range([ "#5D4037", "#1976D2", "#00796B", "#FBC02D", "#388E3C", "#C2185B", "#E64A19", "#455A64", "#922B21", "#7B1FA2", "#AFB42B"])

	    var valueExtent = d3.extent(plant_data, function(d) { return +d.capacity_mw; })

	    // Add a scale for bubble size
	    var size = d3.scaleLinear()
	      .domain(valueExtent)  // What's in the data
	      .range([2, 30])  // Size in pixel


	    var Tooltip = d3.select("#mapTooltipDiv")
      	  .append("div")
      	  .attr("class", "tooltip")
      	  .style("opacity", 0)
      	  .style("background-color", "white")
      	  .style("border", "solid")
      	  .style("border-width", "2px")
      	  .style("border-radius", "5px")
      	  .style("padding", "5px")
      	  .style("z-index", "999")

      	var scatterTooltip = d3.select("#scatterTooltipDiv")
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
    		if(d.capacity_mw != null){
      			Tooltip.style("opacity", 1)
      		} else {
      			scatterTooltip.style("opacity", 1)
      		}

    	}
    	var mousemove = function(d) {
      		Tooltip
        	  .html(d.name + "<br>" + "capacity (MW): " + d.capacity_mw + "<br>" + "primary fuel: " + d.primary_fuel)
        	  .style("left", (d3.mouse(this)[0]+10) + "px")
        	  .style("top", (d3.mouse(this)[1]) + "px")

        	scatterTooltip
        	  .html(d.Country + "<br>total capacity (mw): " + d.Total + "<br>" + currentlyDisplayed + " capacity (mw): " + d[currentlyDisplayed])
        	  .style("left", (d3.mouse(this)[0]+10) + "px")
        	  .style("top", (d3.mouse(this)[1]) + "px")

    	}
    	var mouseleave = function(d) {
      		Tooltip.style("opacity", 0)
      		scatterTooltip.style("opacity", 0)
    	}

    	jsonLayer = L.geoJSON(geoJsonData, {
			style: function (feature){
				return {fillOpacity: 0,
						opacity: 0,
						color: '#cc2537'}
			},
		    onEachFeature: onEachFeature
		}).addTo(map);

      	// Add a svg layer to the map
		L.svg().addTo(map);


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
	        .style("fill", function(d){ return color(d.primary_fuel) })
	        .attr("stroke", function(d){ return color(d.primary_fuel) })
	        .attr("stroke-width", 0)
	        .attr("fill-opacity", .9)
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
	          d3.selectAll("circle."+fuel_type).transition().duration(1000).style("opacity", 0.9)//.attr("r", function(d){ return size(d.capacity_mw) })

	        // Otherwise I hide it
	        }else{
	          d3.selectAll("circle."+fuel_type).transition().duration(1000).style("opacity", 0)//.attr("r", 0)
	        }
	      })
	    }

	    d3.selectAll(".myLabel").each(function(d){
	    	label = d3.select(this)
	    	console.log(label.text())
	    	fuel_type = label.text()
	    	label.style("color", color(fuel_type))
	    })


	    function update_size() {
	    	myZoom.end = map.getZoom();
		    var diff = myZoom.start - myZoom.end;
		    console.log(diff)
		    if (diff > 0) {
		        d3.select("#mapid").select("svg").selectAll("circle").each(function(d){
		        	circle = d3.select(this)
		        	old_radius = circle.attr("r")
		        	circle.attr("r", old_radius/(2*diff))
		    	});
		    	console.log("/2")
		          
		    } else if (diff < 0) {
		        d3.select("#mapid").select("svg").selectAll("circle").each(function(d){
		        	circle = d3.select(this)
		        	old_radius = circle.attr("r")
		        	circle.attr("r", old_radius*(2*Math.abs(diff)))
		        });
		        console.log("*2")
		    }
    		myZoom.start = map.getZoom();
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
		   //myZoom.start = map.getZoom();
		});

	    map.on("moveend", update_size).on("moveend", update_position)

	    // And I initialize it at the beginning
	    update_filter()


	    function updateGraph(){
			  //---------------------------------------------
		    var property = this.value;
		    currentlyDisplayed = property

			  var yExtent = d3.extent(data, function(d) { return +(d[property]/d.Total)*100; })
			  // Add dots

		    var currentYScale = yAxis.scale()

			  points
		      //.data(data)
		      .transition()
		      .duration(1000)
		      .on("start", function(){
		        d3.select(this)
		          .style("opacity", 0.6)
		          .attr("r", 5);
		      })
		      .delay(function(d,i){
		        return i / data.length * 500;
		      })
		      .attr("cy", function(d){
		        return currentYScale((d[property]/d.Total)*100);
		      })
		      .on("end", function(){
		        d3.select(this)
		          .style("opacity", 1)
		          .attr("r", 4)
		      });



		      /*points = points
		        .data(data)
		        .attr("cy", function(d){
		          return yScale((d[property]/d.Total)*100);
		        })*/

		      
		      /*svg.select(".x.axis")
		        .transition()
		        .duration(100)
		        .call(d3.axisBottom(x))*/

		      svgScatter.select("#yLabel")
		        .transition()
		        .duration(100)
		        .text("Percentage of Total Power Capacity (" + property + ")")

		}

		
		  //get data range
		  var xExtent = d3.extent(data, function(d) { return +d.Total; })
		  var yExtent = d3.extent(data, function(d) { return +(d.Renewables/d.Total)*100; })
		    //create scale objects
		    var xScale = d3.scaleLinear()
		      .domain(xExtent)
		      .range([ 0, width ]);

		    var yScale = d3.scaleLinear()
		      .domain([0,100])
		      .range([ height, 0]);
		    //create Axis objects  
		    var xAxis = d3.axisBottom(xScale)

		    var yAxis = d3.axisLeft(yScale)

		    //draw axis
		    var gX = svgScatter.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		    var gY = svgScatter.append("g")
		      .attr("class", "y axis")
		      .call(yAxis);

		    svgScatter.append("text")             
		      .attr("transform",
		            "translate(" + (width/2) + " ," + 
		                           (height + margin.top + 20) + ")")
		      .style("text-anchor", "middle")
		      .text("Total Power Capacity (MW)");

		    svgScatter.append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 0 - margin.left)
		      .attr("x",0 - (height / 2))
		      .attr("dy", "1em")
		      .attr("id", "yLabel")
		      .style("text-anchor", "middle")
		      .text("Percentage of Total Power Capacity (" + currentlyDisplayed + ")");

		    var zoomScatter = d3.zoom()
		          .extent([[0, 0], [width, height]])
		          .scaleExtent([1, 10])
		          .translateExtent([[0,0], [width,height]])
		          .on("zoom", zoomed);

		    svgScatter.append("rect")
		          .attr("width", width)
		          .attr("height", height)
		          .style("fill", "none")
		          .style("pointer-events", "all")
		          //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		          .call(zoomScatter);

		    //draw data points
		    var points_g = svgScatter.append("g")
		      //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		      .attr("clip-path", "url(#clip)")
		      .classed("points_g", true);

		    // draw circles
		    var points = points_g
		      .selectAll("circle")
		      .data(data)

		    points = points
		      .enter()
		      .append("circle")
		        .attr("cx", function (d) { return xScale(d.Total); } )
		        .attr("cy", function (d) { return yScale((d.Renewables/d.Total)*100); } )
		        .attr("r", 4)
		        .style("fill", "#69b3a2")
		      .on("mouseover", mouseover )
		      .on("mousemove", mousemove )
		      .on("mouseleave", mouseleave )
		      .on("click", function(d){
		        dot = d3.select(this)
		        dotCountry = dot.datum().Country
		        updateCountry(dotCountry)
		        var sel = document.getElementById('sel')
		        var opts = sel.options
		        for(var opt, j = 0; opt = opts[j]; j++){
		          if(opt.value == dotCountry){
		            sel.selectedIndex = j;
		            break;
		          }
		        }
      		  })

      		function zoomed() {
		      // create new scale ojects based on event
		          var new_xScale = d3.event.transform.rescaleX(xScale);
		          var new_yScale = d3.event.transform.rescaleY(yScale);
		      // update axes
		          gX.call(xAxis.scale(new_xScale));
		          gY.call(yAxis.scale(new_yScale));
		          points.data(data)
		           .attr('cx', function(d) {return new_xScale(d.Total)})
		           .attr('cy', function(d) {return new_yScale((d[currentlyDisplayed]/d.Total)*100); });


      		}

      		  var yOptions = d3.keys(data[0]).slice(2)

			  var select = d3.select("#yOpts")
			    .append("select")
			    .on("change", updateGraph)

			  var options = select.selectAll(null)
			    .data(yOptions)
			    .enter()
			    .append("option")
			    .text(function(d){return d})
			    .attr("value", function(d){return d})


	});
	});
});