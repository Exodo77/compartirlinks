"use client";

import { NoteItem, toggleNoteTask, deleteNote } from "@/app/actions/notes";
import { useTransition } from "react";
import { Check, Trash2, BookOpen } from "lucide-react";

export default function NoteCard({ note }: { note: NoteItem }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (taskId: string) => {
    startTransition(async () => {
      await toggleNoteTask(note.id, taskId);
    });
  };

  const handleDelete = () => {
    if (confirm("¿Seguro que quieres borrar esta nota?")) {
      startTransition(async () => {
        await deleteNote(note.id);
      });
    }
  };

  const date = new Date(note.createdAt).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="group glass-card rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all relative overflow-hidden flex flex-col h-full opacity-100 data-[pending=true]:opacity-70" data-pending={isPending}>
      <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500/0 group-hover:bg-indigo-500/50 transition-colors" />
      
      <div className="flex items-start justify-between gap-4 mb-4">
        <h4 className="text-zinc-100 font-semibold flex items-center gap-2">
          {note.title || (note.isChecklist ? "Lista de Compras/Tareas" : "Nota rápida")}
        </h4>
        
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="w-8 h-8 rounded-full bg-red-500/0 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center shrink-0 hover:bg-red-500/10 transition-all -mt-1 -mr-1"
          title="Borrar Nota"
        >
          <Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-400" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-48 custom-scrollbar mb-4 text-sm text-zinc-300">
        {!note.isChecklist ? (
          <p className="whitespace-pre-wrap">{note.content}</p>
        ) : (
          <div className="space-y-2">
            {note.tasks?.map((task) => (
              <label key={task.id} className="flex items-start gap-3 cursor-pointer group/item">
                <div className={`mt-0.5 w-4 h-4 shrink-0 rounded flex items-center justify-center transition-colors border ${task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-zinc-600 bg-zinc-900/50 text-transparent group-hover/item:border-indigo-400'}`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                    disabled={isPending}
                  />
                  <Check className={`w-3 h-3 ${task.completed ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className={`transition-all ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                  {task.text}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-white/[0.05] text-xs text-zinc-600 font-medium flex items-center gap-2">
        <BookOpen className="w-3 h-3" />
        {date}
      </div>
    </div>
  );
}
