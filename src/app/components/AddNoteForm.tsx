"use client";

import { useState, useTransition } from "react";
import { addNote } from "@/app/actions/notes";
import { FileText, ListTodo, Plus, X } from "lucide-react";

export default function AddNoteForm() {
  const [isPending, startTransition] = useTransition();
  const [isChecklist, setIsChecklist] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState(["", "", ""]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content && tasks.every((t) => !t.trim())) {
      setError("La nota no puede estar vacía");
      return;
    }
    
    setError(null);
    startTransition(async () => {
      const result = await addNote(title, isChecklist, content, tasks);
      if (result.success) {
        setTitle("");
        setContent("");
        setTasks(["", "", ""]);
      } else {
        setError(result.error || "Ocurrió un error al guardar");
      }
    });
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const addTaskField = () => setTasks([...tasks, ""]);
  const removeTaskField = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10 w-full mt-4">
      <div className="flex gap-4 border-b border-zinc-800 pb-4">
        <button
          type="button"
          onClick={() => setIsChecklist(false)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${!isChecklist ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <FileText className="w-4 h-4" />
          Nota Simple
        </button>
        <button
          type="button"
          onClick={() => setIsChecklist(true)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isChecklist ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <ListTodo className="w-4 h-4" />
          Lista (Checklist)
        </button>
      </div>

      <input
        type="text"
        placeholder="Título de la nota (opcional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isPending}
        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
      />

      {!isChecklist ? (
        <textarea
          placeholder="Escribe tu nota aquí..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          rows={3}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
        />
      ) : (
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-zinc-700 flex-shrink-0 opacity-50" />
              <input
                type="text"
                value={task}
                onChange={(e) => updateTask(i, e.target.value)}
                disabled={isPending}
                placeholder={`Elemento ${i + 1}`}
                className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => removeTaskField(i)}
                className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                title="Eliminar elemento"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTaskField}
            disabled={isPending}
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors px-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            Añadir otro elemento
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-xl px-6 py-2.5 transition-all flex items-center justify-center min-w-[120px]"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Guardar Nota"
          )}
        </button>
      </div>
    </form>
  );
}
