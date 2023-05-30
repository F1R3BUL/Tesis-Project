const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const ejs = require("ejs");
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { exec } = require('child_process');
const requestIp = require('request-ip');
const PORT = 3000;
const {CreateUser, ValidateLogin, ClearActiveUsers, 
  CheckActiveUsers, UpdateActiveUser, CheckIfIpActive,
  CreateRoomData, WaitConnection } = require(__dirname + "/Database/middleware.js");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '\\public'));

app.post("/heartbeat", async (req, res) => {
  let ip = requestIp.getClientIp(req);
  UpdateActiveUser(ip);
  res.sendStatus(200);
});

app.get("/RequestSocket", (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs', {message: " "});
});

app.get('/Login', (req, res) => {
      res.render(__dirname + '/views/index.ejs', {message: ""});
});

app.post('/Login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let ip = requestIp.getClientIp(req);
  ValidateLogin(username, password, ip).then(result =>{
    if(result.Error)
    {
      res.render(__dirname + '/views/index.ejs', {message: result.Message});
    } else {
      console.log("Loged");
      res.sendFile(__dirname + '/views/Information.html');
    }
    
  });
});

app.get('/Register', (req, res) => {
  res.render(__dirname + '/views/Register.ejs', {message: ""});
});

app.post('/Register', (req, res) => {
  let username = req.body.regsiterUsername;
  let password = req.body.regsiterPassword;
  let confirmPassword = req.body.confirmPassword;
  if(username && password && confirmPassword)
  {
    if(password === confirmPassword)
    {
      CreateUser(username, password).then(result =>{
        if(result.Error)
        {
          res.render(__dirname + '/views/Register.ejs', {message: result.Message});
        } else {
          console.log("Registered");
          res.render(__dirname + '/views/index.ejs', {message: ""});
        }       
      });
    } else {
      res.render(__dirname + '/views/Register.ejs', {message: "Passwords dont match"});
    }

  }
  else
  {
    res.render(__dirname + '/views/Register.ejs', {message: "Fill all fields!"});
  }

});

app.get('/Information', (req, res) => { 
  let ip = requestIp.getClientIp(req);
  CheckIfIpActive(ip).then(result => {
    if(result)
    {
      console.log('CHECK LOGIn');
      let username = req.body.username;
      let password = req.body.password;
      ValidateLogin(username, password, ip).then(result =>{
        if(result.Error)
        {
          res.render(__dirname + '/views/index.ejs', {message: result.Message});
        } else {
          console.log("Loged");
          res.sendFile(__dirname + '/views/Information.html');
        }
        
      });
    }
    else {
      res.render(__dirname + '/views/index.ejs', {message: ""});
    }
  })
});

app.post('/Information', (req, res) => {
  let username = req.body.username;
  let password = req.body.password; 
  let ip = requestIp.getClientIp(req);
  CheckIfIpActive(ip).then(result => {
    if(result)
    {
      res.sendFile(__dirname + '/views/Information.html');
    }
    else {
      ValidateLogin(username, password, ip).then(result =>{
        if(result.Error)
        {
          res.render(__dirname + '/views/index.ejs', {message: result.Message});
        } else {
          console.log("Loged");
          res.sendFile(__dirname + '/views/Information.html');
        }        
      });
    }
  })
});

io.on('connection', (socket) => {
  //let ip = socket.request.connection.remoteAddress;
  socket.on('shutdown', () =>{
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
path: 'COM4',
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


let lastReading = "";
let count = 0;
parser.on('data', async (data) => {
      let output = data.toString().split(",");
      let DecodedData = { };
      for(let i = 0; i < output.length; i++){
        DecodedData[output[i].split(':')[0].toString()] = output[i].split(':')[1].toString();
      }
      count++;
      if(count > 4){
        count = 0;
        CreateRoomData(DecodedData);
      }
      console.log(DecodedData);
      if(lastReading === 'danger' && DecodedData['S'] === 'danger')
      {
        console.log(`Error executing command: `);
        exec('shutdown /s /t 0', (error, stdout, stderr) => {
          if (error) {
            console.log(`Error executing command: ${error}`);
            return;
          }
        });
      }
      lastReading = DecodedData['S'];
      if(DecodedData['T'] >=  30)
      {
        exec('shutdown /s /t 0', (error, stdout, stderr) => {
          if (error) {
            console.log(`Error executing command: ${error}`);
            return;
          }
        });
      }
      io.emit('ArduionoData', DecodedData);
});


WaitConnection().then(() =>
{
  ClearActiveUsers();
  CheckActiveUsers();
});

server.listen(PORT, () => 
{
    process.env.TZ = "Europe/Kiev";
    console.log("Server is listening. http://localhost:3000")
});

