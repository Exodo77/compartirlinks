"use client";

import { useActionState } from "react";
import { addLink } from "@/app/actions/links";
import { Plus } from "lucide-react";

export default function AddLinkForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await addLink(formData);
      return res; // {success} or {error}
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            name="title"
            placeholder="Título (opcional, ej: Mi Repo GitHub)"
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm"
            disabled={isPending}
          />
        </div>
        <div className="flex-[2]">
          <input
            type="text"
            name="url"
            placeholder="https://..."
            required
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-sm"
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-70 disabled:hover:bg-emerald-500 text-zinc-950 font-semibold rounded-xl px-6 py-3 transition-colors flex items-center justify-center min-w-[140px]"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5 mr-1 -ml-1" />
              Guardar
            </>
          )}
        </button>
      </div>
      
      {state?.error && (
         <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
           {state.error}
         </div>
      )}
      {state?.success && (
         <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-medium">
           ¡Enlace guardado exitosamente!
         </div>
      )}
    </form>
  );
}
