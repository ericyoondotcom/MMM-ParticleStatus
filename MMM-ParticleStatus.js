Module.register("MMM-ParticleStatus",{
	defaults: {
        particleUsername: "default-username",
        particlePassword: "default-password",
        events: [],
        debug: false
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
    deviceHashMap: {},
    getDom: function() {
      
      var elem = document.createElement("div");
      elem.classList.add("particle--list");

      for(var k = 0; k < this.config.events.length; ++k) {
        var deviceId = this.config.events[k].deviceId;
        var name = this.config.events[k].name;

        if(this.deviceHashMap[[deviceId, name]]) {
          var data = this.deviceHashMap[[deviceId, name]];
          if(this.config.debug){
            Log.log('Data from Device Hash Map:', data);
          }
          var particleItem = document.createElement("div");
          particleItem.classList.add("particle--item");
          var icon = document.createElement("i");
          icon.classList.add("particle--icon");
          icon.classList.add("fas");
          icon.classList.add("fa-" + this.config.events[k].icon);
          if(this.config.events[k].states) {
            
            var low = this.config.events[k].states[0];
            var high = this.config.events[k].states[1];
            if(isNaN(low)) {
              if(data == low){
                icon.classList.add("red");
              }
              else if (data == high){
                icon.classList.add("green");
              }
            }
            else {
              if(data < low) {
                  icon.classList.add("red");
                }
                else if(data > low && data < high) {
                  icon.classList.add("green");
                }
                else if (data > high) {
                  icon.classList.add("red");
                }
            }
          }

          if(this.config.events[k].nickname) {
            var particleNickname = document.createElement("p");
            particleNickname.classList.add("particle--nickname");
            particleNickname.innerHTML = this.config.events[k].nickname;
            icon.appendChild(particleNickname);
          }

          if(this.config.events[k].show_data) {
            var particleData = document.createElement("p");
            particleData.classList.add("particle--data");
            particleData.innerHTML = data;
            icon.appendChild(particleData);
          }
          
          particleItem.appendChild(icon);
          elem.appendChild(particleItem);
        }
      }

      return elem;
    },
    
    start: function() {
      var thisModule = this;
      if(thisModule.config.clientId) {
        if(thisModule.config.clientSecret){
          var particle = new Particle( {clientId: thisModule.config.clientId, clientSecret: thisModule.config.clientSecret});
        }
        else{
          if(thisModule.config.debug){
            Log.log('clientID but no clientSecret');
          }
        }
      }
      else{
        if(thisModule.config.debug){
          Log.log('Not using clientId and clientSecret, assuming Particle events are published as PUBLIC events');
        }
        var particle = new Particle( {});
      }
      particle.login({username: thisModule.config.particleUsername, password: thisModule.config.particlePassword}).then(
        function(data) {
          var token = data.body.access_token;
          for(var j = 0; j < thisModule.config.events.length; ++j) {
            var event = thisModule.config.events[j];

            particle.getEventStream({ deviceId: event.deviceId, name: event.name, auth: token }).then(function(stream) {
              stream.on('event', function(data) {
                if(thisModule.config.debug){
                  Log.log('Data in the stream:',data);
                }
		            thisModule.deviceHashMap[[data.coreid, data.name]] = data.data;
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