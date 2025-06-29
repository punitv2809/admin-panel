// stores/app-selector.ts
import { create } from 'zustand'

type AppType = "admin" | "docs"

type AppSelectorState = {
  currentApp: AppType
  setApp: (app: AppType) => void
}

export const useAppSelector = create<AppSelectorState>((set) => ({
  currentApp: "admin",
  setApp: (app) => set({ currentApp: app }),
}))
