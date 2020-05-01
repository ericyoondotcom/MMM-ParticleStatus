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
          "https://use.fontawesome.com/releases/v5.1.0/css/all.css",
          "MMM-ParticleStatus.css"
        ];
    },
    getScripts: function() {
        return [
          "https://cdn.jsdelivr.net/npm/particle-api-js@8/dist/particle.min.js"
	      ];
    },
    state: [],

    getDom: function() {
      
      var elem = document.createElement("div");
      elem.classList.add("particle--list");
      for(var i = 0; i < this.state.length; ++i) {
        var particleItem = document.createElement("div");
        particleItem.classList.add("particle--item");
        var icon = document.createElement("i");
        icon.classList.add("particle--icon");
        icon.classList.add("fas");
        icon.classList.add("fa-" + this.config.events[i].icon);
        console.log("nickname:",this.config.events[i].nickname);
        console.log("state item: ",this.state[i]);
        icon.innerHTML = "<p class='particle--nickname'> " + this.config.events[i].nickname +": "+ this.state[i] + " </p>";
        if(this.state[i]) {
          particleItem.appendChild(icon);
          elem.appendChild(particleItem);
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
          for(var j = 0; j < thisModule.config.events.length; ++j) {
            var event = thisModule.config.events[j];

            particle.getEventStream({ deviceId: event.deviceId, name: event.name, auth: token }).then(function(stream) {
              stream.on('event', function(data) {
                console.log("data: ", data);
                console.log("j: ", j);
                thisModule.state.push(data.data);
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
