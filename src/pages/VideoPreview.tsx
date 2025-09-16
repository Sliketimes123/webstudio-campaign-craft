import React, { useState, useEffect } from "react";
import { Play, Volume2, Maximize, Settings, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VideoPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoData?: {
    title: string;
    duration: string;
    subtitle: string;
  };
  onUseVideo?: (trimmedDuration?: string) => void;
}

const VideoPreview = ({ open, onOpenChange, videoData, onUseVideo }: VideoPreviewProps) => {
  // State for trim markers
  const [inTime, setInTime] = useState("00:00:00");
  const [outTime, setOutTime] = useState("00:00:00");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Convert time string to seconds for position calculation
  const timeToSeconds = (timeStr: string) => {
    if (!timeStr || timeStr === '') return 0;
    const parts = timeStr.split(':');
    if (parts.length === 1) {
      // Only seconds provided
      return Math.max(0, Math.min(parseInt(parts[0]) || 0, videoDuration));
    } else if (parts.length === 2) {
      // Minutes:seconds provided
      const minutes = Math.max(0, parseInt(parts[0]) || 0);
      const seconds = Math.max(0, parseInt(parts[1]) || 0);
      return Math.min(minutes * 60 + seconds, videoDuration);
    } else if (parts.length === 3) {
      // Hours:minutes:seconds provided
      const hours = Math.max(0, parseInt(parts[0]) || 0);
      const minutes = Math.max(0, parseInt(parts[1]) || 0);
      const secs = Math.max(0, parseInt(parts[2]) || 0);
      return Math.min(hours * 3600 + minutes * 60 + secs, videoDuration);
    }
    return 0;
  };
  
  // Convert seconds to time string
  const secondsToTime = (seconds: number) => {
    const clampedSeconds = Math.max(0, Math.min(seconds, videoDuration));
    const hours = Math.floor(clampedSeconds / 3600);
    const minutes = Math.floor((clampedSeconds % 3600) / 60);
    const secs = Math.floor(clampedSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Parse video duration from the videoData
  const videoDuration = videoData?.duration ? 
    (() => {
      const parts = videoData.duration.split(':');
      if (parts.length === 2) {
        // MM:SS format
        const [minutes, seconds] = parts.map(Number);
        return minutes * 60 + seconds;
      } else if (parts.length === 3) {
        // HH:MM:SS format
        const [hours, minutes, seconds] = parts.map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      }
      return 30; // Default fallback
    })() : 30; // Default to 30 seconds
  
  // Calculate marker positions as percentages
  const inPosition = (timeToSeconds(inTime) / videoDuration) * 100;
  const outPosition = (timeToSeconds(outTime) / videoDuration) * 100;
  
  // Calculate trimmed duration
  const trimmedDuration = () => {
    const inSeconds = timeToSeconds(inTime);
    const outSeconds = timeToSeconds(outTime);
    const trimmed = Math.max(0, outSeconds - inSeconds);
    return secondsToTime(trimmed);
  };
  
  // Format duration for display (MM:SS for videos under 1 hour)
  const formatDurationForDisplay = (timeStr: string) => {
    const seconds = timeToSeconds(timeStr);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };
  
  // Initialize out time to full duration when video data changes
  useEffect(() => {
    if (videoData?.duration) {
      const parts = videoData.duration.split(':');
      let totalSeconds = 30; // Default fallback
      
      if (parts.length === 2) {
        // MM:SS format
        const [minutes, seconds] = parts.map(Number);
        totalSeconds = minutes * 60 + seconds;
      } else if (parts.length === 3) {
        // HH:MM:SS format
        const [hours, minutes, seconds] = parts.map(Number);
        totalSeconds = hours * 3600 + minutes * 60 + seconds;
      }
      
      setOutTime(secondsToTime(totalSeconds));
    }
  }, [videoData]);
  
  // Handle time input changes with proper validation
  const handleInTimeChange = (value: string) => {
    // Validate time format (HH:MM:SS)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (timeRegex.test(value) || value === "00:00:00") {
      setInTime(value);
      const inSeconds = timeToSeconds(value);
      const outSeconds = timeToSeconds(outTime);
      
      if (inSeconds >= outSeconds) {
        // If in time is after or equal to out time, adjust out time
        const newOutSeconds = Math.min(inSeconds + 1, videoDuration);
        setOutTime(secondsToTime(newOutSeconds));
      }
    } else if (value.length <= 8) {
      // Allow partial input while typing
      setInTime(value);
    }
  };
  
  const handleOutTimeChange = (value: string) => {
    // Validate time format (HH:MM:SS)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (timeRegex.test(value) || value === "00:00:00") {
      setOutTime(value);
      const inSeconds = timeToSeconds(inTime);
      const outSeconds = timeToSeconds(value);
      
      if (outSeconds <= inSeconds) {
        // If out time is before or equal to in time, adjust in time
        const newInSeconds = Math.max(outSeconds - 1, 0);
        setInTime(secondsToTime(newInSeconds));
      }
    } else if (value.length <= 8) {
      // Allow partial input while typing
      setOutTime(value);
    }
  };

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
                     <Label htmlFor="inTime" className="text-sm font-medium text-muted-foreground mb-2 block">
                       In Time
                     </Label>
                     <div className="relative">
                       <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                       <Input
                         id="inTime"
                         type="text"
                         placeholder="00:00:00"
                         maxLength={8}
                         className="pl-10 pr-3 py-2 w-full border border-input rounded-md bg-background text-sm font-mono"
                         value={inTime}
                         onChange={(e) => {
                           let value = e.target.value;
                           // Auto-format as user types
                           if (value.length === 2 && !value.includes(':')) {
                             value = value + ':';
                           } else if (value.length === 5 && value.split(':').length === 2) {
                             value = value + ':';
                           }
                           handleInTimeChange(value);
                         }}
                         onBlur={(e) => {
                           // Ensure proper format on blur
                           const value = e.target.value;
                           if (value && value.length < 8) {
                             const parts = value.split(':');
                             if (parts.length === 1) {
                               setInTime('00:00:' + parts[0].padStart(2, '0'));
                             } else if (parts.length === 2) {
                               setInTime('00:' + parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0'));
                             }
                           }
                         }}
                       />
                     </div>
                   </div>
                   <div>
                     <Label htmlFor="outTime" className="text-sm font-medium text-muted-foreground mb-2 block">
                       Out Time
                     </Label>
                     <div className="relative">
                       <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                       <Input
                         id="outTime"
                         type="text"
                         placeholder="00:00:00"
                         maxLength={8}
                         className="pl-10 pr-3 py-2 w-full border border-input rounded-md bg-background text-sm font-mono"
                         value={outTime}
                         onChange={(e) => {
                           let value = e.target.value;
                           // Auto-format as user types
                           if (value.length === 2 && !value.includes(':')) {
                             value = value + ':';
                           } else if (value.length === 5 && value.split(':').length === 2) {
                             value = value + ':';
                           }
                           handleOutTimeChange(value);
                         }}
                         onBlur={(e) => {
                           // Ensure proper format on blur
                           const value = e.target.value;
                           if (value && value.length < 8) {
                             const parts = value.split(':');
                             if (parts.length === 1) {
                               setOutTime('00:00:' + parts[0].padStart(2, '0'));
                             } else if (parts.length === 2) {
                               setOutTime('00:' + parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0'));
                             }
                           }
                         }}
                       />
                     </div>
                   </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Trimmed Duration:</span>
                    <span className="text-sm font-bold text-blue-900">{formatDurationForDisplay(trimmedDuration())}</span>
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
                  <h3 className="font-medium text-muted-foreground mb-2">Original Duration</h3>
                  <p className="text-lg">{videoData?.duration || "00:00"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Trimmed Duration</h3>
                  <p className="text-lg font-bold text-blue-600">{formatDurationForDisplay(trimmedDuration())}</p>
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
                      // Only pass trimmed duration if video was actually trimmed
                      const isTrimmed = inTime !== "00:00:00" || outTime !== secondsToTime(videoDuration);
                      onUseVideo(isTrimmed ? trimmedDuration() : undefined);
                    }
                    onOpenChange(false);
                  }}
                >
                  Use This Video ({formatDurationForDisplay(trimmedDuration())})
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