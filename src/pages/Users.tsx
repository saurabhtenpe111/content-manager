
import React from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserCog,
  Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-09-15T14:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2023-09-14T11:20:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '2023-08-30T09:15:00Z',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2023-09-10T16:45:00Z',
  },
  {
    id: '5',
    name: 'Robert Brown',
    email: 'robert@example.com',
    role: 'Viewer',
    status: 'Active',
    lastLogin: '2023-09-12T13:10:00Z',
  },
];

const Users: React.FC = () => {
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cms-gray-900">User Management</h1>
            <p className="text-cms-gray-600 mt-1">
              Manage users and their permissions
            </p>
          </div>
          
          <Button>
            <Plus size={16} className="mr-2" />
            Add User
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cms-gray-400" size={18} />
            <Input 
              placeholder="Search users..." 
              className="pl-10"
            />
          </div>
          
          <select 
            className="border border-cms-gray-200 rounded-md p-2 w-full sm:w-auto"
            defaultValue="all"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          
          <select 
            className="border border-cms-gray-200 rounded-md p-2 w-full sm:w-auto"
            defaultValue="all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{user.name}</div>
                      <div className="text-sm text-cms-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.role === 'Admin' ? 'default' : 'outline'}
                      className={
                        user.role === 'Admin' 
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                          : user.role === 'Editor'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'Active' ? 'default' : 'outline'}
                      className={
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.lastLogin).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserCog className="mr-2 h-4 w-4" />
                          <span>Manage Permissions</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete User</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-cms-gray-500">
            Showing <span className="font-medium">5</span> of <span className="font-medium">5</span> users
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default Users;
