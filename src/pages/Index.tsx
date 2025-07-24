import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, MousePointer, X, CheckCircle, Edit, Eye, MoreHorizontal, Trash2, FileVideo } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MediaBrowser from "@/components/MediaBrowser";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [repeatFrequencyEnabled, setRepeatFrequencyEnabled] = useState(false);
  const [mediaBrowserOpen, setMediaBrowserOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<any[]>([]);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [draggedVideoIndex, setDraggedVideoIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    campaignName: "",
    adType: "Video Ad",
    file: null as File | null,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    loopCampaign: false,
    loopFrequency: 1,
  });

  const existingCampaigns = ["Default", "Campaign 1", "Campaign 2", "Campaign 3"];
  const adTypes = ["Image", "L-band Ad", "U-band Ad", "Video Ad"];
  const channels = ["ET Fast", "Speaking Tree", "TOI Global", "NBT Entertainment"];
  const days = [
    { key: "S", label: "Sun" },
    { key: "M", label: "Mon" },
    { key: "T", label: "Tue" },
    { key: "W", label: "Wed" },
    { key: "T", label: "Thu" },
    { key: "F", label: "Fri" },
    { key: "S", label: "Sat" },
  ];

  // Load upload queue, video list, and persist campaign name from localStorage on component mount
  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem('uploadQueue') || '[]');
    const savedVideoList = JSON.parse(localStorage.getItem('videoList') || '[]');
    const savedCampaignName = localStorage.getItem('currentCampaignName') || '';
    
    setUploadQueue(savedQueue);
    setVideoList(savedVideoList);
    
    // Restore campaign name if it exists
    if (savedCampaignName) {
      setFormData(prev => ({ ...prev, campaignName: savedCampaignName }));
    }
    
    // Simulate upload progress for items in queue
    savedQueue.forEach((item: any, index: number) => {
      if (item.status === 'uploading') {
        simulateUploadProgress(item.id, index);
      }
    });
  }, []);

  const simulateUploadProgress = (uploadId: number, index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%
      
      setUploadQueue(prev => prev.map(item => 
        item.id === uploadId 
          ? { ...item, progress: Math.min(progress, 100) }
          : item
      ));
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadQueue(prev => {
            const updatedQueue = prev.map(item => 
              item.id === uploadId 
                ? { ...item, status: 'completed', progress: 100 }
                : item
            );
            
            // Add completed video to video list
            const completedVideo = updatedQueue.find(item => item.id === uploadId);
            if (completedVideo) {
              const newVideo = {
                id: completedVideo.id,
                name: completedVideo.title,
                source: completedVideo.source || 'Upload',
                duration: completedVideo.duration || '00:30',
                uploadedAt: new Date().toISOString(),
              };
              
              setVideoList(prevList => {
                const updatedList = [...prevList, newVideo];
                localStorage.setItem('videoList', JSON.stringify(updatedList));
                return updatedList;
              });
              
              // Hide upload progress after 2 seconds
              setTimeout(() => {
                setUploadQueue(prev => prev.filter(item => item.id !== uploadId));
                const currentQueue = JSON.parse(localStorage.getItem('uploadQueue') || '[]');
                const filteredQueue = currentQueue.filter((item: any) => item.id !== uploadId);
                localStorage.setItem('uploadQueue', JSON.stringify(filteredQueue));
              }, 2000);
            }
            
            return updatedQueue;
          });
        }, 500);
      }
    }, 800);
  };

  const removeFromQueue = (uploadId: number) => {
    const updatedQueue = uploadQueue.filter(item => item.id !== uploadId);
    setUploadQueue(updatedQueue);
    localStorage.setItem('uploadQueue', JSON.stringify(updatedQueue));
  };

  const validateForm = () => {
    if (!formData.campaignName.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign name is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.adType) {
      toast({
        title: "Validation Error", 
        description: "Ad type selection is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (selectedChannels.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one channel must be selected",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const campaignData = {
      ...formData,
      channels: selectedChannels,
      selectedDays: repeatFrequencyEnabled ? selectedDays : [],
      repeatFrequencyEnabled,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(), // Simple ID generation
    };
    
    // Save to localStorage for demonstration
    const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    existingCampaigns.push(campaignData);
    localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));
    
    // Clear persisted campaign name after successful save
    localStorage.removeItem('currentCampaignName');
    
    toast({
      title: "Success!",
      description: `Campaign "${formData.campaignName}" saved successfully`,
    });
    
    // Reset form data except campaign name
    setFormData(prev => ({
      ...prev,
      // Keep campaign name intact
      adType: "Video Ad",
      file: null,
      startDate: undefined,
      endDate: undefined,
      startTime: "",
      endTime: "",
      loopCampaign: false,
      loopFrequency: 1,
    }));
    
    // Redirect to settings page after saving
    setTimeout(() => {
      navigate('/settings');
    }, 1500);
  };

  const handleCancel = () => {
    // Clear persisted campaign name on cancel
    localStorage.removeItem('currentCampaignName');
    navigate(-1); // Go back to previous page
  };

  const toggleDay = (dayKey: string) => {
    setSelectedDays(prev => 
      prev.includes(dayKey)
        ? prev.filter(day => day !== dayKey)
        : [...prev, dayKey]
    );
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(ch => ch !== channel)
        : [...prev, channel]
    );
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handleVideoRowDragStart = (e: React.DragEvent, index: number) => {
    setDraggedVideoIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleVideoRowDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleVideoRowDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedVideoIndex === null || draggedVideoIndex === dropIndex) {
      setDraggedVideoIndex(null);
      return;
    }

    const newVideoList = [...videoList];
    const draggedVideo = newVideoList[draggedVideoIndex];
    
    // Remove the dragged video from its current position
    newVideoList.splice(draggedVideoIndex, 1);
    
    // Insert it at the new position
    newVideoList.splice(dropIndex, 0, draggedVideo);
    
    setVideoList(newVideoList);
    localStorage.setItem('videoList', JSON.stringify(newVideoList));
    setDraggedVideoIndex(null);
  };

  const removeVideo = (videoId: number) => {
    const updatedVideoList = videoList.filter(video => video.id !== videoId);
    setVideoList(updatedVideoList);
    localStorage.setItem('videoList', JSON.stringify(updatedVideoList));
    
    toast({
      title: "Video Removed",
      description: "Video has been removed from the campaign library",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-roboto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-medium text-center text-gray-900">
            Fast Channel Ad Campaign
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Campaign Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
              <Label htmlFor="campaignName" className="text-sm font-medium text-gray-700">Campaign Name</Label>
              <Input
                id="campaignName"
                placeholder="Enter campaign name"
                value={formData.campaignName}
                onChange={(e) => {
                  const newCampaignName = e.target.value;
                  setFormData(prev => ({ ...prev, campaignName: newCampaignName }));
                  // Persist campaign name to localStorage on every change
                  localStorage.setItem('currentCampaignName', newCampaignName);
                }}
                className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Upload Media File */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Select Media File</Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileVideo className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-sm border-gray-300 hover:bg-gray-50"
                  onClick={() => setMediaBrowserOpen(true)}
                >
                  Select
                </Button>
                {formData.file && (
                  <p className="text-sm text-blue-600 mt-2">
                    {formData.file.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress Section */}
          {uploadQueue.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Upload Progress</h3>
              <div className="space-y-2">
                {uploadQueue.map((upload) => (
                  <div key={upload.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-900 truncate">{upload.title}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {upload.status === 'completed' ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <span className="text-xs text-gray-500">{Math.round(upload.progress)}%</span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromQueue(upload.id)}
                            className="h-4 w-4 p-0 hover:bg-gray-200"
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </div>
                      </div>
                      <Progress 
                        value={upload.progress} 
                        className="h-1"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>
                          {upload.status === 'completed' ? 'Completed' : 'Uploading...'}
                        </span>
                        <span>{new Date(upload.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video List Section */}
          {videoList.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Library</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Video Name</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videoList.map((video, index) => (
                      <TableRow 
                        key={video.id}
                        draggable
                        onDragStart={(e) => handleVideoRowDragStart(e, index)}
                        onDragOver={handleVideoRowDragOver}
                        onDrop={(e) => handleVideoRowDrop(e, index)}
                        className={cn(
                          "cursor-move transition-colors",
                          draggedVideoIndex === index && "opacity-50",
                          "hover:bg-gray-50"
                        )}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{video.name}</TableCell>
                        <TableCell>{video.source}</TableCell>
                        <TableCell>{video.duration}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => removeVideo(video.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}


          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              type="submit" 
              className="px-8 py-3 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              Save Campaign
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-8 py-3 text-sm font-medium rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      
      <MediaBrowser 
        open={mediaBrowserOpen}
        onOpenChange={setMediaBrowserOpen}
        onFileSelect={(file) => setFormData(prev => ({ ...prev, file }))}
      />
      
      <Toaster />
    </div>
  );
};

export default Index;