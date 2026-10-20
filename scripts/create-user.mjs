import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const username = process.argv[2];
const password = process.argv[3];
const karyawanId = process.argv[4] ? parseInt(process.argv[4], 10) : 1;

if (!username || !password) {
  console.log("Penggunaan: node --env-file=.env.local scripts/create-user.mjs <username> <password> [karyawan_id]");
  console.log("Contoh:     node --env-file=.env.local scripts/create-user.mjs viewer pdam123");
  process.exit(1);
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    const [existing] = await conn.query(
      "SELECT ID, USER_NAME FROM SPD_USER WHERE USER_NAME = ?",
      [username.trim()]
    );

    const hash = await bcrypt.hash(password, 10);

    if (existing.length > 0) {
      console.log(`User "${username}" sudah ada (ID: ${existing[0].ID}). Memperbarui password...`);
      await conn.query(
        "UPDATE SPD_USER SET PASSWORD = ?, UPDATED_AT = NOW() WHERE USER_NAME = ?",
        [hash, username.trim()]
      );
      console.log(`✓ Password untuk user "${username}" berhasil diperbarui!`);
    } else {
      console.log(`Membuat akun baru "${username}"...`);
      const [res] = await conn.query(
        "INSERT INTO SPD_USER (USER_NAME, KARYAWAN_ID, PASSWORD, CREATED_AT, UPDATED_AT) VALUES (?, ?, ?, NOW(), NOW())",
        [username.trim(), karyawanId, hash]
      );
      console.log(`✓ User "${username}" berhasil dibuat dengan ID: ${res.insertId}`);
    }
  } catch (err) {
    console.error("Gagal membuat/memperbarui user:", err);
  } finally {
    await conn.end();
  }
}

main();
