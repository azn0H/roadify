import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleBasedRoute } from "./components/RoleBasedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const App = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/student-dashboard" element={
      <RoleBasedRoute allowedRoles={['student']}>
        <StudentDashboard />
      </RoleBasedRoute>
    } />
    <Route path="/teacher-dashboard" element={
      <RoleBasedRoute allowedRoles={['teacher']}>
        <TeacherDashboard />
      </RoleBasedRoute>
    } />
    <Route path="/admin-dashboard" element={
      <RoleBasedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </RoleBasedRoute>
    } />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
