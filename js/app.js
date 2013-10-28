var App = new Marionette.Application();

App.addRegions({
    "controls": "#controls",
    "map": "#map",
    "info": "#info"
});



App.module('Controls', function(Controls, App, Backbone, Marionette, $, _){

	var ControlsView = Marionette.ItemView.extend({
		template: '#template-controls',
		
		ui: {

		},
		year: '1996',
		play: true,


		events: {
			'click .year_select li': 'clickYear',
			'click .play': 'play',
			'click .pause': 'pause',

			'click .type_select .monde': 'showMonde',
			'click .type_select .france': 'showFrance',

			'click .more_symbols .missions': 'toggleMissions',
			'click .more_symbols .formations': 'toggleFormations',
		},

		clickYear: function(event){
			App.controls.year = $(event.currentTarget).html();
			App.vent.trigger('year:change');
		},

		play: function(event){
			console.log('play');
		},

		pause: function(event){
			console.log('pause');
		},

		showMonde: function(event){
			console.log('show Monde');
		},

		showFrance: function(event){
			console.log('show France');
		},

		toggleMissions: function(event){
			var missionsState = event.currentTarget.checked;
			console.log('display Missions: ' + missionsState);
		},

		toggleFormations: function(event){
			var formationsState = event.currentTarget.checked;
			console.log('display Missions: ' + formationsState);
		},
	});



    var Controller = Marionette.Controller.extend({

        initialize: function(options){
            this.region = options.region;
        },

        show: function(){
            var controlsView = new ControlsView({});
            this.region.show(controlsView);
        }
    });

    Controls.addInitializer(function(){
    	Controls.year = '1996';
	    Controls.controller = new Controller({
	        region: App.controls
	    });
	    Controls.controller.show();
	});
});

// App.module('Map', function(Map, App, Backbone, Marionette, $, _){

// 	var MapView = Marionette.ItemView.extend({
// 		template: '#map-template',
		
// 		ui: {

// 		},

// 		events: {
// 			'click' : 'testClick'

// 		},

// 		testClick: function(event){
// 			console.log('testClick');
// 		}


// 	});

//     var Controller = Marionette.Controller.extend({

//         initialize: function(options){
//             this.region = options.region
//         },

//         show: function(){
//             var mapView = new MapView({});
//             this.region.show(mapView);
//         }

//     });

//     Map.addInitializer(function(){
// 	    Map.controller = new Controller({
// 	        region: App.map
// 	    });
// 	    Map.controller.show();
// 	});
// });

// App.module('CountryInfo', function(Map, App, Backbone, Marionette, $, _){

// 	var CountryInfoView = Marionette.ItemView.extend({
// 		template: '#info-template',
		
// 		ui: {

// 		},

// 		events: {
// 			'click' : 'testClick'

// 		},

// 		testClick: function(event){
// 			console.log('testClick');
// 		}


// 	});

//     var Controller = Marionette.Controller.extend({

//         initialize: function(options){
//             this.region = options.region
//         },

//         show: function(){
//             var countryInfoView = new CountryInfoView({});
//             this.region.show(countryInfoView);
//         }

//     });

//     Map.addInitializer(function(){
// 	    Map.controller = new Controller({
// 	        region: App.info
// 	    });
// 	    Map.controller.show();
// 	});
// });


App.module('Main', function(Main, App, Backbone, Marionette, $, _){

	Main.Controller = function(){
		// load data
		this.data = [];
		this.currentYear = 1996;
	};

	_.extend(Main.Controller.prototype, {
		//start the app by showing the appropriate views
		start: function(){
			// this.showControls();
			// this.showMap(data);
		},

		// showControls: function(){
		// 	var controlsView = new ControlsView();
		// 	App.controls.show(controlsView);
		// },

		// showMap: function(data){
		// 	var mapView = new mapView();
		// 	App.controls.show(mapView);
		// },

		// showCountryInfo: function(country){
		// 	App.main.show(new TodoList.Views.ListView({
		// 		model: country
		// 	}))
		// },

	});

	// TodoList initializer
	// get the todolist up and running by initializing the mediator
	// when the app is started, pulling in existing todos and displaying them

	Main.addInitializer(function(){
		this.controller = new Main.Controller();
		this.controller.start();
	})

});


