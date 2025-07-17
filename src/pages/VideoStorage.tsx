import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Search, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const VideoStorage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [activeTab, setActiveTab] = useState("uploaded");

  const handleReset = () => {
    setSearchQuery("");
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleGo = () => {
    console.log("Searching with:", { searchQuery, fromDate, toDate });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar placeholder - would contain navigation icons */}
      <div className="fixed left-0 top-0 w-12 h-full bg-white border-r border-slate-200 flex flex-col items-center py-4 space-y-4">
        <div className="w-6 h-6 bg-orange-500 rounded"></div>
        <div className="w-6 h-6 bg-blue-500 rounded"></div>
        <div className="w-6 h-6 bg-slate-300 rounded"></div>
        <div className="w-6 h-6 bg-slate-300 rounded"></div>
        <div className="w-6 h-6 bg-slate-300 rounded"></div>
        <div className="w-6 h-6 bg-slate-300 rounded"></div>
        <div className="w-6 h-6 bg-slate-300 rounded"></div>
        <div className="w-6 h-6 bg-slate-300 rounded"></div>
      </div>

      {/* Main Content */}
      <div className="ml-12 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded"></div>
            VIDEO STORAGE
          </h1>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
            UPLOAD
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-none">
            <TabsTrigger 
              value="uploaded" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-6 py-2 rounded-none"
            >
              UPLOADED
            </TabsTrigger>
            <TabsTrigger 
              value="recorded"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-6 py-2 rounded-none"
            >
              RECORDED
            </TabsTrigger>
          </TabsList>

          {/* Search and Filter Section */}
          <Card className="mt-4 border border-slate-200 rounded-none shadow-none">
            <CardContent className="p-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label className="text-sm text-slate-600 mb-2 block">
                    <Search className="w-4 h-4 inline mr-1" />
                    Enter event title
                  </Label>
                  <Input
                    placeholder="Enter event title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-slate-600">FROM</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-32 justify-start text-left font-normal border-slate-300",
                          !fromDate && "text-slate-500"
                        )}
                      >
                        {fromDate ? (
                          format(fromDate, "dd/MM/yyyy")
                        ) : (
                          <span>09/07/2025</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-slate-600">TO</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-32 justify-start text-left font-normal border-slate-300",
                          !toDate && "text-slate-500"
                        )}
                      >
                        {toDate ? (
                          format(toDate, "dd/MM/yyyy")
                        ) : (
                          <span>16/07/2025</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button 
                  onClick={handleGo}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                >
                  GO
                </Button>

                <Button 
                  variant="outline"
                  onClick={handleReset}
                  className="border-slate-300 text-slate-600 px-4 py-2"
                >
                  RESET
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Area */}
          <TabsContent value="uploaded" className="mt-6">
            <Card className="border border-slate-200 rounded-none shadow-none min-h-96">
              <CardContent className="p-8 flex items-center justify-center">
                <p className="text-slate-500 text-lg">No Files Found</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recorded" className="mt-6">
            <Card className="border border-slate-200 rounded-none shadow-none min-h-96">
              <CardContent className="p-8 flex items-center justify-center">
                <p className="text-slate-500 text-lg">No Files Found</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VideoStorage;