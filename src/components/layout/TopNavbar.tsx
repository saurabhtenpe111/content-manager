
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Settings, 
  HelpCircle, 
  User, 
  LogOut,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const TopNavbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  // Get initials from user's full name
  const getInitials = () => {
    if (!user) return '?';
    
    const fullName = user.user_metadata.full_name as string;
    if (!fullName) return user.email?.substring(0, 1).toUpperCase() || '?';
    
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="h-16 border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-semibold text-lg">
          Headless CMS
        </Link>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.user_metadata.full_name || user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/api-keys')}>
              <Key size={16} className="mr-2" />
              API Keys
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings size={16} className="mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle size={16} className="mr-2" />
              Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
