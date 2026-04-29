import Layout from "../../components/layout/Layout";
import { HiAcademicCap, HiCheckCircle } from "react-icons/hi";

function CompletedCourse() {
  const completedCourses = [
    { title: "Basic Mathematics", progress: 100, duration: "5h 20m", completedDate: "May 15, 2023" },
    { title: "English Language", progress: 100, duration: "4h 45m", completedDate: "June 2, 2023" },
    { title: "Introduction to Science", progress: 100, duration: "6h 10m", completedDate: "April 28, 2023" },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Completed Courses</h1>
          <p className="text-gray-600">Review your learning achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <HiAcademicCap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Completed</h3>
            <p className="text-3xl font-bold text-blue-600">3</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Hours</h3>
            <p className="text-3xl font-bold text-green-600">16h 15m</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <HiCheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Certificates</h3>
            <p className="text-3xl font-bold text-purple-600">3</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Your Completed Courses</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {completedCourses.map((course, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <HiAcademicCap className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{course.duration}</span>
                      <span className="mx-2">•</span>
                      <span>Completed on {course.completedDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Completed
                    </span>
                    <button className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CompletedCourse;