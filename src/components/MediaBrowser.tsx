import React, { useState } from "react";
import { Play, Upload, Library, Triangle, UploadIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    },
    {
      id: 2,
      title: "Matrix Scene",
      subtitle: "Uploaded: 92 days ago", 
      duration: "03:45",
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
      <DialogContent className="max-w-6xl h-[80vh] p-0 overflow-hidden bg-white border-2 border-gray-300">
        <DialogHeader className="sr-only">
          <DialogTitle>Media Browser</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-56 bg-gray-100 border-r-2 border-gray-300">
            <div className="p-4">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium border transition-colors",
                        selectedTab === item.id
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <IconComponent className="h-4 w-4 stroke-2" strokeWidth={2} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Top Bar */}
            <div className="border-b-2 border-gray-300 p-4">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Enter URL"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="h-10 border-2 border-gray-300 bg-white font-medium text-sm"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-10 w-10 p-0 border-2 border-gray-300 bg-white hover:bg-gray-50"
                  >
                    <Play className="h-4 w-4 stroke-2" strokeWidth={2} />
                  </Button>
                  
                  <span className="text-sm font-medium text-gray-600 mx-2">– OR –</span>
                  
                  <Button 
                    size="sm" 
                    onClick={handleFileUpload} 
                    className="h-10 bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-800 font-medium"
                  >
                    <Upload className="h-4 w-4 mr-2 stroke-2" strokeWidth={2} />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b-2 border-gray-300 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 stroke-2" strokeWidth={2} />
                <Input
                  placeholder={selectedTab === "Silke" ? "Search By Title/ Slike ID" : "Search By Title"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-2 border-gray-300 bg-white font-medium text-sm"
                />
              </div>
            </div>

            {/* Video Cards */}
            <div className="flex-1 p-6 bg-gray-50">
              <ScrollArea className="h-full pr-4">
                <div className="pr-2">
                {selectedTab === "Silke" ? (
                  <div className="grid grid-cols-2 gap-4 pr-4">
                    {[
                      {
                        id: 1,
                        title: "SilkeVod",
                        subtitle: "Slike ID: 1xv3dgq9z9",
                        duration: "05:02",
                      },
                      {
                        id: 2,
                        title: "Matrix Scene",
                        subtitle: "Slike ID: 2bw8kx7p4m", 
                        duration: "03:45",
                      },
                    ].map((video) => (
                      <div 
                        key={video.id} 
                        className="bg-white border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        {/* Thumbnail placeholder */}
                        <div className="relative h-24 bg-gray-200 border-b-2 border-gray-300 flex items-center justify-center">
                          <div className="w-12 h-12 border-2 border-gray-400 bg-white flex items-center justify-center">
                            <Play className="h-5 w-5 text-gray-600 stroke-2" strokeWidth={2} />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-gray-900 text-white text-xs px-1 py-0.5 font-medium border border-gray-900">
                            {video.duration}
                          </div>
                        </div>
                        
                        {/* Card content */}
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 mb-1 text-xs truncate">{video.title}</h3>
                          <p className="text-xs text-gray-600 font-medium truncate">{video.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 pr-4">
                    {videoCards.map((video) => (
                      <div 
                        key={video.id} 
                        className="bg-white border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        {/* Thumbnail placeholder */}
                        <div className="relative h-20 bg-gray-200 border-b-2 border-gray-300 flex items-center justify-center">
                          <div className="w-10 h-10 border-2 border-gray-400 bg-white flex items-center justify-center">
                            <Play className="h-4 w-4 text-gray-600 stroke-2" strokeWidth={2} />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-gray-900 text-white text-xs px-1 py-0.5 font-medium border border-gray-900">
                            {video.duration}
                          </div>
                        </div>
                        
                        {/* Card content */}
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 mb-1 text-xs truncate">{video.title}</h3>
                          <p className="text-xs text-gray-600 font-medium truncate">{video.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </ScrollArea>
            </div>

            {/* Bottom Buttons */}
            <div className="border-t-2 border-gray-300 p-4 bg-white flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="px-6 py-2 h-10 border-2 border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50"
              >
                BACK
              </Button>
              <Button 
                disabled 
                className="px-6 py-2 h-10 bg-gray-300 text-gray-500 border-2 border-gray-300 cursor-not-allowed font-medium"
              >
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