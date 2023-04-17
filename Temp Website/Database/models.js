const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('ArduinoToNodeJsWebsite', 'NicolaJ_SQLLogin_1 ', 'mrubs9xwhz', {
  host: 'ArduinoToNodeJsWebsite.mssql.somee.com',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false // If you are connecting to a server with SSL encryption
    }
  }
});

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

module.exports = {
  sequelize,
  User
};