import React, { useState, useEffect } from "react";
import Logo from "../assets/wootlab-logo.png";
import lock from "../assets/lock.svg";
import Hamburger from "../assets/hamburgerMenu.svg";
import Close from "../assets/close.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`w-full h-[80px] bg-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
      <div className="p-4 md:max-w-[1200px] max-w-[400px] mx-auto w-full h-full flex justify-between items-center">
        <img 
          src={Logo} 
          alt="logo" 
          className="h-[50px] cursor-pointer" 
          onClick={() => navigate("/")}
        />
        
        <div className="md:flex hidden items-center gap-4">
          <button
            className="flex items-center bg-transparent px-6 gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            onClick={() => navigate("/login")}
          >
            <img src={lock} alt="lock" className="h-4 w-4" />
            Login
          </button>
          <button
            className="px-6 py-2 bg-[#33468a] text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
            onClick={() => navigate("/signup")}
          >
            Create account
          </button>
        </div>
        
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="md:hidden cursor-pointer p-2"
          onClick={handleToggle}
        >
          <img src={toggle ? Close : Hamburger} alt="menu" className="h-6 w-6" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <button
                className="flex items-center justify-center border border-gray-300 bg-transparent px-6 gap-2 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => {
                  navigate("/login");
                  setToggle(false);
                }}
              >
                <img src={lock} alt="lock" className="h-4 w-4" />
                Login
              </button>
              <button
                className="px-6 py-3 bg-[#33468a] text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                onClick={() => {
                  navigate("/signup");
                  setToggle(false);
                }}
              >
                Create account
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;