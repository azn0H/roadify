import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookLessonDialog } from "@/components/BookLessonDialog";
import { RescheduleDialog } from "@/components/RescheduleDialog";
import { StudentOnboarding } from "@/components/StudentOnboarding";
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLessons } from "@/hooks/use-lessons";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function StudentDashboard() {
  const { user, signOut } = useAuth();
  const { lessons, lessonsLoading, profile } = useLessons();
  const [userCourse, setUserCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  useEffect(() => {
    fetchUserCourse();
  }, [user]);

  const fetchUserCourse = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_courses')
      .select('*, course:courses(*)')
      .eq('user_id', user.id)
      .eq('instructor_confirmed', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user course:', error);
    } else if (data) {
      setUserCourse(data);
    }
    setCourseLoading(false);
  };

  // Show onboarding if user hasn't completed enrollment
  if (!courseLoading && !userCourse) {
    return <StudentOnboarding />;
  }

  const upcomingLessons = lessons?.filter(lesson => 
    new Date(lesson.lesson_date) >= new Date() && lesson.status !== 'completed'
  ) || [];
  
  const nextLesson = upcomingLessons[0];
  const completedLessons = lessons?.filter(lesson => lesson.status === 'completed') || [];
  const totalLessons = lessons?.length || 0;
  const completionRate = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold text-foreground">
            Zdravíme,{profile?.first_name ? ` ${profile.first_name}` : ''} 👋
          </h1>
            <p className="text-muted-foreground">Vítej na Studentském dashboardu</p>
          </div>
                  <div className="flex items-center gap-2">
          <BookLessonDialog>
            <Button variant="automotive">
              <Plus className="h-4 w-4 mr-2" />
              Book New Lesson
            </Button>
          </BookLessonDialog>
          {user && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                           <Avatar className="h-8 w-8">
                           <AvatarImage src={profile.avatar_url || ''} />
                          <AvatarFallback>
                         {profile.first_name?.[0]}{profile.last_name?.[0]}
                          </AvatarFallback>
                          </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                          <div className="flex items-center gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                              <p className="font-medium">{user.email}</p>
                            </div>
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate('/profile')}>
                            <Settings className="mr-2 h-4 w-4" />
                            Nastavení
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Odhlásit se
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
        </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Lessons Remaining"
            value={Math.max(0, totalLessons - completedLessons.length)}
            description={`Out of ${totalLessons} total lessons`}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <DashboardCard
            title="Lessons Completed"
            value={completedLessons.length}
            description="Successfully finished"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <DashboardCard
            title="Progress"
            value={`${completionRate}%`}
            description="Course completion"
            icon={<Clock className="h-5 w-5" />}
          />
          <DashboardCard
            title="Next Test"
            value="2 weeks"
            description="Estimated time"
            icon={<AlertCircle className="h-5 w-5" />}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Next Lesson */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Next Lesson
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextLesson ? (
                <>
                  <div className="bg-gradient-secondary rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{format(new Date(nextLesson.lesson_date), 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{nextLesson.lesson_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{nextLesson.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Instructor: {nextLesson.teacher?.first_name} {nextLesson.teacher?.last_name}</span>
                    </div>
                    <Badge className="bg-primary/10 text-primary">
                      {nextLesson.course?.name}
                    </Badge>
                  </div>
                  <RescheduleDialog
                    lessonId={nextLesson.id}
                    currentDate={nextLesson.lesson_date}
                    currentTime={nextLesson.lesson_time}
                  >
                    <Button variant="outline" className="w-full">
                      Reschedule Lesson
                    </Button>
                  </RescheduleDialog>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No upcoming lessons scheduled</p>
                  <BookLessonDialog>
                    <Button variant="automotive">
                      <Plus className="h-4 w-4 mr-2" />
                      Book Your First Lesson
                    </Button>
                  </BookLessonDialog>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Lessons */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Upcoming Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingLessons.slice(1, 3).map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{format(new Date(lesson.lesson_date), 'MMMM dd, yyyy')} at {lesson.lesson_time}</p>
                      <p className="text-sm text-muted-foreground">
                        Instructor: {lesson.teacher?.first_name} {lesson.teacher?.last_name}
                      </p>
                    </div>
                    <Badge 
                      variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}
                      className={lesson.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {lesson.status}
                    </Badge>
                  </div>
                ))}
                {upcomingLessons.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No upcoming lessons
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Practical Skills</h4>
                  <div className="space-y-2">
                    {[
                      { skill: "Vehicle Controls", progress: 80 },
                      { skill: "Parking", progress: 60 },
                      { skill: "Highway Driving", progress: 40 },
                      { skill: "City Navigation", progress: 70 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.skill}</span>
                          <span className="text-muted-foreground">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Theory Knowledge</h4>
                  <div className="space-y-2">
                    {[
                      { topic: "Traffic Rules", progress: 90 },
                      { topic: "Road Signs", progress: 85 },
                      { topic: "Safety Guidelines", progress: 75 },
                      { topic: "Emergency Procedures", progress: 65 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.topic}</span>
                          <span className="text-muted-foreground">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-accent h-2 rounded-full transition-all" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}