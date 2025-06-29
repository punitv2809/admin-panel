// stores/breadcrumb.ts
import { create } from 'zustand'
import { ReactNode } from 'react'

type BreadcrumbItem = {
  title: string
  href?: string
}

type BreadcrumbState = {
  items: BreadcrumbItem[]
  setBreadcrumb: (items: BreadcrumbItem[]) => void
  headerContent: ReactNode
  setHeaderContent: (content: ReactNode) => void
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  items: [],
  setBreadcrumb: (items) => set({ items }),
  headerContent: null,
  setHeaderContent: (content) => set({ headerContent: content }),
}))
