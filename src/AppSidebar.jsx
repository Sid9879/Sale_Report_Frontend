"use client";

import {
  Home,
  LayoutDashboard,
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";
import { PackagePlus } from "lucide-react";
import { logOutUser } from "./store/userSlice";

export function AppSidebar() {
  let dispatch = useDispatch();
  let userStore = useSelector((state) => state.user);
  let Authenticated = userStore.isAuthenticated;
  console.log(Authenticated)
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const logoutUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8090/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.msg || "Logout Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.msg || error.response?.data.error || "Something went a wrong");
    }
  };

  return (
    <Sidebar className="flex flex-col justify-between h-full">
      <SidebarContent className="flex-1">
        {/* Application Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">
            {userStore?.user?.name}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Home Menu Item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Dashboard Menu Item */}
            { userStore.user?.isAdmin&& <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/allEmployee">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>}

              {/* Products Menu Item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/products">
                    <ShoppingCart />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Sale Menu Item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/sales">
                    <TrendingUp />
                    <span>Sale</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Add Products Menu Item */}
             { userStore.user?.isAdmin&&<SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/addProducts">
                    <PackagePlus />
                    <span>Add Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom User Section */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
           {Authenticated&&<SidebarMenu>
              {/* Profile toggle */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  <User />
                  <span>Profile</span>
                  {showProfileMenu ? <ChevronUp className="ml-auto" /> : <ChevronDown className="ml-auto" />}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {showProfileMenu && (
                <>
                  <SidebarMenuItem className="ml-6">
                    <SidebarMenuButton asChild>
                      <Link to="/profile">
                        <Eye />
                        <span>View Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                 {userStore.user?.isAdmin&&<SidebarMenuItem className="ml-6">
                    <SidebarMenuButton asChild>
                      <Link to="/addEmployee">
                        <UserPlus />
                        <span>Add Employee</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>}
                  <SidebarMenuItem className="ml-6">
                    <SidebarMenuButton asChild>
                      <Link
                        to="/login"
                        onClick={async() => {
                         await logoutUser();
                          dispatch(logOutUser());
                        }}
                      >
                        <LogOut />
                        <span>Logout</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* Login */}
            {Authenticated===false&&<SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/login">
                    <LogIn />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>}

             
            </SidebarMenu>}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
