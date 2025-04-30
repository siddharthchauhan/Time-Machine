
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Pencil, Trash2, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Department {
  id: string;
  name: string;
  description: string | null;
}

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const { toast } = useToast();
  const { profile } = useAuth();
  
  // Only admins should be able to manage departments
  const isAdmin = profile?.role === 'admin';
  
  useEffect(() => {
    fetchDepartments();
  }, []);
  
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setDepartments(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching departments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddDepartment = async () => {
    if (!departmentName.trim()) {
      toast({
        title: "Department name required",
        description: "Please provide a name for the department.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('departments')
        .insert({
          name: departmentName.trim(),
          description: departmentDescription.trim() || null
        });
        
      if (error) throw error;
      
      toast({
        title: "Department added",
        description: `${departmentName} has been added successfully.`
      });
      
      setDepartmentName('');
      setDepartmentDescription('');
      setIsAddDialogOpen(false);
      fetchDepartments();
    } catch (error: any) {
      toast({
        title: "Error adding department",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateDepartment = async () => {
    if (!editingDepartment) return;
    
    if (!departmentName.trim()) {
      toast({
        title: "Department name required",
        description: "Please provide a name for the department.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('departments')
        .update({
          name: departmentName.trim(),
          description: departmentDescription.trim() || null
        })
        .eq('id', editingDepartment.id);
        
      if (error) throw error;
      
      toast({
        title: "Department updated",
        description: `${departmentName} has been updated successfully.`
      });
      
      setEditingDepartment(null);
      setDepartmentName('');
      setDepartmentDescription('');
      setIsEditDialogOpen(false);
      fetchDepartments();
    } catch (error: any) {
      toast({
        title: "Error updating department",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteDepartment = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Department deleted",
        description: `${name} has been deleted successfully.`
      });
      
      fetchDepartments();
    } catch (error: any) {
      toast({
        title: "Error deleting department",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const openEditDialog = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentName(department.name);
    setDepartmentDescription(department.description || '');
    setIsEditDialogOpen(true);
  };
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Department Management
            </CardTitle>
            <CardDescription>
              Create and manage departments in your organization.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>
                  Create a new department for your organization structure.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter department name" 
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter department description" 
                    value={departmentDescription}
                    onChange={(e) => setDepartmentDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDepartment}>
                  Add Department
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : departments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.description || '—'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(department)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDepartment(department.id, department.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No departments found. Create your first department to get started.
          </div>
        )}
      </CardContent>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Department Name</Label>
              <Input 
                id="edit-name" 
                placeholder="Enter department name" 
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea 
                id="edit-description" 
                placeholder="Enter department description" 
                value={departmentDescription}
                onChange={(e) => setDepartmentDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDepartment}>
              Update Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DepartmentManagement;
