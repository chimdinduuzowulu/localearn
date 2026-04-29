export const IsCompleted = (courseData: {
  videoLinks: string[];
  courseName: string;
}) => {
  const playedString = localStorage.getItem("played-videos") || "[]";
  const Allplayed: string[] = JSON.parse(playedString);
  const videoLinksArray = courseData.videoLinks;
  const value = videoLinksArray.every((video) => Allplayed.includes(video));
  if (value) {
    return courseData.courseName;
  }
};
