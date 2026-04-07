"use client";

import { useActionState } from "react";
import { login, loginAsGuest } from "@/app/actions/auth";
import { Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await login(formData);
    },
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="w-full max-w-md z-10">
        <div className="glass-card rounded-2xl p-8 space-y-8 relative overflow-hidden">
          {/* Edge highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10 shadow-lg">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Bienvenido</h1>
            <p className="text-zinc-400 text-sm">Inicia sesión en tu pizarra privada</p>
          </div>

          <form action={formAction} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="username">
                  Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="Ej. waltter87"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state?.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-zinc-900 hover:bg-zinc-100 disabled:opacity-70 disabled:cursor-not-allowed font-medium rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 group"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
              ) : (
                <>
                  Entrar a la Pizarra
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Botón de Invitado */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="w-full flex items-center gap-3">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="text-xs text-zinc-600 font-medium uppercase">o</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>
            
            <form action={loginAsGuest} className="w-full">
              <button
                type="submit"
                className="w-full bg-zinc-900/50 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/30 font-medium rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2"
              >
                Entrar como Invitado
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
