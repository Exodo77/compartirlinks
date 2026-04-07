"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { kvClient } from "./links";
import crypto from "crypto";

const hashPass = (pass: string) => crypto.createHash('sha256').update(pass).digest('hex');

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  
  if (!username || !password) return { error: "Todos los campos son obligatorios" };

  let isValid = false;

  // Hardcode clásico para el administrador
  if (username === "waltter87" && password === "trapos87") {
    isValid = true;
  } else {
    // Buscar usuario en Base de Datos KV
    try {
      const storedPassHash = await kvClient.get(`user:${username.toLowerCase()}`);
      if (storedPassHash && storedPassHash === hashPass(password)) {
        isValid = true;
      }
    } catch (e) {
      console.error(e);
      return { error: "Servicio no disponible" };
    }
  }

  if (isValid) {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", username.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    redirect("/");
  }

  return { error: "Credenciales incorrectas" };
}

export async function register(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) return { error: "Todos los campos son obligatorios" };
  if (username.length < 3) return { error: "El usuario debe tener mínimo 3 letras" };
  if (password.length < 6) return { error: "La contraseña debe tener mínimo 6 caracteres" };

  const safeUser = username.toLowerCase();

  if (safeUser === "guest" || safeUser === "logged_in") {
    return { error: "Nombre de usuario no permitido" };
  }

  try {
    const existingUser = await kvClient.get(`user:${safeUser}`);
    if (existingUser) {
      return { error: "El nombre de usuario ya está en uso" };
    }

    await kvClient.set(`user:${safeUser}`, hashPass(password));

    // Si tuvo éxito, lo logueamos directamente
    const cookieStore = await cookies();
    cookieStore.set("auth_token", safeUser, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    
  } catch (e) {
    console.error(e);
    return { error: "No se pudo registrar el usuario. Revisa la base de datos." };
  }

  redirect("/");
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
