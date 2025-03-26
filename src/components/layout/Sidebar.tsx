
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, Settings, Database, LucideIcon, Package2, Grid3X3 } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active, collapsed }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent group",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon size={18} className={cn("flex-shrink-0", collapsed ? "mr-0" : "")} />
      {!collapsed && <span className="transition-opacity duration-200">{label}</span>}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 pointer-events-none -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </Link>
  );
};

const NavSection: React.FC<{ title: string; children: React.ReactNode; collapsed?: boolean }> = ({
  title,
  children,
  collapsed,
}) => {
  return (
    <div className="mb-6">
      {!collapsed && (
        <div className="px-3 mb-2 text-xs font-semibold uppercase text-sidebar-foreground/60">
          {title}
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
};

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-50 flex flex-col h-full border-r bg-sidebar shadow-lg transition-all duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center p-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="text-sidebar-foreground">FlexiCMS</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="mx-auto">
              <Package2 className="h-6 w-6 text-primary" />
            </Link>
          )}
          <button
            onClick={toggleCollapsed}
            className="ml-auto p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <NavSection title="General" collapsed={collapsed}>
            <NavItem
              to="/"
              icon={LayoutDashboard}
              label="Dashboard"
              active={location.pathname === "/"}
              collapsed={collapsed}
            />
            <NavItem
              to="/content-types"
              icon={Database}
              label="Content Types"
              active={location.pathname === "/content-types"}
              collapsed={collapsed}
            />
            <NavItem
              to="/field-types"
              icon={Grid3X3}
              label="Field Types"
              active={location.pathname === "/field-types"}
              collapsed={collapsed}
            />
          </NavSection>

          <NavSection title="Content" collapsed={collapsed}>
            <NavItem
              to="/content"
              icon={FileText}
              label="Content Manager"
              active={location.pathname === "/content"}
              collapsed={collapsed}
            />
          </NavSection>

          <NavSection title="System" collapsed={collapsed}>
            <NavItem
              to="/settings"
              icon={Settings}
              label="Settings"
              active={location.pathname === "/settings"}
              collapsed={collapsed}
            />
          </NavSection>
        </div>

        <div className="border-t p-4">
          {!collapsed && (
            <div className="text-xs text-sidebar-foreground/70">
              FlexiCMS Version 1.0
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
