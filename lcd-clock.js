var moment = require("moment");
var five = require("johnny-five");
var Tessel = require("tessel-io");
var board = new five.Board({
  io: new Tessel()
});
const TEMPERATURE = 0;
const HUMIDITY = 1;
const PRESSURE = 2;
const TIME = 3;
const NUM_OPTIONS = 4;
const SECONDS_DELAY = 5;

function updateDisplay(monitor, lcd, i)
{
    switch (i) {
        case TEMPERATURE: 
            lcd.cursor(0, 0).print("Temperature:   ");
            lcd.useChar("sbox");
            lcd.cursor(1, 0).print(monitor.thermometer.fahrenheit.toFixed(0) +":sbox:F     ");
            break;
        case HUMIDITY: 
            lcd.cursor(0, 0).print("Humidity:      ");
            lcd.cursor(1, 0).print(monitor.hygrometer.relativeHumidity.toFixed(2) + "%     ");
            break;
        case PRESSURE: 
            lcd.cursor(0, 0).print("Pressure:      ");
            lcd.cursor(1, 0).print(monitor.barometer.pressure.toFixed(2) + " kPa  ");
            break;
        case TIME:
            lcd.cursor(0, 0).print(moment().format("MMM Do, YYYY"));
            lcd.cursor(1, 0).print(moment().utcOffset("-0500").format("hh:mm A "));
            break;
    }  
}


board.on("ready", function() {
  var lcd = new five.LCD({
    //      RS    EN    D4    D5    D6    D7
    pins: ["a2", "a3", "a4", "a5", "a6", "a7"],
  });
  var monitor = new five.Multi({
    controller: "BME280"
  });
  var snapshots = [ "", ""];
  var i = TIME;
  board.loop(SECONDS_DELAY*1000, () => {  
    i+=1;
    i%=NUM_OPTIONS;
    updateDisplay(monitor, lcd, i);
  });
});
