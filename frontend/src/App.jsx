import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Details   from "./pages/Details";
import Dashboard from "./pages/Dashboard";
import View      from "./pages/View";
import Chat      from "./pages/Chat";
import Inbox     from "./pages/Inbox";
import NotFound  from "./pages/NotFound";
import { getUser } from "./utils/auth";

function PrivateRoute({ children }) {
  return getUser() ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/details"   element={<Details />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/view"      element={<PrivateRoute><View /></PrivateRoute>} />
        <Route path="/chat/:userId" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/inbox"     element={<PrivateRoute><Inbox /></PrivateRoute>} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}