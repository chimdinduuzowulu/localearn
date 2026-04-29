import {
  FaHome,
  FaUserCircle,
  FaRegArrowAltCircleRight,
  FaDiscourse,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router";

function BottomStackNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-lg flex flex-row justify-around items-center px-4 z-50">
      <button 
        onClick={() => navigate("/index")}
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors duration-200 ${
          isActive("/index") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600"
        }`}
      >
        <FaHome className="text-xl" />
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button 
        onClick={() => navigate("/courses")}
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors duration-200 ${
          isActive("/courses") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600"
        }`}
      >
        <FaDiscourse className="text-xl" />
        <span className="text-xs mt-1">Courses</span>
      </button>
      
      <button 
        onClick={() => navigate("/profile")}
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors duration-200 ${
          isActive("/profile") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600"
        }`}
      >
        <FaUserCircle className="text-xl" />
        <span className="text-xs mt-1">Profile</span>
      </button>
      
      <button 
        onClick={() => navigate("/login")}
        className="flex flex-col items-center justify-center w-16 h-16 rounded-lg text-gray-600 hover:text-red-600 transition-colors duration-200"
      >
        <FaRegArrowAltCircleRight className="text-xl" />
        <span className="text-xs mt-1">Logout</span>
      </button>
    </div>
  );
}

export default BottomStackNav;