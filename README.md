# andromeda-telemetry

![](https://github.com/JohnBehnke/andromeda-telemetry/blob/master/logo.png "Andromeda")

# Building

1. Install NodeJS (https://nodejs.org/en/download/ or though your favorite package manager)
2. Install OpenMCT (https://github.com/nasa/openmct)
3. Download or clone Andromeda-telemetry
4. Install the dependencies (npm install)
5. Copy the andromeda-telemetry directory into the openmct/examples directory
6. Run `npm start` in the openmct directory
7. Run `node andromeda.js` in the andromeda-telemetry directory in a seperate terminal instance
8. Navigate to `localhost:8081` in your browser

#Note
On line 18 of `andromeda.js`, you need to change where the serial port is. You can probably find out the name for this by using the Arduino tools.

