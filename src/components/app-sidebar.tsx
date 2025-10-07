"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ChevronRight, ChevronLeft } from "lucide-react"
import {
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { ProductionService } from "@/lib/services"

const data = {
  navSecondary: [
    { /* Tutorials / contact email */
      title: "Help",
      url: "mailto:contact@gaialith.com",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar()
  const params = useParams()
  const [dashboardUrl, setDashboardUrl] = useState<string>("/")

  useEffect(() => {
    const currentId = (params as any)?.id
    if (currentId) {
      setDashboardUrl(`/production/${currentId}`)
      return
    }
    let isMounted = true
    ProductionService.getAll()
      .then((productions) => {
        if (!isMounted) return
        const first = productions?.[0]
        setDashboardUrl(first?.id ? `/production/${first.id}` : "/")
      })
      .catch(() => {
        if (!isMounted) return
        setDashboardUrl("/")
      })
    return () => {
      isMounted = false
    }
  }, [params])

  const navMainItems = useMemo(
    () => [
      {
        title: "Dashboard",
        url: dashboardUrl,
        icon: IconDashboard,
      },
      {
        title: "Team",
        url: "/team",
        icon: IconListDetails,
      },
    ],
    [dashboardUrl]
  )

  return (
    <>
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/" className="flex items-center gap-2 mt-2">
                <div className="brand-container">
                  <span className="brand-text-modern">PaperworkPRO</span>
                  <div className="brand-accent"></div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-10 gap-5">
        <NavMain items={navMainItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
    {/* Floating toggle outside the sliding container so it remains clickable when collapsed */}
    <button
      type="button"
      aria-label={state === "collapsed" ? "Open sidebar" : "Close sidebar"}
      onClick={toggleSidebar}
      className={`sidebar-toggle-button fixed top-1/2 -translate-y-1/2 z-50 hidden md:flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow hover:bg-slate-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        state === "collapsed" ? "left-2" : "left-[calc(var(--sidebar-width)-2rem)]"
      }`}
    >
      {state === "collapsed" ? (
        <ChevronRight className="sidebar-toggle-icon h-4 w-4" />
      ) : (
        <ChevronLeft className="sidebar-toggle-icon h-4 w-4" />
      )}
    </button>
    </>
  )
}
