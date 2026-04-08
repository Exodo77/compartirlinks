import { getUsers, deleteUser, isAdmin } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { Users, ArrowLeft, Trash2, ShieldAlert } from "lucide-react";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/");
  }

  const users = await getUsers();

  return (
    <div className="min-h-screen pb-20 relative">
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-6 pt-12 relative z-10">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center ring-1 ring-indigo-500/20 backdrop-blur-md">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Panel de Administración</h1>
          </div>
          
          <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors border border-white/10 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver a la Pizarra</span>
          </a>
        </header>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-zinc-400" />
            <h3 className="text-xl font-semibold text-zinc-200">Usuarios Registrados ({users.length})</h3>
          </div>

          <div className="glass-card rounded-2xl p-2 sm:p-4 relative overflow-hidden">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500 font-medium">No hay ningún otro usuario registrado todavía.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {users.map((username) => (
                  <div key={username} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold text-xs uppercase">{username.substring(0, 2)}</span>
                      </div>
                      <span className="text-zinc-200 font-medium">{username}</span>
                    </div>

                    {username !== "waltter87" && username !== "logged_in" && (
                      <form action={deleteUser}>
                        <input type="hidden" name="username" value={username} />
                        <button 
                          type="submit" 
                          className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
