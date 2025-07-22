import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
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

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [repeatFrequencyEnabled, setRepeatFrequencyEnabled] = useState(false);
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
    
    toast({
      title: "Success!",
      description: `Campaign "${formData.campaignName}" saved successfully`,
    });
    
    // Redirect to settings page after saving
    setTimeout(() => {
      navigate('/settings');
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
                <Label className="text-sm font-medium text-gray-700">Upload Media File</Label>
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
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag & drop or browse
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-sm border-gray-300 hover:bg-gray-50"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*,video/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          setFormData(prev => ({ ...prev, file }));
                        }
                      };
                      input.click();
                    }}
                  >
                    Browse
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

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pt-4">
            <Button 
              type="submit" 
              className="px-8 py-3 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              Add Campaign
            </Button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;