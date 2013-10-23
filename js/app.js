var app = new Marionette.Application();

app.addRegions({
    "controls": "#controls",
    "map": "#map",
    "info": "#info"
});

app.controls.show(new ControlsView());
// app.controls.show(new ControlsView());

// App.module("SampleModule", function(Mod, App, Backbone, Marionette, $, _){

//     // Define a view to show
//     // ---------------------

//     var MainView = Marionette.ItemView.extend({
//         template: "#sample-template"
//     });

//     // Define a controller to run this module
//     // --------------------------------------

//     var Controller = Marionette.Controller.extend({

//         initialize: function(options){
//             this.region = options.region
//         },

//         show: function(){
//             var model = new Backbone.Model({
//                 contentPlacement: "here"
//             });

//             var view = new MainView({
//                 model: model
//             });

//             this.region.show(view);
//         }

//     });


//     // Initialize this module when the app starts
//     // ------------------------------------------

//     Mod.addInitializer(function(){
//         Mod.controller = new Controller({
//             region: App.mainRegion
//         });
//         Mod.controller.show();
//     });
// });

// // Start the app
// // -------------

App.start();