import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Store,
  Users,
  Shield,
  Database,
  FileText,
  HelpCircle,
  Code,
  Plus,
  List,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAppSelector } from "./ui/stores/app.selectors"
import { useAdminAppStore } from "./ui/stores/admin.app.store"

const data = {
  teams: [
    {
      name: "Admin Panel",
      logo: GalleryVerticalEnd,
      plan: "beta-1.0",
    },
    {
      name: "Docs",
      logo: AudioWaveform,
      plan: "Startup",
    }
  ],
  // 🟨 Multi-app navigation (top-level)
  navMain: [
    {
      app: "admin",
      icon: SquareTerminal,
      sections: [
        {
          title: "Management",
          icon: Shield,
          items: [
            {
              title: "Dashboard",
              url: "/app/admin/dashboard",
              icon: SquareTerminal,
            },
            {
              title: "Users",
              url: "/app/admin/users",
              icon: Users,
            },
            {
              title: "Analytics",
              url: "/app/admin/analytics",
              icon: PieChart,
            },
          ],
        },
        {
          title: "Channels",
          icon: Store,
          items: [
            {
              title: "List",
              url: "/app/admin/channels",
              icon: List,
            },
            {
              title: "Create",
              url: "/app/admin/channels/create",
              icon: Plus,
            }
          ]
        },
        {
          title: "Apps",
          icon: Code,
          items: [
            {
              title: "List",
              url: "/app/admin/apps",
              icon: List,
            },
            {
              title: "Create",
              url: "/app/admin/apps/create",
              icon: Plus,
            }
          ]
        },
        {
          title: "System",
          icon: Settings2,
          items: [
            {
              title: "Settings",
              url: "/app/admin/settings",
              icon: Settings2,
            },
            {
              title: "Database",
              url: "/app/admin/database",
              icon: Database,
            },
            {
              title: "Logs",
              url: "/app/admin/logs",
              icon: FileText,
            },
          ],
        },
        {
          title: "Support",
          icon: HelpCircle,
          url: "/app/admin/support",
        },
      ],
    },
    {
      app: "docs",
      icon: BookOpen,
      sections: [
        {
          title: "Guides",
          icon: BookOpen,
          items: [
            {
              title: "Introduction",
              url: "/app/docs/introduction",
              icon: BookOpen,
            },
            {
              title: "Get Started",
              url: "/app/docs/get-started",
              icon: BookOpen,
            },
          ],
        },
        {
          title: "Resources",
          icon: FileText,
          items: [
            {
              title: "Tutorials",
              url: "/app/docs/tutorials",
              icon: BookOpen,
            },
            {
              title: "Changelog",
              url: "/app/docs/changelog",
              icon: FileText,
            },
          ],
        },
        {
          title: "API Reference",
          icon: Code,
          url: "/app/docs/api",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/app/admin/design",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/app/admin/sales",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/app/admin/travel",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentApp = useAppSelector((s) => s.currentApp)
  const user = useAdminAppStore((s) => s.user)
  const appNav = data.navMain.find((nav) => nav.app === currentApp)

  const navItems = appNav?.sections.map((section) => ({
    title: section.title,
    url: section.url || "#",
    icon: section.icon,
    isActive: false,
    hasSubsections: !!section.items,
    items: section.items?.map((item) => ({
      title: item.title,
      url: item.url,
      icon: item.icon,
    })) || [],
  })) || []

  const filteredProjects = currentApp === "admin" ? data.projects : []

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavProjects projects={filteredProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
