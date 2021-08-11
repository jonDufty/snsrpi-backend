var express = require('express');
var apiRouter = express.Router();

const devices = require('../resources/device_list');
const ex_config = require('../resources/config_example');

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
    console.log(Date.now());
    res.status(200).send(body=sensors);
});


// Get Sensor Config
apiRouter.get('/devices/:deviceID/sensors/:sensorID', (req,res) => {
    // console.log(new Date.now());
    console.log(req.params);
    console.log(req.headers);
    res.status(200).send(ex_config);
});


// Update Sensor Config
apiRouter.post('/devices/:deviceID/sensors/:sensorID', (req, res) => {
    var body = req.body;
    res.status(200).send(body=body);
})


// Run device


// 

module.exports = apiRouter;
