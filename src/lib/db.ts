import mysql from "mysql2/promise";

declare global {
  var __simpaduPool: mysql.Pool | undefined;
}

function createPool() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
    dateStrings: true,
    decimalNumbers: true,
    timezone: "+07:00",
  });

  pool.on("connection", (conn) => {
    conn.query("SET SESSION TRANSACTION READ ONLY");
  });

  return pool;
}

export const pool = globalThis.__simpaduPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__simpaduPool = pool;
}
