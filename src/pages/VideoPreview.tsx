import React, { useState } from "react";
import { Play, Volume2, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VideoPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoData?: {
    title: string;
    duration: string;
    subtitle: string;
  };
  onUseVideo?: () => void;
}

const VideoPreview = ({ open, onOpenChange, videoData, onUseVideo }: VideoPreviewProps) => {
  // State for trim markers
  const [inTime, setInTime] = useState("00:00:00");
  const [outTime, setOutTime] = useState("00:00:00");
  
  // Convert time string to seconds for position calculation
  const timeToSeconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };
  
  // Assume video duration of 300 seconds (5 minutes) for demo
  const videoDuration = 300;
  
  // Calculate marker positions as percentages
  const inPosition = (timeToSeconds(inTime) / videoDuration) * 100;
  const outPosition = (timeToSeconds(outTime) / videoDuration) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {videoData?.title || "Video Preview"}
          </DialogTitle>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left Column - Video Player */}
            <div className="space-y-4">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Play className="h-8 w-8 ml-1" />
                    </div>
                    <p className="text-lg font-medium mb-2">
                      {videoData?.title || "Sample Video"}
                    </p>
                    <p className="text-sm text-white/70">
                      Duration: {videoData?.duration || "00:00"}
                    </p>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Play className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-white text-sm">0:00</span>
                      <div className="relative flex-1">
                        <Slider
                          defaultValue={[0]}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        {/* In Marker */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-green-500 rounded-sm"
                          style={{ left: `${Math.min(Math.max(inPosition, 0), 100)}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                        />
                        {/* Out Marker */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-red-500 rounded-sm"
                          style={{ left: `${Math.min(Math.max(outPosition, 0), 100)}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                        />
                      </div>
                      <span className="text-white text-sm">{videoData?.duration || "0:00"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trim Controls */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium mb-4">Trim Video</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">In Time</label>
                    <input
                      type="time"
                      step="1"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      value={inTime}
                      onChange={(e) => setInTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Out Time</label>
                    <input
                      type="time"
                      step="1"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      value={outTime}
                      onChange={(e) => setOutTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Video Information */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Video Details</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Title</h3>
                  <p className="text-lg">{videoData?.title || "Untitled Video"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Duration</h3>
                  <p className="text-lg">{videoData?.duration || "00:00"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Upload Date</h3>
                  <p className="text-lg">{videoData?.subtitle || "Unknown"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Format</h3>
                  <p className="text-lg">MP4</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button 
                  className="w-full"
                  onClick={() => {
                    if (onUseVideo) {
                      onUseVideo();
                    }
                    onOpenChange(false);
                  }}
                >
                  Use This Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreview;