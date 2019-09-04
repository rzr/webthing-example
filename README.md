# WEBTHING-EXAMPLE #

[![GitHub forks](
https://img.shields.io/github/forks/rzr/webthing-example.svg?style=social&label=Fork&maxAge=2592000
)](
https://GitHub.com/rzr/webthing-example/network/
)
[![license](
https://img.shields.io/badge/license-MPL--2.0-blue.svg
)](LICENSE)
[![IRC Channel](
https://img.shields.io/badge/chat-on%20freenode-brightgreen.svg
)](
https://kiwiirc.com/client/irc.freenode.net/#tizen
)

## ABOUT ##

IoT.js is supporting MQTT protocol, so it's straightforward to build a bridge:

[![mqtt](
http://image.slidesharecdn.com/mozilla-things-fosdem-2019-190207162845/95/mozillathingsfosdem2019-22-638.jpg
)](
https://www.slideshare.net/rzrfreefr/mozillathingsfosdem2019/22# 
"MQTT")

## USAGE ##

```sh
iotjs index.js  "${httpd_port}" "${mqtt_host}" "${mqtt_port}" "${mqtt_topic}"  ["${mqtt_key}"]
```

Example using "Anavi Gaz Detector" and "Mozilla Webthing gateway":

```sh
mosquitto_sub -h ${host} -t "#" -v 
homeassistant/binary_sensor/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/DangerousGas/config {"device_class":"gas","name":"FFFFF Dangerous Gas","unique_id":"anavi-FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF-DangerousGas","state_topic":"workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/DangerousGas","device":{"identifiers":"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","manufacturer":"ANAVI Technology","model":"ANAVI Gas Detector","name":"FFFFF","sw_version":"e491cbccda9e73ef23d235532606a251","connections":[["mac","ff:ff:ff:ff:ff:ff:ff"]]}}
homeassistant/sensor/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/AirConductivity/config {"unit_of_measurement":"%","value_template":"{{ value_json.Conductivity | round(2) }}","name":"6998b Air Conductivity","unique_id":"anavi-FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF-AirConductivity","state_topic":"workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/AirConductivity","device":{"identifiers":"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","manufacturer":"ANAVI Technology","model":"ANAVI Gas Detector","name":"6998b","sw_version":"e491cbccda9e73ef23d235532606a251","connections":[["mac","ff:ff:ff:ff:ff:ff:ff"]]}}
workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/wifi/ssid {"ssid":"Private"}
workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/wifi/bssid {"bssid":"ff:ff:ff:ff:ff:42"}
workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/wifi/rssi {"rssi":-44}
workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/wifi/ip {"ip":"192.100.0.42"}
workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/sketch {"sketch":"e491cbccda9e73ef23d235532606a251"}
workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/AirQuality {"Quality":"Good"}
workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/DangerousGas OFF
workgroup/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF/AirConductivity {"Conductivity":9}


iotjs index.js  "8888" "gateway.local" "1883" "workgroup/${machineid}/AirConductivity"  Conductivity &

curl http://localhost:8888/properties
#| {"Conductivity":13}
```

## RESOURCES ##

*   <https://archive.fosdem.org/2019/schedule/event/project_things/>
*   <https://discourse.mozilla.org/t/mqtt-to-virtual-thing-adapter/36786/3>
