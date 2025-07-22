import React, { useState } from "react";
import { Play, Upload, Library, Triangle, UploadIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface MediaBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect?: (file: File) => void;
}

const MediaBrowser: React.FC<MediaBrowserProps> = ({ open, onOpenChange, onFileSelect }) => {
  const [selectedTab, setSelectedTab] = useState("Library");
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { id: "Library", label: "Library", icon: Library },
    { id: "Silke", label: "Silke", icon: Triangle },
    { id: "Uploads", label: "Uploads", icon: UploadIcon },
  ];

  const videoCards = [
    {
      id: 1,
      title: "SilkeVod",
      subtitle: "Uploaded: 186 days ago",
      duration: "05:02",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=200&h=200&fit=crop&crop=center",
    },
    {
      id: 2,
      title: "Matrix Scene",
      subtitle: "Uploaded: 92 days ago", 
      duration: "03:45",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop&crop=center",
    },
  ];

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onFileSelect) {
        onFileSelect(file);
        onOpenChange(false);
      }
    };
    input.click();
  };

  const handleBack = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Media Browser</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                      selectedTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Enter URL"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="outline" className="h-9 w-9 p-0">
                    <Play className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-500 mx-2">– OR –</span>
                  
                  <Button size="sm" onClick={handleFileUpload} className="h-9">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search By Title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>

            {/* Video Cards */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-2 gap-6">
                {videoCards.map((video) => (
                  <div key={video.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                      <p className="text-sm text-gray-500">{video.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="border-t border-gray-200 p-4 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                BACK
              </Button>
              <Button disabled className="opacity-50 cursor-not-allowed">
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaBrowser;