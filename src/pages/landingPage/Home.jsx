import React from "react";
import {
  HeroSection,
  Navbar,
  Companies,
  Courses,
  Navigate,
  Categories,
  FeedBack,
  CTA,
  Footer,
} from "./components";

const HomePage = () => {
  return (
    <div className="app bg-gray-50">
      <Navbar />
      <HeroSection />
      <Companies />
      <Courses />
      <Navigate />
      <Categories />
      <FeedBack />
      <CTA />
      <Footer />
    </div>
  );
};
export default HomePage;