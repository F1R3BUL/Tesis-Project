const { Sequelize, DataTypes, Op } = require('sequelize');

// const sequelize = new Sequelize('kurami_', 'kurami_ ', '', {
//   host: 'sql.bsite.net/MSSQL2016',
//   dialect: 'mssql',
//   port: '',
//   database: 'kurami_',
//   logging: false,
//   dialectOptions: {
//     options: {
//       encrypt: false // If you are connecting to a server with SSL encryption
//     }
//   }
// });

const sequelize = new Sequelize('arduinotowebsitetest_', 'arduinotowebsitetest_', 'ArduinoToWebsiteTest', {
  dialect: 'mssql',
  host: 'sql.bsite.net',
  logging: false,
  dialectOptions: {
    options: {
      instanceName: 'MSSQL2016',
       encrypt: false
    }
  }
})

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

sequelize.sync({ force: true });

module.exports = {
  sequelize,
  User,
  UserIP,
  Data,
  Op
};