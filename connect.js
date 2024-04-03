const { Sequelize } = require('sequelize');
require('dotenv').config()

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const connect = async () => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.log(error);
    }
}

connect();