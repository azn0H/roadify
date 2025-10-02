import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface PendingApproval {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string | null;
  address: string | null;
  created_at: string;
  approval_status: string;
  rejection_reason: string | null;
}

export function useApprovals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingApprovals, isLoading: approvalsLoading } = useQuery<PendingApproval[]>({
    queryKey: ['pending-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const approveAccount = useMutation({
    mutationFn: async (userId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Account approved successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to approve account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectAccount = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: 'rejected',
          rejection_reason: reason,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Account rejected",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to reject account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStudentDocuments = async (studentId: string) => {
    const { data, error } = await supabase
      .storage
      .from('student-documents')
      .list(studentId);

    if (error) throw error;
    return data || [];
  };

  const getDocumentUrl = (studentId: string, fileName: string) => {
    const { data } = supabase
      .storage
      .from('student-documents')
      .getPublicUrl(`${studentId}/${fileName}`);

    return data.publicUrl;
  };

  return {
    pendingApprovals: pendingApprovals || [],
    approvalsLoading,
    approveAccount,
    rejectAccount,
    getStudentDocuments,
    getDocumentUrl,
  };
}
