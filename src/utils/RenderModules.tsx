import { CoursesData } from "../../public/assets/data/CoursesData";
import { FaPlayCircle } from "react-icons/fa";
import ReactPlayer from "react-player/lazy";
import React, { useEffect, useState } from "react";
import { storePlayedVideos } from "./storePlayedVideo";
import { ICourses } from "../interfaces/ICourses";
import { IsOffline } from "./IsOffline";
import { HiOutlineDownload, HiChevronRight } from "react-icons/hi";

interface RenderModulesProps {
  course: string | undefined;
}

const RenderModules: React.FC<RenderModulesProps> = ({ course }) => {
  const defaultValue = {
    courseName: "",
    courseSubModule: 0,
    courseTotalModule: 0,
    videoLinks: [],
    offlineLinks: [],
    svgdPath: "",
  };
  
  const [courseDataState, setCourseData] = useState<ICourses>(defaultValue);
  const [progress, setProgress] = useState({ played: 0 });
  const onlineStatus = IsOffline();
  const [url, setUrl] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  console.log(courseDataState, isAdded, progress)
  useEffect(() => {
    const courseData = CoursesData.filter(
      (courseFilter) => courseFilter.courseName === course
    );

    if (courseData[0]) {
      setCourseData(courseData[0]);
      
      if (onlineStatus && courseData[0].videoLinks && courseData[0].videoLinks[0]) {
        setUrl(courseData[0].videoLinks[0]);
      } else if (!onlineStatus && courseData[0].offlineLinks && courseData[0].offlineLinks[0]) {
        setUrl(courseData[0].offlineLinks[0]);
      } else if (courseData[0].videoLinks && courseData[0].videoLinks[0]) {
        setUrl(courseData[0].videoLinks[0]);
      }
      
      setIsAdded(true);
    }
  }, [course, onlineStatus]);

  const modules = [
    { title: "Introduction", duration: "15:20", completed: true },
    { title: "Basic Concepts", duration: "22:45", completed: true },
    { title: "Advanced Techniques", duration: "35:10", completed: false },
    { title: "Practical Applications", duration: "28:30", completed: false },
    { title: "Review and Assessment", duration: "18:15", completed: false },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Video Player */}
      <div className="lg:w-2/3">
        <div className="bg-black rounded-xl overflow-hidden shadow-lg">
          <ReactPlayer
            width="100%"
            height="400px"
            onProgress={(progress) => setProgress(progress)}
            onEnded={() => storePlayedVideos(url)}
            light={true}
            playing={true}
            playIcon={<FaPlayCircle className="w-16 h-16 text-white opacity-80" />}
            url={url}
            controls
          />
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About this course</h2>
          <p className="text-gray-600">
            This course will teach you the fundamentals of {course}. You'll learn key concepts and 
            practical applications that you can use in real-world scenarios.
          </p>
        </div>
      </div>
      
      {/* Course Modules */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Course Content</h3>
            <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
              <HiOutlineDownload className="mr-1" /> Download All
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {modules.map((module, index) => (
              <div 
                key={index}
                className={`px-6 py-4 cursor-pointer transition-colors duration-150 ${
                  activeModule === index ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setActiveModule(index)}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
                    module.completed ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    {module.completed ? (
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{module.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{module.duration}</p>
                  </div>
                  
                  <HiChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h3>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: '40%' }}
            ></div>
          </div>
          
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>40% Complete</span>
            <span>2/5 Modules</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderModules;