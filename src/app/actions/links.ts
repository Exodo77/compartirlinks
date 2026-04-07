"use server";

import { createClient } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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

// Función para separar la base de datos principal de la de invitados
async function getBoardKey() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  // Si está logueado como admin usa su pizarra principal, si es invitado usa una separada
  return token === "logged_in" ? "my_link_board" : "guest_link_board";
}

export async function addLink(formData: FormData) {
  const url = formData.get("url") as string;
  if (!url) return { error: "URL requerida" };

  let title = formData.get("title") as string;
  
  if (!title) {
    try {
      title = new URL(url).hostname.replace("www.", "");
    } catch {
      title = url;
    }
  }

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
    const boardKey = await getBoardKey();
    await kvClient.lpush(boardKey, newLink);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("KV Error:", error);
    if (error?.message?.includes("URL requires a valid URI")) {
      return { error: "Base de datos desconectada. Falta configurar Vercel KV en el Dashboard." };
    }
    return { error: "Error al guardar el enlace" };
  }
}

export async function getLinks(): Promise<LinkItem[]> {
  try {
    const boardKey = await getBoardKey();
    const links = await kvClient.lrange(boardKey, 0, -1);
    return (links as unknown as LinkItem[]) || [];
  } catch (error) {
    console.error("KV Fetch Error:", error);
    return [];
  }
}

export async function editLink(id: string, newTitle: string, newUrl: string) {
  try {
    const boardKey = await getBoardKey();
    const links = (await kvClient.lrange(boardKey, 0, -1)) as unknown as LinkItem[];
    
    const index = links.findIndex(link => link.id === id);
    if (index === -1) return { error: "Link no encontrado" };

    let finalUrl = newUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    const updatedItem = {
      ...links[index],
      title: newTitle,
      url: finalUrl
    };

    await kvClient.lset(boardKey, index, updatedItem);
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("KV Edit Error:", error);
    return { error: "No se pudo editar el enlace." };
  }
}
