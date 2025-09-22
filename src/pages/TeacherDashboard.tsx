import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddNotesDialog } from "@/components/AddNotesDialog";
import { ViewScheduleDialog } from "@/components/ViewScheduleDialog";
import { 
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  AlertTriangle,
  MapPin,
  BookOpen,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLessons } from "@/hooks/use-lessons";
import { useUsers } from "@/hooks/use-users";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const { lessons, lessonsLoading, profile } = useLessons();
  const { students } = useUsers();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const teacherLessons = lessons?.filter(lesson => lesson.teacher_id === profile?.id) || [];
  const todayLessons = teacherLessons?.filter(lesson => 
    format(new Date(lesson.lesson_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ) || [];
  
  const teacherStudents = students?.filter(student => 
    teacherLessons.some(lesson => lesson.student_id === student.id)
  ) || [];

    const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Vítej zpět{profile?.first_name ? ` ${profile.first_name}` : ''}. 👋
          </h1>
          <p className="text-muted-foreground">Učitelský dashboard</p>
        </div>


        <div className="flex items-center gap-2">
          <ViewScheduleDialog>
            <Button variant="automotive">
              Učitelský Rozvrh
            </Button>
          </ViewScheduleDialog>

        {/*  <AddNotesDialog lessonId="" currentNotes="">
            <Button variant="automotive">
              Přidat Poznámky
            </Button>
          </AddNotesDialog>*/}

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
            title="Active Students"
            value={teacherStudents.length}
            description="Currently teaching"
            icon={<Users className="h-5 w-5" />}
          />
          <DashboardCard
            title="Lessons This Week"
            value={teacherLessons.length}
            description={`${teacherLessons.filter(l => l.status === 'completed').length} completed, ${teacherLessons.filter(l => l.status !== 'completed').length} upcoming`}
            icon={<Calendar className="h-5 w-5" />}
          />
          <DashboardCard
            title="Success Rate"
            value="94%"
            description="Student pass rate"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: 2, label: "improvement" }}
          />
          <DashboardCard
            title="Average Rating"
            value="4.8"
            description="Student feedback"
            icon={<Star className="h-5 w-5" />}
          />
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full lg:w-[400px] grid-cols-3">
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today's Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayLessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-medium text-sm">{lesson.lesson_time}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{lesson.student?.first_name} {lesson.student?.last_name}</p>
                          <p className="text-sm text-muted-foreground">{lesson.course?.name}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {lesson.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}
                          className={lesson.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {lesson.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {todayLessons.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No lessons scheduled for today
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Student Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teacherStudents.map((student, index) => {
                    const studentLessons = teacherLessons.filter(lesson => lesson.student_id === student.id);
                    const completedLessons = studentLessons.filter(lesson => lesson.status === 'completed');
                    const progress = studentLessons.length > 0 ? Math.round((completedLessons.length / studentLessons.length) * 100) : 0;
                    const nextLesson = studentLessons.find(lesson => new Date(lesson.lesson_date) >= new Date());
                    
                    return (
                      <div key={student.id} className="p-6 bg-muted/30 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{student.first_name} {student.last_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Next lesson: {nextLesson ? `${format(new Date(nextLesson.lesson_date), 'MMM dd, h:mm a')}` : 'Not scheduled'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {progress < 50 && (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            )}
                            <Badge variant={progress >= 50 ? 'default' : 'secondary'}>
                              {progress >= 50 ? 'Active' : 'Needs Attention'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Overall Progress</span>
                              <span className="text-muted-foreground">{progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all" 
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">{completedLessons.length}</p>
                              <p className="text-xs text-muted-foreground">Lessons Completed</p>
                            </div>
                            <AddNotesDialog lessonId={nextLesson?.id || ""} currentNotes="">
                              <Button size="sm" variant="outline" disabled={!nextLesson}>
                                Add Notes
                              </Button>
                            </AddNotesDialog>
                            <Button size="sm" variant="automotive">
                              Schedule Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {teacherStudents.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No students assigned yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Pending Lesson Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherLessons
                    .filter(lesson => lesson.status === 'pending')
                    .map((lesson, index) => (
                    <div key={lesson.id} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{lesson.student?.first_name} {lesson.student?.last_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Requested: {format(new Date(lesson.lesson_date), 'MMM dd, yyyy')} at {lesson.lesson_time}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {lesson.course?.name}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Location: {lesson.location}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="automotive">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="ghost">
                          Decline
                        </Button>
                      </div>
                    </div>
                    ))}
                  {teacherLessons.filter(lesson => lesson.status === 'pending').length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No pending requests
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}