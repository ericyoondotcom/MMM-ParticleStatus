# MMM-ParticleStatus
[MagicMirror](https://github.com/MichMich/MagicMirror) module that shows you the status of your [Particle](https://particle.io) devices.

_**Note:** This project is not affiliated or endorsed by Particle Industries, Inc._

## Installation and Setup
### Set up Particle Side
This module listens for events. For each indicator you want to have on your Magic Mirror, make up a unique name for the event, such as "LightStateChange", "Garage", or "Car". Do not create separate events for the states (such as "LightOn" and "LightOff"); just an umbrella event.

Each time you want to update the state of the indicator on the Magic Mirror, publish to that event by using `Particle.publish("Event Name", "New State")` in the Particle firmware, such as the example shown below:
```
if(<Light switch just turned on>){
    Particle.publish("Light", "On");
}
if(<Light switch just turned off>){
    Particle.publish("Light", "Off");
}
```
It is important to not publish state every  `loop()` tick, just when the state has changed.

You can have multiple events per device and use multiple devices.

Flash the new code to your device(s).

You can read the official Particle docs on `Particle.publish` [here](https://docs.particle.io/reference/firmware/photon/#particle-publish-).

### Install the Module
Run the following commands in your shell (or if using Windows, the equivalent):
1. `cd ~/MagicMirror/modules` (replace the path with wherever your MagicMirror modules folder is)
2. `git clone https://github.com/yummypasta/MMM-ParticleStatus.git`

### Change Config
Add the following code to your config file. Edit the `config` value as specified in the next section.
```
{
    module: "MMM-ParticleStatus",
    position: <Position of module>,
    header: "My Particle Devices", //Change this as you see fit, or leave blank for a minimal look
    config: {
        //Edit this config as described in the next section.
    }
}
```

## Config Options
The `config` value in your config file needs to be changed.

Key | Value(s) | Default Value
--- | --- | --- 
particleUsername | Your Particle account username. | _required_
particlePassword | Your particle account password. | _required_
clientId | Device network client Id. | _required_
clientSecret | Device network client secret. | _required_
events | An array of events (format is described below). | Empty array, resulting in nothing being shown

### Event Objects
The `events` field in the config takes a special JS Object, as described below.

Key | Value(s) | Default Value
--- | --- | --- 
deviceId | The id of the device that publishes the event. | _required_
name | The name of the event to listen for (the **first** parameter of the `Particle.publish` function) | _required_
nickname | Any name that you would like to refer to the device | _required_
icon | A [Font Awesome](https://fontawesome.io) icon to represent the event. _Only icons in the "solid" category are available. Brands are not available._ | _required_
states | A JS Object, mapping possible states of the event to how the icon should be displayed (`off`, `on`, or `blink`). Example: `{ "Opening": "blink", "Closing": "blink", "Open": "on", "Closed": "off" }`. If the state is not defined in this object, the state of the icon will not change. | _required_
