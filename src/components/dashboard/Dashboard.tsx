
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { BarChart, Activity, Layers, Users, FileText, Settings, Plus, ArrowRight, Database } from "lucide-react";
import { Bar, BarChart as ReBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", Blog: 4, Product: 7, User: 2 },
  { name: "Feb", Blog: 3, Product: 4, User: 5 },
  { name: "Mar", Blog: 5, Product: 8, User: 3 },
  { name: "Apr", Blog: 7, Product: 10, User: 6 },
  { name: "May", Blog: 6, Product: 9, User: 4 },
  { name: "Jun", Blog: 8, Product: 12, User: 7 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Get insights of your content management system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Content Type
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card glassEffect hover>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Content Types</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card glassEffect hover>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Entries</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
            <p className="text-xs text-muted-foreground mt-1">
              +24 from last month
            </p>
          </CardContent>
        </Card>
        <Card glassEffect hover>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 from last month
            </p>
          </CardContent>
        </Card>
        <Card glassEffect hover>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">154</div>
            <p className="text-xs text-muted-foreground mt-1">
              +32 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card glassEffect className="col-span-7 md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Content Growth</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                New content entries created over time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Blog" fill="hsl(var(--primary))" opacity={0.8} radius={4} />
                  <Bar dataKey="Product" fill="#8884d8" opacity={0.8} radius={4} />
                  <Bar dataKey="User" fill="#82ca9d" opacity={0.8} radius={4} />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card glassEffect className="col-span-7 md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">New Blog post created</p>
                <p className="text-xs text-muted-foreground mt-1">
                  2 hours ago by John Doe
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Product schema updated</p>
                <p className="text-xs text-muted-foreground mt-1">
                  5 hours ago by Sarah Johnson
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">User field added</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Yesterday by Mike Williams
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">New user role created</p>
                <p className="text-xs text-muted-foreground mt-1">
                  2 days ago by Admin
                </p>
              </div>
            </div>

            <Button variant="ghost" className="w-full mt-4 justify-between">
              View all activity
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
