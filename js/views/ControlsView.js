var ControlsView = Backbone.Marionette.ItemView.extend({
  template : "#controls",
  
  // ui : {
  //   play : 'li.play'
  // },
  
  events : {
    'click li.play': 'play'
  },

  play : function(evt) {
  	console.log('play');
  }
});