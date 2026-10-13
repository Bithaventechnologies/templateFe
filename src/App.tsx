import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Routes } from "./routes/routes";

export default function App() {
  return <AuthProvider><RouterProvider router={Routes} /></AuthProvider>;
}
