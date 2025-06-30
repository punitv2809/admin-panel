import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router"
import { useBreadcrumbStore } from "./ui/stores/breadcrumb"
import React from "react"
import { Toaster } from "./ui/sonner"

export default function Layout() {
    const breadcrumbItems = useBreadcrumbStore((state) => state.items)
    const headerContent = useBreadcrumbStore((state) => state.headerContent)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex pr-3 h-16 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="grow flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbItems.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem className={index !== breadcrumbItems.length - 1 ? "hidden md:block" : ""}>
                                            {item.href ? (
                                                <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                            )}
                                        </BreadcrumbItem>
                                        {index < breadcrumbItems.length - 1 && (
                                            <BreadcrumbSeparator className="hidden md:block" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="">
                        {headerContent}
                    </div>
                </header>
                <div className="flex flex-1 flex-col">
                    <Outlet />
                    <Toaster />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
