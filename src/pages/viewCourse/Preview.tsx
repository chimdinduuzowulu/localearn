import { FaCloudDownloadAlt, FaPlayCircle } from "react-icons/fa";
import ReactPlayer from "react-player/lazy";
function Preview() {
  const googleDriveURL = "https://youtu.be/OXNechp4g84?si=OvoK0rL09_38jugO";

  return (
    <main className="h-full w-full pb-4 overflow-y-aut0">
      <div className="container px-2 mx-auto grid">
        <div className="grid gap-6 mb-2 md:grid-cols-1">
          <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-secondaryColor">
            <div className="min-w-0 p-4 bg-white grid grid-cols-2 place-content-between place-items-end rounded-lg shadow-xs dark:bg-secondaryColor">
              <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300"></h4>
              <FaCloudDownloadAlt
                size={43}
                title="Download All Courses"
                className="hover:cursor-pointer text-primaryColor"
              />
            </div>
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Course Preview
            </h4>

            <ReactPlayer
              width={"100%"}
              height={"600px"}
              playing={true}
              playIcon={<FaPlayCircle />}
              url={googleDriveURL}
              controls
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Preview;
