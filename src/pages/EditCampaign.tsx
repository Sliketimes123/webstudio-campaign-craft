import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, MousePointer, X, CheckCircle, Edit, Eye, MoreHorizontal, Trash2, FileVideo } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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

const EditCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  
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
    adType: "",
    file: null as File | null,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    loopCampaign: false,
    loopFrequency: 1,
  });

  // Exclude Video File from ad types for edit page  
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

  // Load campaign data, upload queue, and video list on component mount
  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem('uploadQueue') || '[]');
    const savedVideoList = JSON.parse(localStorage.getItem('videoList') || '[]');
    
    setUploadQueue(savedQueue);
    setVideoList(savedVideoList);
    
    // Simulate upload progress for items in queue
    savedQueue.forEach((item: any, index: number) => {
      if (item.status === 'uploading') {
        simulateUploadProgress(item.id, index);
      }
    });

    if (id) {
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      const campaign = campaigns.find((c: any) => c.id === id);
      
      if (campaign) {
        setFormData({
          campaignName: campaign.campaignName || "",
          adType: campaign.adType === "Video File" ? "" : campaign.adType || "", // Reset if video
          file: null, // Don't load existing file
          startDate: campaign.startDate ? new Date(campaign.startDate) : undefined,
          endDate: campaign.endDate ? new Date(campaign.endDate) : undefined,
          startTime: campaign.startTime || "",
          endTime: campaign.endTime || "",
          loopCampaign: campaign.loopCampaign || false,
          loopFrequency: campaign.loopFrequency || 1,
        });
        
        setSelectedChannels(campaign.channels || []);
        setSelectedDays(campaign.selectedDays || []);
        setRepeatFrequencyEnabled(campaign.repeatFrequencyEnabled || false);
      } else {
        toast({
          title: "Error",
          description: "Campaign not found",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [id, navigate, toast]);

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

    const updatedCampaign = {
      ...formData,
      channels: selectedChannels,
      selectedDays: repeatFrequencyEnabled ? selectedDays : [],
      repeatFrequencyEnabled,
      updatedAt: new Date().toISOString(),
      id: id,
    };
    
    // Update in localStorage
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updatedCampaigns = campaigns.map((campaign: any) => 
      campaign.id === id ? { ...campaign, ...updatedCampaign } : campaign
    );
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    
    toast({
      title: "Success!",
      description: `Campaign "${formData.campaignName}" updated successfully`,
    });
    
    // Redirect to settings page after saving
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleCancel = () => {
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
            Edit Ad Campaign – WebStudio (24/7 Events)
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
                onChange={(e) => setFormData(prev => ({ ...prev, campaignName: e.target.value }))}
                className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Ad Type Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="adType" className="text-sm font-medium text-gray-700">Select Ad Type</Label>
                <Select 
                  value={formData.adType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, adType: value }))}
                >
                  <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Choose ad type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {adTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
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

          {/* Ad Preview Section */}
          {formData.file && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ad Preview</h3>
              <div className="flex justify-center">
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  {formData.file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(formData.file)} 
                      alt="Ad preview" 
                      className="max-w-sm max-h-64 object-contain rounded"
                    />
                  ) : formData.file.type.startsWith('video/') ? (
                    <video 
                      src={URL.createObjectURL(formData.file)} 
                      controls 
                      className="max-w-sm max-h-64 rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-64 h-32 bg-gray-200 rounded">
                      <p className="text-gray-500">Preview not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Select Fast Channel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Fast Channel</h3>
            <div className="grid grid-cols-2 gap-4">
              {channels.map((channel) => (
                <div key={channel} className="flex items-center space-x-3">
                  <Checkbox
                    id={channel}
                    checked={selectedChannels.includes(channel)}
                    onCheckedChange={() => toggleChannel(channel)}
                    className="border-gray-300"
                  />
                  <Label htmlFor={channel} className="text-sm text-gray-700">{channel}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Scheduling</h3>
            <div className="space-y-6">
              {/* Date and Time Pickers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full pl-3 text-left font-normal text-sm h-10 border-gray-300 focus:border-blue-500",
                          !formData.startDate && "text-gray-500"
                        )}
                      >
                        {formData.startDate ? (
                          format(formData.startDate, "dd/MM")
                        ) : (
                          <span>Start Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full pl-3 text-left font-normal text-sm h-10 border-gray-300 focus:border-blue-500",
                          !formData.endDate && "text-gray-500"
                        )}
                      >
                        {formData.endDate ? (
                          format(formData.endDate, "dd/MM")
                        ) : (
                          <span>End Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    className="text-sm h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    className="text-sm h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              {/* Day Selection and Loop Campaign */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-sm font-medium text-gray-700">Repeat Frequency</Label>
                    <Switch
                      checked={repeatFrequencyEnabled}
                      onCheckedChange={setRepeatFrequencyEnabled}
                    />
                  </div>
                  {repeatFrequencyEnabled && (
                    <div className="flex gap-2">
                      {days.map((day) => (
                        <Button
                          key={day.key}
                          type="button"
                          variant={selectedDays.includes(day.key) ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "w-10 h-10 rounded-full p-0 text-sm",
                            selectedDays.includes(day.key)
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          )}
                          onClick={() => toggleDay(day.key)}
                        >
                          {day.key}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Loop Campaign */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="loopCampaign"
                      checked={formData.loopCampaign}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, loopCampaign: !!checked }))
                      }
                      className="border-gray-300"
                    />
                    <Label htmlFor="loopCampaign" className="text-sm text-gray-700">Run Campaign in Loop</Label>
                  </div>
                  
                  {formData.loopCampaign && (
                    <div className="space-y-2">
                      <Label htmlFor="loopFrequency" className="text-sm font-medium text-gray-700">Loop Frequency (0-100)</Label>
                      <Input
                        id="loopFrequency"
                        type="number"
                        min="0"
                        max="100"
                        className="w-24 text-sm h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.loopFrequency}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          loopFrequency: Number(e.target.value) 
                        }))}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pt-4">
            <Button 
              type="submit" 
              className="px-8 py-3 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              Update Campaign
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="px-8 py-3 text-sm font-medium rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
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

export default EditCampaign;