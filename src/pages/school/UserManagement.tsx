
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { api, Student } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Upload, RefreshCw, Check, X, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    username: '',
    name: '',
    email: '',
    password: '', // Added password field
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch students
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students', user?.id],
    queryFn: () => api.getStudents(user?.id || ''),
    enabled: !!user?.id,
  });

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: (newStudent: Partial<Student>) => api.addStudent({
      ...newStudent,
      schoolId: user?.id,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Student added successfully',
      });
      setNewStudent({ username: '', name: '', email: '', password: '' });
      setIsAddUserDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add student',
        variant: 'destructive',
      });
    },
  });

  // Update student status mutation
  const updateStudentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' }) =>
      api.updateStudentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Student status updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update student status',
        variant: 'destructive',
      });
    },
  });

  // Remove student mutation
  const removeStudentMutation = useMutation({
    mutationFn: (id: string) => api.removeStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Student removed',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove student',
        variant: 'destructive',
      });
    },
  });

  // Bulk upload mutation
  const bulkUploadMutation = useMutation({
    mutationFn: (file: File) => api.bulkUploadStudents(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Students uploaded successfully',
      });
      setFile(null);
      setIsUploadDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload students',
        variant: 'destructive',
      });
    },
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.username || !newStudent.name || !newStudent.password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    addStudentMutation.mutate(newStudent);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'Please select a file',
        description: 'You need to upload a CSV or PDF file',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    // Simulate a delay to show loading state in the demo
    setTimeout(() => {
      bulkUploadMutation.mutate(file);
      setIsUploading(false);
    }, 1500);
  };

  // Count active and suspended students
  const activeStudents = students.filter(s => s.status === 'active').length;
  const suspendedStudents = students.filter(s => s.status === 'suspended').length;

  return (
    <DashboardLayout>
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage student accounts for your school
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex gap-2 items-center">
                  <UserPlus className="h-4 w-4" />
                  <span>Add Student</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Create a new student account for your school.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Student ID/Username</Label>
                    <Input
                      id="username"
                      value={newStudent.username}
                      onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                      placeholder="e.g. S001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="e.g. student@school.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddUserDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={addStudentMutation.isPending}
                    >
                      {addStudentMutation.isPending ? 'Adding...' : 'Add Student'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <Upload className="h-4 w-4" />
                  <span>Bulk Upload</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Students</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or PDF file with student details.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".csv,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: CSV, PDF
                    </p>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsUploadDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isUploading || bulkUploadMutation.isPending}
                    >
                      {isUploading || bulkUploadMutation.isPending ? (
                        <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                      ) : (
                        'Upload'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Suspended Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{suspendedStudents}</div>
            </CardContent>
          </Card>
        </div>
        
        <TabsList>
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <StudentTable 
            students={students} 
            isLoading={isLoading} 
            onUpdateStatus={(id, status) => updateStudentStatusMutation.mutate({ id, status })}
            onRemove={(id) => removeStudentMutation.mutate(id)}
            isUpdating={updateStudentStatusMutation.isPending}
            isRemoving={removeStudentMutation.isPending}
          />
        </TabsContent>
        
        <TabsContent value="active">
          <StudentTable 
            students={students.filter(s => s.status === 'active')} 
            isLoading={isLoading}
            onUpdateStatus={(id, status) => updateStudentStatusMutation.mutate({ id, status })}
            onRemove={(id) => removeStudentMutation.mutate(id)}
            isUpdating={updateStudentStatusMutation.isPending}
            isRemoving={removeStudentMutation.isPending}
          />
        </TabsContent>
        
        <TabsContent value="suspended">
          <StudentTable 
            students={students.filter(s => s.status === 'suspended')} 
            isLoading={isLoading}
            onUpdateStatus={(id, status) => updateStudentStatusMutation.mutate({ id, status })}
            onRemove={(id) => removeStudentMutation.mutate(id)}
            isUpdating={updateStudentStatusMutation.isPending}
            isRemoving={removeStudentMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status: 'active' | 'suspended') => void;
  onRemove: (id: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

function StudentTable({ 
  students, 
  isLoading,
  onUpdateStatus,
  onRemove,
  isUpdating,
  isRemoving
}: StudentTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No students found.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.username}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email || '-'}</TableCell>
              <TableCell>
                <Badge variant={student.status === 'active' ? 'outline' : 'destructive'}>
                  {student.status === 'active' ? 'Active' : 'Suspended'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {student.status === 'active' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onUpdateStatus(student.id, 'suspended')}
                      disabled={isUpdating}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onUpdateStatus(student.id, 'active')}
                      disabled={isUpdating}
                      className="text-green-500 border-green-200 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onRemove(student.id)}
                    disabled={isRemoving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
