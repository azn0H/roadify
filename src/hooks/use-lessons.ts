import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

// Types for our database tables
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

interface Course {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Lesson {
  id: string;
  student_id: string;
  teacher_id: string;
  course_id: string;
  lesson_date: string;
  lesson_time: string;
  location: string;
  status: string;
  teacher_notes: string | null;
  student_notes: string | null;
  created_at: string;
  updated_at: string;
  student?: Profile;
  teacher?: Profile;
  course?: Course;
}

export function useLessons() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ['lessons', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          student:profiles!lessons_student_id_fkey(first_name, last_name),
          teacher:profiles!lessons_teacher_id_fkey(first_name, last_name),
          course:courses(name)
        `)
        .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`)
        .order('lesson_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const bookLesson = useMutation({
    mutationFn: async (lessonData: {
      teacher_id: string;
      course_id: string;
      lesson_date: string;
      lesson_time: string;
      location: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lessons')
        .insert({
          student_id: user.id,
          ...lessonData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: "Lesson booked successfully!",
        description: "Your lesson has been scheduled.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to book lesson",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateLessonNotes = useMutation({
    mutationFn: async (data: { lessonId: string; notes: string; type: 'teacher' | 'student' }) => {
      const updateField = data.type === 'teacher' ? 'teacher_notes' : 'student_notes';
      
      const { error } = await supabase
        .from('lessons')
        .update({ [updateField]: data.notes })
        .eq('id', data.lessonId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: "Notes updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update notes",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    lessons: lessons || [],
    profile,
    lessonsLoading,
    bookLesson,
    updateLessonNotes,
  };
}