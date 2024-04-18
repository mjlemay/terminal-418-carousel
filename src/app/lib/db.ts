import postgres from 'postgres'; 

const sql = postgres('', {
    host                 : process.env.DB_HOST,            // Postgres ip address[s] or domain name[s]
    port                 : 5432,                           // Postgres server port[s]
    database             : process.env.DB_NAME,            // Name of database to connect to
    username             : process.env.DB_USER,            // Username of database user
    password             : process.env.DB_PASSWORD,        // Password for database user
});

export default sql;