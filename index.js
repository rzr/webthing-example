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
var webthing = require('webthing-iotjs');


function AngleProperty(thing, name, value, metadata, config) {
  var self = this;
  webthing.Property.call(this, thing,
                         name || "Angle",
                         new webthing.Value(Number(value)), {
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
}

function AngleThing(name, type, description) {
  var self = this;
  webthing.Thing.call(this,
                      name || 'Angle',
                      type || [],
                      description || 'A web connected Angle');
  {
    this.addProperty(new AngleProperty(this, 'angle', 0, {
      description: 'Angle'
    }, {
      minimum: -90,
      maximum: +90,
    }));
  }
}


function App() {
  var port = process.argv[3] ? Number(process.argv[3]) : 8888;
  var url = "http://localhost:".concat(port);
  var server = new webthing.WebThingServer
  (new webthing.SingleThing(new AngleThing), port);
  process.on('SIGINT', function () {
    server.stop();
  });
  console.log(url);
  server.start();
}

if (module.parent === null) {
  App()
}
