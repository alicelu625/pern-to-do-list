const Pool = require('pg').Pool;
require('dotenv').config();

//development configuration
const devConfig = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE
};

//production configuration
const proConfig = {
    //string to connect to postgres database
    connectionString: process.env.DATABASE_URL //from heroku add-on
}

//if in production, use proConfig, else use devConfig
const pool = new Pool(
    process.env.NODE_ENV === 'production' ? proConfig : devConfig
);

module.exports = pool;