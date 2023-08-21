const env = process.env
const db = {
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    database: env.DB_NAME,
    port:env.DB_PORT,
    password : env.DB_PASSWORD
}

module.exports = db