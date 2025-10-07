import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

interface UserCourse {
  id: string;
  user_id: string;
  course_id: string;
  instructor_confirmed: boolean;
  payment_status: string;
  onboarding_step: number;
  lessons_remaining: number;
  purchased_at: string;
  documents_uploaded: boolean;
  course: {
    id: string;
    name: string;
    description: string | null;
    duration_hours: number;
    price: number;
    is_active: boolean;
  };
}

export function useUserCourse() {
  const { user } = useAuth();

  const { data: userCourse, isLoading: courseLoading } = useQuery<UserCourse | null>({
    queryKey: ['user-course', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_courses')
        .select('*, course:courses(*)')
        .eq('user_id', user.id)
        .eq('instructor_confirmed', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user course:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Poll every 5 seconds to catch approval updates
  });

  return {
    userCourse,
    courseLoading,
  };
}
