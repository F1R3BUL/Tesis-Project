const app = require("express")();
const server = require("http").createServer(app);
const ejs = require("ejs");
const io = require("socket.io")(server);
const fs = require('fs');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const { exec } = require('child_process');
const requestIp = require('request-ip');
const player = require('play-sound')();
const sessionStorage = require('node-sessionstorage');
var LoggedIp = {IP: '0.0.0.0', Logged: true};
// Set up the WebSocket server
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render(__dirname + '/login.ejs', {message: ""});
});

app.post('/Information', (req, res) => {
  let ip = requestIp.getClientIp(req);
  if(sessionStorage.getItem("ip"))
  {
    if(sessionStorage.getItem("ip") === ip)
    {
      res.sendFile(__dirname + '/index.html'); 
    }
  }
  else if (req.body.username === "admin" && req.body.password === "admin") {
        console.log(req.body);
        LoggedIp = {IP : ip, Logged: true};
        sessionStorage.setItem("ip", ip);
        res.sendFile(__dirname + '/index.html'); 
      }
      else
      {
        res.render(__dirname + '/login.ejs', {message: "Wrong Password"});
      }
});

app.get('/Information', (req, res) => {
  let ip = requestIp.getClientIp(req);
  if(LoggedIp.Logged === true)
  {
    if(LoggedIp.IP === ip)
    {
      res.sendFile(__dirname + '/index.html'); 
    }
    else
    {
      res.render(__dirname + '/login.ejs', {message: "Account is logged on a different device."});
    }
  }
  else{
    res.render(__dirname + '/login.ejs', {message: ""});
  }
});

io.on('connection', (socket) => {
      let ip = socket.request.connection.remoteAddress;

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
        player.play('./BEEEEEEEEEEEEP.mp3', (err) => {
          if (err) console.log(`Could not play sound: ${err}`);
        });
      //exec('shutdown /s /t 0', (error, stdout, stderr) => {
      //  if (error) {
      //    console.error(`Error executing command: ${error}`);
      //    return;
      //  }
      //})
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
      if (temperature >= 27 && temperature <= 29)
      {
        io.emit('ArduionoData', data.toString());
        // Play audio file
        player.play('BEEEEEEEEEEEEP.wav', (err) => {
          if (err) {
            console.error(`Failed to play audio: ${err}`);
          }
        });
      }
      else if(temperature >=  30)
      {
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
