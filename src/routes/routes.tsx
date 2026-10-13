import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Templates from "../pages/Templates";
import CreateTemplate from "../pages/CreateTemplate";
import EditTemplate from "../pages/EditTemplate";
import EmailComposer from "../pages/EmailComposer";
import EmailHistory from "../pages/EmailHistory";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

function ProtectedRoute() {
  const { status } = useAuth(); const location = useLocation();
  if (status === "checking") return <main className="grid min-h-screen place-items-center" role="status">Checking your session…</main>;
  return status === "signedIn" ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
function LoginRoute() { const { status } = useAuth(); return status === "checking" ? <main className="grid min-h-screen place-items-center">Checking your session…</main> : status === "signedIn" ? <Navigate to="/dashboard" replace /> : <Login />; }
function RootRedirect() { const { status } = useAuth(); return status === "checking" ? <main className="grid min-h-screen place-items-center">Checking your session…</main> : <Navigate to={status === "signedIn" ? "/dashboard" : "/login"} replace />; }

export const Routes = createBrowserRouter([
  { path: "/", element: <RootRedirect /> }, { path: "/login", element: <LoginRoute /> },
  { element: <ProtectedRoute />, children: [{ element: <DashboardLayout />, children: [
    { path: "/dashboard", element: <Dashboard /> }, { path: "/templates", element: <Templates /> },
    { path: "/templates/new", element: <CreateTemplate /> }, { path: "/templates/:id/edit", element: <EditTemplate /> },
    { path: "/compose", element: <EmailComposer /> }, { path: "/history", element: <EmailHistory /> }, { path: "/settings", element: <Settings /> },
  ] }] }, { path: "*", element: <NotFound /> },
]);
