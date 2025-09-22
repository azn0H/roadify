import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCourseDialog } from "@/components/AddCourseDialog";
import { EditCourseDialog } from "@/components/EditCourseDialog";
import { AddUserDialog } from "@/components/AddUserDialog";
import { EditUserDialog } from "@/components/EditUserDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ViewTeacherProfileDialog } from "@/components/ViewTeacherProfileDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { SaleCodeGenerator } from "@/components/SaleCodeGenerator";
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
  Trash2,
  Ticket,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUsers } from "@/hooks/use-users";
import { useCourses } from "@/hooks/use-courses";
import { useLessons } from "@/hooks/use-lessons";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { users, teachers, deleteUser } = useUsers();
  const { allCourses, deleteCourse } = useCourses();
  const { lessons, profile } = useLessons();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const recentUsers = users?.slice(0, 3) || [];
  const totalRevenue = 43927; // This would come from actual payment data
  const totalBookings = lessons?.length || 0;

   const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground"> Vítej zpět,{profile?.first_name ? ` ${profile.first_name}` : ''}. 👋</h1>
            <p className="text-muted-foreground">
              Admin dashboard
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SaleCodeGenerator>
              <Button variant="outline">
                <Ticket className="h-4 w-4 mr-2" />
                Slevové kódy
              </Button>
            </SaleCodeGenerator>
            <SettingsDialog>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Nastavení
              </Button>
            </SettingsDialog>
            <AddUserDialog>
              <Button variant="automotive">
                <PlusCircle className="h-4 w-4 mr-2" />
                Přidat uživatele
              </Button>
            </AddUserDialog>
             {user && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full self-center">
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
            title="Uživatelé"
            value={users?.length || 0}
            description="Active users in system"
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 15, label: "from last month" }}
          />
          <DashboardCard
            title="Měsíčný příjem"
            value={`${totalRevenue.toLocaleString()} Kč`}
            description="Current month earnings"
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 8, label: "from last month" }}
          />
          <DashboardCard
            title="Počet rezervací"
            value={totalBookings}
            description="This month"
            icon={<Calendar className="h-5 w-5" />}
            trend={{ value: 22, label: "from last month" }}
          />
          <DashboardCard
            title="úspěšnost"
            value="95%"
            description="Overall pass rate"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: 3, label: "improvement" }}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-[700px] grid-cols-5">
            <TabsTrigger value="overview">Přehled</TabsTrigger>
            <TabsTrigger value="users">Všichni uživatelé</TabsTrigger>
            <TabsTrigger value="courses">Kurzy</TabsTrigger>
            <TabsTrigger value="teachers">Učitelé</TabsTrigger>
            <TabsTrigger value="students">Studenti</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Analýza příjmů
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tento měsíc</span>
                      <span className="font-semibold text-lg">{totalRevenue.toLocaleString()} Kč</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Minulý měsíc</span>
                      <span className="font-medium">40,651 Kč</span>
                    </div>
                      <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Zvýšen</span>
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
                    Nedávno registrovaní uživatelé
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
                  Uživatelé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Všichni uživatelé</h4>
                    <AddUserDialog>
                      <Button size="sm" variant="automotive">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Přidat uživatele
                      </Button>
                    </AddUserDialog>
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
                            Aktivní
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(user.created_at), 'MMM dd, yyyy')}
                          </span>
                          <EditUserDialog user={user}>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </EditUserDialog>
                          <DeleteConfirmDialog
                            title="Smazat uživatele"
                            description={`Opravndu chcete smazat uživatele ${user.first_name} ${user.last_name}? Tato akce je nevratná.`}
                            onConfirm={() => deleteUser.mutate(user.id)}
                            isLoading={deleteUser.isPending}
                          >
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DeleteConfirmDialog>
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
                  Kurzy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Všechny kurzy</h4>
                    <AddCourseDialog>
                      <Button size="sm" variant="automotive">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Přidat kurz
                      </Button>
                    </AddCourseDialog>
                  </div>
                  <div className="space-y-4">
                    {allCourses?.map((course, index) => (
                      <div key={course.id} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold">{course.name}</h5>
                          <div className="flex items-center gap-2">
                            <EditCourseDialog course={course}>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Upravit
                              </Button>
                            </EditCourseDialog>
                            <DeleteConfirmDialog
                              title="Delete Course"
                              description={`Are you sure you want to delete the course "${course.name}"? This action cannot be undone.`}
                              onConfirm={() => deleteCourse.mutate(course.id)}
                              isLoading={deleteCourse.isPending}
                            >
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DeleteConfirmDialog>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Cena: </span>
                            <span className="font-medium text-primary">{course.price} Kč</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Délka: </span>
                            <span className="font-medium">{course.duration_hours} hodin</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status: </span>
                            <span className="font-medium text-green-600">{course.is_active ? 'Aktivní' : 'Neaktivní'}</span>
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
                  Učitelé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Všichni Učitelé</h4>
                    <AddUserDialog>
                      <Button size="sm" variant="automotive">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Přidat učitele
                      </Button>
                    </AddUserDialog>
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
                              <ViewTeacherProfileDialog teacher={teacher}>
                                <Button size="sm" variant="outline">
                                  Zobrazit profil
                                </Button>
                              </ViewTeacherProfileDialog>
                              <EditUserDialog user={teacher}>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </EditUserDialog>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Studenti: </span>
                              <span className="font-medium">{teacherStudents.length}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Hodnocení: </span>
                              <span className="font-medium text-accent">4.8/5</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Hodiny: </span>
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

                    <TabsContent value="students" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Studenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Všichni studenti</h4>
                    <AddUserDialog>
                      <Button size="sm" variant="automotive">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Přidat studenta
                      </Button>
                    </AddUserDialog>
                  </div>
                  <div className="space-y-4">
                    {teachers?.map((student, index) => {
                      const teacherLessons = lessons?.filter(lesson => lesson.teacher_id === student.id) || [];
                      const teacherStudents = users?.filter(user => 
                        user.role === 'student' && teacherLessons.some(lesson => lesson.student_id === user.id)
                      ) || [];
                      
                      return (
                        <div key={student.id} className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold">{student.first_name} {student.last_name}</h5>
                            <div className="flex items-center gap-2">
                              
                              <EditUserDialog user={student}>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </EditUserDialog>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Studenti: </span>
                              <span className="font-medium">{student.email}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Kurz: </span>
                              <span className="font-medium">{}</span>
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