import { Route, Routes } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { subscribeUser } from "./utils/notification";

import HomePage from "./pages/landingPage/Home";
import PrivacyPolicy from "./pages/Privacy";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Profile from "./pages/auth/Profile";
import Dashboard from "./pages/Dashboard";
import _404 from "./pages/404";
import Blank from "./components/Blank";

import StudentLibrary from "./pages/student/StudentLibrary";
import StudyPage from "./pages/student/StudyPage";
import QuizPage from "./pages/student/QuizPage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ViewDocument from "./pages/teacher/ViewDocument";
import { AuthProvider } from "./context/AuthContext";

function App() {
  useEffect(() => {
    subscribeUser();

    const handleOnline = () => toast.success("✅ You are back online");
    const handleOffline = () => toast.error("📡 You are offline — some features may be limited");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* Student dashboard */}
        <Route path="/index" element={<Dashboard />} />
        <Route path="/courses" element={<StudentLibrary />} />
        <Route path="/study/:documentId" element={<StudyPage />} />
        <Route path="/quiz/:documentId" element={<QuizPage />} />

        {/* Teacher portal */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/view-document/:documentId" element={<ViewDocument />} />

        {/* Misc */}
        <Route path="/blank" element={<Blank />} />
        <Route path="/*" element={<_404 />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;