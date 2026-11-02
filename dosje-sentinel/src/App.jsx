import { useState } from "react";
import Login from "./pages/Login";
import InstitutePortal from "./pages/InstitutePortal";
import InspectorPortal from "./pages/InspectorPortal";
import AdminPortal from "./pages/AdminPortal";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login onLogin={setUser} />;

  const handleLogout = () => setUser(null);

  if (user.role === "admin") return <AdminPortal user={user} onLogout={handleLogout} />;
  if (user.role === "inspector") return <InspectorPortal user={user} onLogout={handleLogout} />;
  return <InstitutePortal user={user} onLogout={handleLogout} />;
}
