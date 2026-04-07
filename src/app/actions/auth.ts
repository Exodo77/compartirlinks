"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === "waltter87" && password === "trapos87") {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "logged_in", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    
    redirect("/");
  }

  return { error: "Credenciales incorrectas" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}

export async function loginAsGuest() {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "guest", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 días para el invitado
    path: "/",
  });
  
  redirect("/");
}
