"use server";

import { getKvClient } from "@/app/lib/kv";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface NoteItem {
  id: string;
  title: string;
  isChecklist: boolean;
  content: string; // Para notas de texto
  tasks: { id: string; text: string; completed: boolean }[]; // Para listas tipo To-Do
  createdAt: number;
}

async function getNotesKey() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (token === "guest") return "guest_notes_board";
  if (token === "logged_in" || token === "waltter87") return "my_notes_board";
  
  return `notes_${token}`;
}

export async function addNote(title: string, isChecklist: boolean, content: string, tasks: string[]) {
  if (!title && !content && tasks.length === 0) return { error: "La nota no puede estar vacía" };

  const id = crypto.randomUUID();
  const newNote: NoteItem = {
    id,
    title,
    isChecklist,
    content,
    tasks: tasks.filter(t => t.trim() !== "").map(text => ({ id: crypto.randomUUID(), text, completed: false })),
    createdAt: Date.now(),
  };

  try {
    const key = await getNotesKey();
    await getKvClient().lpush(key, newNote);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("KV Error:", error);
    return { error: "Error al guardar la nota" };
  }
}

export async function getNotes(): Promise<NoteItem[]> {
  try {
    const key = await getNotesKey();
    const notes = await getKvClient().lrange(key, 0, -1);
    return (notes as unknown as NoteItem[]) || [];
  } catch (error) {
    console.error("KV Fetch Error:", error);
    return [];
  }
}

export async function toggleNoteTask(noteId: string, taskId: string) {
  try {
    const key = await getNotesKey();
    const notes = (await getKvClient().lrange(key, 0, -1)) as unknown as NoteItem[];
    
    const index = notes.findIndex(n => n.id === noteId);
    if (index === -1) return { error: "Nota no encontrada" };

    const note = notes[index];
    const taskIndex = note.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      note.tasks[taskIndex].completed = !note.tasks[taskIndex].completed;
      await getKvClient().lset(key, index, note);
      revalidatePath("/");
      return { success: true };
    }
    return { error: "Tarea no encontrada" };
  } catch (error) {
    console.error("KV Edit Error:", error);
    return { error: "Error al actualizar la nota." };
  }
}

export async function deleteNote(noteId: string) {
  try {
    const key = await getNotesKey();
    const notes = (await getKvClient().lrange(key, 0, -1)) as unknown as NoteItem[];
    
    const index = notes.findIndex(n => n.id === noteId);
    if (index === -1) return { error: "Nota no encontrada" };

    const noteToRemove = notes[index];
    // Redis requiere el valor exacto para borrar con lrem, o podemos extraer, mod, y reemplazar lista
    // Pero LREM usa el valor serializado, como es KV, lo mejor es reemplazar toda la lista para evitar errores:
    notes.splice(index, 1);
    
    await getKvClient().del(key);
    if (notes.length > 0) {
      // Reinsertamos todas (como lpush inserta invertido, las invertimos antes para mantener orden si lo necesitamos)
      // O podemos usar un pipeline o simplemente setear toda la lista
      // LRPUSH o similar. Pero getKvClient permite setear listas completas solo iterando o RPUSH
      const pipeline = getKvClient().pipeline();
      for (const n of notes.reverse()) {
        pipeline.lpush(key, n);
      }
      await pipeline.exec();
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("KV Delete Error:", error);
    return { error: "Error al borrar la nota." };
  }
}

export async function editNote(noteId: string, title: string, content: string, newTasks: string[]) {
  try {
    const key = await getNotesKey();
    const notes = (await getKvClient().lrange(key, 0, -1)) as unknown as NoteItem[];
    
    const index = notes.findIndex(n => n.id === noteId);
    if (index === -1) return { error: "Nota no encontrada" };

    const note = notes[index];
    note.title = title;
    
    if (!note.isChecklist) {
      note.content = content;
    } else {
      // Re-map tasks: keep old completion state if text match, otherwise false
      note.tasks = newTasks.filter(t => t.trim() !== "").map(text => {
        const existing = note.tasks.find(ot => ot.text === text);
        return existing ? existing : { id: crypto.randomUUID(), text, completed: false };
      });
    }

    await getKvClient().lset(key, index, note);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("KV Edit Error:", error);
    return { error: "Error al actualizar la nota." };
  }
}
