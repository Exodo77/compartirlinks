"use server";

import { createClient } from "@vercel/kv";
import { revalidatePath } from "next/cache";

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  createdAt: number;
}

// Creamos un cliente que soporte las variables antiguas de Vercel KV o las nuevas de Upstash
const kvClient = createClient({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export async function addLink(formData: FormData) {
  const url = formData.get("url") as string;
  if (!url) return { error: "URL requerida" };

  let title = formData.get("title") as string;
  
  // Si no escribe título, intentamos sacar el nombre de la página de la URL
  if (!title) {
    try {
      title = new URL(url).hostname.replace("www.", "");
    } catch {
      title = url;
    }
  }

  // Validar si la URL tiene http:// o https://
  let finalUrl = url;
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = "https://" + finalUrl;
  }
  
  const id = crypto.randomUUID();
  const newLink: LinkItem = {
    id,
    url: finalUrl,
    title,
    createdAt: Date.now(),
  };

  try {
    // Vercel KV (Redis) guarda los datos como pares llave-valor o listas.
    // Usamos una lista lpush para meter el enlace más nuevo al principio.
    await kvClient.lpush("my_link_board", newLink);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("KV Error:", error);
    if (error.message.includes("URL requires a valid URI")) {
      return { error: "Base de datos desconectada. Falta configurar Vercel KV en el Dashboard." };
    }
    return { error: "Error al guardar el enlace" };
  }
}

export async function getLinks(): Promise<LinkItem[]> {
  try {
    // Traemos todos los enlaces guardados
    const links = await kvClient.lrange("my_link_board", 0, -1);
    return (links as unknown as LinkItem[]) || [];
  } catch (error) {
    console.error("KV Fetch Error:", error);
    return [];
  }
}
