import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Details from "./pages/details";
import Dashboard from "./pages/dashboard";
import View from "./pages/view";
import "./index.css";
import Chat from "./pages/chat";
import Inbox from "./pages/inbox";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/details" element={<Details />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view" element={<View />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
