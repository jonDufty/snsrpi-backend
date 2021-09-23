var express = require('express');
var apiRouter = express.Router();

const devices = require('../resources/device_list');
const ex_config = require('../resources/config_example');

var thing_group = "vibration_sydney";

var AWS = require("aws-sdk");
const { IoTDataPlaneClient, ListNamedShadowsForThingCommand,
    GetThingShadowCommand, UpdateThingShadowCommand } = require("@aws-sdk/client-iot-data-plane");
const { IoTClient, ListThingsInThingGroupCommand } = require("@aws-sdk/client-iot");

    
AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    else {
        console.log(`Access key:${AWS.config.credentials.accessKeyId}`)
    }
});
    
    
const iotClient = new IoTClient({
    credentials: AWS.config.credentials,
    region: "ap-southeast-2",
});

const client = new IoTDataPlaneClient({
    credentials: AWS.config.credentials,
    region: "ap-southeast-2",
});

console.log("Client successfully initialised");

input = { thingName: "local_device" }
command = new ListNamedShadowsForThingCommand(input);

/* GET home page. */
apiRouter.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

// List Devices
apiRouter.get('/devices', async (req, res) => {
    
    var command = new ListThingsInThingGroupCommand({
        thingGroupName: thing_group,
    });
    try {
        const response = await iotClient.send(command);
        var things = response.things;
        console.log(things);

    } catch (e) {
        console.log(e);
        res.status(400).send({ "error": "Request failed" });
    }
    res.status(200).send(body = things);
});


// List Sensors
apiRouter.get('/devices/:deviceID', async (req, res) => {
    deviceID = req.params.deviceID;

    var command = new GetThingShadowCommand({
        thingName: req.params.deviceID,
        shadowName: "global"
    });
    try {
        const response = await client.send(command);
        payload = JSON.parse(new TextDecoder('utf-8').decode(response.payload));
        state = payload.state.reported;

    } catch (e) {
        console.log(e);
        res.status(400).send({ "error": "Request failed" });
    }

    res.status(200).send(state);
});


// Get Sensor Config
apiRouter.get('/devices/:deviceID/sensors/:sensorID', async (req, res) => {
    // console.log(new Date.now());
    console.log(req.params);
    console.log(req.headers);

    var command = new GetThingShadowCommand({
        thingName: req.params.deviceID,
        shadowName: req.params.sensorID
    });
    // var command = new ListNamedShadowsForThingCommand({
    // thingName: "local_device"
    // });
    try {
        const response = await client.send(command);
        payload = JSON.parse(new TextDecoder('utf-8').decode(response.payload));
        state = payload.state.reported;

    } catch (e) {
        console.log(e);
        res.status(400).send({ "error": "Request failed" });
    }

    res.status(200).send(state);
});


// Update Sensor Config
apiRouter.post('/devices/:deviceID/sensors/:sensorID', async (req, res) => {
    var payload = { state: { desired: req.body } };
    var payload_encode = new TextEncoder('utf-8').encode(JSON.stringify(payload));
    var command = new UpdateThingShadowCommand({
        thingName: req.params.deviceID,
        shadowName: req.params.sensorID,
        payload: payload_encode
    });

    try {
        const response = await client.send(command);
        payload = JSON.parse(new TextDecoder('utf-8').decode(response.payload));

    } catch (e) {
        console.log(e);
        res.status(400).send({ "error": "Request failed" });
    }

    res.status(200).send(payload);
})



// 

module.exports = apiRouter;
