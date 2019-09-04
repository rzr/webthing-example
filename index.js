// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0
/**
 *
 * Copyright 2018-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/#
 */

var console = require('console');
var webthing = require('webthing-iotjs');
var Property = webthing.Property;
var SingleThing = webthing.SingleThing;
var Thing = webthing.Thing;
var Value = webthing.Value;
var WebThingServer = webthing.WebThingServer;
var mqtt = require('mqtt');

// Disable logs here by editing to '!console.log'
var verbose = !console.log || function () {};

function basename(path)
{
  var result = String(path)
  var pos = result.lastIndexOf('/');
  if (pos) {
    result = result.substring(pos + 1);
  }
  return result;
}

function MqttNumberProperty(thing, name, metadata, config) {
  var self = this;
  self.config = config;
  Property.call(
    this,
    thing,
    name,
    new Value(0),
    metadata
  );
  verbose('log: connecting: ' + this.config.mqtt.connect.host);
  this.client = new mqtt.connect(this.config.mqtt.connect, function() {
    verbose('log: connected, listening on port='
            + self.config.mqtt.connect.port);
    self.client.subscribe(self.config.mqtt.topic,
                          self.config.mqtt.subscribe,
                          function(error) {
                            verbose('log: subscribed: '
                                    + self.config.mqtt.topic
                                    + ' error:' + error );
                            if (error) {
                              console.error('error: subscribe failed');
                              throw error;
                            }
                          });
    self.client.on('message', function(data) {
      verbose('log: message: ' + String(data && data.topic));
      verbose(data.message.toString());
      var object = JSON.parse(data.message.toString());
      var updatedValue = object[self.getName()];
      verbose(updatedValue);
      if (updatedValue !== self.lastValue) {
        verbose('log: ' + self.getName() + ': change: ' + updatedValue);
        self.value.notifyOfExternalUpdate(updatedValue);
        self.lastValue = updatedValue;
      }
    });
  });
}

function start() {
  var self = this;

  self.config = {
    port: 8888,
    mqtt: {
      connect: {
        host: 'localhost',
        port: 1883
      },
      subscribe: {
        qos: 2,
        retain: false
      },
      topic: '#',
    },
    property: {
      name: "level",
      metadata: {
        description: "Level",
        type: 'number',
        readOnly: true,
        '@type': 'LevelProperty'
      }
    }
  };

  if (typeof(process.argv[2]) != 'undefined') {
    this.config.port = Number(process.argv[2]);
  }

  if (typeof(process.argv[3]) != 'undefined') {
    this.config.mqtt.connect.host = String(process.argv[3]);
  }

  if (typeof(process.argv[4]) != 'undefined') {
    this.config.mqtt.connect.port = Number(process.argv[4]);
  }

  if (typeof(process.argv[5]) != 'undefined') {
    this.config.mqtt.topic = String(process.argv[5]);
    this.config.property.name = basename(this.config.mqtt.topic);
  }

  if (typeof(process.argv[6]) != 'undefined') {
    this.config.property.name = String(process.argv[6]);
  }

  this.thing = new Thing('urn:dev:ops:mqtt-level-sensor-1234',
                         'LevelMqttSensor',
                         ['MultiLevelSensor'],
                         'A level sensor');
  this.thing.parent = this;

  this.thing.addProperty(new MqttNumberProperty(this.thing,
                                                this.config.property.name,
                                                this.config.property.metadata,
                                                this.config
                                               ));

  verbose('log: http serving on port=' + config.port);
  this.server = new webthing.WebThingServer(new webthing.SingleThing(thing),
                                            Number(self.config.port));
  process.on('SIGINT', function () {
    self.server.stop();
  });
  this.server.start();
}

start();
