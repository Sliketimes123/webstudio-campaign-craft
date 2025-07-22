import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Play, Pause, Volume2, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const VideoPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoData = location.state?.video;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">
            {videoData?.title || "Video Preview"}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Video Player */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-6">
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
                  <Slider
                    defaultValue={[0]}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
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

          {/* Video Information */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Video Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="flex gap-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    // Add video to upload queue and redirect
                    const videoData = location.state?.video;
                    if (videoData) {
                      // Store video data in localStorage to pass to campaign manager
                      const uploadQueue = JSON.parse(localStorage.getItem('uploadQueue') || '[]');
                      const newUpload = {
                        id: Date.now(),
                        title: videoData.title,
                        progress: 0,
                        status: 'uploading',
                        timestamp: new Date().toISOString()
                      };
                      uploadQueue.push(newUpload);
                      localStorage.setItem('uploadQueue', JSON.stringify(uploadQueue));
                    }
                    navigate('/campaign-manager');
                  }}
                >
                  Use This Video
                </Button>
                <Button variant="outline">
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;