import React, { useState, useEffect } from "react";
import Logo from "../assets/wootlab-logo.png";
import lock from "../assets/lock.svg";
import Hamburger from "../assets/hamburgerMenu.svg";
import Close from "../assets/close.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Features", anchor: "#features" },
  { label: "Courses", anchor: "#courses" },
  { label: "About", anchor: "#about" },
];

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (anchor) => {
    setToggle(false);
    const target = document.querySelector(anchor);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={`w-full h-[80px] bg-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="px-4 md:px-8 max-w-[1200px] mx-auto w-full h-full flex justify-between items-center">
        {/* Logo */}
        <img
          src={Logo}
          alt="Wootlab Academy"
          className="h-[50px] cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop nav */}
        <div className="md:flex hidden items-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.anchor}
              onClick={() => handleSmoothScroll(link.anchor)}
              className="text-gray-600 hover:text-[#33468a] text-sm font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              {link.label}
            </button>
          ))}

          <button
            className="flex items-center bg-transparent px-5 gap-2 text-gray-700 hover:text-[#33468a] transition-colors duration-200 font-medium text-sm border-none cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <img src={lock} alt="lock" className="h-4 w-4" />
            Login
          </button>

          <button
            className="px-6 py-2 bg-[#33468a] text-white rounded-md hover:bg-[#27366e] transition-colors duration-200 font-medium shadow-md text-sm"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>

        {/* Mobile hamburger */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="md:hidden cursor-pointer p-2"
          onClick={() => setToggle(!toggle)}
        >
          <img
            src={toggle ? Close : Hamburger}
            alt="menu toggle"
            className="h-6 w-6"
          />
        </motion.div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.anchor}
                  onClick={() => handleSmoothScroll(link.anchor)}
                  className="text-left text-gray-600 py-2 px-4 rounded-md hover:bg-gray-50 text-sm font-medium bg-transparent border-none cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                <button
                  className="flex items-center justify-center border border-gray-300 bg-transparent px-6 gap-2 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm cursor-pointer"
                  onClick={() => {
                    navigate("/login");
                    setToggle(false);
                  }}
                >
                  <img src={lock} alt="lock" className="h-4 w-4" />
                  Login
                </button>
                <button
                  className="px-6 py-3 bg-[#33468a] text-white rounded-md hover:bg-[#27366e] transition-colors duration-200 text-sm font-medium"
                  onClick={() => {
                    navigate("/signup");
                    setToggle(false);
                  }}
                >
                  Create Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
