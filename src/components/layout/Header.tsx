import React, { useState, useEffect } from "react";
import { HiSearch, HiBell, HiMenu, HiLogout } from "react-icons/hi";
import { useNavigate } from "react-router";

interface HeaderProps {
  toggleSideNav: () => void;
}

interface UserData {
  signUpData: {
    fname: string;
    lname: string;
    email: string;
    password: string;
  };
}

const Header: React.FC<HeaderProps> = ({ toggleSideNav }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const parsedData = JSON.parse(userDataString);
        setUserData(parsedData);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  // Function to generate avatar from initials
  const getAvatarInitials = (fname: string, lname: string) => {
    return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase();
  };

  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("language");
    
    // Close the profile menu
    setIsProfileMenuOpen(false);
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            onClick={toggleSideNav}
          >
            <HiMenu className="w-6 h-6" />
          </button>
          
          <div className="relative ml-4 md:ml-0 md:w-64 lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              type="text"
              placeholder="Search for a course"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <HiBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {isNotificationsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-2 px-4 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">New course available</p>
                    <p className="text-sm text-gray-500">Basic Mathematics is now available</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Assignment reminder</p>
                    <p className="text-sm text-gray-500">Your assignment is due tomorrow</p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                </div>
                <div className="py-2 px-4 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center focus:outline-none"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {userData ? getAvatarInitials(userData.signUpData.fname, userData.signUpData.lname) : "U"}
              </div>
            </button>
            
            {isProfileMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-900">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userData ? userData.signUpData.email : "user@example.com"}
                    </p>
                  </div>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    Your Profile
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    Settings
                  </button>
                  <button 
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                    onClick={handleSignOut}
                  >
                    <HiLogout className="mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;