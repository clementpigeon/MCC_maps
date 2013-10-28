App.module('Maps', function(Maps, App, Backbone, Marionette, $, _){

	var FranceMapView = Marionette.ItemView.extend({
		initialize: function(){

			var width = 700,
			    height = 500;

			// définir la projection et le path generator pour la carte
			this.projection = d3.geo.kavrayskiy7()
			.scale(2400)
			.center([+46.995241,+2.449951])
			.translate([width / 2 +1550, height / 2 +1830]);

			this.pathGenerator = d3.geo.path().projection(this.projection);

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
			.attr("d", this.pathGenerator);
			console.log('init');

			this.listenTo(App.vent, 'year:change', this.render)
		},

		render: function(){
			var year = App.controls.currentView.year;
			console.log(year);
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

		},
		
		ui: {

		},

		events: {
			// 'click' : 'testClick'

		},

		testClick: function(event){
			console.log('testClick');
		}


	});

    var Controller = Marionette.Controller.extend({

        initialize: function(options){
            this.region = options.region
        },

        show: function(){
            var franceMapView = new FranceMapView();
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