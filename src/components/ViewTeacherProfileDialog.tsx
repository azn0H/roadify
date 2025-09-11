import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  BookOpen,
  Users,
  Clock
} from "lucide-react";
import { useLessons } from "@/hooks/use-lessons";
import { useUsers } from "@/hooks/use-users";
import { format } from "date-fns";

interface Teacher {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface ViewTeacherProfileDialogProps {
  teacher: Teacher;
  children: React.ReactNode;
}

export function ViewTeacherProfileDialog({ teacher, children }: ViewTeacherProfileDialogProps) {
  const { lessons } = useLessons();
  const { users } = useUsers();
  
  const teacherLessons = lessons?.filter(lesson => lesson.teacher_id === teacher.id) || [];
  const teacherStudents = users?.filter(user => 
    user.role === 'student' && teacherLessons.some(lesson => lesson.student_id === user.id)
  ) || [];
  
  const completedLessons = teacherLessons.filter(lesson => lesson.status === 'completed').length;
  const pendingLessons = teacherLessons.filter(lesson => lesson.status === 'pending').length;
  const averageRating = 4.8; // This would come from actual ratings data

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Teacher Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={teacher.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{teacher.first_name} {teacher.last_name}</h3>
                  <p className="text-muted-foreground">Driving Instructor</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-accent fill-current" />
                    <span className="text-sm font-medium">{averageRating}</span>
                    <span className="text-sm text-muted-foreground">({teacherLessons.length} lessons)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{teacher.email}</span>
                </div>
                {teacher.phone_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{teacher.phone_number}</span>
                  </div>
                )}
                {teacher.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{teacher.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {format(new Date(teacher.created_at), 'MMM yyyy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{completedLessons}</div>
                <div className="text-sm text-muted-foreground">Completed Lessons</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{teacherStudents.length}</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{pendingLessons}</div>
                <div className="text-sm text-muted-foreground">Pending Lessons</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Students */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teacherStudents.slice(0, 5).map((student) => {
                  const studentLessons = teacherLessons.filter(lesson => lesson.student_id === student.id);
                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm">
                            {student.first_name?.[0]}{student.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{student.first_name} {student.last_name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {studentLessons.length} lessons
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                {teacherStudents.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-4">
                    No students assigned yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Rating</span>
                  <span className="font-semibold">{averageRating}/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Teaching Hours</span>
                  <span className="font-semibold">{completedLessons * 2} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <span className="font-semibold">5+ years</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}