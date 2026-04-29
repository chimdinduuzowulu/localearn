import Layout from "../../components/layout/Layout";
import { useParams } from "react-router";
import RenderModules from "../../utils/RenderModules";

const ViewCourse: React.FC = () => {
  const { courseName } = useParams();
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{courseName}</h1>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-4">12 Lessons</span>
            <span>•</span>
            <span className="ml-4">2h 15m Total Length</span>
          </div>
        </div>
        
        <RenderModules course={courseName} />
      </div>
    </Layout>
  );
};

export default ViewCourse;