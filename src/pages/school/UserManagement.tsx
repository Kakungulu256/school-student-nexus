
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { api, Student } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Upload, AlertTriangle } from 'lucide-react';

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newStudent, setNewStudent] = useState({
    username: '',
    name: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (user && user.id) {
        try {
          const data = await api.getStudents(user.id);
          setStudents(data);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch students',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStudents();
  }, [user, toast]);

  const handleAddStudent = async () => {
    if (!user) return;

    try {
      const student = await api.addStudent({
        schoolId: user.id,
        username: newStudent.username,
        name: newStudent.name,
      });

      setStudents([...students, student]);
      setNewStudent({ username: '', name: '' });
      setShowAddDialog(false);

      toast({
        title: 'Success',
        description: 'Student added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add student',
        variant: 'destructive',
      });
    }
  };

  const handleBulkUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const newStudents = await api.bulkUploadStudents(file);
      setStudents([...students, ...newStudents]);
      setFile(null);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setShowBulkDialog(false);
        
        toast({
          title: 'Success',
          description: `${newStudents.length} students added successfully`,
        });
      }, 500);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process bulk upload',
        variant: 'destructive',
      });
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(interval);
    }
  };

  const handleStatusChange = async (student: Student) => {
    try {
      const newStatus = student.status === 'active' ? 'suspended' : 'active';
      const updatedStudent = await api.updateStudentStatus(student.id, newStatus);
      
      setStudents(
        students.map(s => (s.id === student.id ? updatedStudent : s))
      );
      
      toast({
        title: 'Success',
        description: `Student ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update student status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      await api.removeStudent(selectedStudent.id);
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      setShowDeleteDialog(false);
      
      toast({
        title: 'Success',
        description: 'Student removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove student',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Add and manage student accounts
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Students</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or PDF file containing student details.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".csv,.pdf"
                      onChange={e => {
                        if (e.target.files) setFile(e.target.files[0]);
                      }}
                    />
                    <p className="text-xs text-gray-500">
                      Accepted formats: CSV, PDF
                    </p>
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-education-primary rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-center">
                        {uploadProgress < 100
                          ? `Processing... ${uploadProgress}%`
                          : 'Complete!'}
                      </p>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowBulkDialog(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkUpload}
                    disabled={!file || isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Create a new student account.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Student ID/Username</Label>
                    <Input
                      id="username"
                      value={newStudent.username}
                      onChange={e =>
                        setNewStudent({ ...newStudent, username: e.target.value })
                      }
                      placeholder="e.g., S001"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={e =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      placeholder="e.g., John Doe"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddStudent}
                    disabled={!newStudent.username || !newStudent.name}
                  >
                    Add Student
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <UserPlus className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No students yet</h3>
              <p className="text-gray-500 mb-4">
                Add your first student to get started
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                Add Student
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                Manage your student accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.username}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={student.status === 'active' ? 'default' : 'destructive'}
                        >
                          {student.status === 'active' ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(student)}
                          >
                            {student.status === 'active' ? 'Suspend' : 'Activate'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowDeleteDialog(true);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {/* Confirm Delete Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to remove {selectedStudent?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteStudent}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
