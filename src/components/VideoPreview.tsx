import { IPreview } from "../interfaces/IPreview";

const VideoPreview: React.FC<IPreview> = () => {
  return (
    <main className="h-full w-full pb-4 overflow-y-aut0">
      <div className="container px-2 mx-auto grid">
        <div className="grid gap-6 mb-2 md:grid-cols-1">
          <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Course Overview
            </h4>

            <iframe
              className="w-full h-[400px]"
              src="https://www.youtube.com/embed/-YXmN65exwE?si=cgVtfWS2rue6gJlc"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoPreview;
