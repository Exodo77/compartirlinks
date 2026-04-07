import { ExternalLink } from "lucide-react";
import { LinkItem } from "@/app/actions/links";

export default function LinkCard({ link }: { link: LinkItem }) {
  const date = new Date(link.createdAt).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group glass-card rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-white/[0.02] active:scale-[0.98] transition-all block relative overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500/0 group-hover:bg-emerald-500/50 transition-colors" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-zinc-100 font-semibold truncate group-hover:text-emerald-400 transition-colors">
            {link.title || link.url}
          </h4>
          <p className="text-zinc-500 text-sm truncate mt-1 group-hover:text-zinc-400 transition-colors">
            {link.url}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 transition-colors">
          <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
        </div>
      </div>
      <div className="mt-6 text-xs text-zinc-600 font-medium">
        Agregado el {date}
      </div>
    </a>
  );
}
