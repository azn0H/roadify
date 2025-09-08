import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function AdminDashboard() {
  const recentUsers = [
    { name: "Alex Thompson", email: "alex@email.com", role: "Student", joinDate: "Mar 10, 2024" },
    { name: "Sarah Johnson", email: "sarah@email.com", role: "Teacher", joinDate: "Mar 8, 2024" },
    { name: "Mike Chen", email: "mike@email.com", role: "Student", joinDate: "Mar 5, 2024" }
  ];

  const courses = [
    { name: "Basic Driving Course", price: "$299", enrolled: 45, revenue: "$13,455" },
    { name: "Intensive Course", price: "$599", enrolled: 32, revenue: "$19,168" },
    { name: "Advanced Driving", price: "$399", enrolled: 28, revenue: "$11,172" }
  ];

  const teachers = [
    { name: "Sarah Johnson", students: 24, rating: 4.9, lessons: 156 },
    { name: "Mike Chen", students: 19, rating: 4.7, lessons: 142 },
    { name: "Emma Davis", students: 21, rating: 4.8, lessons: 134 }
  ];

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
            value="247"
            description="Active users in system"
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 15, label: "from last month" }}
          />
          <DashboardCard
            title="Monthly Revenue"
            value="$43,927"
            description="Current month earnings"
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 8, label: "from last month" }}
          />
          <DashboardCard
            title="Total Bookings"
            value="156"
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
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{user.role}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{user.joinDate}</p>
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
                    {[
                      { name: "Alex Thompson", email: "alex@email.com", role: "Student", status: "Active", lessons: 8 },
                      { name: "Sarah Johnson", email: "sarah@email.com", role: "Teacher", status: "Active", lessons: 156 },
                      { name: "Mike Chen", email: "mike@email.com", role: "Student", status: "Active", lessons: 12 },
                      { name: "Emma Davis", email: "emma@email.com", role: "Teacher", status: "Active", lessons: 134 }
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge 
                            variant={user.status === 'Active' ? 'default' : 'secondary'}
                            className={user.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {user.role === 'Student' ? `${user.lessons} lessons` : `${user.lessons} taught`}
                          </span>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
                    <Button size="sm" variant="automotive">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
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
                            <span className="font-medium text-primary">{course.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Enrolled: </span>
                            <span className="font-medium">{course.enrolled} students</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Revenue: </span>
                            <span className="font-medium text-green-600">{course.revenue}</span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    {teachers.map((teacher, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold">{teacher.name}</h5>
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
                            <span className="font-medium">{teacher.students}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rating: </span>
                            <span className="font-medium text-accent">{teacher.rating}/5</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Lessons: </span>
                            <span className="font-medium">{teacher.lessons} taught</span>
                          </div>
                        </div>
                      </div>
                    ))}
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