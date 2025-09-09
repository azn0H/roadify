import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCourseDialog } from "@/components/AddCourseDialog";
import { 
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Settings,
  Shield,
  BookOpen,
  Car,
  PlusCircle,
  Edit,
  Trash2
} from "lucide-react";
import { useUsers } from "@/hooks/use-users";
import { useCourses } from "@/hooks/use-courses";
import { useLessons } from "@/hooks/use-lessons";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { users, teachers } = useUsers();
  const { allCourses } = useCourses();
  const { lessons } = useLessons();

  const recentUsers = users?.slice(0, 3) || [];
  const totalRevenue = 43927; // This would come from actual payment data
  const totalBookings = lessons?.length || 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive overview of Rodify Driving School operations.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="automotive">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Users"
            value={users?.length || 0}
            description="Active users in system"
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 15, label: "from last month" }}
          />
          <DashboardCard
            title="Monthly Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            description="Current month earnings"
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 8, label: "from last month" }}
          />
          <DashboardCard
            title="Total Bookings"
            value={totalBookings}
            description="This month"
            icon={<Calendar className="h-5 w-5" />}
            trend={{ value: 22, label: "from last month" }}
          />
          <DashboardCard
            title="Success Rate"
            value="95%"
            description="Overall pass rate"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: 3, label: "improvement" }}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-[600px] grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-semibold text-lg">$43,927</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Month</span>
                      <span className="font-medium">$40,651</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Growth</span>
                      <span className="font-medium text-green-600">+8.1%</span>
                    </div>
                    <div className="mt-6">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">68% of monthly target</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Recent Registrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUsers.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{user.role}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{format(new Date(user.created_at), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">All Users</h4>
                    <Button size="sm" variant="automotive">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {users?.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{user.first_name} {user.last_name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge 
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(user.created_at), 'MMM dd, yyyy')}
                          </span>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Course Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">All Courses</h4>
                    <AddCourseDialog>
                      <Button size="sm" variant="automotive">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Course
                      </Button>
                    </AddCourseDialog>
                  </div>
                  <div className="space-y-4">
                    {allCourses?.map((course, index) => (
                      <div key={course.id} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold">{course.name}</h5>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-medium text-primary">${course.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration: </span>
                            <span className="font-medium">{course.duration_hours} hours</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status: </span>
                            <span className="font-medium text-green-600">{course.is_active ? 'Active' : 'Inactive'}</span>
                          </div>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Teacher Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">All Teachers</h4>
                    <Button size="sm" variant="automotive">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Teacher
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {teachers?.map((teacher, index) => {
                      const teacherLessons = lessons?.filter(lesson => lesson.teacher_id === teacher.id) || [];
                      const teacherStudents = users?.filter(user => 
                        user.role === 'student' && teacherLessons.some(lesson => lesson.student_id === user.id)
                      ) || [];
                      
                      return (
                        <div key={teacher.id} className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold">{teacher.first_name} {teacher.last_name}</h5>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                View Profile
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Students: </span>
                              <span className="font-medium">{teacherStudents.length}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Rating: </span>
                              <span className="font-medium text-accent">4.8/5</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Lessons: </span>
                              <span className="font-medium">{teacherLessons.length} taught</span>
                            </div>
                          </div>
                        </div>
                      );
                    }) || []}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}