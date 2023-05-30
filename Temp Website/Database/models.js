const { Sequelize, DataTypes, Op } = require('sequelize');

// 'sql.bsite.net/MSSQL2016'

const sequelize = new Sequelize('ArduinoToNodeJsWebsite', 'NicolaJ_SQLLogin_1', 'mrubs9xwhz', {
  host: 'ArduinoToNodeJsWebsite.mssql.somee.com',
  dialect: 'mssql',
  database: 'ArduinoToNodeJsWebsite',
  logging: false,
  dialectOptions: {
    options: {
      encrypt: false // If you are connecting to a server with SSL encryption
    }
  }
});

// const sequelize = new Sequelize('haaaaaaaaaaaaaa', 'haaaaaaaaaaaaaa', 'Ts0BHEtj_~SF', {
//   dialect: 'mssql',
//   host: 'den1.mssql8.gear.host',
//   logging: false,
//   dialectOptions: {
//     options: {      
//       server: "MSSQL8"
//     }
//   }
// })

const User = sequelize.define('Users', {
  UserId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const UserIP = sequelize.define('UserIPs', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserId:
  {
    type: DataTypes.INTEGER,
    
    references:
    {
      model: User,
      key: 'UserId'
    }   
  },
  IP:
  {
    type: DataTypes.STRING,
  }
});

const Data = sequelize.define('RoomData', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Humidity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Temperature: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Level: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

sequelize.sync({ force: false });

module.exports = {
  sequelize,
  User,
  UserIP,
  Data,
  Op
};