# WaglyJs
WaglyJs is an express web app that is to be implemented in the cloud

## PLEASE NOTE
At current the login system is insecure due to storing access token in localStorage. For production change to using something like redis 

## TODO:
- Look into deploying database funcitons in cloud
- Maybe jwt in cloud aswell

## Usage
The web app should be available on:

Current Logins:
Walker:
```asgl
    Username: Walker
    Password: pass
```
Owner:
``` asgl
    Username: Owner
    Password: pass
```

However, if you wish to run the app locally see below

## Installation
To install required packaged please run
```bash
npm i
```

To run this web app locally you must also set up a .env file with the following
```asgl
HOST_NAME:      Name of host (URL or IP)
PORT:           Port to listen on
CONNECT:        Connection URI for mongodb database
ACCESS_SECRET:  Secret key for access token
REFRESH_SECRET: Secret key for refresh token
```

## Run code
Use the command to start the server, then navigate too `127.0.0.1:8080` if run locally
```bash
npm run start
```