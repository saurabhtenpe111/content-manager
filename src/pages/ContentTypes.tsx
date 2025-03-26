
import Layout from "@/components/layout/Layout";
import ContentTypeBuilder from "@/components/content-types/ContentTypeBuilder";
import { Button } from "@/components/common/Button";
import { Plus, Database, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";

const ContentTypes = () => {
  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Types</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your content structure
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card glassEffect hover>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium">Blog Post</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Blog content with title, body, categories and author
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">5 fields</div>
                <Button variant="ghost" size="sm">
                  Edit Structure
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card glassEffect hover>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium">Product</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Product details including name, price, and inventory
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">8 fields</div>
                <Button variant="ghost" size="sm">
                  Edit Structure
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card glassEffect hover>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium">User Profile</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                User information with preferences and settings
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">12 fields</div>
                <Button variant="ghost" size="sm">
                  Edit Structure
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed flex items-center justify-center p-6 hover:bg-accent/5 transition-colors cursor-pointer">
            <div className="text-center">
              <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium">Create New Content Type</p>
              <p className="text-sm text-muted-foreground mt-1">
                Define a new structure for your content
              </p>
            </div>
          </Card>
        </div>

        <ContentTypeBuilder />
      </div>
    </Layout>
  );
};

export default ContentTypes;
