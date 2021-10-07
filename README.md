# snsrpi-backend

Basic Express JS API for communicating with Raspberry Pi vibration monitor using AWS IOT Core

## Setup and Install

Requires Node.js - I've had this work on versions from 12+

To install all dependencies

```
cd app
npm install
```

## Running the App

from the `./app` directory simply run `npm run`

This is linked to a script that runs nodemon, which allows the script to run constantly, and reload on saved changes

## The API

The API is fairly barebones. All of the business logic is in `app/api/routes` pretty much. The routes are fairly self explanatory. As some of them reuqire int he intiialising of an AWS Iot client, it assumes that it can find valid AWS credentials either in the form of a shared credentials file or environment variables.