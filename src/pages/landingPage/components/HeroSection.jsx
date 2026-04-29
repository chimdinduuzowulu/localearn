import React, { useEffect, useState } from "react";
import heroImg from "../assets/language.png";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault();
    setDeferredPrompt(event);
    setIsInstalled(false);
  };

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const isAppInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      localStorage.getItem("isInstalled") === "true";
    if (isAppInstalled) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsInstalled(true);
          localStorage.setItem("isInstalled", "true");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-16 px-4">
      <div className="md:max-w-[1200px] mx-auto grid md:grid-cols-2 gap-8 items-center">
        <motion.div 
          className="flex flex-col justify-start gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Learn in Your{" "}
            <span className="text-[#B58A4B]">Native Language</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Access over <span className="text-[#33468a] font-semibold">100+ courses</span> 
            prepared in your native languages. Quality education should have no language barriers.
          </p>
          
          <p className="text-lg font-semibold text-[#33468a]">
            Enjoy uninterrupted learning anytime, anywhere.
            <br />
            <span className="text-blue-600">No Data? No Problem.</span>
          </p>
          
          {!isInstalled && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={handleInstallClick}
                className="px-8 py-4 bg-[#33468a] text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 font-medium text-lg flex items-center gap-2 animate-pulse"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Install App for Free
              </button>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center"
        >
          <img 
            src={heroImg} 
            alt="People learning in native languages" 
            className="w-full max-w-md md:max-w-lg transform hover:scale-105 transition-transform duration-500" 
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;