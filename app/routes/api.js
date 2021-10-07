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

const getAllDevices = async(things) => {
    console.log(things);
    const devices = Promise.all(things.map( (thing) => getGlobalShadow(thing)));
    return devices;
}

const getGlobalShadow = async (thing) => {
    try {
        var sensor_command = new GetThingShadowCommand({
            thingName: thing,
            shadowName: "global"
        });
        sens_response = await client.send(sensor_command);
        payload = JSON.parse(new TextDecoder('utf-8').decode(sens_response.payload));
        console.log(payload);
        state = payload.state.reported;
        sensor = {
                device_id: thing,
                active: true,
                connected: true,
                ...state
            }
        
    } catch (e) {
        console.log(e.message);
        sensor = {
                device_id: thing,
                active: false,
                connected: false,
                sensors: []
        };

    } finally {
        console.log(sensor);
        return sensor;
    }
}

console.log("Client successfully initialised");

input = { thingName: "local_device" }
command = new ListNamedShadowsForThingCommand(input);

/* GET home page. */
apiRouter.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

// List Devices
apiRouter.get('/devices', async (req, res) => {

    var dev_command = new ListThingsInThingGroupCommand({
        thingGroupName: thing_group,
    });

    try {
        const dev_response = await iotClient.send(dev_command);
        var things = dev_response.things;
    } catch (e) {
        console.log(e.message);
        res.status(400).send({ "error": "Request failed" });
    }
    console.log(things)

    const state = await getAllDevices(things)
    console.log(state)

    res.status(200).send(body = state);
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
    console.log(req.params);
    console.log(req.headers);

    var command = new GetThingShadowCommand({
        thingName: req.params.deviceID,
        shadowName: req.params.sensorID
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



module.exports = apiRouter;
