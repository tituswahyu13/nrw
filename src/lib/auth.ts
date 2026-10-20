import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { pool } from "./db";
import { sessionOptions, SessionData, defaultSession } from "./session";
import { AuthUser } from "./types";

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.user) {
    return null;
  }
  return session.user;
}

export async function authenticateUser(username: string, passwordPlain: string): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  if (!username || !passwordPlain) {
    return { success: false, error: "Username dan password wajib diisi" };
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT ID, USER_NAME, KARYAWAN_ID, PASSWORD FROM SPD_USER WHERE USER_NAME = ? LIMIT 1",
      [username.trim()]
    );

    if (rows.length === 0) {
      return { success: false, error: "Username atau password salah" };
    }

    const dbUser = rows[0];
    const passwordMatch = await bcrypt.compare(passwordPlain, dbUser.PASSWORD);

    if (!passwordMatch) {
      return { success: false, error: "Username atau password salah" };
    }

    const user: AuthUser = {
      id: Number(dbUser.ID),
      username: String(dbUser.USER_NAME),
      karyawanId: Number(dbUser.KARYAWAN_ID),
    };

    const session = await getSession();
    session.user = user;
    session.isLoggedIn = true;
    await session.save();

    return { success: true, user };
  } catch (err: any) {
    console.error("Auth error:", err);
    return { success: false, error: "Terjadi kesalahan pada database saat otentikasi" };
  }
}

export async function logoutUser() {
  const session = await getSession();
  session.destroy();
}
