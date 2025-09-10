import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useLessons } from "@/hooks/use-lessons";
import { format, startOfWeek, endOfWeek, isWithinInterval, addDays } from "date-fns";

interface ViewScheduleDialogProps {
  children: React.ReactNode;
}

export function ViewScheduleDialog({ children }: ViewScheduleDialogProps) {
  const { lessons, profile } = useLessons();
  
  const teacherLessons = lessons?.filter(lesson => lesson.teacher_id === profile?.id) || [];
  
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  
  const thisWeekLessons = teacherLessons.filter(lesson => 
    isWithinInterval(new Date(lesson.lesson_date), { start: weekStart, end: weekEnd })
  );
  
  const todayLessons = teacherLessons.filter(lesson => 
    format(new Date(lesson.lesson_date), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
  );
  
  const upcomingLessons = teacherLessons.filter(lesson => 
    new Date(lesson.lesson_date) > now
  ).slice(0, 10);

  const getDayLessons = (dayOffset: number) => {
    const targetDate = addDays(weekStart, dayOffset);
    return thisWeekLessons.filter(lesson => 
      format(new Date(lesson.lesson_date), 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
    );
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Overview</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="space-y-4">
            <div className="grid gap-4">
              {days.map((day, index) => {
                const dayLessons = getDayLessons(index);
                const dayDate = addDays(weekStart, index);
                
                return (
                  <Card key={day} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {day} - {format(dayDate, 'MMM dd')}
                        <Badge variant="outline" className="ml-auto">
                          {dayLessons.length} lessons
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dayLessons.length > 0 ? (
                        <div className="space-y-2">
                          {dayLessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="text-center">
                                  <Clock className="h-4 w-4 mx-auto mb-1" />
                                  <span className="text-sm font-medium">{lesson.lesson_time}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{lesson.student?.first_name} {lesson.student?.last_name}</p>
                                  <p className="text-sm text-muted-foreground">{lesson.course?.name}</p>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {lesson.location}
                                  </div>
                                </div>
                              </div>
                              <Badge variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}>
                                {lesson.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No lessons scheduled</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule - {format(now, 'MMMM dd, yyyy')}</CardTitle>
              </CardHeader>
              <CardContent>
                {todayLessons.length > 0 ? (
                  <div className="space-y-3">
                    {todayLessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <Clock className="h-4 w-4 mx-auto mb-1" />
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
                        <Badge variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No lessons scheduled for today</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingLessons.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingLessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <Calendar className="h-4 w-4 mx-auto mb-1" />
                            <p className="font-medium text-sm">{format(new Date(lesson.lesson_date), 'MMM dd')}</p>
                            <p className="text-xs text-muted-foreground">{lesson.lesson_time}</p>
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
                        <Badge variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No upcoming lessons scheduled</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}