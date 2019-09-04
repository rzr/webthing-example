// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0

/**
 *
 * Copyright 2018-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */
var webthing;

try {
  webthing = require('../webthing');
} catch (err) {
  webthing = require('webthing-iotjs');
}

var Property = webthing.Property;
var SingleThing = webthing.SingleThing;
var Thing = webthing.Thing;
var Value = webthing.Value;
var WebThingServer = webthing.WebThingServer;

function makeThing() {
  var thing = new Thing('urn:dev:ops:my-level-actuator-1234', 
    'LevelActuatorExample',
    ['Level'],
    'An actuator example that just log');
  thing.addProperty(new Property(thing, 'level', new Value(0, function (update) {
    return console.log("change: ".concat(update));
  }), {
    '@type': 'LevelProperty',
    title: 'Level',
    type: 'Number',
    description: 'Whether the output is changed'
  }));
  return thing;
}

function runServer() {
  var port = process.argv[2] ? Number(process.argv[2]) : 8888;
  var hostname = process.argv[3] ? String(process.argv[3]) : null;
  var sslOptions = process.argv[4] ? String(process.argv[4]) : null;
  var url = "".concat(sslOptions ? 'https' : 'http', "://localhost:").concat(port, "/properties/level");
  console.log("Usage:\n\n".concat(process.argv[0], " ").concat(process.argv[1], " [port]\n\nTry:\ncurl -X PUT -H 'Content-Type: application/json' --data '{\"level\": 100 }' ").concat(url, "\n"));
  var thing = makeThing();
  var server = new WebThingServer(new SingleThing(thing), port, hostname, sslOptions);
  process.on('SIGINT', function () {
    server.stop();
    process.exit();
  });
  server.start();
}

runServer();
