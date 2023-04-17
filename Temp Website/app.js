const app = require("express")();
const server = require("http").createServer(app);
const ejs = require("ejs");
const bodyParser = require('body-parser');
const { sequelize, User } = require(__dirname + '/Database/models.js');
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    sequelize.authenticate();
    const result =  User.findAll();
    
    console.log(result);
    res.render(__dirname + '/views/index.ejs');
});

async function run() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
  
      // Create a new user
      const newUser = await User.create({
        Username: 'John Smith',
        Password: 'john.smith@example.com'
      });
      console.log(`New user created with ID ${newUser.id}.`);
  
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    } finally {
      await sequelize.close();
      console.log('Connection has been closed.');
    }
  }
  
  run();

app.listen(PORT, () => 
{
    console.log("Server is listening. http://localhost:3000")
});