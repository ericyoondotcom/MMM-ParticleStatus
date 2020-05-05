# MMM-ParticleStatus
[MagicMirror](https://github.com/MichMich/MagicMirror) module that shows you the status of your [Particle](https://particle.io) devices.

<img src="https://i.imgur.com/YmFRuTm.png" width="375">

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
another example:
```
float voltage = analogRead(BATT) * 0.0011224;
Particle.publish("device_battery_voltage", String(voltage));
```

It is important to not publish state every  `loop()` tick, just when the state has changed.

You can have multiple events per device and use multiple devices.

You can read the official Particle docs on `Particle.publish` [here](https://docs.particle.io/reference/firmware/photon/#particle-publish-).

### Install the Module
Run the following commands in your shell (or if using Windows, the equivalent):
1. `cd ~/MagicMirror/modules` (replace the path with wherever your MagicMirror modules folder is)
2. `git clone https://github.com/NickEngmann/MMM-ParticleStatus.git`

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
events | An array of events (format is described below). | Empty array, resulting in nothing being shown

### Event Objects
The `events` field in the config takes a special JS Object, as described below.

Key | Value(s) | Default Value
--- | --- | --- 
deviceId | The id of the device that publishes the event. | _required_
name | The name of the event to listen for (the **first** parameter of the `Particle.publish` function) | _required_
nickname | Any name that you would like to refer to the device | _required_
icon | A [Font Awesome](https://fontawesome.io) icon to represent the event. _Only icons in the "solid" category are available. Brands are not available._ | _required_
states | A two variable array, that will reflect the color of the icon depending on the state of the data. _Example_: Event name returns two different states (`off`, or `on`) and `states: ["off", "on" ]`. When the event returns `"off"`, the color of the icon will be red, and green for `"on"`. The functionality differs if your event name returns _integers/floats_. With numbers, it utilzies the range between two numbers to show item state. Example: Event name returns battery voltage and `states:[3.0, 5.5]`. If the event returns `2.7` for the battery voltage, the icon will be red, but if the event returns `3.8` then the icon will be green. | _not required_
show_data | Whether to show the data returned by the event `name` | _false by default_

---

### Examples
 
#### Event Example 1
```
events:
    {
        deviceId: "a------------8",
        name: "moisture_level_percentage",
        icon: "leaf",
        nickname: "lettuce",
        states: [16, 30]
    },
```

If the data returned by the `moisture_level_percentage` event is within 16-30, it will display a green leaf icon, otherwise it displays a red leaf icon. 

<img src="https://i.imgur.com/HVyhBWe.png" height="82" width="82">

#### Event Example 2
```
events:
    {
        deviceId: "a------------8",
        name: "device_battery_voltage",
        icon: "battery-half",
        nickname: "tomatoes",
        states: [2.9, 4.5],
        show_data: true
    }
```

If the data returned by the `device_battery_voltage` event is within 2.9-4.5, it will display a green battery-half icon, otherwise it display a red battery-half icon. It will also show the data returned by the event underneath.

<img src="https://i.imgur.com/3adrMuU.png" height="82" width="82">

#### Event Example 3
```
events:
    {
        deviceId: "b------------8",
        name: "device_sensor_online",
        icon: "leaf",
        nickname: "rosemary",
        states: ["off", "on"]
    },
```

If the data returned by the `device_sensor_online` event is within "off", then it will return back a red leaf icon, but if the data returned by the event is "on" then it displays a green leaf icon.

#### Configuration Example
```		
{   
    module: "MMM-ParticleStatus",
    position: "top_bar",
    header: "Particle Devices", //Change this as you see fit, or leave blank for a minimal look
    config: {
        particleUsername: "default@gmail.com",
        particlePassword: "defaultpassword",
        events:
            [
                {
                    deviceId: "e------------f",
                    name: "moisture_level_percentage",
                    nickname: "lettuce",
                    icon: "leaf",
                    states: [16, 30]
                },
                {
                    deviceId: "e------------d",
                    name: "moisture_level_percentage",
                    icon: "leaf",
                    nickname: "lavender",
                    states: [16, 30]
                },
                {
                    deviceId: "e------------d",
                    name: "device_battery_voltage",
                    icon: "battery-half",
                    nickname: "lavender",
                    states: [2.9, 4.5],
                    show_data: true
                },
}
``` 