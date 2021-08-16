const ex_config = {
    "sample_rate":500,
    "output_type":"feather",
    "offline_mode":false,
    "channels":[
        true, true, true
    ],
    "output_directory": "~/data",
    "save_interval":{
        "unit":"mins",
        "interval":5
    },
    "file_upload":{
        "enabled":true,
        "endpoint":"awsendpoint.arup.com"
    },
    "duration":false
};

module.exports = ex_config;