// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0

/**
 *
 * Copyright 2018-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/
 */
var console = require('console'); // Disable logs here by editing to '!console.log'
var log = console.log || function () {};
var verbose = console.log || function () {};

var webthing;

try {
  webthing = require('../webthing');
} catch (err) {
  webthing = require('webthing-iotjs');
}

var Property = webthing.Property;
var Value = webthing.Value;

var Thing = webthing.Thing;
var WebThingServer = webthing.WebThingServer;
var SingleThing = webthing.SingleThing; // Update with different board here if needed

function AnglePropery(thing, name, value, metadata, config) {
  var self = this;
  Property.call(this, thing, name || "Angle", new Value(Number(value)), {
    title: metadata && metadata.title || "Level: ".concat(name),
    type: 'number',
    minimum: config.minimum || -180,
    maximum: config.maximum || +180,
    description: metadata && metadata.description || "Angle"
  });
  {
    this.config = config;
    self.value.valueForwarder = function (value) {
      verbose('forward: ' + value);
    };
  }

  this.close = function () {
    vebose('close');
  };

  return this;
}


function PwmThing(name, type, description) {
  var self = this;
  Thing.call(this, name || 'PWM', type || [], description || 'A web connected PWM');
  {

    var offset = .4;
    var period = 20;
    this.pinProperties = [
      new AnglePropery(this, 'angle', 0, {
        description: 'Angle'
      }, {
        minimum: -90,
        maximum: +90,
      })
    ];

    this.pinProperties.forEach(function (property) {
      self.addProperty(property);
    });


    this.close = function () {
      self.pinProperties.forEach(function (property) {
        property.close && property.close();
      });
    };
  }
}

var BoardThing = PwmThing;

function App() {
  var port = process.argv[3] ? Number(process.argv[3]) : 8888;
  var url = "http://localhost:".concat(port);
  var thing = new BoardThing();
  var server = new WebThingServer(new SingleThing(thing), port);
  process.on('SIGINT', function () {
    server.stop();

    var cleanup = function () {
      thing && thing.close();
      process.exit();
    };

    cleanup();
  });
  console.log(url);
  server.start();
}

if (module.parent === null) {
  App()
}
