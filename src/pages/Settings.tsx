import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Edit, Eye, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Settings = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="campaign-manager" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="stream-settings">Stream Settings</TabsTrigger>
            <TabsTrigger value="video-profiles">Video Profiles</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="campaign-manager" className="bg-primary text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Campaign Manager
            </TabsTrigger>
            <TabsTrigger value="account-settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="assets">
            <div className="p-6 text-center text-muted-foreground">
              Assets configuration coming soon...
            </div>
          </TabsContent>

          <TabsContent value="stream-settings">
            <div className="p-6 text-center text-muted-foreground">
              Stream settings configuration coming soon...
            </div>
          </TabsContent>

          <TabsContent value="video-profiles">
            <div className="p-6 text-center text-muted-foreground">
              Video profiles configuration coming soon...
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="p-6 text-center text-muted-foreground">
              Members management coming soon...
            </div>
          </TabsContent>

          <TabsContent value="campaign-manager" className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-xl font-semibold text-foreground">Campaign Management</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Campaign Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                  <span className="absolute -top-5 left-0 text-xs text-muted-foreground">Campaign Search</span>
                </div>

                {/* Campaign Filter */}
                <div className="relative">
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campaigns</SelectItem>
                      {campaignOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="absolute -top-5 left-0 text-xs text-muted-foreground">Campaign</span>
                </div>

                {/* Create New Button */}
                <Button 
                  onClick={handleCreateNew}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  Create New
                </Button>
              </div>
            </div>

            {/* Data Table */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/30">
                    <TableHead className="text-left font-medium text-foreground">#</TableHead>
                    <TableHead className="text-left font-medium text-foreground">Campaign Name</TableHead>
                    <TableHead className="text-left font-medium text-foreground">Fast Channel</TableHead>
                    <TableHead className="text-left font-medium text-foreground">Status</TableHead>
                    <TableHead className="text-left font-medium text-foreground">Last Login</TableHead>
                    <TableHead className="text-left font-medium text-foreground">Last Active</TableHead>
                    <TableHead className="text-left font-medium text-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="text-left text-foreground">{index + 1}</TableCell>
                      <TableCell className="text-left text-foreground font-medium">{item.campaignName}</TableCell>
                      <TableCell className="text-left text-foreground">{item.fastChannel}</TableCell>
                      <TableCell className="text-left">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            : item.status === 'Inactive'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-left text-foreground">{item.lastLogin}</TableCell>
                      <TableCell className="text-left text-foreground">{item.lastActive}</TableCell>
                      <TableCell className="text-left">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-muted"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border border-border">
                              <DropdownMenuItem className="hover:bg-muted">Duplicate</DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-muted">Archive</DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-muted text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No campaigns found matching your criteria.
              </div>
            )}
          </TabsContent>

          <TabsContent value="account-settings">
            <div className="p-6 text-center text-muted-foreground">
              Account settings configuration coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;