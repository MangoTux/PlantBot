var iss = require("iss");
var five = require("johnny-five");
var Tessel = require("tessel-io");
var board = new five.Board({
  io: new Tessel()
});

board.on("ready", function() {
  var lcd = new five.LCD(["a2", "a3", "a4", "a5", "a6", "a7"]);

  // ISS Code: 25544
  // Max Requests: 20/s
  iss.locationStream(25544, 20).on("data", (buffer) => {
    var data = JSON.parse(buffer.toString());

    lcd.cursor(0, 0).print(data.latitude);
    lcd.cursor(1, 0).print(data.longitude);
  });
});
