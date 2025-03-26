
import React from 'react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

const Sidebar = ({
  open,
  onClose,
  children,
  position = 'left',
  className,
}: SidebarProps) => {
  const isMobile = useMobile();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side={position}
        className={cn(
          'p-0 flex flex-col h-full w-[300px] sm:max-w-none',
          isMobile ? 'w-full' : 'sm:w-[300px]',
          className
        )}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
