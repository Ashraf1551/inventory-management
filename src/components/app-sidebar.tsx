"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Archive,
  Box,
  Building2,
  ChevronDown,
  LayoutDashboard,
  Package,
  Tag,
  Truck,
  Warehouse,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible"

const topItemsBefore = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Box },
  { title: "Categories", url: "/product-categories", icon: Tag },
]

const topItemsAfter = [
  { title: "Warehouses", url: "/warehouses", icon: Warehouse },
  { title: "Suppliers", url: "/suppliers", icon: Building2 },
]

const inventorySubItems = [
  { title: "Low Stock", url: "/inventory/low-stock", icon: Package },
  { title: "Movements", url: "/inventory/movements", icon: Truck },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isInventoryActive = pathname === "/inventory" || pathname.startsWith("/inventory/")

  const [inventoryOpen, setInventoryOpen] = useState(isInventoryActive)

  useEffect(() => {
    if (isInventoryActive) setInventoryOpen(true)
  }, [isInventoryActive])

  const toggleInventory = useCallback(() => {
    setInventoryOpen((prev) => !prev)
  }, [])

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Inventory</span>
                <span className="text-xs text-muted-foreground">Management</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topItemsBefore.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible open={inventoryOpen} onOpenChange={setInventoryOpen}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isInventoryActive}
                    tooltip="Inventory"
                    render={<Link href="/inventory" />}
                  >
                    <Archive />
                    <span>Inventory</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction onClick={toggleInventory}>
                    <ChevronDown className={cn("transition-transform", inventoryOpen && "rotate-180")} />
                  </SidebarMenuAction>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {inventorySubItems.map((sub) => (
                        <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton
                            isActive={pathname === sub.url}
                            render={<Link href={sub.url} />}
                          >
                            <sub.icon />
                            <span>{sub.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {topItemsAfter.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
