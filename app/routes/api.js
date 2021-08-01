var express = require('express');
var apiRouter = express.Router();

const devices = [
    "rpi-123",
    "rpi-456"
];

const sensors = [1901, 2601];

/* GET home page. */
apiRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// List Devices
apiRouter.get('/devices', (req,res) => {
    var devList = devices;
    res.status(200).send(body=devList);
});


// List Sensors
apiRouter.get('/devices/:deviceID/sensors', (req,res) => {
    deviceID = req.params.deviceID;
    res.status(200).send(body=sensors);
});


// Get Sensor Config
apiRouter.get('/devices/:deviceID/sensors/:sensorID', (req,res) => (
    res.status(200).send(`This is a config for of sensor ${req.params.sensorID}`)
));


// Update Sensor Config
apiRouter.post('/devices/:deviceID/sensors/:sensorID', (req, res) => {
    var body = req.body;
    res.status(200).send(body=body);
})


// Run device


// 

module.exports = apiRouter;
