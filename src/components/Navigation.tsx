import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  return (
    <div className="flex justify-center gap-4 mb-6">
      <Link to="/">
        <Button 
          variant={location.pathname === "/" ? "default" : "outline"}
          className={
            location.pathname === "/" 
              ? "bg-blue-500 hover:bg-blue-600 text-white" 
              : "border-slate-300 text-slate-600"
          }
        >
          Campaign Manager
        </Button>
      </Link>
      <Link to="/video-storage">
        <Button 
          variant={location.pathname === "/video-storage" ? "default" : "outline"}
          className={
            location.pathname === "/video-storage" 
              ? "bg-blue-500 hover:bg-blue-600 text-white" 
              : "border-slate-300 text-slate-600"
          }
        >
          Video Storage
        </Button>
      </Link>
    </div>
  );
};

export default Navigation;