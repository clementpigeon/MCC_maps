//créer le SVG
var width = 700,
    height = 500;

// échelle pour le rayon des cercles
var rScale = d3.scale.linear()
  .domain([0, 1, 40])
  .rangeRound([0, 6, 45]);

// définir la projection et le path generator pour la carte
var projection = d3.geo.kavrayskiy7()
.scale(200)
.translate([width / 2-100, height / 2+40]);

var pathGenerator = d3.geo.path().projection(projection);

// créer le svg
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);




var currentYear = 1996;
// décoder le topojson en geojson
var geojsonWorld = topojson.object(worldTopoJSON, worldTopoJSON.objects.countries).geometries;
// classer le mccdata par id
// mccdata = mccdata.sort(function(a, b){
//   return a.id - b.id ;
// });

svg.selectAll(".country") 
.data(geojsonWorld)
.enter().append("path")
.attr("class", function(map_country) { 
  var classes = "country " + map_country.id;
  var data_country_ids = _(data['2012']['countries']).map(function(c){return c.id});
  data_country_ids.forEach(function(data_country_id){
    if (map_country.id == data_country_id){
    classes += " mcc";
  }});
  return classes; })
.attr("d", pathGenerator);

// créer geojsonMcc et le trier dans l'ordre des id
var geojsonMcc = geojsonWorld
.filter(function(country){
	var isMcc = false;
  	var data_country_ids = _(data['2012']['countries']).keys();
	data_country_ids.forEach(function(data_country_id){
	  if (country.id == data_country_ids) {
	    isMcc = true;
	    };
	})
	return isMcc;
})
.sort(function(a, b){
	return a.id - b.id ;
});

function init(){
	console.log('init');

	svg.selectAll(".symbol")
	.data(_(data['2012']['countries']))
	.enter().append("svg:circle")
	.attr("class", "symbol")
	.attr("cx", function(d, i) { 
		console.log('cx');
	  return Math.round(pathGenerator.centroid(geojsonMcc[i])[0]);
	  })
	.attr("cy", function(d, i) { 
	  return Math.round(pathGenerator.centroid(geojsonMcc[i])[1]);
	  })
	.attr('r', 10)
	.on("mouseover", hover)
	.on("mouseout", function(){
	  $('.pays_popup').remove();
	});

}

function hover(d){   //le datum est passé en d
  var $tooltip = $("<div class='pays_popup'></div>");
  var x = parseInt($(this).attr("cx")) + 15;
  var y = parseInt($(this).attr("cy")) -15;
  $tooltip.html("<b>" + d.pays + "</b><br />" + d[currentYear] + " enfants");

  $('#wrapper').append($tooltip);
  $tooltip.css("left", x+"px");
  $tooltip.css("top", y+"px");
}

function update(year){
	svg.selectAll(".symbol").transition()
	.duration(400)
	.attr("r", function(d) { return rScale(d[year]);});
}


init();



