import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";

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

const Index = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [repeatFrequencyEnabled, setRepeatFrequencyEnabled] = useState(false);
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
    <div className="min-h-screen bg-gray-50 font-roboto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-medium text-center text-gray-900">
            Manage Ad Campaign – WebStudio (24/7 Events)
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
                  <Button type="button" variant="outline" size="sm" className="h-8 text-sm border-gray-300 hover:bg-gray-50">
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

              {/* Day Selection */}
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

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pt-4">
            <Button 
              type="submit" 
              className="px-8 py-3 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              Save Campaign
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="px-8 py-3 text-sm font-medium rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
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