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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      sections: [
        {
          title: "Management",
          items: [
            {
              title: "Dashboard",
              url: "/app/admin/dashboard",
              icon: SquareTerminal,
            },
            {
              title: "Users",
              url: "/app/admin/users",
              icon: Bot,
            },
          ],
        },
        {
          title: "System",
          items: [
            {
              title: "Settings",
              url: "/app/admin/settings",
              icon: Settings2,
            },
          ],
        },
      ],
    },
    {
      app: "docs",
      sections: [
        {
          title: "Guides",
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
          items: [
            {
              title: "Tutorials",
              url: "/app/docs/tutorials",
              icon: BookOpen,
            },
            {
              title: "Changelog",
              url: "/app/docs/changelog",
              icon: BookOpen,
            },
          ],
        },
      ],
    },
  ]
  ,
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
  const appNav = data.navMain.find(item => item.app === currentApp)
  const filteredSections = appNav?.sections || []


  const filteredNavMain = data.navMain.filter(item => {
    return currentApp === "admin" ? item.title === "Admin Panel" : item.title === "Docs"
  })

  const filteredProjects = currentApp === "admin" ? data.projects : []

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredSections.map((section, i) => (
          <div key={i} className="mb-4">
            <h4 className="">
              {section.title}
            </h4>
            {section.items.map((item, j) => (
              <NavMain
                key={j}
                items={[{ ...item, isActive: location.pathname.startsWith(item.url) }]}
              />
            ))}
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
