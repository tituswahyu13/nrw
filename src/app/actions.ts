"use server";

import { redirect } from "next/navigation";
import { authenticateUser, logoutUser } from "@/lib/auth";

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = await authenticateUser(username, password);

  if (!result.success) {
    return { error: result.error || "Login gagal" };
  }

  redirect("/");
}

export async function logoutAction() {
  await logoutUser();
  redirect("/login");
}
