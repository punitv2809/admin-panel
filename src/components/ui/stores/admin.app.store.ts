import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'

// ✅ Zod schema for server
export const backendServerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  host: z.string().min(1, "Host is required"),
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  pingPath: z.string().min(1, "Ping path is required").startsWith("/", "Ping path must start with '/'"),
  inUse: z.boolean().optional(),
})

// 👇 Infer the TypeScript type
export type BackendServer = z.infer<typeof backendServerSchema>

type AdminAppState = {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void

  backendServers: BackendServer[]
  addServer: (server: BackendServer) => void
  updateServer: (index: number, updated: Partial<BackendServer>) => void
  removeServer: (index: number) => void
  resetServers: () => void
}

export const useAdminAppStore = create<AdminAppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),

      backendServers: [],
      addServer: (server) => {
        const validated = backendServerSchema.safeParse(server)
        if (!validated.success) {
          console.error("Invalid server:", validated.error)
          return
        }
        set((state) => ({
          backendServers: [...state.backendServers, server],
        }))
      },
      updateServer: (index, updated) => {
        set((state) => {
          const updatedList = [...state.backendServers]
          updatedList[index] = { ...updatedList[index], ...updated }
          return { backendServers: updatedList }
        })
      },
      removeServer: (index) => {
        set((state) => ({
          backendServers: state.backendServers.filter((_, i) => i !== index),
        }))
      },
      resetServers: () => set({ backendServers: [] }),
    }),
    {
      name: "admin-app-backend-servers", // localStorage key
      partialize: (state) => ({
        backendServers: state.backendServers,
      }),
    }
  )
)
