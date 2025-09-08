import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";

export default function StudentDashboard() {
  const nextLesson = {
    date: "March 15, 2024",
    time: "2:00 PM",
    location: "Downtown Training Center", 
    instructor: "Sarah Johnson",
    type: "Practical Driving"
  };

  const upcomingLessons = [
    {
      date: "March 18, 2024",
      time: "10:00 AM", 
      instructor: "Mike Chen",
      status: "confirmed"
    },
    {
      date: "March 22, 2024",
      time: "3:00 PM",
      instructor: "Sarah Johnson", 
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Alex! Track your progress and manage your lessons.</p>
          </div>
          <Button variant="automotive">
            <Plus className="h-4 w-4 mr-2" />
            Book New Lesson
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Lessons Remaining"
            value="8"
            description="Out of 12 total lessons"
            icon={<BookOpen className="h-5 w-5" />}
          />
          <DashboardCard
            title="Lessons Completed"
            value="4"
            description="Successfully finished"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <DashboardCard
            title="Progress"
            value="33%"
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
              <div className="bg-gradient-secondary rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{nextLesson.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{nextLesson.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{nextLesson.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Instructor: {nextLesson.instructor}</span>
                </div>
                <Badge className="bg-primary/10 text-primary">
                  {nextLesson.type}
                </Badge>
              </div>
              <Button variant="outline" className="w-full">
                Reschedule Lesson
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Lessons */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Upcoming Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingLessons.map((lesson, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{lesson.date} at {lesson.time}</p>
                      <p className="text-sm text-muted-foreground">
                        Instructor: {lesson.instructor}
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