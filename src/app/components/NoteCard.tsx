"use client";

import { NoteItem, toggleNoteTask, deleteNote } from "@/app/actions/notes";
import { useTransition, useState, useEffect } from "react";
import { Check, Trash2, BookOpen, X, Maximize2 } from "lucide-react";

export default function NoteCard({ note }: { note: NoteItem }) {
  const [isPending, startTransition] = useTransition();
  const [isFocused, setIsFocused] = useState(false);

  // Prevenir scroll en el background cuando el modal está abierto
  useEffect(() => {
    if (isFocused) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isFocused]);

  const handleToggle = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    startTransition(async () => {
      await toggleNoteTask(note.id, taskId);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const renderContent = (isModal: boolean) => (
    <div className={`flex-1 overflow-y-auto custom-scrollbar text-sm ${isModal ? 'text-zinc-200 mt-6 text-base' : 'max-h-48 text-zinc-300'}`}>
      {!note.isChecklist ? (
        <p className="whitespace-pre-wrap">{note.content}</p>
      ) : (
        <div className={`space-y-2 ${isModal ? 'space-y-4' : ''}`}>
          {note.tasks?.map((task) => (
            <label key={task.id} className={`flex items-start gap-3 cursor-pointer group/item p-1 rounded-lg hover:bg-white/5 transition-colors ${isModal ? 'p-3 border border-white/5 bg-black/20' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className={`mt-0.5 shrink-0 rounded flex items-center justify-center transition-colors border ${isModal ? 'w-5 h-5' : 'w-4 h-4'} ${task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-zinc-600 bg-zinc-900/50 text-transparent group-hover/item:border-indigo-400'}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={task.completed}
                  onChange={(e) => handleToggle(task.id)}
                  disabled={isPending}
                />
                <Check className={`${isModal ? 'w-4 h-4' : 'w-3 h-3'} ${task.completed ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <span className={`transition-all break-words w-full ${task.completed ? 'text-zinc-500 line-through' : ''}`}>
                {task.text}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Tarjeta Normal en la grilla */}
      <div 
        onClick={() => setIsFocused(true)}
        className="group glass-card rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all relative overflow-hidden flex flex-col h-full opacity-100 data-[pending=true]:opacity-70 cursor-pointer shadow-lg hover:shadow-indigo-500/10" 
        data-pending={isPending}
      >
        <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500/0 group-hover:bg-indigo-500/50 transition-colors" />
        
        <div className="flex items-start justify-between gap-4 mb-4">
          <h4 className="text-zinc-100 font-semibold flex items-center gap-2 group-hover:text-indigo-300 transition-colors">
            {note.title || (note.isChecklist ? "Lista de Compras/Tareas" : "Nota rápida")}
          </h4>
          
          <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all -mt-1 -mr-1">
            <button
              onClick={() => setIsFocused(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-indigo-500/10 transition-colors"
              title="Enfocar"
            >
              <Maximize2 className="w-4 h-4 text-zinc-400 hover:text-indigo-400" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/10 transition-colors"
              title="Borrar Nota"
            >
              <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-400" />
            </button>
          </div>
        </div>
        
        {/* Contenido truncado en la tarjeta */}
        <div className="flex-1 overflow-hidden relative">
           {/* Fade-out para notas muy largas en vista tarjeta */}
           <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-950/20 to-transparent z-10 pointer-events-none" />
           {renderContent(false)}
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.05] text-xs text-zinc-500 font-medium flex items-center gap-2">
          <BookOpen className="w-3 h-3" />
          {date}
        </div>
      </div>

      {/* MODAL MODO FOCUS */}
      {isFocused && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" 
          onClick={() => setIsFocused(false)}
        >
          <div 
            className="glass-card w-full max-w-2xl max-h-[85vh] rounded-2xl flex flex-col relative shadow-2xl border-indigo-500/30 animate-in zoom-in-95 duration-200 overflow-hidden bg-zinc-950/90"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 sm:px-8 border-b border-white/10 shrink-0 sticky top-0 bg-zinc-950/80 backdrop-blur-xl z-20">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-indigo-400" />
                {note.title || (note.isChecklist ? "Lista de Compras/Tareas" : "Nota rápida")}
              </h2>
              <button 
                onClick={() => setIsFocused(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white text-zinc-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Completo del Modal */}
            <div className="p-6 sm:px-8 overflow-y-auto custom-scrollbar flex-1">
              {renderContent(true)}
            </div>

            {/* Footer del Modal */}
            <div className="p-6 sm:px-8 border-t border-white/5 flex justify-between items-center text-sm text-zinc-500 shrink-0 bg-black/10">
              <span>Creado el {date}</span>
              <button
                onClick={(e) => { setIsFocused(false); handleDelete(e); }}
                disabled={isPending}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
