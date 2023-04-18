const express = require("express");
const app = express();
const server = require("http").createServer(app);
const ejs = require("ejs");
const bodyParser = require('body-parser');
const io = require("socket.io")(server);
const requestIp = require('request-ip');
const PORT = 3000;
const {CreateUser, ValidateLogin, ClearActiveUsers, CheckActiveUsers, UpdateActiveUser } = require(__dirname + "/Database/middleware.js");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '\\public'));

ClearActiveUsers();
CheckActiveUsers();

app.post("/heartbeat", async (req, res) => {
  let ip = requestIp.getClientIp(req);
  UpdateActiveUser(ip);
  res.sendStatus(200);
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
      res.render(__dirname + '/views/Information.ejs');
    }
    
  });
});

app.get('/Register', (req, res) => {
  res.render(__dirname + '/views/Register.ejs', {message: ""});
});

app.post('/Register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password)
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
  }
  else
  {
    res.render(__dirname + '/views/Register.ejs', {message: "Fill all fields!"});
  }

});

app.get('/Information', (req, res) => {
  res.render(__dirname + '/views/index.ejs', {message: ""});
});

app.post('/Information', (req, res) => {
  res.render(__dirname + '/views/index.ejs', {message: ""});
});

io.on('connection', (socket) => {
  let ip = socket.request.connection.remoteAddress;
  console.log("socket connected");
  //exec('shutdown /s /t 0', (error, stdout, stderr) => {
  //  if (error) {
  //    console.error(`Error executing command: ${error}`);
  //    return;
  //  }
  //})
});



app.listen(PORT, () => 
{
    console.log("Server is listening. http://localhost:3000")
});

