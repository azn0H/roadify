import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  avatar_url: string | null;
  email_notifications: boolean;
  mobile_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export function useUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery<Profile[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: teachers, isLoading: teachersLoading } = useQuery<Profile[]>({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .order('first_name');

      if (error) throw error;
      return data || [];
    },
  });

  const { data: students, isLoading: studentsLoading } = useQuery<Profile[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('first_name');

      if (error) throw error;
      return data || [];
    },
  });

  const updateUser = useMutation({
    mutationFn: async (data: {
      id: string;
      first_name?: string;
      last_name?: string;
      phone_number?: string;
      address?: string;
      role?: string;
    }) => {
      const { id, ...updateData } = data;
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "User updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "User deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    users: users || [],
    teachers: teachers || [],
    students: students || [],
    usersLoading,
    teachersLoading,
    studentsLoading,
    updateUser,
    deleteUser,
  };
}