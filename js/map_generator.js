
function setupWorldMap(){
	var width = 700,
	    height = 500;

	// définir la projection et le path generator pour la carte
	var projection = d3.geo.kavrayskiy7()
	.scale(200)
	.translate([width / 2-100, height / 2+40]);

	this.pathGenerator = d3.geo.path().projection(projection);

	// décoder le topojson en geojson
	var geojsonWorld = topojson.object(worldTopoJSON, worldTopoJSON.objects.countries).geometries;

	// créer le svg
	var svg = d3.select("#map").append("svg")
	    .attr("width", width)
	    .attr("height", height);


	svg.selectAll(".country") 
	.data(geojsonWorld)
	.enter().append("path")
	.attr("class", function(country) { 
	  var classes = "country " + country.id;
	  if (countries[country.id] ){
	  	classes += " mcc";
	  }
	  return classes; 
	})
	.attr("d", pathGenerator);

	// créer geojsonMcc, un sous-ensemble de geoJsonWorld
	this.geojsonMcc = geojsonWorld
	.filter(function(country){
		var isMcc = false;
		_(countries).each(function(v, k){
		  if (country.id == k) {
		    isMcc = true;
		   };
		})
		return isMcc;
	})

}



function setupFranceMap(){
	var width = 700,
	    height = 500;

	// définir la projection et le path generator pour la carte
	this.projection = d3.geo.kavrayskiy7()
	.scale(2400)
	.center([+46.995241,+2.449951])
	.translate([width / 2 +1550, height / 2 +1830]);

	this.pathGenerator = d3.geo.path().projection(projection);

	// décoder le topojson en geojson
	var geojsonWorld = topojson.object(worldTopoJSON, worldTopoJSON.objects.countries).geometries;

	// créer le svg
	var svg = d3.select("#map").append("svg")
	    .attr("width", width)
	    .attr("height", height);


	svg.selectAll(".country") 
	.data(geojsonWorld)
	.enter().append("path")
	.attr("class", "country")
	.attr("d", pathGenerator);

}



function hover(d){   //le datum est passé en d

  var $tooltip = $("<div class='pays_popup'></div>");
  var x = parseInt($(this).attr("cx")) + 15;
  // x = x+10;
  var y = parseInt($(this).attr("cy")) - 25;
  $tooltip.html("<b>" + countries[d.id].name + "</b><br />" + d.enfants + " enfants");

  $('#map').append($tooltip);
  $tooltip.css("left", x+"px");
  $tooltip.css("top", y+"px");
};

function updateWorldMap(year){

	// échelle pour le rayon des cercles
	this.rScale = d3.scale.linear()
	  .domain([0, 1, 40])
	  .rangeRound([0, 6, 45]);

	var that = this;
	var updated = d3.select("svg").selectAll(".symbol")
	.data(data[year]['countries'], function(c){return c['id']});

	updated.enter().append("svg:circle")
	.attr("class", "symbol")
	.attr("cx", function(d) { 
		var this_country = _(that.geojsonMcc).findWhere({'id': parseInt(d.id)}) ;
		var center = Math.round(that.pathGenerator.centroid(this_country)[0]);
	  	return center;
	  })
	.attr("cy", function(d) { 
		var this_country = _(that.geojsonMcc).findWhere({'id': parseInt(d.id)}) 
		var center = Math.round(that.pathGenerator.centroid(this_country)[1]);
	  	return center;
	  })
	.on("mouseover", hover)
	.on("mouseout", function(){
	  $('.pays_popup').remove();
	})
	.on('click', displayCountryInfo);

	updated.exit().transition()
	.duration(800)
	.attr("r", 0)
	.remove();
	
	updated.transition()
	.duration(1000)
	.attr("r", function(d) { return that.rScale(d['enfants']) || 0 ;});
};

function updateFranceMap(year){

	// échelle pour le rayon des cercles
	var rScale = d3.scale.linear()
	  .domain([0, 1, 50])
	  .rangeRound([0, 6, 20]);

	var that = this;

	var updated = d3.select("svg").selectAll(".symbol")
	.data(data[year]['sites'], function(c){return c['id']});

	updated.enter().append("svg:circle")
	.attr("class", "symbol")
	.attr("cx", function(d) { 
		var coord = that.projection([+sites[d.id].lng, sites[d.id].lat])
	  	return Math.round(coord[0]);
	  })
	.attr("cy", function(d) { 
		var coord = that.projection([+sites[d.id].lng, sites[d.id].lat])
	  	return Math.round(coord[1]);
	  	return center;
	  })
	.on("mouseover", hover)
	.on("mouseout", function(){
	  $('.pays_popup').remove();
	})
	.on('click', displayCountryInfo);

	updated.exit().transition()
	.duration(800)
	.attr("r", 0)
	.remove();
	
	updated.transition()
	.duration(1000)
	.attr("r", function(d) { return rScale(d['enfants']) || 0 ;});

};

function displayCountryInfo(d){
	console.log('display info for ' + countries[d.id].name + ' (id '+ d.id +')');
}





