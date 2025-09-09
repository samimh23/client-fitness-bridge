import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Dumbbell, Apple, UserRound, Power } from "lucide-react";
import { AuthService } from "@/lib/auth";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Workouts", url: "/workouts", icon: Dumbbell },
  { title: "Nutrition", url: "/nutrition", icon: Apple },
  { title: "Profile", url: "/profile", icon: UserRound },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUserEmail(user.email || "Coach");
        setUserName(user.name || "Coach");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    AuthService.logout();
    toast.success("Successfully disconnected from CoachPro");
    navigate("/login");
  };

  const getNavCls = (active: boolean) =>
    active 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-accent hover:text-accent-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent className="bg-background border-r border-border/50">
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold gradient-text">CoachPro</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => 
                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${getNavCls(isActive)}`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-border/50">
          {collapsed ? (
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white text-xs">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-accent/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Power className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}