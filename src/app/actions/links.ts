"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getKvClient } from "@/app/lib/kv";

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  createdAt: number;
}
async function getBoardKey() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (token === "guest") return "guest_link_board";
  if (token === "logged_in" || token === "waltter87") return "my_link_board";
  
  return `board_${token}`; // Cada usuario nuevo tendrá su "board_maria", "board_pedro", etc.
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
    await getKvClient().lpush(boardKey, newLink);
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
    const links = await getKvClient().lrange(boardKey, 0, -1);
    return (links as unknown as LinkItem[]) || [];
  } catch (error) {
    console.error("KV Fetch Error:", error);
    return [];
  }
}

export async function editLink(id: string, newTitle: string, newUrl: string) {
  try {
    const boardKey = await getBoardKey();
    const links = (await getKvClient().lrange(boardKey, 0, -1)) as unknown as LinkItem[];
    
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

    await getKvClient().lset(boardKey, index, updatedItem);
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("KV Edit Error:", error);
    return { error: "No se pudo editar el enlace." };
  }
}
