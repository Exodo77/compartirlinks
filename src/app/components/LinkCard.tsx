"use client";

import { ExternalLink, Pencil, Save, X } from "lucide-react";
import { LinkItem, editLink } from "@/app/actions/links";
import { useState, useTransition } from "react";

export default function LinkCard({ link }: { link: LinkItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [isPending, startTransition] = useTransition();

  const handleSave = async () => {
    startTransition(async () => {
      const result = await editLink(link.id, title, url);
      if (result.success) {
        setIsEditing(false);
      } else {
        alert(result.error);
      }
    });
  };

  const date = new Date(link.createdAt).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });

  if (isEditing) {
    return (
      <div className="glass-card rounded-2xl p-6 border-emerald-500/50 bg-white/[0.03] transition-all relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 transition-colors" />
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            placeholder="Título..."
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isPending}
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            placeholder="URL..."
          />
          
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group glass-card rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-white/[0.02] transition-all relative overflow-hidden flex flex-col h-full">
      <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500/0 group-hover:bg-emerald-500/50 transition-colors" />
      
      <div className="flex items-start justify-between gap-4 flex-1">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 peer block"
        >
          <h4 className="text-zinc-100 font-semibold truncate hover:text-emerald-400 transition-colors">
            {link.title || link.url}
          </h4>
          <p className="text-zinc-500 text-sm truncate mt-1 hover:text-zinc-400 transition-colors">
            {link.url}
          </p>
        </a>
        
        {/* Actions Menu */}
        <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 hover:bg-emerald-500/10 transition-colors"
            title="Abrir"
          >
            <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-emerald-400 transition-colors" />
          </a>
          <button
            onClick={() => setIsEditing(true)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 hover:bg-indigo-500/10 transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4 text-zinc-400 hover:text-indigo-400 transition-colors" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/[0.05] text-xs text-zinc-600 font-medium">
        Agregado el {date}
      </div>
    </div>
  );
}
