# Fraka Robot Libary 

## Connecting to the robot
To be able to use the robots api you first have to create an instance
and then call the connect method.
This will try to fetch an authentication token from the robot. 
The token will be passed to the robot on each subsequent method call, internally by the library

``` node
const Franka = require('./Franka')
var franka = new Franka('192.168.0.1')
franka.connect('user', 'password')
.then(()=>{
	//sucessfully authenticated and connected
	//do your stuff here
})
.catch((e)=>{
	//handle errors that occured while connecting
})
```

## Locking and Unlocking the robot
Locking and Unlocking of the robot joints are special robot functions.
While in locked state the joints of the robot are blocked and therefore wont move. 

### Locking
``` node
frank.lock()
```

### Unlocking
``` node
franka.unlock()
```

## List available timelines
Still to be implemented

## Executing timelines
__Before executing any timeline you will have unlock the robot.__

``` node
franka.executeTimeline('timeline_id')
```

## Quick Start
``` node
//Import Franka Library
const Franka = require('Franka')

//Create a new Franka instance and build up the connection
var franka = new Franka('192.168.0.1')
franka.connect(username, password)
.then(()=>{
	//Unlock the breaks of the Robot
	franka.executeRobotAction(Franka.Actions['open-brakes'])
})
.catch(e=>{
	//print the error and exit
	console.error('Could not connect to robot', e)
	process.exit(1)
})
```
