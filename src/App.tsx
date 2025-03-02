import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CourseListPage from "./pages/admin/CourseListPage";
import CourseFormPage from "./pages/admin/CourseFormPage";
import CourseDetailPage from "./pages/admin/CourseDetailPage";
import ModuleFormPage from "./pages/admin/ModuleFormPage";
import ModuleDetailPage from "./pages/admin/ModuleDetailPage";
import MaterialFormPage from "./pages/admin/MaterialFormPage";
import AuthGuard from "./components/auth/AuthGuard";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <AuthGuard requireAuth={false}>
                <LoginPage />
              </AuthGuard>
            }
          />
          <Route
            path="/register"
            element={
              <AuthGuard requireAuth={false}>
                <RegisterPage />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminDashboardPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <AuthGuard>
                <CourseListPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/courses/new"
            element={
              <AuthGuard>
                <CourseFormPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/courses/:id"
            element={
              <AuthGuard>
                <CourseDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/courses/:id/edit"
            element={
              <AuthGuard>
                <CourseFormPage />
              </AuthGuard>
            }
          />

          {/* Module Routes */}
          <Route
            path="/admin/courses/:courseId/modules/new"
            element={
              <AuthGuard>
                <ModuleFormPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/modules/:id"
            element={
              <AuthGuard>
                <ModuleDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/modules/:id/edit"
            element={
              <AuthGuard>
                <ModuleFormPage />
              </AuthGuard>
            }
          />

          {/* Material Routes */}
          <Route
            path="/admin/modules/:moduleId/materials/new"
            element={
              <AuthGuard>
                <MaterialFormPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/materials/:id/edit"
            element={
              <AuthGuard>
                <MaterialFormPage />
              </AuthGuard>
            }
          />
          {/* Tempo route catch-all */}
          <Route path="/tempobook/*" element={<div />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
