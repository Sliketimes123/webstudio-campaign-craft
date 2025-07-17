import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Video, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: Video,
      label: "Video Storage",
      path: "/",
      isActive: location.pathname === "/"
    },
    {
      icon: Settings,
      label: "Campaign Manager", 
      path: "/campaign-manager",
      isActive: location.pathname === "/campaign-manager"
    }
  ];

  return (
    <div className="fixed left-0 top-0 w-16 h-full bg-white border-r border-slate-200 flex flex-col items-center py-6 space-y-4">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            item.isActive 
              ? "bg-blue-500 text-white" 
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          )}
          title={item.label}
        >
          <item.icon className="w-5 h-5" />
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;