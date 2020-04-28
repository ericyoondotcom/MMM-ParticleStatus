Module.register("MMM-ParticleStatus",{
	defaults: {
        particleUsername: "default-username",
        particlePassword: "default-password",
        clientId: "default-clientId",
				clientSecret: "default-clientSecret",
        events: []
    },
    
    getStyles: function() {
        return [
            "https://use.fontawesome.com/releases/v5.1.0/css/all.css"
        ];
    },
    getScripts: function() {
        return [
         " https://cdn.jsdelivr.net/npm/particle-api-js@8/dist/particle.min.js"
	];
    },
    state: [],

    getDom: function() {
      var elem = document.createElement("div");
      for(var i = 0; i < this.state.length; ++i) {
        var icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add("fa-" + this.config.events[i].icon);
        icon.innerHTML = " " + this.config.events[i].nickname +": "+ this.state[i] + " ";
        if(this.state[i]) {
          elem.appendChild(icon);
        }
      }
      return elem;
    },
    
    start: function() {
      var thisModule = this;
      var particle = new Particle({clientId: thisModule.config.clientId, clientSecret: thisModule.config.clientSecret});
      particle.login({username: thisModule.config.particleUsername, password: thisModule.config.particlePassword}).then(
        function(data) {
          var token = data.body.access_token;
          for(var j = 0; j < thisModule.config.events.length; ++j){
            var event = thisModule.config.events[j];

            particle.getEventStream({ deviceId: event.deviceId, name: event.name, auth: token }).then(function(stream) {
              stream.on('event', function(data) {
                thisModule.state[thisModule.config.events.length-j] =  data.data;
                thisModule.updateDom();
              });
            });
          }
          thisModule.updateDom();
        },
        function (err) {
          Log.log('Could not log in.', err);
        }
      );       
    }
});
