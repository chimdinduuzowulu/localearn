import { Link } from "react-router-dom";

const Cards: React.FC<any> = (props) => {
  return (
    <Link to={`/viewCourse/${props.title}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              {props.svg}
            </div>
            {props.progress !== undefined && (
              <div className="text-right">
                <span className="text-xs font-medium text-blue-600">
                  {props.progress}% Complete
                </span>
                <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${props.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {props.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {props.translate}
          </p>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{props.subModules} Modules</span>
            <span>{props.totalVideos} Videos</span>
          </div>
        </div>
        
        <div className="px-6 pb-4">
          <button className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200">
            Continue Learning
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Cards;