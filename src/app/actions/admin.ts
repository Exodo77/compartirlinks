"use server";

import { getKvClient } from "@/app/lib/kv";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  // Solo waltter87 (o el token legacy "logged_in") es admin
  return token === "waltter87" || token === "logged_in";
}

export async function getUsers() {
  if (!(await isAdmin())) return [];
  
  const keys = await getKvClient().keys("user:*");
  const users = keys.map(k => k.replace("user:", ""));
  return users;
}

export async function deleteUser(formData: FormData) {
  if (!(await isAdmin())) return;
  
  const username = formData.get("username") as string;
  if (!username) return;
  
  // Evitar que el admin se borre a sí mismo
  if (username === "waltter87" || username === "logged_in") {
    return;
  }
  
  // Borrar credenciales de usuario y también su base de datos personal
  await getKvClient().del(`user:${username}`);
  await getKvClient().del(`board_${username}`);
  
  revalidatePath("/admin");
}
