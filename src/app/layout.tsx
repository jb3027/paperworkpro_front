"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserService } from "@/lib/services";
import { User } from "@/lib/mockData";
import { Folder, Settings, LogOut, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/components/ui/sidebar";
import { Button } from "@/app/components/ui/button";
import "./globals.css";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Folder,
  },
  {
    title: "Files",
    url: "/files",
    icon: Folder,
  },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await UserService.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleLogout = async () => {
    await UserService.logout();
  };

  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-[#0f172a]">
            <Sidebar className="border-r border-gray-800 bg-[#1e293b]">
              <SidebarHeader className="border-b border-gray-800 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#065f46] to-[#0d9488] rounded-lg flex items-center justify-center shadow-lg">
                    <Folder className="w-6 h-6 text-[#fafaf9]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#fafaf9] text-lg">ProDocs</h2>
                    <p className="text-xs text-gray-400">Production Files</p>
                  </div>
                </div>
              </SidebarHeader>
              
              <SidebarContent className="p-3">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`hover:bg-[#065f46] hover:text-[#fafaf9] transition-all duration-300 rounded-lg mb-1 ${
                              pathname === item.url ? 'bg-[#065f46] text-[#fafaf9]' : 'text-gray-300'
                            }`}
                          >
                            <Link href={item.url} className="flex items-center gap-3 px-4 py-3">
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {user && (
                  <SidebarGroup className="mt-6">
                    <div className="px-4 py-3 bg-[#065f46]/20 rounded-lg border border-[#065f46]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${
                          user.role === 'admin' ? 'bg-[#f59e0b]' : 
                          user.role === 'editor' ? 'bg-[#0d9488]' : 
                          'bg-gray-400'
                        }`} />
                        <span className="text-xs font-medium text-[#fafaf9] uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {user.role === 'admin' ? 'Full access' : 
                         user.role === 'editor' ? 'Can edit files' : 
                         'View only'}
                      </p>
                    </div>
                  </SidebarGroup>
                )}
              </SidebarContent>

              <SidebarFooter className="border-t border-gray-800 p-4">
                {user && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#0d9488] to-[#065f46] rounded-full flex items-center justify-center">
                        <span className="text-[#fafaf9] font-semibold text-sm">
                          {user.full_name?.charAt(0) || user.email?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#fafaf9] text-sm truncate">
                          {user.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-[#991b1b] hover:text-[#fafaf9] hover:border-[#991b1b] transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </SidebarFooter>
            </Sidebar>

            <main className="flex-1 flex flex-col">
              <header className="bg-[#1e293b] border-b border-gray-800 px-6 py-4 md:hidden">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-[#065f46] p-2 rounded-lg transition-colors duration-200 text-[#fafaf9]" />
                  <h1 className="text-xl font-semibold text-[#fafaf9]">ProDocs</h1>
                </div>
              </header>

              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}