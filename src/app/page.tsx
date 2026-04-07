import { getLinks } from "./actions/links";
import { logout } from "./actions/auth";
import { Link2, LogOut, Plus, Globe } from "lucide-react";
import AddLinkForm from "./components/AddLinkForm";
import LinkCard from "./components/LinkCard";

export default async function Home() {
  const links = await getLinks();

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 pt-12 relative z-10">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ring-1 ring-white/20 backdrop-blur-md">
              <Link2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Mis Links</h1>
          </div>
          
          <form action={logout}>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20 text-sm font-medium">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </form>
        </header>

        <section className="mb-16">
          <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Guardar Nuevo Enlace
            </h2>

            <AddLinkForm />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-5 h-5 text-zinc-400" />
            <h3 className="text-xl font-semibold text-zinc-200">Tu Pizarra ({links.length})</h3>
          </div>

          {links.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-zinc-400 font-medium">Aún no tienes enlaces guardados.</p>
              <p className="text-zinc-600 text-sm mt-1">Pega un enlace arriba para empezar tu colección.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
