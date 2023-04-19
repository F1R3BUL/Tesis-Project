const { Time, DateTime } = require('mssql');
const { sequelize, User, UserIP, Data, Op} = require('./models');

async function CheckConnection()
{
    try {
        await sequelize.authenticate().then(() =>
            {
                return true;
            }
        );
    } catch (error) {
        return false;
    }

}

async function WaitConnection()
{
    await new Promise(resolve => setTimeout(resolve, 10000)); 
}

async function CreateUser(Username, Password)
{
    let result = {Error: false , Message: ""};
    let entity = await User.findOne({ where: { Username: Username } });
        if(entity === null)
        {
            let test = await User.build({
                Username: Username,
                Password: Password
              });
              await test.save();
        }
        else{
            result.Error = true;
            result.Message = "Username already exist!";
        }
        return result;
}

async function ValidateLogin(Username, Password, IP)
{
    let result = {Error: false , Message: ""};
    let entity = await User.findOne({ where: { Username: Username, Password: Password} });
    if(entity != null)
    {
        let ipEntity = await UserIP.findOne({where: {UserId: entity.UserId}});
        if(ipEntity === null)
        {
            let test = await UserIP.build({
                UserId: entity.UserId,
                IP: IP
              });
            await test.save();
        } else {
            result.Error = true;
            result.Message = "Accaunt is logged on another device!";
        }

    } else {
        result.Error = true;
        result.Message = "No user with this username and password!";
    }
    return result;
}

async function CheckIfIpActive(IP)
{
    let entity = await UserIP.findOne({where: {Ip: IP}});
    if(entity)
    {
        return true;
    } else {
        return false;
    }
}

async function UpdateActiveUser(IP){
    await UserIP.update({IP: IP}, 
        {
            where: {
            IP: IP
          }
        });
}

async function CreateRoomData(DecodedData){
    let test = await Data.build({
        Humidity: DecodedData['H'],
        Temperature: DecodedData['T'],
        Level: DecodedData['S']
      });
    await test.save();
}

async function ClearActiveUsers()
{
    await UserIP.destroy({
        truncate: true
      });
}

async function CheckActiveUsers()
{
    while(true)
    {
        let temp = new Date(new Date().getTime() - (2 * 60 * 1000));
        await UserIP.destroy({
            where:{
                updatedAt:  {
                    [Op.lte]: temp
                  }
            }
          });
        await new Promise(resolve => setTimeout(resolve, 60000));       
    }   
}

module.exports = {
    CreateUser,
    ValidateLogin,
    ClearActiveUsers,
    CheckActiveUsers,
    UpdateActiveUser,
    CheckIfIpActive,
    CreateRoomData,
    WaitConnection
};