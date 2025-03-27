import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarItem } from "@/components/layout/SidebarItem";
import {
  LayoutDashboard,
  FileText,
  Database,
  Puzzle,
  FormInput,
  KeyRound,
  Users2,
  Settings2,
  Languages,
  ShieldCheck,
  Folder,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-60 border-r bg-sidebar pb-10 pt-16 lg:border-r-0">
      <ScrollArea className="h-full px-3 py-2">
        <div className="space-y-4">
          <div className="py-2">
            <div className="space-y-1">
              <SidebarItem
                icon={<LayoutDashboard size={16} />}
                label="Dashboard"
                href="/dashboard"
              />
              <SidebarItem
                icon={<FileText size={16} />}
                label="Content"
                href="/content"
              />
              <SidebarItem
                icon={<Database size={16} />}
                label="Content Types"
                href="/content-types"
              />
              <SidebarItem
                icon={<Puzzle size={16} />}
                label="Fields Library"
                href="/fields-library"
              />
              <SidebarItem
                icon={<FormInput size={16} />}
                label="Form Builder"
                href="/form-builder"
              />
              <SidebarItem
                icon={<KeyRound size={16} />}
                label="API Keys"
                href="/api-keys"
              />
              <SidebarItem
                icon={<Users2 size={16} />}
                label="Users"
                href="/users"
              />
              <SidebarItem
                icon={<Folder size={16} />}
                label="Fields Demo"
                href="/fields-demo"
              />
            </div>
          </div>

          <div className="py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
              Settings
            </h3>
            <div className="space-y-1">
              <SidebarItem
                icon={<Settings2 size={16} />}
                label="General"
                href="/settings"
              />
              <SidebarItem
                icon={<Languages size={16} />}
                label="Localization"
                href="/settings/localization"
              />
              <SidebarItem
                icon={<ShieldCheck size={16} />}
                label="Security"
                href="/settings/security"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
