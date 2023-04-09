const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const fs = require('fs');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const { exec } = require('child_process');


// Set up the WebSocket server
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on("login", ({ username, password }) => {
      // Perform login authentication
      if (username === "admin" && password === "admin") {          
        io.emit('loginSuccess');
      }
      
    });

    socket.on('Index', (socket)=> {   
      fs.readFile('style.css', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('css', data.toString());
      }
      });
    });

    socket.on('shutdown', (socket) => {
      console.log("Shudown recieved");
      exec('shutdown /s /t 0', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return;
        }
      })
    });
});

// Create a serial port object
const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
  },(err => {
    if(err)
    {
      console.log('No device on serial port.');
      io.emit('SerialError');
    }
    else{
      console.log('Device connected');
    }
  }));

    const parser = port.pipe(new ReadlineParser({delimiter: '\r\n'}));


    parser.on('data', (data) => {
      let output = data.toString().split(";");
      let temperature = output[1];
      if(temperature >=  30)
      {
        io.emit('ArduionoData', data.toString());
        console.error(`shutting down`);
        exec('shutdown /s /t 0', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error}`);
            return;
          }
        });
      }
      io.emit('ArduionoData', data.toString());
      data.split()
    });

// Set up the serial port

server.listen(3000, () => {
  console.log('Server listening on port http://localhost:3000');
});
