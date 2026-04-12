import mysql from "mysql2/promise";

let db;

try {
  db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "internapi",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("MySQL pool created successfully");
} catch (error) {
  console.error(" Error creating database pool:", error);
  process.exit(1);
}

export default db;