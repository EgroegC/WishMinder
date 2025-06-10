import { Calendar, ChevronUp, Home, Inbox, User2 } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Account",
        url: "/account",
        icon: Inbox,
    },
    {
        title: "Upcoming Celebrations",
        url: "/upcoming/celebrations",
        icon: Calendar,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/">
                                <img className='rounded-md' src='/icons/favicon-96x96.png' alt="logo" width={20} height={20} />
                                <span>Dev</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel> Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url} >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 />Joe Doe <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger >
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-sm">Sign Out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}