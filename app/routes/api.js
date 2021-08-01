var express = require('express');
var apiRouter = express.Router();

/* GET home page. */
apiRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// List Devices
apiRouter.get('/devices', (req,res) => (
    res.send('This is a list of devices')
));


// List Sensors
apiRouter.get('/devices/:deviceID/sensors', (req,res) => {
    deviceID = req.params.deviceID;
    res.send(`This is a list of sensors for device ${deviceID}`);
});


// Get Sensor Config
apiRouter.get('/devices/:deviceID/sensors/:sensorID', (req,res) => (
    res.send(`This is a config for of sensor ${req.params.sensorID}`)
));


// Update Sensor Config


// Run device


// 

module.exports = apiRouter;
