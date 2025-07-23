import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { Search, Edit, Eye, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Settings = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Sample data for the table
  const memberData = [
    {
      id: 1,
      campaignName: "Summer Sale 2024",
      fastChannel: "ET Fast",
      status: "Active",
      startDateTime: "2024-01-15 09:00 AM",
      endDateTime: "2024-02-15 06:00 PM",
      repeatFrequency: "Mon, Wed, Fri"
    },
    {
      id: 2,
      campaignName: "Holiday Special",
      fastChannel: "Speaking Tree",
      status: "Inactive",
      startDateTime: "2024-01-14 08:00 AM",
      endDateTime: "2024-01-31 11:59 PM",
      repeatFrequency: "Daily"
    },
    {
      id: 3,
      campaignName: "New Year Promo",
      fastChannel: "TOI Global",
      status: "Active",
      startDateTime: "2024-01-01 12:00 AM",
      endDateTime: "2024-01-07 11:59 PM",
      repeatFrequency: "Weekends"
    },
    {
      id: 4,
      campaignName: "Sports Week",
      fastChannel: "NBT Entertainment",
      status: "Pending",
      startDateTime: "2024-02-01 06:00 AM",
      endDateTime: "2024-02-07 10:00 PM",
      repeatFrequency: "Tue, Thu, Sat"
    },
    {
      id: 5,
      campaignName: "Tech Conference",
      fastChannel: "ET Fast",
      status: "Active",
      startDateTime: "2024-01-20 10:00 AM",
      endDateTime: "2024-01-22 05:00 PM",
      repeatFrequency: "Mon, Tue, Wed"
    },
    {
      id: 6,
      campaignName: "Back to School",
      fastChannel: "Speaking Tree",
      status: "Active",
      startDateTime: "2024-08-15 07:00 AM",
      endDateTime: "2024-09-15 08:00 PM",
      repeatFrequency: "Weekdays"
    },
    {
      id: 7,
      campaignName: "Black Friday Deals",
      fastChannel: "TOI Global",
      status: "Inactive",
      startDateTime: "2024-11-24 12:00 AM",
      endDateTime: "2024-11-26 11:59 PM",
      repeatFrequency: "Fri, Sat, Sun"
    },
    {
      id: 8,
      campaignName: "Winter Collection",
      fastChannel: "NBT Entertainment",
      status: "Active",
      startDateTime: "2024-12-01 08:00 AM",
      endDateTime: "2024-02-28 09:00 PM",
      repeatFrequency: "Daily"
    },
    {
      id: 9,
      campaignName: "Valentine's Special",
      fastChannel: "ET Fast",
      status: "Pending",
      startDateTime: "2024-02-10 09:00 AM",
      endDateTime: "2024-02-14 11:59 PM",
      repeatFrequency: "Mon, Wed, Fri"
    },
    {
      id: 10,
      campaignName: "Easter Promotion",
      fastChannel: "Speaking Tree",
      status: "Active",
      startDateTime: "2024-03-25 08:00 AM",
      endDateTime: "2024-04-01 10:00 PM",
      repeatFrequency: "Weekends"
    },
    {
      id: 11,
      campaignName: "Mother's Day Sale",
      fastChannel: "TOI Global",
      status: "Inactive",
      startDateTime: "2024-05-08 09:00 AM",
      endDateTime: "2024-05-12 08:00 PM",
      repeatFrequency: "Thu, Fri, Sat, Sun"
    },
    {
      id: 12,
      campaignName: "Father's Day Special",
      fastChannel: "NBT Entertainment",
      status: "Active",
      startDateTime: "2024-06-15 10:00 AM",
      endDateTime: "2024-06-16 11:00 PM",
      repeatFrequency: "Sat, Sun"
    },
    {
      id: 13,
      campaignName: "Independence Day",
      fastChannel: "ET Fast",
      status: "Pending",
      startDateTime: "2024-07-04 07:00 AM",
      endDateTime: "2024-07-04 11:59 PM",
      repeatFrequency: "Thu"
    },
    {
      id: 14,
      campaignName: "Labor Day Weekend",
      fastChannel: "Speaking Tree",
      status: "Active",
      startDateTime: "2024-09-01 08:00 AM",
      endDateTime: "2024-09-03 10:00 PM",
      repeatFrequency: "Fri, Sat, Sun, Mon"
    },
    {
      id: 15,
      campaignName: "Halloween Special",
      fastChannel: "TOI Global",
      status: "Inactive",
      startDateTime: "2024-10-28 06:00 PM",
      endDateTime: "2024-10-31 11:59 PM",
      repeatFrequency: "Mon, Tue, Wed, Thu"
    },
    {
      id: 16,
      campaignName: "Thanksgiving Deals",
      fastChannel: "NBT Entertainment",
      status: "Active",
      startDateTime: "2024-11-25 09:00 AM",
      endDateTime: "2024-11-28 11:59 PM",
      repeatFrequency: "Mon, Tue, Wed, Thu"
    },
    {
      id: 17,
      campaignName: "Christmas Campaign",
      fastChannel: "ET Fast",
      status: "Pending",
      startDateTime: "2024-12-20 08:00 AM",
      endDateTime: "2024-12-25 11:59 PM",
      repeatFrequency: "Daily"
    },
    {
      id: 18,
      campaignName: "New Year's Eve",
      fastChannel: "Speaking Tree",
      status: "Active",
      startDateTime: "2024-12-31 10:00 PM",
      endDateTime: "2025-01-01 02:00 AM",
      repeatFrequency: "Tue, Wed"
    },
    {
      id: 19,
      campaignName: "Spring Collection",
      fastChannel: "TOI Global",
      status: "Inactive",
      startDateTime: "2024-03-01 09:00 AM",
      endDateTime: "2024-05-31 08:00 PM",
      repeatFrequency: "Weekdays"
    },
    {
      id: 20,
      campaignName: "Summer Clearance",
      fastChannel: "NBT Entertainment",
      status: "Active",
      startDateTime: "2024-07-01 10:00 AM",
      endDateTime: "2024-08-31 09:00 PM",
      repeatFrequency: "Weekends"
    },
    {
      id: 21,
      campaignName: "Flash Sale Monday",
      fastChannel: "ET Fast",
      status: "Pending",
      startDateTime: "2024-01-29 09:00 AM",
      endDateTime: "2024-01-29 11:59 PM",
      repeatFrequency: "Mon"
    },
    {
      id: 22,
      campaignName: "Weekend Special",
      fastChannel: "Speaking Tree",
      status: "Active",
      startDateTime: "2024-01-27 08:00 AM",
      endDateTime: "2024-01-28 10:00 PM",
      repeatFrequency: "Sat, Sun"
    },
    {
      id: 23,
      campaignName: "Midweek Madness",
      fastChannel: "TOI Global",
      status: "Inactive",
      startDateTime: "2024-01-24 12:00 PM",
      endDateTime: "2024-01-25 06:00 PM",
      repeatFrequency: "Wed, Thu"
    },
    {
      id: 24,
      campaignName: "Final Day Sale",
      fastChannel: "NBT Entertainment",
      status: "Active",
      startDateTime: "2024-01-31 08:00 AM",
      endDateTime: "2024-01-31 11:59 PM",
      repeatFrequency: "Wed"
    },
    {
      id: 25,
      campaignName: "Grand Opening",
      fastChannel: "ET Fast",
      status: "Pending",
      startDateTime: "2024-02-15 10:00 AM",
      endDateTime: "2024-02-17 08:00 PM",
      repeatFrequency: "Thu, Fri, Sat"
    }
  ];

  const campaignOptions = ["TOI Global", "Speaking Tree", "ET Fast", "NBT Entertainment"];

  const handleCreateNew = () => {
    navigate("/campaign-manager");
  };

  const filteredData = memberData.filter(item =>
    item.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCampaign === "all" || selectedCampaign === "" || item.fastChannel === selectedCampaign)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Statistics
  const totalCampaigns = memberData.length;
  const activeCampaigns = memberData.filter(item => item.status === "Active").length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date to DD Month YYYY format
  const formatDateTime = (dateTimeString: string) => {
    try {
      // Parse the date from "YYYY-MM-DD HH:mm AM/PM" format
      const parsedDate = parse(dateTimeString, "yyyy-MM-dd hh:mm a", new Date());
      // Format to "DD Month YYYY HH:mm AM/PM"
      return format(parsedDate, "dd MMMM yyyy hh:mm a");
    } catch (error) {
      // If parsing fails, return original string
      return dateTimeString;
    }
  };

  // Calculate total duration of all videos in a campaign
  const calculateTotalDuration = (campaignName: string) => {
    try {
      // Get videos from localStorage (same as in Index.tsx)
      const videoList = JSON.parse(localStorage.getItem('videoList') || '[]');
      
      // For now, we'll simulate that videos belong to campaigns
      // In a real app, videos would have a campaignId or campaignName field
      // Since we don't have that relationship yet, we'll return a sample duration
      // You can modify this logic based on how you want to associate videos with campaigns
      
      let totalSeconds = 0;
      
      // Sample calculation - you can modify this logic
      videoList.forEach((video: any) => {
        if (video.duration) {
          // Parse duration from "mm:ss" format
          const [minutes, seconds] = video.duration.split(':').map(Number);
          totalSeconds += (minutes * 60) + seconds;
        }
      });
      
      // If no videos associated with this campaign, return 00:00
      if (totalSeconds === 0) {
        return "00:00";
      }
      
      // Convert total seconds back to mm:ss format
      const totalMinutes = Math.floor(totalSeconds / 60);
      const remainingSeconds = totalSeconds % 60;
      
      return `${totalMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } catch (error) {
      return "00:00";
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 font-['Roboto',sans-serif]">
        {/* Header */}
        <div className="border-b border-border bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-6">
          <Tabs defaultValue="campaign-manager" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8 bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger value="assets" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Assets</TabsTrigger>
              <TabsTrigger value="stream-settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Stream Settings</TabsTrigger>
              <TabsTrigger value="video-profiles" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Video Profiles</TabsTrigger>
              <TabsTrigger value="members" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Members</TabsTrigger>
              <TabsTrigger value="campaign-manager" className="bg-blue-600 text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Campaign Manager
              </TabsTrigger>
              <TabsTrigger value="account-settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Account Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="assets">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center text-gray-500">
                  Assets configuration coming soon...
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stream-settings">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center text-gray-500">
                  Stream settings configuration coming soon...
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video-profiles">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center text-gray-500">
                  Video profiles configuration coming soon...
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center text-gray-500">
                  Members management coming soon...
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaign-manager" className="space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  {/* Search and Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center pt-2">
                    <h2 className="text-xl font-semibold text-gray-900">Campaign Management</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                      {/* Campaign Search */}
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500">Campaign Search</span>
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                          <Input
                            placeholder="Enter name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-7 h-8 text-sm w-full sm:w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Campaign Filter and Create New Button */}
                      <div className="flex gap-3 items-end">
                        <div className="space-y-1">
                          <span className="text-xs text-gray-500">Campaign</span>
                          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                            <SelectTrigger className="h-8 w-full sm:w-40 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Select campaign" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg">
                              <SelectItem value="all">All Campaigns</SelectItem>
                              {campaignOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Create New Button */}
                        <Button 
                          onClick={handleCreateNew}
                          size="sm"
                          className="h-8 bg-blue-600 hover:bg-blue-700 text-white px-4 text-sm transition-colors"
                        >
                          Create New
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Statistics */}
                  <div className="text-sm text-gray-500 mb-4">
                    Total Campaign {totalCampaigns} | Active Campaign {activeCampaigns}
                  </div>

                  {/* Data Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-gray-200 bg-gray-50/50">
                            <TableHead className="text-left font-medium text-gray-900 py-4">#</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4">Campaign Name</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4 hidden sm:table-cell">Fast Channel</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4">Status</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4 hidden md:table-cell">Start Date and Time</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4 hidden md:table-cell">End Date and Time</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4 hidden lg:table-cell">Repeat Frequency (Day wise)</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4 hidden xl:table-cell">Total Duration</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentData.map((item, index) => (
                            <TableRow 
                              key={item.id} 
                              className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150"
                            >
                              <TableCell className="text-left text-gray-900 py-4">{startIndex + index + 1}</TableCell>
                              <TableCell className="text-left text-gray-900 font-medium py-4">
                                <div className="block sm:hidden">
                                  <div className="font-medium">{item.campaignName}</div>
                                  <div className="text-sm text-gray-500">{item.fastChannel}</div>
                                </div>
                                <div className="hidden sm:block">{item.campaignName}</div>
                              </TableCell>
                              <TableCell className="text-left text-gray-900 py-4 hidden sm:table-cell">{item.fastChannel}</TableCell>
                              <TableCell className="text-left py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'Active' 
                                    ? 'bg-green-100 text-green-800'
                                    : item.status === 'Inactive'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-left text-gray-900 py-4 hidden md:table-cell">{formatDateTime(item.startDateTime)}</TableCell>
                              <TableCell className="text-left text-gray-900 py-4 hidden md:table-cell">{formatDateTime(item.endDateTime)}</TableCell>
                              <TableCell className="text-left text-gray-900 py-4 hidden lg:table-cell">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                                  {item.repeatFrequency}
                                </span>
                              </TableCell>
                               <TableCell className="text-left text-gray-900 py-4 hidden xl:table-cell">
                                 <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium">
                                   {calculateTotalDuration(item.campaignName)}
                                 </span>
                               </TableCell>
                              <TableCell className="text-left py-4">
                                <div className="flex items-center gap-2">
                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                          onClick={() => navigate(`/edit-campaign/${item.id}`)}
                                        >
                                         <Edit className="h-4 w-4" />
                                       </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>Edit campaign</TooltipContent>
                                   </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View details</TooltipContent>
                                  </Tooltip>
                                  
                                  <DropdownMenu>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                          >
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>More actions</TooltipContent>
                                    </Tooltip>
                                    <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                                      <DropdownMenuItem className="hover:bg-gray-50">Duplicate</DropdownMenuItem>
                                      <DropdownMenuItem className="hover:bg-gray-50">Archive</DropdownMenuItem>
                                      <DropdownMenuItem className="hover:bg-gray-50 text-red-600">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                    <div className="text-sm text-gray-500">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={currentPage === page 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }
                        >
                          {page}
                        </Button>
                      ))}
                      
                      {totalPages > 10 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {filteredData.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No campaigns found matching your criteria.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account-settings">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center text-gray-500">
                  Account settings configuration coming soon...
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Settings;