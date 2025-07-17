import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      lastLogin: "2024-01-15 10:30 AM",
      lastActive: "2024-01-15 02:45 PM"
    },
    {
      id: 2,
      campaignName: "Holiday Special",
      fastChannel: "Speaking Tree",
      status: "Inactive",
      lastLogin: "2024-01-14 08:15 AM",
      lastActive: "2024-01-14 11:20 AM"
    },
    {
      id: 3,
      campaignName: "New Year Promo",
      fastChannel: "TOI Global",
      status: "Active",
      lastLogin: "2024-01-15 09:45 AM",
      lastActive: "2024-01-15 01:30 PM"
    },
    {
      id: 4,
      campaignName: "Sports Week",
      fastChannel: "NBT Entertainment",
      status: "Pending",
      lastLogin: "2024-01-13 07:30 AM",
      lastActive: "2024-01-13 10:15 AM"
    },
    {
      id: 5,
      campaignName: "Tech Conference",
      fastChannel: "ET Fast",
      status: "Active",
      lastLogin: "2024-01-15 11:00 AM",
      lastActive: "2024-01-15 03:15 PM"
    },
    {
      id: 6,
      campaignName: "Back to School",
      fastChannel: "Speaking Tree",
      status: "Active",
      lastLogin: "2024-01-14 02:20 PM",
      lastActive: "2024-01-14 04:45 PM"
    },
    {
      id: 7,
      campaignName: "Black Friday Deals",
      fastChannel: "TOI Global",
      status: "Inactive",
      lastLogin: "2024-01-13 05:30 PM",
      lastActive: "2024-01-13 07:15 PM"
    },
    {
      id: 8,
      campaignName: "Winter Collection",
      fastChannel: "NBT Entertainment",
      status: "Active",
      lastLogin: "2024-01-15 08:45 AM",
      lastActive: "2024-01-15 12:30 PM"
    },
    {
      id: 9,
      campaignName: "Valentine's Special",
      fastChannel: "ET Fast",
      status: "Pending",
      lastLogin: "2024-01-12 11:15 AM",
      lastActive: "2024-01-12 02:45 PM"
    },
    {
      id: 10,
      campaignName: "Easter Promotion",
      fastChannel: "Speaking Tree",
      status: "Active",
      lastLogin: "2024-01-15 01:20 PM",
      lastActive: "2024-01-15 04:10 PM"
    },
    {
      id: 11,
      campaignName: "Mother's Day Sale",
      fastChannel: "TOI Global",
      status: "Inactive",
      lastLogin: "2024-01-11 09:30 AM",
      lastActive: "2024-01-11 01:20 PM"
    },
    {
      id: 12,
      campaignName: "Father's Day Special",
      fastChannel: "NBT Entertainment",
      status: "Active",
      lastLogin: "2024-01-14 03:45 PM",
      lastActive: "2024-01-14 06:30 PM"
    },
    {
      id: 13,
      campaignName: "Independence Day",
      fastChannel: "ET Fast",
      status: "Pending",
      lastLogin: "2024-01-10 07:15 AM",
      lastActive: "2024-01-10 10:45 AM"
    },
    {
      id: 14,
      campaignName: "Labor Day Weekend",
      fastChannel: "Speaking Tree",
      status: "Active",
      lastLogin: "2024-01-13 12:30 PM",
      lastActive: "2024-01-13 05:15 PM"
    },
    {
      id: 15,
      campaignName: "Halloween Special",
      fastChannel: "TOI Global",
      status: "Inactive",
      lastLogin: "2024-01-09 04:20 PM",
      lastActive: "2024-01-09 07:45 PM"
    },
    {
      id: 16,
      campaignName: "Thanksgiving Deals",
      fastChannel: "NBT Entertainment",
      status: "Active",
      lastLogin: "2024-01-12 10:15 AM",
      lastActive: "2024-01-12 02:30 PM"
    },
    {
      id: 17,
      campaignName: "Christmas Campaign",
      fastChannel: "ET Fast",
      status: "Pending",
      lastLogin: "2024-01-08 06:45 AM",
      lastActive: "2024-01-08 11:20 AM"
    },
    {
      id: 18,
      campaignName: "New Year's Eve",
      fastChannel: "Speaking Tree",
      status: "Active",
      lastLogin: "2024-01-11 02:30 PM",
      lastActive: "2024-01-11 06:15 PM"
    },
    {
      id: 19,
      campaignName: "Spring Collection",
      fastChannel: "TOI Global",
      status: "Inactive",
      lastLogin: "2024-01-07 08:30 AM",
      lastActive: "2024-01-07 12:45 PM"
    },
    {
      id: 20,
      campaignName: "Summer Clearance",
      fastChannel: "NBT Entertainment",
      status: "Active",
      lastLogin: "2024-01-10 01:45 PM",
      lastActive: "2024-01-10 05:30 PM"
    },
    {
      id: 21,
      campaignName: "Flash Sale Monday",
      fastChannel: "ET Fast",
      status: "Pending",
      lastLogin: "2024-01-06 09:15 AM",
      lastActive: "2024-01-06 01:30 PM"
    },
    {
      id: 22,
      campaignName: "Weekend Special",
      fastChannel: "Speaking Tree",
      status: "Active",
      lastLogin: "2024-01-09 03:20 PM",
      lastActive: "2024-01-09 07:45 PM"
    },
    {
      id: 23,
      campaignName: "Midweek Madness",
      fastChannel: "TOI Global",
      status: "Inactive",
      lastLogin: "2024-01-05 11:45 AM",
      lastActive: "2024-01-05 03:20 PM"
    },
    {
      id: 24,
      campaignName: "Final Day Sale",
      fastChannel: "NBT Entertainment",
      status: "Active",
      lastLogin: "2024-01-08 04:30 PM",
      lastActive: "2024-01-08 08:15 PM"
    },
    {
      id: 25,
      campaignName: "Grand Opening",
      fastChannel: "ET Fast",
      status: "Pending",
      lastLogin: "2024-01-04 07:20 AM",
      lastActive: "2024-01-04 11:45 AM"
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
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Campaign Management</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      {/* Campaign Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Enter name"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-full sm:w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="absolute -top-5 left-0 text-xs text-gray-500">Campaign Search</span>
                      </div>

                      {/* Campaign Filter */}
                      <div className="relative">
                        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                          <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                        <span className="absolute -top-5 left-0 text-xs text-gray-500">Campaign</span>
                      </div>

                      {/* Create New Button */}
                      <Button 
                        onClick={handleCreateNew}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-colors"
                      >
                        Create New
                      </Button>
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
                            <TableHead className="text-left font-medium text-gray-900 py-4">
                              <span className="block sm:hidden">Campaign</span>
                              <span className="hidden sm:block">Campaign Name</span>
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4 hidden sm:table-cell">Fast Channel</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4">Status</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4 hidden md:table-cell">Last Login</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 py-4 hidden md:table-cell">Last Active</TableHead>
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
                              <TableCell className="text-left text-gray-900 py-4 hidden md:table-cell">{item.lastLogin}</TableCell>
                              <TableCell className="text-left text-gray-900 py-4 hidden md:table-cell">{item.lastActive}</TableCell>
                              <TableCell className="text-left py-4">
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
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