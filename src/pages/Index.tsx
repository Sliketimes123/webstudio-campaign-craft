import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

const Index = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState({
    campaignType: "Default",
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

  const existingCampaigns = ["Default", "Campaign 1", "Campaign 2", "Campaign 3"];
  const adTypes = ["Image", "L-band Ad", "Overlay Ad", "U-band Ad", "Video File"];
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Campaign data:", {
      ...formData,
      channels: selectedChannels,
      selectedDays,
    });
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-center text-foreground">
            Manage Ad Campaign – WebStudio (24/7 Events)
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="campaignType">Existing Campaign</Label>
                  <Select 
                    value={formData.campaignType} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, campaignType: value }));
                      setIsCreatingNew(false);
                    }}
                    disabled={isCreatingNew}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select existing campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingCampaigns.map((campaign) => (
                        <SelectItem key={campaign} value={campaign}>
                          {campaign}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-6 w-10 h-10 rounded-full p-0"
                  onClick={() => {
                    setIsCreatingNew(!isCreatingNew);
                    if (!isCreatingNew) {
                      setFormData(prev => ({ ...prev, campaignType: "", campaignName: "" }));
                    }
                  }}
                >
                  +
                </Button>
              </div>
              {isCreatingNew && (
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    placeholder="Enter new campaign name"
                    value={formData.campaignName}
                    onChange={(e) => setFormData(prev => ({ ...prev, campaignName: e.target.value }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ad Type Selection */}
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adType">Select Ad Type</Label>
                  <Select 
                    value={formData.adType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, adType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose ad type" />
                    </SelectTrigger>
                    <SelectContent>
                      {adTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload Media File</Label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary hover:bg-primary/5"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop or browse
                    </p>
                    <Button type="button" variant="outline" size="sm">
                      Browse
                    </Button>
                    {formData.file && (
                      <p className="text-xs text-primary mt-2">
                        {formData.file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Select Fast Channel */}
          <Card>
            <CardHeader>
              <CardTitle>Select Fast Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {channels.map((channel) => (
                  <div key={channel} className="flex items-center space-x-2">
                    <Checkbox
                      id={channel}
                      checked={selectedChannels.includes(channel)}
                      onCheckedChange={() => toggleChannel(channel)}
                    />
                    <Label htmlFor={channel}>{channel}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date and Time Pickers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full pl-2 text-left font-normal text-xs",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        {formData.startDate ? (
                          format(formData.startDate, "dd/MM")
                        ) : (
                          <span>Start Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
                  <Label className="text-sm">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full pl-2 text-left font-normal text-xs",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        {formData.endDate ? (
                          format(formData.endDate, "dd/MM")
                        ) : (
                          <span>End Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
                  <Label htmlFor="startTime" className="text-sm">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    className="text-xs h-8"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    className="text-xs h-8"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              {/* Day Selection */}
              <div className="space-y-2">
                <Label>Repeat Frequency (Day wise)</Label>
                <div className="flex gap-2">
                  {days.map((day) => (
                    <Button
                      key={day.key}
                      type="button"
                      variant={selectedDays.includes(day.key) ? "default" : "outline"}
                      size="sm"
                      className="w-10 h-10 rounded-full p-0"
                      onClick={() => toggleDay(day.key)}
                    >
                      {day.key}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Loop Campaign */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="loopCampaign"
                    checked={formData.loopCampaign}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, loopCampaign: !!checked }))
                    }
                  />
                  <Label htmlFor="loopCampaign">Run Campaign in Loop</Label>
                </div>
                
                {formData.loopCampaign && (
                  <div className="space-y-2">
                    <Label htmlFor="loopFrequency" className="text-sm">Loop Frequency (0-100)</Label>
                    <Input
                      id="loopFrequency"
                      type="number"
                      min="0"
                      max="100"
                      className="w-24 text-xs h-8"
                      value={formData.loopFrequency}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        loopFrequency: Number(e.target.value) 
                      }))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button type="submit" className="px-8 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Save Campaign
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="px-8 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;