import { useNavigate, useLocation } from "react-router";
import { 
  HiHome, 
  HiBookOpen, 
  HiUser, 
  HiLogout,
  HiX,
  HiAcademicCap 
} from "react-icons/hi";

interface SideNavProps {
  isOpen: boolean;
  closeSideNav: () => void;
}

function SideNav({ isOpen, closeSideNav }: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/index", icon: <HiHome className="w-5 h-5" />, label: "Dashboard" },
    { path: "/courses", icon: <HiBookOpen className="w-5 h-5" />, label: "Courses" },
    { path: "/profile", icon: <HiUser className="w-5 h-5" />, label: "Profile" },
  ];

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-blue-800 to-blue-900 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 md:hidden border-b border-blue-700">
          <div className="flex items-center">
            <HiAcademicCap className="w-8 h-8 text-white mr-2" />
            <div className="text-xl font-bold text-white">Wootlab</div>
          </div>
          <button onClick={closeSideNav} className="text-white">
            <HiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="py-6 px-4 h-full flex flex-col">
          <div className="hidden md:flex items-center mb-8">
            <HiAcademicCap className="w-8 h-8 text-white mr-2" />
            <div className="text-xl font-bold text-white">Wootlab</div>
          </div>
          
          <ul className="space-y-2 flex-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    closeSideNav();
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? "bg-blue-700 text-white shadow-inner"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3 font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-8 border-t border-blue-700">
            <button
              className="flex items-center w-full px-4 py-3 text-blue-100 hover:bg-blue-700 hover:text-white rounded-lg transition-colors duration-200 font-medium"
              onClick={() => {
                navigate("/login");
                closeSideNav();
              }}
            >
              <HiLogout className="w-5 h-5" />
              <span className="ml-3">Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideNav;