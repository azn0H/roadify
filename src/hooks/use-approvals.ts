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

      // Update profile with rejection
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          approval_status: 'rejected',
          rejection_reason: reason,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Reset user course to document upload step
      const { error: courseError } = await supabase
        .from('user_courses')
        .update({
          onboarding_step: 3,
          documents_uploaded: false,
          instructor_confirmed: false,
        })
        .eq('user_id', userId);

      if (courseError) throw courseError;

      // Create notification for the student
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Účet nebyl schválen',
          message: `Váš účet nebyl schválen. Důvod: ${reason}. Prosím nahrajte nové dokumenty.`,
          type: 'rejection',
          is_read: false,
        });

      if (notificationError) throw notificationError;
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

  const getDocumentUrl = async (studentId: string, fileName: string) => {
    const { data, error } = await supabase
      .storage
      .from('student-documents')
      .createSignedUrl(`${studentId}/${fileName}`, 3600); // 1 hour expiry

    if (error) throw error;
    return data?.signedUrl || '';
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
