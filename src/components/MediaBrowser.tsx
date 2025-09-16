import React, { useState, useEffect } from "react";
import { Play, Upload, Library, Triangle, UploadIcon, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import VideoPreview from "@/pages/VideoPreview";

interface MediaBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect?: (file: File) => void;
  referenceDuration?: string | null;
  isEditMode?: boolean;
}

const MediaBrowser: React.FC<MediaBrowserProps> = ({ open, onOpenChange, onFileSelect, referenceDuration, isEditMode = false }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Library");
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreviewOpen, setVideoPreviewOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const { toast } = useToast();

  // Clear selected video when MediaBrowser opens
  useEffect(() => {
    if (open) {
      setSelectedVideo(null);
    }
  }, [open]);

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
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Matrix Scene",
      subtitle: "Uploaded: 92 days ago", 
      duration: "03:45",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
    },
  ];

  const silkeVideos = [
    {
      id: 1,
      title: "SilkeVod",
      subtitle: "Slike ID: 1xv3dgq9z9",
      duration: "05:02",
      thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Matrix Scene",
      subtitle: "Slike ID: 2bw8kx7p4m", 
      duration: "03:45",
      thumbnail: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop"
    },
  ];

  const uploadsVideos = [
    {
      id: 1,
      title: "Upload Video 1",
      subtitle: "Uploaded: 2 days ago",
      duration: "02:15",
      thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Upload Video 2",
      subtitle: "Uploaded: 5 days ago", 
      duration: "04:30",
      thumbnail: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=400&h=300&fit=crop"
    },
  ];

  const handleFileUpload = async () => {
    try {
      setIsUploading(true);
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*,image/*,.mp4,.mov,.avi,.mkv,.webm,.jpg,.jpeg,.png,.gif';
      input.multiple = false;
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // Validate file size (max 100MB for videos)
          const maxSize = 100 * 1024 * 1024; // 100MB
          if (file.size > maxSize) {
            alert('File size too large. Please select a file under 100MB.');
            setIsUploading(false);
            return;
          }
          
          // Validate file type
          const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
          if (!validTypes.some(type => file.type.includes(type.split('/')[1]) || file.name.toLowerCase().includes(type.split('/')[1]))) {
            alert('Please select a valid video or image file.');
            setIsUploading(false);
            return;
          }
          
          // Generate a random duration for demo purposes (in real app, this would be extracted from video)
          const mockDuration = "00:30"; // In real app, you'd extract actual duration
          
          // Check duration validation for uploads if reference duration exists
          if (referenceDuration && mockDuration !== referenceDuration) {
            toast({
              title: "Duration Mismatch",
              description: "Please select a video with the same duration as your first selected video.",
              variant: "destructive",
            });
            setIsUploading(false);
            return;
          }
          
          // Clear any previously selected video and set new uploaded file
          setSelectedVideo({
            title: file.name,
            duration: mockDuration,
            subtitle: `Uploaded: ${new Date().toLocaleDateString()}`,
            fileSize: Math.round(file.size / (1024 * 1024)) + 'MB',
            isUploadedFile: true // Mark as uploaded file to distinguish from library videos
          });
          setVideoPreviewOpen(true);
          
          if (onFileSelect) {
            await onFileSelect(file);
          }
        }
        setIsUploading(false);
      };
      
      input.oncancel = () => {
        setIsUploading(false);
      };
      
      input.click();
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      alert('Upload failed. Please try again.');
    }
  };

  const handleBack = () => {
    onOpenChange(false);
  };

  // Clear selected video when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedVideo(null);
    }
  }, [open]);

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
              <div className="flex items-center gap-1">
                <div className="flex-1">
                  <Input
                    placeholder="Enter URL"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="h-10 border-2 border-gray-300 bg-white font-medium text-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-10 w-10 p-0 border-2 border-gray-300 bg-white hover:bg-gray-50"
                    onClick={() => {
                      const urlVideoDuration = "00:30"; // In real app, you'd extract duration from URL
                      
                      // Check duration validation for URL videos if reference duration exists
                      if (referenceDuration && urlVideoDuration !== referenceDuration) {
                        toast({
                          title: "Duration Mismatch",
                          description: "Please select a video with the same duration as your first selected video.",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      setSelectedVideo({ title: "URL Video", duration: urlVideoDuration, subtitle: "From URL" });
                      setVideoPreviewOpen(true);
                    }}
                  >
                    <Play className="h-4 w-4 stroke-2" strokeWidth={2} />
                  </Button>
                  
                  <span className="text-sm font-medium text-gray-600">– OR –</span>
                  
                  <Button 
                    size="sm" 
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="h-10 bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-800 font-medium disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                  >
                    <Upload className={cn("h-4 w-4 mr-2 stroke-2", isUploading && "animate-pulse")} strokeWidth={2} />
                    {isUploading ? "Uploading..." : "Upload"}
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
                  <div className="grid grid-cols-3 gap-4 pr-4">
                    {silkeVideos.map((video) => (
                      <div 
                        key={video.id} 
                        className="bg-white border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-20 bg-gray-200 border-b-2 border-gray-300 overflow-hidden">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 bg-white/20 border border-white/30 hover:bg-white/30 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Check duration validation
                                if (referenceDuration && video.duration !== referenceDuration) {
                                  toast({
                                    title: "Duration Mismatch",
                                    description: "Please select a video with the same duration as your first selected video.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setSelectedVideo(video);
                                setVideoPreviewOpen(true);
                              }}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 bg-white/20 border border-white/30 hover:bg-white/30 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Check duration validation
                                if (referenceDuration && video.duration !== referenceDuration) {
                                  toast({
                                    title: "Duration Mismatch",
                                    description: "Please select a video with the same duration as your first selected video.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setSelectedVideo(video);
                                setVideoPreviewOpen(true);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
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
                ) : selectedTab === "Uploads" ? (
                  <div className="grid grid-cols-3 gap-4 pr-4">
                    {uploadsVideos.map((video) => (
                      <div 
                        key={video.id} 
                        className="bg-white border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-20 bg-gray-200 border-b-2 border-gray-300 overflow-hidden">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 bg-white/20 border border-white/30 hover:bg-white/30 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Check duration validation
                                if (referenceDuration && video.duration !== referenceDuration) {
                                  toast({
                                    title: "Duration Mismatch",
                                    description: "Please select a video with the same duration as your first selected video.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setSelectedVideo(video);
                                setVideoPreviewOpen(true);
                              }}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 bg-white/20 border border-white/30 hover:bg-white/30 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Check duration validation
                                if (referenceDuration && video.duration !== referenceDuration) {
                                  toast({
                                    title: "Duration Mismatch",
                                    description: "Please select a video with the same duration as your first selected video.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setSelectedVideo(video);
                                setVideoPreviewOpen(true);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
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
                        className="bg-white border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-20 bg-gray-200 border-b-2 border-gray-300 overflow-hidden">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 bg-white/20 border border-white/30 hover:bg-white/30 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Check duration validation
                                if (referenceDuration && video.duration !== referenceDuration) {
                                  toast({
                                    title: "Duration Mismatch",
                                    description: "Please select a video with the same duration as your first selected video.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setSelectedVideo(video);
                                setVideoPreviewOpen(true);
                              }}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 bg-white/20 border border-white/30 hover:bg-white/30 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Check duration validation
                                if (referenceDuration && video.duration !== referenceDuration) {
                                  toast({
                                    title: "Duration Mismatch",
                                    description: "Please select a video with the same duration as your first selected video.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setSelectedVideo(video);
                                setVideoPreviewOpen(true);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
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
            <div className="border-t-2 border-gray-300 p-4 bg-white flex justify-start">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="px-6 py-2 h-10 border-2 border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50"
              >
                BACK
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      
      <VideoPreview
        open={videoPreviewOpen}
        onOpenChange={setVideoPreviewOpen}
        videoData={selectedVideo}
        onUseVideo={(trimmedDuration) => {
          if (selectedVideo) {
            // Use trimmed duration if available, otherwise use original duration
            const finalDuration = trimmedDuration || selectedVideo.duration;
            
            // Convert to MM:SS format for consistency
            const formatDuration = (duration: string) => {
              if (duration.includes(':')) {
                const parts = duration.split(':');
                if (parts.length === 3) {
                  // HH:MM:SS -> MM:SS
                  const hours = parseInt(parts[0]);
                  const minutes = parseInt(parts[1]);
                  const seconds = parseInt(parts[2]);
                  const totalMinutes = hours * 60 + minutes;
                  return `${totalMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
                return duration; // Already MM:SS format
              }
              return duration;
            };
            
            const formattedDuration = formatDuration(finalDuration);
            
            // Check duration validation before using video
            if (referenceDuration && formattedDuration !== referenceDuration) {
              toast({
                title: "Duration Mismatch",
                description: "Please select a video with the same duration as your first selected video.",
                variant: "destructive",
              });
              return;
            }
            
            // Add video to upload queue
            const uploadQueue = JSON.parse(localStorage.getItem('uploadQueue') || '[]');
            const newUpload = {
              id: Date.now(),
              title: selectedVideo.title,
              duration: formattedDuration,
              originalDuration: selectedVideo.duration,
              trimmedDuration: trimmedDuration && trimmedDuration !== selectedVideo.duration ? trimmedDuration : undefined,
              source: 'Library',
              progress: 0,
              status: 'uploading',
              simulationStarted: false,
              timestamp: new Date().toISOString()
            };
            uploadQueue.push(newUpload);
            localStorage.setItem('uploadQueue', JSON.stringify(uploadQueue));
            
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('uploadQueueUpdated', { 
              detail: { uploadQueue } 
            }));
            
            // Only navigate to campaign manager if NOT in edit mode
            if (!isEditMode) {
              navigate('/campaign-manager');
            }
          }
          onOpenChange(false);
        }}
      />
    </Dialog>
  );
};

export default MediaBrowser;