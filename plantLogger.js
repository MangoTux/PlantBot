var moment = require("moment");
var five = require("johnny-five");
var Tessel = require("tessel-io");
var request = require("request");
//var querystring = require("querystring");
//var http = require("http");

var board = new five.Board({
  io: new Tessel()
});

const SECONDS_DELAY = 15; //c1800; // Update once every half hour

function postToServer(monitor, soil)
{
    /*
    * UNITS
    * Temp: Kelvin
    * Humidity: %
    * Pressure: kPa
    */
    request.post('http://eudyptes.org/plant/log.php', {form:{
        pass: 'ManuNui',
        temp:  monitor.thermometer.kelvin.toFixed(0),
        humidity: monitor.hygrometer.relativeHumidity.toFixed(2),
        pressure: monitor.barometer.pressure.toFixed(2),
        soil: soil.value.toFixed(2)
    }}, function(error, response, body) {
        console.log(body);
    });
                 ;
    /*var post_data = querystring.stringify({
        'pass' : 'ManuNui',
        'temp' :  monitor.thermometer.kelvin.toFixed(0),
        'humidity' : monitor.hygrometer.relativeHumidity.toFixed(2),
        'pressure' : monitor.barometer.pressure.toFixed(2)
    });
    
    var post_options = {
        host: 'www.eudyptes.org',
        port: '80',
        path: '/plant/log.php',
        method: 'POST'
    };
    
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('Response: ' + chunk);
        });
    });
    
    post_req.write(post_data);
    post_req.end();
    */
}

board.on("ready", function() {
    var monitor = new five.Multi({
        controller: "BME280"
    });
    var soil = new five.Sensor("a7");
    
    board.loop(SECONDS_DELAY*1000, () => {  
        postToServer(monitor, soil);
    });
});
