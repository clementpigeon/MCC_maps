App.module('Maps', function(Maps, App, Backbone, Marionette, $, _){


	var MapView = Marionette.ItemView.extend({
		initialize: function(){

			var width = 700,
			    height = 500;

			this.zoomFactor = 1;
			this.translateLeft = 0;
			this.translateUp = 0;

			// définir la projection et le path generator pour la carte

			this.projection = d3.geo.kavrayskiy7()
			.scale(200)
			.translate([width / 2-100, height / 2+40]);

			this.pathGenerator = d3.geo.path().projection(this.projection);
			
			// projection zoom
			this.projectionZoom = d3.geo.kavrayskiy7()
			.scale(2400)
			.center([+46.995241,+2.449951])
			.translate([width / 2 +1550, height / 2 +1830]);

			this.pathGeneratorZoom = d3.geo.path().projection(this.projection);

			// décoder le topojson en geojson
			var geojsonWorld = topojson.object(worldTopoJSON, worldTopoJSON.objects.countries).geometries;

			// créer le svg
			this.svg = d3.select("#map").append("svg")
			    .attr("width", width)
			    .attr("height", height);

		    this.g = this.svg.append('g');

		    this.countries = this.g.selectAll(".country") 
		    .data(geojsonWorld)
		    .enter().append("path")
		    .attr("class", function(country) { 
		      var classes = "country " + country.id;
		      if (countries[country.id] ){
		      	classes += " mcc";
		      }
		      return classes; 
		    })
		    .attr("d", this.pathGenerator);

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

			this.listenTo(App.vent, 'year:change', this.updateMap)
		},

		zoomFrance: function(){
			this.zoomFactor = 14;
			this.translateLeft = -3230;
			this.translateUp = -1530;

			var transformation = "translate(" + this.translateLeft + "," + this.translateUp + ")scale(" + this.zoomFactor + ")";

			this.g.transition()
			    .duration(1000)
			    .attr("transform", transformation)
			    .style("stroke-width", 0.1);	
			    // tranform : higher number moves map left, up
		},

		zoomAfrique: function(){
			this.zoomFactor = 2.2;

			this.translateLeft = -280;
			this.translateUp = -330;

			var transformation = "translate(" + this.translateLeft + "," + this.translateUp + ")scale(" + this.zoomFactor + ")";

			this.g.transition()
			    .duration(1000)
			    .attr("transform", transformation)
			    .style("stroke-width", 0.1);	
			
			var year = App.controls.year;
		    
		    var rScale_zoom_Afrique = d3.scale.linear()
		      .domain([0, 1, 50])
		      .rangeRound([0, 5, 20]);

			var new_circle = this.g.selectAll(".symbol")
			.data(data[year]['countries'], function(c){return c['id']})
			.transition(1000)
			.delay(500)
			.attr("r", function(d) { return rScale_zoom_Afrique(d['enfants']) || 0 ;});
		},

		unZoom: function(){
			this.zoomFactor = 1;

			this.g.transition()
			    .duration(1000)
			    .attr("transform", "translate(1)scale(" + this.zoomFactor + ")")
			    .style("stroke-width", 1);	
			    // tranform : higher number moves map left, up
		},

		updateMap: function(){
			this.updateSites();
			this.updatePays();
		},

		updateSites: function(){
			var that = this;
			var year = App.controls.year;
			// échelle pour le rayon des cercles
			var France_rScale = d3.scale.linear()
			  .domain([0, 1, 50])
			  .rangeRound([0, 3, 6]);

			var France_rScale_zoom = d3.scale.linear()
			  .domain([0, 1, 50])
			  .rangeRound([0, 6, 20]);



			var updated = this.g.selectAll(".symbol_france")
			.data(data[year]['sites'], function(c){return c['id']});

			updated.enter().append("svg:circle")
			.attr("class", "symbol_france")
			.attr("cx", function(d) { 
				var coord = that.projection([+sites[d.id].lng, sites[d.id].lat])
			  	return Math.round(coord[0]);
			  })
			.attr("cy", function(d) { 
				var coord = that.projection([+sites[d.id].lng, sites[d.id].lat])
			  	return Math.round(coord[1]);
			  	return center;
			  })
			.on("mouseover", this.hover)
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
			.attr("r", function(d) { return France_rScale(d['enfants']) || 0 ;});
		},

		updatePays: function(){
			// échelle pour le rayon des cercles
			var year = App.controls.year;
			this.pays_rScale = d3.scale.linear()
			  .domain([0, 1, 40])
			  .rangeRound([0, 6, 45]);

			var that = this;
			var updated = this.g.selectAll(".symbol")
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
			.on("mouseover", this.hover)
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
			.attr("r", function(d) { return that.pays_rScale(d['enfants']) || 0 ;});

		},

		hover: function (d){   //le datum est passé en d

		  var $tooltip = $("<div class='pays_popup'></div>");
		  var x = parseInt($(this).attr("cx")) + 15;
		  // x = x+10;
		  var y = parseInt($(this).attr("cy")) - 25;
		  $tooltip.html("<b>" + countries[d.id].name + "</b><br />" + d.enfants + " enfants");

		  $('#map').append($tooltip);
		  $tooltip.css("left", (x * 2.2 - 280)+"px"); // -280,-330 x2.2
		  $tooltip.css("top", (y *2.2 -330)+"px");
		},

	// var FranceMapView = Marionette.ItemView.extend({
	// 	initialize: function(){

	// 		var width = 700,
	// 		    height = 500;

	// 		// définir la projection et le path generator pour la carte
	// 		this.projection = d3.geo.kavrayskiy7()
	// 		.scale(2400)
	// 		.center([+46.995241,+2.449951])
	// 		.translate([width / 2 +1550, height / 2 +1830]);

	// 		this.pathGenerator = d3.geo.path().projection(this.projection);

	// 		// décoder le topojson en geojson
	// 		var geojsonWorld = topojson.object(worldTopoJSON, worldTopoJSON.objects.countries).geometries;

	// 		// créer le svg
	// 		this.svg = d3.select("#map").append("svg")
	// 		    .attr("width", width)
	// 		    .attr("height", height);


	// 		this.svg.selectAll(".country") 
	// 		.data(geojsonWorld)
	// 		.enter().append("path")
	// 		.attr("class", "country")
	// 		.attr("d", this.pathGenerator);
	// 		console.log('init');

	// 		this.listenTo(App.vent, 'year:change', this.render)
	// 	},

	// 	zoom: function(){
	// 		this.svg.transition
	// 		.duration(800)
	// 		.
	// 	},

	// 	render: function(){
	// 		var year = App.controls.year;
	// 		// échelle pour le rayon des cercles
	// 		var rScale = d3.scale.linear()
	// 		  .domain([0, 1, 50])
	// 		  .rangeRound([0, 6, 20]);

	// 		var that = this;

	// 		var updated = this.svg.selectAll(".symbol")
	// 		.data(data[year]['sites'], function(c){return c['id']});

	// 		updated.enter().append("svg:circle")
	// 		.attr("class", "symbol")
	// 		.attr("cx", function(d) { 
	// 			var coord = that.projection([+sites[d.id].lng, sites[d.id].lat])
	// 		  	return Math.round(coord[0]);
	// 		  })
	// 		.attr("cy", function(d) { 
	// 			var coord = that.projection([+sites[d.id].lng, sites[d.id].lat])
	// 		  	return Math.round(coord[1]);
	// 		  	return center;
	// 		  })
	// 		.on("mouseover", hover)
	// 		.on("mouseout", function(){
	// 		  $('.pays_popup').remove();
	// 		})
	// 		.on('click', displayCountryInfo);

	// 		updated.exit().transition()
	// 		.duration(800)
	// 		.attr("r", 0)
	// 		.remove();
			
	// 		updated.transition()
	// 		.duration(1000)
	// 		.attr("r", function(d) { return rScale(d['enfants']) || 0 ;});
	// 	},
		
		ui: {

		},

		events: {


		},



	});

    var Controller = Marionette.Controller.extend({

        initialize: function(options){
            this.region = options.region
        },

        show: function(){
            this.mapView = new MapView();
            //this.region.show(franceMapView);
        }

    });

    Maps.addInitializer(function(){
	    Maps.controller = new Controller({
	        region: App.map
	    });
	    Maps.controller.show();
	});
});